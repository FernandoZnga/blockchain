import { Injectable } from "@nestjs/common";
import { PrismaService } from "../shared/prisma.service";
import { BlockchainService } from "../shared/blockchain.service";

@Injectable()
export class SystemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockchain: BlockchainService,
  ) {}

  async health() {
    const blockchain = await this.blockchain.health();
    const db = await this.prisma.$queryRaw`SELECT 1`;
    return {
      status: "ok",
      database: Array.isArray(db) ? "up" : "up",
      blockchain,
      timestamp: new Date().toISOString(),
    };
  }

  async blockchainStatus() {
    return this.blockchain.health();
  }
}
