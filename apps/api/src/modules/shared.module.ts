import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "../shared/prisma.service";
import { CryptoService } from "../shared/crypto.service";
import { BlockchainService } from "../shared/blockchain.service";
import { AuditService } from "../shared/audit.service";
import { UsersService } from "../services/users.service";
import { WalletsService } from "../services/wallets.service";
import { KycService } from "../services/kyc.service";
import { ComplianceSimulationService } from "../services/compliance-simulation.service";

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [
    PrismaService,
    CryptoService,
    BlockchainService,
    AuditService,
    UsersService,
    WalletsService,
    KycService,
    ComplianceSimulationService,
  ],
  exports: [
    JwtModule,
    PrismaService,
    CryptoService,
    BlockchainService,
    AuditService,
    UsersService,
    WalletsService,
    KycService,
    ComplianceSimulationService,
  ],
})
export class SharedModule {}
