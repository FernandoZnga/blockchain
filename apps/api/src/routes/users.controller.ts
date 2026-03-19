import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../shared/auth.decorator";
import { JwtGuard } from "../shared/jwt.guard";
import { UpdateProfileDto } from "./dtos";
import { UsersService } from "../services/users.service";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("profile")
  profile(@CurrentUser() user: { sub: string }) {
    return this.usersService.getById(user.sub);
  }

  @Patch("profile")
  update(@CurrentUser() user: { sub: string }, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.sub, dto);
  }
}
