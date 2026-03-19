import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../shared/auth.decorator";
import { JwtGuard } from "../shared/jwt.guard";
import { TransfersService } from "../services/transfers.service";
import { InternalTransferDto, OnchainTransferDto } from "./dtos";

@ApiTags("Transfers")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("transfers")
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post("internal")
  internal(@CurrentUser() user: { sub: string }, @Body() dto: InternalTransferDto) {
    return this.transfersService.internal(user.sub, dto);
  }

  @Post("onchain")
  onchain(@CurrentUser() user: { sub: string }, @Body() dto: OnchainTransferDto) {
    return this.transfersService.onchain(user.sub, dto);
  }

  @Get()
  list(@CurrentUser() user: { sub: string }) {
    return this.transfersService.list(user.sub);
  }

  @Get(":id")
  get(@CurrentUser() user: { sub: string }, @Param("id") id: string) {
    return this.transfersService.get(user.sub, id);
  }
}
