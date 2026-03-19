import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../shared/auth.decorator";
import { JwtGuard } from "../shared/jwt.guard";
import { HistoryService } from "../services/history.service";

@ApiTags("History")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  history(@CurrentUser() user: { sub: string }, @Query("filter") filter?: string) {
    return this.historyService.getHistory(user.sub, filter);
  }
}
