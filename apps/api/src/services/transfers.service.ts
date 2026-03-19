import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { LedgerDirection, LedgerSourceType, OperationStatus, TransferType } from "@prisma/client";
import { AuditService } from "../shared/audit.service";
import { BlockchainService } from "../shared/blockchain.service";
import { PrismaService } from "../shared/prisma.service";
import { InternalTransferDto, OnchainTransferDto } from "../routes/dtos";
import { KycService } from "./kyc.service";

@Injectable()
export class TransfersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kyc: KycService,
    private readonly blockchain: BlockchainService,
    private readonly audit: AuditService,
  ) {}

  async internal(userId: string, dto: InternalTransferDto) {
    await this.kyc.requireApproved(userId);
    const senderWallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!senderWallet) throw new NotFoundException("Wallet not found");
    if (Number(senderWallet.internalBalance) < dto.amount) throw new BadRequestException("Insufficient balance");

    let recipientWallet = null;
    if (dto.email) {
      const recipientUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
        include: { wallet: true },
      });
      recipientWallet = recipientUser?.wallet ?? null;
    } else if (dto.walletAddress) {
      recipientWallet = await this.prisma.wallet.findUnique({
        where: { address: dto.walletAddress },
      });
    }

    if (!recipientWallet) throw new NotFoundException("Recipient not found");
    if (recipientWallet.id === senderWallet.id) throw new BadRequestException("Self transfer is not allowed");

    const transfer = await this.prisma.$transaction(async (tx) => {
      const sender = await tx.wallet.findUniqueOrThrow({ where: { id: senderWallet.id } });
      const receiver = await tx.wallet.findUniqueOrThrow({ where: { id: recipientWallet.id } });
      const senderBefore = Number(sender.internalBalance);
      const receiverBefore = Number(receiver.internalBalance);

      await tx.wallet.update({
        where: { id: sender.id },
        data: { internalBalance: senderBefore - dto.amount, tokenBalance: senderBefore - dto.amount },
      });
      await tx.wallet.update({
        where: { id: receiver.id },
        data: { internalBalance: receiverBefore + dto.amount, tokenBalance: receiverBefore + dto.amount },
      });

      const createdTransfer = await tx.transfer.create({
        data: {
          fromWalletId: sender.id,
          toWalletId: receiver.id,
          toAddress: receiver.address,
          amount: dto.amount,
          status: OperationStatus.APPROVED,
          type: TransferType.INTERNAL,
          confirmedAt: new Date(),
        },
      });

      await tx.ledgerEntry.createMany({
        data: [
          {
            walletId: sender.id,
            direction: LedgerDirection.DEBIT,
            sourceType: LedgerSourceType.TRANSFER,
            sourceId: createdTransfer.id,
            amount: dto.amount,
            balanceBefore: senderBefore,
            balanceAfter: senderBefore - dto.amount,
          },
          {
            walletId: receiver.id,
            direction: LedgerDirection.CREDIT,
            sourceType: LedgerSourceType.TRANSFER,
            sourceId: createdTransfer.id,
            amount: dto.amount,
            balanceBefore: receiverBefore,
            balanceAfter: receiverBefore + dto.amount,
          },
        ],
      });

      return createdTransfer;
    });

    await this.audit.log({
      actorUserId: userId,
      entityType: "Transfer",
      entityId: transfer.id,
      action: "INTERNAL_TRANSFER_CREATED",
      metadata: { amount: dto.amount, recipientWalletId: recipientWallet.id },
    });

    return transfer;
  }

  async onchain(userId: string, dto: OnchainTransferDto) {
    await this.kyc.requireApproved(userId);
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException("Wallet not found");
    if (Number(wallet.internalBalance) < dto.amount) throw new BadRequestException("Insufficient balance");

    const signed = await this.blockchain.buildEducationalTransfer(`ONCHAIN-${userId}`, wallet.address, dto.toAddress, String(dto.amount));

    const transfer = await this.prisma.$transaction(async (tx) => {
      const currentWallet = await tx.wallet.findUniqueOrThrow({ where: { id: wallet.id } });
      const before = Number(currentWallet.internalBalance);
      const createdTransfer = await tx.transfer.create({
        data: {
          fromWalletId: wallet.id,
          toAddress: dto.toAddress,
          amount: dto.amount,
          type: TransferType.ONCHAIN,
          status: OperationStatus.APPROVED,
          blockchainHash: signed.hash,
          blockNumber: signed.blockNumber,
          confirmedAt: new Date(),
        },
      });

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { internalBalance: before - dto.amount, tokenBalance: before - dto.amount },
      });
      await tx.ledgerEntry.create({
        data: {
          walletId: wallet.id,
          direction: LedgerDirection.DEBIT,
          sourceType: LedgerSourceType.TRANSFER,
          sourceId: createdTransfer.id,
          amount: dto.amount,
          balanceBefore: before,
          balanceAfter: before - dto.amount,
        },
      });
      await tx.blockchainEvent.create({
        data: {
          walletId: wallet.id,
          eventName: "EducationalTransferRegistered",
          txHash: signed.hash,
          blockNumber: signed.blockNumber,
          payload: signed,
        },
      });
      return createdTransfer;
    });

    return transfer;
  }

  async list(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) return [];
    return this.prisma.transfer.findMany({
      where: {
        OR: [{ fromWalletId: wallet.id }, { toWalletId: wallet.id }],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async get(userId: string, transferId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException("Wallet not found");
    const transfer = await this.prisma.transfer.findFirst({
      where: {
        id: transferId,
        OR: [{ fromWalletId: wallet.id }, { toWalletId: wallet.id }],
      },
    });
    if (!transfer) throw new NotFoundException("Transfer not found");
    return transfer;
  }
}
