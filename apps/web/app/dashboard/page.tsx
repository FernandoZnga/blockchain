import { Shell } from "../../components/shell";
import { Card, SectionTitle, StatCard, StatusChip } from "../../components/ui";

export default function DashboardPage() {
  return (
    <Shell title="Dashboard" eyebrow="Overview">
      <div className="grid gap-5 lg:grid-cols-3">
        <StatCard label="Available balance" value="$1,425.00" hint="Internal demo ledger balance" />
        <StatCard label="Wallet address" value="0x8a72...19bf" hint="Auto-generated on registration" />
        <StatCard label="KYC status" value="Approved" hint="Required for deposits and transfers" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <SectionTitle title="Recent activity" text="Latest deposits, transfers, and compliance events." />
          <div className="grid gap-4">
            {[
              ["Deposit", "$250.00", "Approved"],
              ["Internal transfer", "$25.00", "Approved"],
              ["KYC review", "Risk score 22", "Approved"],
            ].map(([label, value, status]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
                <div>
                  <p className="font-medium text-slate-900">{label}</p>
                  <p className="text-sm text-slate-500">{value}</p>
                </div>
                <StatusChip tone="success">{status}</StatusChip>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle title="Network health" text="Private/local blockchain status." />
          <div className="grid gap-4">
            <div className="rounded-2xl border border-slate-200 px-4 py-4">
              <p className="text-sm text-slate-500">Hardhat node</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">Online</p>
            </div>
            <div className="rounded-2xl border border-slate-200 px-4 py-4">
              <p className="text-sm text-slate-500">Educational banner</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                This environment uses simulated fiat flows, simulated KYC, and a private local chain.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
