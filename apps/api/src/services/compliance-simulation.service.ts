import { Injectable } from "@nestjs/common";
import { CountryRiskLevel, PepStatus, SanctionsStatus } from "@prisma/client";

@Injectable()
export class ComplianceSimulationService {
  private readonly watchlist = ["blocked", "sanctioned", "risk", "watch"];
  private readonly highRiskCountries = ["IR", "KP", "SY"];

  run(input: {
    firstName: string;
    lastName: string;
    country: string;
    documentNumber: string;
  }) {
    const fullName = `${input.firstName} ${input.lastName}`.toLowerCase();
    const watchlistHit = this.watchlist.some((token) => fullName.includes(token) || input.documentNumber.toLowerCase().includes(token));
    const countryRiskLevel = this.highRiskCountries.includes(input.country.toUpperCase())
      ? CountryRiskLevel.HIGH
      : CountryRiskLevel.LOW;

    let riskScore = 18;
    if (watchlistHit) riskScore += 55;
    if (countryRiskLevel === CountryRiskLevel.HIGH) riskScore += 20;

    const sanctionsStatus = watchlistHit ? SanctionsStatus.POSSIBLE_MATCH : SanctionsStatus.CLEAR;
    const pepStatus = fullName.includes("minister") ? PepStatus.POSSIBLE_MATCH : PepStatus.CLEAR;
    if (pepStatus === PepStatus.POSSIBLE_MATCH) riskScore += 10;

    return {
      sanctionsStatus,
      pepStatus,
      countryRiskLevel,
      watchlistHit,
      riskScore: Math.min(99, riskScore),
      manualReviewRequired: riskScore >= 60,
      suggestedStatus: watchlistHit ? "UNDER_REVIEW" : riskScore >= 80 ? "REJECTED" : "APPROVED",
    };
  }
}
