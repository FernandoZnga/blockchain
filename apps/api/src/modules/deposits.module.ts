import { Module } from "@nestjs/common";
import { DepositsController } from "../routes/deposits.controller";
import { DepositsService } from "../services/deposits.service";

@Module({
  imports: [],
  controllers: [DepositsController],
  providers: [DepositsService],
})
export class DepositsModule {}
