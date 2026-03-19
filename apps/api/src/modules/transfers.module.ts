import { Module } from "@nestjs/common";
import { TransfersController } from "../routes/transfers.controller";
import { TransfersService } from "../services/transfers.service";

@Module({
  imports: [],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
