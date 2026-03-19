import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DepositMethod, LedgerDirection, LedgerSourceType, OperationStatus } from "@prisma/client";
import { AuditService } from "../shared/audit.service";
import { CryptoService } from "../shared/crypto.service";
import { PrismaService } from "../shared/prisma.service";
import { BankDepositDto, CardDepositDto } from "../routes/dtos";
import { KycService } from "./kyc.service";

@Injectable()
export class DepositsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
    private readonly kyc: KycService,
    private readonly audit: AuditService,
  ) {}

  async createCardDeposit(userId: string, dto: CardDepositDto) {
    await this.kyc.requireApproved(userId);
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException("Wallet not found");

    const deposit = await this.prisma.depositRequest.create({
      data: {
        userId,
        walletId: wallet.id,
        method: DepositMethod.CARD,
        amount: dto.amount,
        status: OperationStatus.PROCESSING,
        rawMaskedDetailsJson: {
          cardHolderName: dto.cardHolderName,
          cardNumber: this.crypto.maskCardNumber(dto.cardNumber),
          billingZip: dto.billingZip,
        },
      },
    });

    return this.processDemo(userId, deposit.id);
  }

  async createBankDeposit(userId: string, dto: BankDepositDto) {
    await this.kyc.requireApproved(userId);
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException("Wallet not found");

    const deposit = await this.prisma.depositRequest.create({
      data: {
        userId,
        walletId: wallet.id,
        method: DepositMethod.BANK,
        amount: dto.amount,
        status: OperationStatus.PROCESSING,
        rawMaskedDetailsJson: {
          accountHolderName: dto.accountHolderName,
          bankName: dto.bankName,
          accountNumber: this.crypto.maskAccountNumber(dto.accountNumber),
          routingNumber: dto.routingNumber.slice(0, 2) + "******",
        },
      },
    });

    return this.processDemo(userId, deposit.id);
  }

  async processDemo(actorUserId: string, depositId: string) {
    const deposit = await this.prisma.depositRequest.findUnique({ where: { id: depositId }, include: { wallet: true } });
    if (!deposit) throw new NotFoundException("Deposit not found");

    const approved = Number(deposit.amount) % 10 !== 0;
    const nextStatus = approved ? OperationStatus.APPROVED : OperationStatus.FAILED;

    const updated = await this.prisma.depositRequest.update({
      where: { id: depositId },
      data: {
        status: nextStatus,
        processedAt: new Date(),
        externalReferenceSimulated: `SIM-${deposit.method}-${deposit.id.slice(0, 8)}`,
      },
    });

    if (nextStatus === OperationStatus.APPROVED) {
      await this.prisma.$transaction(async (tx) => {
        const currentWallet = await tx.wallet.findUniqueOrThrow({ where: { id: deposit.walletId } });
        const before = Number(currentWallet.internalBalance);
        const after = before + Number(deposit.amount);
        await tx.wallet.update({
          where: { id: deposit.walletId },
          data: {
            internalBalance: after,
            tokenBalance: after,
          },
        });
        await tx.ledgerEntry.create({
          data: {
            walletId: deposit.walletId,
            direction: LedgerDirection.CREDIT,
            sourceType: LedgerSourceType.DEPOSIT,
            sourceId: deposit.id,
            amount: deposit.amount,
            balanceBefore: before,
            balanceAfter: after,
          },
        });
      });
    }

    await this.audit.log({
      actorUserId,
      entityType: "DepositRequest",
      entityId: depositId,
      action: `DEPOSIT_${nextStatus}`,
      metadata: { amount: deposit.amount.toString(), method: deposit.method },
    });

    return updated;
  }

  async list(userId: string) {
    return this.prisma.depositRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async get(userId: string, depositId: string) {
    const deposit = await this.prisma.depositRequest.findFirst({ where: { id: depositId, userId } });
    if (!deposit) throw new NotFoundException("Deposit not found");
    return deposit;
  }
}
