import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    actorUserId?: string | null;
    entityType: string;
    entityId: string;
    action: string;
    metadata?: unknown;
    kycProfileId?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        actorUserId: params.actorUserId ?? null,
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        metadata: params.metadata as object | undefined,
        kycProfileId: params.kycProfileId,
      },
    });
  }
}
