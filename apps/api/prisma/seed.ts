import { PrismaClient, UserRole, KycStatus, OperationStatus, DepositMethod, TransferType, LedgerDirection, LedgerSourceType, PepStatus, SanctionsStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";

const prisma = new PrismaClient();

async function main() {
  const passwordHashes = await Promise.all([
    bcrypt.hash("AdminPass123!", 10),
    bcrypt.hash("CompliancePass123!", 10),
    bcrypt.hash("UserPass123!", 10),
  ]);

  const users = [
    { firstName: "Admin", lastName: "User", email: "admin@educhain.local", role: UserRole.ADMIN, passwordHash: passwordHashes[0] },
    { firstName: "Nora", lastName: "Compliance", email: "compliance@educhain.local", role: UserRole.COMPLIANCE_ADMIN, passwordHash: passwordHashes[1] },
    { firstName: "Ava", lastName: "Stone", email: "ava@educhain.local", role: UserRole.USER, passwordHash: passwordHashes[2] },
    { firstName: "Liam", lastName: "Park", email: "liam@educhain.local", role: UserRole.USER, passwordHash: passwordHashes[2] },
    { firstName: "Sofia", lastName: "Reed", email: "sofia@educhain.local", role: UserRole.USER, passwordHash: passwordHashes[2] },
  ];

  for (const user of users) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } });
    if (existing) continue;

    const created = await prisma.user.create({
      data: {
        ...user,
        emailVerified: true,
        wallet: {
          create: {
            address: `0x${randomUUID().replace(/-/g, "").slice(0, 40)}`,
            encryptedPrivateKey: "seeded-demo-key",
            publicKey: "seeded-demo-public-key",
            internalBalance: user.role === UserRole.USER ? 150 : 0,
            tokenBalance: user.role === UserRole.USER ? 150 : 0,
          },
        },
        kycProfile: {
          create: {
            status:
              user.email === "ava@educhain.local"
                ? KycStatus.APPROVED
                : user.email === "liam@educhain.local"
                  ? KycStatus.UNDER_REVIEW
                  : user.email === "sofia@educhain.local"
                    ? KycStatus.REJECTED
                    : KycStatus.NOT_STARTED,
            riskScore: user.email === "sofia@educhain.local" ? 84 : 22,
            pepStatus: PepStatus.CLEAR,
            sanctionsScreeningStatus: user.email === "sofia@educhain.local" ? SanctionsStatus.REJECTED : SanctionsStatus.CLEAR,
            manualReviewRequired: user.email === "liam@educhain.local",
          },
        },
      },
      include: { wallet: true, kycProfile: true },
    });

    if (created.role === UserRole.USER && created.wallet) {
      await prisma.ledgerEntry.create({
        data: {
          walletId: created.wallet.id,
          direction: LedgerDirection.CREDIT,
          sourceType: LedgerSourceType.ADJUSTMENT,
          sourceId: created.id,
          amount: created.wallet.internalBalance,
          balanceBefore: 0,
          balanceAfter: created.wallet.internalBalance,
        },
      });
    }
  }

  const ava = await prisma.user.findUnique({ where: { email: "ava@educhain.local" }, include: { wallet: true } });
  const liam = await prisma.user.findUnique({ where: { email: "liam@educhain.local" }, include: { wallet: true } });

  if (ava?.wallet && liam?.wallet) {
    await prisma.depositRequest.upsert({
      where: { id: "seed-approved-deposit" },
      update: {},
      create: {
        id: "seed-approved-deposit",
        userId: ava.id,
        walletId: ava.wallet.id,
        method: DepositMethod.CARD,
        amount: 250,
        status: OperationStatus.APPROVED,
        processedAt: new Date(),
        externalReferenceSimulated: "SIM-DEP-APPROVED",
        rawMaskedDetailsJson: {
          cardHolderName: "Ava Stone",
          cardNumber: "**** **** **** 4242",
        },
      },
    });

    await prisma.depositRequest.upsert({
      where: { id: "seed-failed-deposit" },
      update: {},
      create: {
        id: "seed-failed-deposit",
        userId: liam.id,
        walletId: liam.wallet.id,
        method: DepositMethod.BANK,
        amount: 500,
        status: OperationStatus.FAILED,
        processedAt: new Date(),
        externalReferenceSimulated: "SIM-DEP-FAILED",
        rawMaskedDetailsJson: {
          bankName: "Demo Bank",
          accountNumber: "****9988",
        },
      },
    });

    await prisma.transfer.upsert({
      where: { id: "seed-transfer" },
      update: {},
      create: {
        id: "seed-transfer",
        fromWalletId: ava.wallet.id,
        toWalletId: liam.wallet.id,
        toAddress: liam.wallet.address,
        amount: 25,
        status: OperationStatus.APPROVED,
        type: TransferType.INTERNAL,
        confirmedAt: new Date(),
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
