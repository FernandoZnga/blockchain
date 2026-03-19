import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../shared/auth.decorator";
import { JwtGuard } from "../shared/jwt.guard";
import { DepositsService } from "../services/deposits.service";
import { BankDepositDto, CardDepositDto } from "./dtos";

@ApiTags("Deposits")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("deposits")
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Post("card")
  card(@CurrentUser() user: { sub: string }, @Body() dto: CardDepositDto) {
    return this.depositsService.createCardDeposit(user.sub, dto);
  }

  @Post("bank")
  bank(@CurrentUser() user: { sub: string }, @Body() dto: BankDepositDto) {
    return this.depositsService.createBankDeposit(user.sub, dto);
  }

  @Get()
  list(@CurrentUser() user: { sub: string }) {
    return this.depositsService.list(user.sub);
  }

  @Get(":id")
  get(@CurrentUser() user: { sub: string }, @Param("id") id: string) {
    return this.depositsService.get(user.sub, id);
  }

  @Post(":id/process-demo")
  process(@CurrentUser() user: { sub: string }, @Param("id") id: string) {
    return this.depositsService.processDemo(user.sub, id);
  }
}
