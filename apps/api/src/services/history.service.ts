import { Injectable } from "@nestjs/common";
import { PrismaService } from "../shared/prisma.service";

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getHistory(userId: string, filter?: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    const [deposits, transfers, events, kycProfile] = await Promise.all([
      this.prisma.depositRequest.findMany({
        where: filter === "deposits" ? { userId } : { userId },
        orderBy: { createdAt: "desc" },
      }),
      wallet
        ? this.prisma.transfer.findMany({
            where: {
              OR: [{ fromWalletId: wallet.id }, { toWalletId: wallet.id }],
            },
            orderBy: { createdAt: "desc" },
          })
        : [],
      wallet
        ? this.prisma.blockchainEvent.findMany({
            where: { walletId: wallet.id },
            orderBy: { createdAt: "desc" },
          })
        : [],
      this.prisma.kycProfile.findUnique({
        where: { userId },
        include: { auditLogs: true },
      }),
    ]);

    const items = [
      ...deposits.map((item) => ({ type: "deposit", dateTime: item.createdAt, status: item.status, reference: item.externalReferenceSimulated, details: item })),
      ...transfers.map((item) => ({ type: item.type === "INTERNAL" ? "transfer" : "blockchain", dateTime: item.createdAt, status: item.status, reference: item.blockchainHash ?? item.id, details: item })),
      ...events.map((item) => ({ type: "blockchain_event", dateTime: item.createdAt, status: "APPROVED", reference: item.txHash, details: item })),
      ...(kycProfile?.auditLogs ?? []).map((item) => ({ type: "kyc_event", dateTime: item.createdAt, status: item.action, reference: item.entityId, details: item })),
    ]
      .filter((entry) => (filter ? entry.type.includes(filter.slice(0, -1)) || entry.type === filter : true))
      .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

    return items;
  }
}
