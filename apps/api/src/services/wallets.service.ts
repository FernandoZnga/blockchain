import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, Wallet } from "@prisma/client";
import { PrismaService } from "../shared/prisma.service";
import { BlockchainService } from "../shared/blockchain.service";
import { CryptoService } from "../shared/crypto.service";

@Injectable()
export class WalletsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockchain: BlockchainService,
    private readonly crypto: CryptoService,
  ) {}

  async createForUser(userId: string) {
    const generated = await this.blockchain.createWallet();
    return this.prisma.wallet.create({
      data: {
        userId,
        address: generated.address,
        publicKey: generated.publicKey,
        encryptedPrivateKey: this.crypto.encrypt(generated.privateKey),
      },
    });
  }

  async getMine(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException("Wallet not found");
    return wallet;
  }

  async getById(id: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id }, include: { user: true } });
    if (!wallet) throw new NotFoundException("Wallet not found");
    return wallet;
  }

  async getTechnicalDetails(userId: string) {
    const wallet = await this.getMine(userId);
    return {
      walletAddress: wallet.address,
      publicKey: wallet.publicKey,
      concepts: {
        address: "Public identifier used to receive funds on the demo network.",
        privateKey: "Encrypted at rest and hidden by default. It controls signing authority.",
        signature: "A cryptographic proof that a transaction was authorized by the wallet owner.",
        hash: "Deterministic identifier of a transaction or payload.",
        nonce: "Counter used to prevent replay on chains.",
        gas: "Execution cost unit on EVM networks.",
        internalLedger: "Application-side balance and history used for simulated exchange operations.",
        blockchain: "Shared append-only state on the local Hardhat node.",
      },
    };
  }

  async adjustBalance(walletId: string, amountDelta: Prisma.Decimal | number) {
    const wallet = await this.getById(walletId);
    const before = Number(wallet.internalBalance);
    const after = before + Number(amountDelta);
    return this.prisma.wallet.update({
      where: { id: walletId },
      data: {
        internalBalance: after,
        tokenBalance: after,
      },
    });
  }

  async findByAddress(address: string): Promise<Wallet | null> {
    return this.prisma.wallet.findUnique({ where: { address } });
  }
}
