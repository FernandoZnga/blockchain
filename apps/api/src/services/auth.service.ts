import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { randomUUID, createHash } from "node:crypto";
import { PrismaService } from "../shared/prisma.service";
import { AuditService } from "../shared/audit.service";
import { RegisterDto, LoginDto } from "../routes/dtos";
import { WalletsService } from "./wallets.service";
import { KycService } from "./kyc.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly wallets: WalletsService,
    private readonly kyc: KycService,
    private readonly audit: AuditService,
  ) {}

  private parseJwtTtl(value: string | undefined, fallbackSeconds: number) {
    if (!value) return fallbackSeconds;
    if (/^\d+$/.test(value)) return Number(value);

    const match = value.match(/^(\d+)([smhd])$/);
    if (!match) return fallbackSeconds;

    const amount = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 60 * 60 * 24,
    };
    const multiplier = unit ? multipliers[unit] : undefined;
    if (!multiplier) return fallbackSeconds;

    return amount * multiplier;
  }

  private async signTokens(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: this.parseJwtTtl(process.env.JWT_ACCESS_TTL, 15 * 60),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: this.parseJwtTtl(process.env.JWT_REFRESH_TTL, 7 * 24 * 60 * 60),
    });
    return { accessToken, refreshToken };
  }

  private hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException("Email already in use");

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        passwordHash,
      },
    });

    await this.wallets.createForUser(user.id);
    await this.kyc.ensureProfile(user.id);
    await this.prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: randomUUID(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    await this.audit.log({ actorUserId: user.id, entityType: "User", entityId: user.id, action: "REGISTERED" });

    return this.login({ email: dto.email, password: dto.password });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const validPassword = await bcrypt.compare(dto.password, user.passwordHash);
    if (!validPassword) throw new UnauthorizedException("Invalid credentials");

    const tokens = await this.signTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(tokens.refreshToken),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    return {
      ...tokens,
      user: await this.prisma.user.findUnique({
        where: { id: user.id },
        include: { wallet: true, kycProfile: true },
      }),
    };
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hashToken(refreshToken) },
      include: { user: true },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    return this.signTokens({
      id: stored.user.id,
      email: stored.user.email,
      role: stored.user.role,
    });
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: this.hashToken(refreshToken) },
      data: { revokedAt: new Date() },
    });
    return { success: true };
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true, kycProfile: true },
    });
  }

  async verifyEmailDemo(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });
  }
}
