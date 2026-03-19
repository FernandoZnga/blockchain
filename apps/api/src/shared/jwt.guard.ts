import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : request.cookies?.accessToken;
    if (!token || token === "undefined" || token === "null") {
      throw new UnauthorizedException("Missing access token");
    }

    try {
      request.user = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
    } catch {
      throw new UnauthorizedException("Invalid access token");
    }

    return true;
  }
}
