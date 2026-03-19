import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { KycDocumentType, KycStatus, OperationStatus } from "@prisma/client";
import { AuditService } from "../shared/audit.service";
import { PrismaService } from "../shared/prisma.service";
import { KycDocumentDto, KycPersonalInfoDto, KycSelfieDto } from "../routes/dtos";
import { ComplianceSimulationService } from "./compliance-simulation.service";

@Injectable()
export class KycService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly compliance: ComplianceSimulationService,
  ) {}

  async ensureProfile(userId: string) {
    const existing = await this.prisma.kycProfile.findUnique({ where: { userId } });
    if (existing) return existing;
    return this.prisma.kycProfile.create({ data: { userId } });
  }

  async start(userId: string) {
    const profile = await this.ensureProfile(userId);
    return this.prisma.kycProfile.update({
      where: { id: profile.id },
      data: { status: KycStatus.IN_PROGRESS },
    });
  }

  async updatePersonalInfo(userId: string, dto: KycPersonalInfoDto) {
    const profile = await this.ensureProfile(userId);
    const result = await this.prisma.kycPersonalInfo.upsert({
      where: { kycProfileId: profile.id },
      update: { ...dto, dateOfBirth: new Date(dto.dateOfBirth) },
      create: { ...dto, dateOfBirth: new Date(dto.dateOfBirth), kycProfileId: profile.id },
    });
    await this.prisma.kycProfile.update({
      where: { id: profile.id },
      data: { status: KycStatus.IN_PROGRESS },
    });
    return result;
  }

  async uploadDocument(userId: string, dto: KycDocumentDto) {
    const profile = await this.ensureProfile(userId);
    return this.prisma.kycDocument.create({
      data: {
        kycProfileId: profile.id,
        documentType: dto.documentType as KycDocumentType,
        documentNumberMasked: `***${dto.documentNumber.slice(-4)}`,
        issuingCountry: dto.issuingCountry,
        expirationDate: new Date(dto.expirationDate),
        frontFilePath: dto.frontImageUrl,
        backFilePath: dto.backImageUrl,
        status: OperationStatus.APPROVED,
      },
    });
  }

  async uploadSelfie(userId: string, dto: KycSelfieDto) {
    const profile = await this.ensureProfile(userId);
    return this.prisma.kycSelfie.upsert({
      where: { kycProfileId: profile.id },
      update: { filePath: dto.selfieImageUrl, faceMatchScore: 94.5, livenessStatus: "SIMULATED_PASS" },
      create: {
        kycProfileId: profile.id,
        filePath: dto.selfieImageUrl,
        faceMatchScore: 94.5,
        livenessStatus: "SIMULATED_PASS",
      },
    });
  }

  async submit(userId: string) {
    const profile = await this.prisma.kycProfile.findUnique({
      where: { userId },
      include: { personalInfo: true, documents: true, selfie: true, user: true },
    });
    if (!profile || !profile.personalInfo || profile.documents.length === 0 || !profile.selfie) {
      throw new BadRequestException("Complete all KYC steps before submitting");
    }

    const latestDocument = profile.documents[profile.documents.length - 1];
    if (!latestDocument) {
      throw new BadRequestException("KYC document is required");
    }
    const simulation = this.compliance.run({
      firstName: profile.personalInfo.firstName,
      lastName: profile.personalInfo.lastName,
      country: profile.personalInfo.country,
      documentNumber: latestDocument.documentNumberMasked,
    });

    const nextStatus =
      simulation.suggestedStatus === "APPROVED"
        ? KycStatus.APPROVED
        : simulation.suggestedStatus === "REJECTED"
          ? KycStatus.REJECTED
          : KycStatus.UNDER_REVIEW;

    const updated = await this.prisma.kycProfile.update({
      where: { id: profile.id },
      data: {
        status: nextStatus,
        riskScore: simulation.riskScore,
        pepStatus: simulation.pepStatus,
        sanctionsScreeningStatus: simulation.sanctionsStatus,
        manualReviewRequired: simulation.manualReviewRequired,
        submittedAt: new Date(),
      },
      include: { personalInfo: true, documents: true, selfie: true },
    });

    await this.prisma.complianceCheck.create({
      data: {
        userId,
        kycProfileId: profile.id,
        sanctionsStatus: simulation.sanctionsStatus,
        pepStatus: simulation.pepStatus,
        countryRiskLevel: simulation.countryRiskLevel,
        watchlistHit: simulation.watchlistHit,
        riskScore: simulation.riskScore,
        rawResultJson: simulation,
      },
    });

    await this.audit.log({
      actorUserId: userId,
      entityType: "KycProfile",
      entityId: profile.id,
      action: "KYC_SUBMITTED",
      metadata: { nextStatus },
      kycProfileId: profile.id,
    });

    return updated;
  }

  async getStatus(userId: string) {
    const profile = await this.prisma.kycProfile.findUnique({
      where: { userId },
      include: {
        personalInfo: true,
        documents: true,
        selfie: true,
        checks: true,
        auditLogs: true,
      },
    });
    if (!profile) throw new NotFoundException("KYC profile not found");
    return profile;
  }

  async getHistory(userId: string) {
    const profile = await this.prisma.kycProfile.findUnique({ where: { userId } });
    if (!profile) return [];
    return this.prisma.auditLog.findMany({
      where: { kycProfileId: profile.id },
      orderBy: { createdAt: "desc" },
    });
  }

  async requireApproved(userId: string) {
    const profile = await this.prisma.kycProfile.findUnique({ where: { userId } });
    if (!profile || profile.status !== KycStatus.APPROVED) {
      throw new BadRequestException("KYC approval is required for this action");
    }
  }

  async reviewCase(caseId: string, reviewerId: string, action: "APPROVED" | "REJECTED" | "NEEDS_RESUBMISSION", notes?: string, reason?: string) {
    const current = await this.prisma.kycProfile.findUnique({ where: { id: caseId } });
    if (!current) throw new NotFoundException("KYC case not found");
    const nextStatusByAction: Record<"APPROVED" | "REJECTED" | "NEEDS_RESUBMISSION", KycStatus> = {
      APPROVED: KycStatus.APPROVED,
      REJECTED: KycStatus.REJECTED,
      NEEDS_RESUBMISSION: KycStatus.NEEDS_RESUBMISSION,
    };
    const updated = await this.prisma.kycProfile.update({
      where: { id: caseId },
      data: {
        status: nextStatusByAction[action],
        reviewedAt: new Date(),
        reviewedByUserId: reviewerId,
        reviewerNotes: notes,
        rejectionReason: reason,
      },
    });

    await this.audit.log({
      actorUserId: reviewerId,
      entityType: "KycProfile",
      entityId: caseId,
      action: `KYC_${action}`,
      metadata: { notes, reason },
      kycProfileId: caseId,
    });

    return updated;
  }
}
