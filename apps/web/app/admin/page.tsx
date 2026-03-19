import { Shell } from "../../components/shell";
import { Card, SectionTitle, StatusChip } from "../../components/ui";

export default function AdminPage() {
  return (
    <Shell title="Admin Console" eyebrow="Operations">
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionTitle title="KYC queue" text="Reviewer-facing summary for simulated compliance decisions." />
          <div className="grid gap-3">
            {[
              ["ava@educhain.local", "Approved", "success"],
              ["liam@educhain.local", "Under review", "warning"],
              ["sofia@educhain.local", "Rejected", "danger"],
            ].map(([email, status, tone]) => (
              <div key={email} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
                <p className="text-sm text-slate-700">{email}</p>
                <StatusChip tone={tone as "success" | "warning" | "danger"}>{status}</StatusChip>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle title="Operational controls" text="Read-only admin overview with safe demo actions only." />
          <div className="space-y-3 text-sm leading-7 text-slate-600">
            <p>Inspect users, wallets, deposits, transfers, and audit logs.</p>
            <p>Manually approve, reject, or request KYC resubmission.</p>
            <p>Seed guidance points back to the backend seed script instead of exposing dangerous controls.</p>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
