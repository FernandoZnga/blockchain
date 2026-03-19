import { Module } from "@nestjs/common";
import { HistoryController } from "../routes/history.controller";
import { HistoryService } from "../services/history.service";

@Module({
  imports: [],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
