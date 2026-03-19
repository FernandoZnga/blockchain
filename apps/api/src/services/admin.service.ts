import { Injectable } from "@nestjs/common";
import { KycStatus, UserRole } from "@prisma/client";
import { PrismaService } from "../shared/prisma.service";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  users() {
    return this.prisma.user.findMany({
      include: { wallet: true, kycProfile: true },
      orderBy: { createdAt: "desc" },
    });
  }

  wallets() {
    return this.prisma.wallet.findMany({ include: { user: true } });
  }

  deposits() {
    return this.prisma.depositRequest.findMany({
      include: { user: true, wallet: true },
      orderBy: { createdAt: "desc" },
    });
  }

  transfers() {
    return this.prisma.transfer.findMany({
      include: { fromWallet: { include: { user: true } }, toWallet: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  kycCases() {
    return this.prisma.kycProfile.findMany({
      include: { user: true, documents: true, selfie: true, checks: true },
      orderBy: { updatedAt: "desc" },
    });
  }

  kycCase(id: string) {
    return this.prisma.kycProfile.findUnique({
      where: { id },
      include: { user: true, personalInfo: true, documents: true, selfie: true, checks: true, auditLogs: true },
    });
  }

  async seedDemo() {
    const count = await this.prisma.user.count();
    return {
      seeded: count >= 5,
      summary: "Run `pnpm db:seed` for the full demo dataset.",
    };
  }

  logs() {
    return this.prisma.auditLog.findMany({
      include: { actor: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }
}
