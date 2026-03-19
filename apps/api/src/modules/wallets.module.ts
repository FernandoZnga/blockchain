import { Module } from "@nestjs/common";
import { WalletsController } from "../routes/wallets.controller";

@Module({
  imports: [],
  controllers: [WalletsController],
  providers: [],
})
export class WalletsModule {}
