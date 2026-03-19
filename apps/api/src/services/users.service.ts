import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../shared/prisma.service";
import { UpdateProfileDto } from "../routes/dtos";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true, kycProfile: true },
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async getByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }, include: { wallet: true, kycProfile: true } });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      include: { wallet: true, kycProfile: true },
    });
  }
}
