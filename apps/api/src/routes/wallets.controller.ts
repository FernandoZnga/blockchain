import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../shared/auth.decorator";
import { JwtGuard } from "../shared/jwt.guard";
import { WalletsService } from "../services/wallets.service";

@ApiTags("Wallets")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("wallets")
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get("me")
  me(@CurrentUser() user: { sub: string }) {
    return this.walletsService.getMine(user.sub);
  }

  @Get("me/technical-details")
  technicalDetailsForCurrentUser(@CurrentUser() user: { sub: string }) {
    return this.walletsService.getTechnicalDetails(user.sub);
  }

  @Get(":id")
  byId(@Param("id") id: string) {
    return this.walletsService.getById(id);
  }

  @Get(":id/balance")
  async balance(@Param("id") id: string) {
    const wallet = await this.walletsService.getById(id);
    return {
      internalBalance: wallet.internalBalance,
      tokenBalance: wallet.tokenBalance,
    };
  }

  @Get(":id/technical-details")
  async technicalDetails(@Param("id") id: string) {
    const wallet = await this.walletsService.getById(id);
    return this.walletsService.getTechnicalDetails(wallet.userId);
  }
}
