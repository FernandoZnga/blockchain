import { Module } from "@nestjs/common";
import { SystemController } from "../routes/system.controller";
import { SystemService } from "../services/system.service";

@Module({
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}
