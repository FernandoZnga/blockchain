import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SystemService } from "../services/system.service";

@ApiTags("System")
@Controller("system")
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get("health")
  health() {
    return this.systemService.health();
  }

  @Get("blockchain-status")
  blockchainStatus() {
    return this.systemService.blockchainStatus();
  }
}
