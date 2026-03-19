import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsEmail, IsEnum, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty() @IsString() firstName!: string;
  @ApiProperty() @IsString() lastName!: string;
  @ApiProperty() @IsEmail() email!: string;
  @ApiProperty() @IsString() @MinLength(8) password!: string;
}

export class LoginDto {
  @ApiProperty() @IsEmail() email!: string;
  @ApiProperty() @IsString() password!: string;
}

export class RefreshDto {
  @ApiProperty() @IsString() refreshToken!: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() firstName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastName?: string;
}

export class KycPersonalInfoDto {
  @ApiProperty() @IsString() firstName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() middleName?: string;
  @ApiProperty() @IsString() lastName!: string;
  @ApiProperty() @IsDateString() dateOfBirth!: string;
  @ApiProperty() @IsString() country!: string;
  @ApiProperty() @IsString() nationality!: string;
  @ApiProperty() @IsString() phoneNumber!: string;
  @ApiProperty() @IsString() addressLine1!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() addressLine2?: string;
  @ApiProperty() @IsString() city!: string;
  @ApiProperty() @IsString() state!: string;
  @ApiProperty() @IsString() postalCode!: string;
}

export class KycDocumentDto {
  @ApiProperty({ enum: ["PASSPORT", "NATIONAL_ID", "DRIVER_LICENSE"] }) @IsString() documentType!: string;
  @ApiProperty() @IsString() documentNumber!: string;
  @ApiProperty() @IsString() issuingCountry!: string;
  @ApiProperty() @IsDateString() expirationDate!: string;
  @ApiProperty() @IsString() frontImageUrl!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() backImageUrl?: string;
}

export class KycSelfieDto {
  @ApiProperty() @IsString() selfieImageUrl!: string;
}

export class CardDepositDto {
  @ApiProperty() @IsString() cardHolderName!: string;
  @ApiProperty() @IsString() cardNumber!: string;
  @ApiProperty() @IsString() expiryMonth!: string;
  @ApiProperty() @IsString() expiryYear!: string;
  @ApiProperty() @IsString() cvv!: string;
  @ApiProperty() @IsString() billingZip!: string;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(1) amount!: number;
}

export class BankDepositDto {
  @ApiProperty() @IsString() accountHolderName!: string;
  @ApiProperty() @IsString() bankName!: string;
  @ApiProperty() @IsString() routingNumber!: string;
  @ApiProperty() @IsString() accountNumber!: string;
  @ApiProperty() @IsString() accountType!: string;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(1) amount!: number;
}

export class InternalTransferDto {
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() walletAddress?: string;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0.01) amount!: number;
}

export class OnchainTransferDto {
  @ApiProperty() @IsString() toAddress!: string;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0.01) amount!: number;
}

export class ReviewKycDto {
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Boolean) @IsBoolean() manualReviewRequired?: boolean;
}
