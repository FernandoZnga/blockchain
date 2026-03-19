import { Module } from "@nestjs/common";
import { KycController } from "../routes/kyc.controller";

@Module({
  imports: [],
  controllers: [KycController],
  providers: [],
})
export class KycModule {}
