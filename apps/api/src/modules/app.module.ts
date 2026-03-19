import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { UsersModule } from "./users.module";
import { KycModule } from "./kyc.module";
import { WalletsModule } from "./wallets.module";
import { DepositsModule } from "./deposits.module";
import { TransfersModule } from "./transfers.module";
import { HistoryModule } from "./history.module";
import { AdminModule } from "./admin.module";
import { SystemModule } from "./system.module";
import { SharedModule } from "./shared.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }]),
    SharedModule,
    AuthModule,
    UsersModule,
    KycModule,
    WalletsModule,
    DepositsModule,
    TransfersModule,
    HistoryModule,
    AdminModule,
    SystemModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
