import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../shared/auth.decorator";
import { JwtGuard } from "../shared/jwt.guard";
import { KycService } from "../services/kyc.service";
import { KycDocumentDto, KycPersonalInfoDto, KycSelfieDto } from "./dtos";

@ApiTags("KYC")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("kyc")
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post("start")
  start(@CurrentUser() user: { sub: string }) {
    return this.kycService.start(user.sub);
  }

  @Patch("personal-info")
  personalInfo(@CurrentUser() user: { sub: string }, @Body() dto: KycPersonalInfoDto) {
    return this.kycService.updatePersonalInfo(user.sub, dto);
  }

  @Post("document")
  document(@CurrentUser() user: { sub: string }, @Body() dto: KycDocumentDto) {
    return this.kycService.uploadDocument(user.sub, dto);
  }

  @Post("selfie")
  selfie(@CurrentUser() user: { sub: string }, @Body() dto: KycSelfieDto) {
    return this.kycService.uploadSelfie(user.sub, dto);
  }

  @Post("submit")
  submit(@CurrentUser() user: { sub: string }) {
    return this.kycService.submit(user.sub);
  }

  @Get("status")
  status(@CurrentUser() user: { sub: string }) {
    return this.kycService.getStatus(user.sub);
  }

  @Get("me")
  me(@CurrentUser() user: { sub: string }) {
    return this.kycService.getStatus(user.sub);
  }

  @Get("history")
  history(@CurrentUser() user: { sub: string }) {
    return this.kycService.getHistory(user.sub);
  }
}
