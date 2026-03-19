import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../shared/auth.decorator";
import { JwtGuard } from "../shared/jwt.guard";
import { Roles } from "../shared/roles.decorator";
import { RolesGuard } from "../shared/roles.guard";
import { AdminService } from "../services/admin.service";
import { KycService } from "../services/kyc.service";
import { ReviewKycDto } from "./dtos";

@ApiTags("Admin")
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Controller("admin")
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly kycService: KycService,
  ) {}

  @Roles("ADMIN", "COMPLIANCE_ADMIN")
  @Get("users")
  users() {
    return this.adminService.users();
  }

  @Roles("ADMIN", "COMPLIANCE_ADMIN")
  @Get("wallets")
  wallets() {
    return this.adminService.wallets();
  }

  @Roles("ADMIN", "COMPLIANCE_ADMIN")
  @Get("deposits")
  deposits() {
    return this.adminService.deposits();
  }

  @Roles("ADMIN", "COMPLIANCE_ADMIN")
  @Get("transfers")
  transfers() {
    return this.adminService.transfers();
  }

  @Roles("ADMIN", "COMPLIANCE_ADMIN")
  @Get("kyc/cases")
  kycCases() {
    return this.adminService.kycCases();
  }

  @Roles("ADMIN", "COMPLIANCE_ADMIN")
  @Get("kyc/cases/:id")
  kycCase(@Param("id") id: string) {
    return this.adminService.kycCase(id);
  }

  @Roles("ADMIN", "COMPLIANCE_ADMIN")
  @Post("kyc/cases/:id/approve")
  approve(@Param("id") id: string, @CurrentUser() user: { sub: string }, @Body() dto: ReviewKycDto) {
    return this.kycService.reviewCase(id, user.sub, "APPROVED", dto.notes, dto.reason);
  }

  @Roles("ADMIN", "COMPLIANCE_ADMIN")
  @Post("kyc/cases/:id/reject")
  reject(@Param("id") id: string, @CurrentUser() user: { sub: string }, @Body() dto: ReviewKycDto) {
    return this.kycService.reviewCase(id, user.sub, "REJECTED", dto.notes, dto.reason);
  }

  @Roles("ADMIN", "COMPLIANCE_ADMIN")
  @Post("kyc/cases/:id/request-resubmission")
  requestResubmission(@Param("id") id: string, @CurrentUser() user: { sub: string }, @Body() dto: ReviewKycDto) {
    return this.kycService.reviewCase(id, user.sub, "NEEDS_RESUBMISSION", dto.notes, dto.reason);
  }

  @Roles("ADMIN")
  @Post("seed-demo")
  seedDemo() {
    return this.adminService.seedDemo();
  }

  @Roles("ADMIN", "COMPLIANCE_ADMIN")
  @Get("logs")
  logs() {
    return this.adminService.logs();
  }
}
