import { Shell } from "../../../components/shell";
import { Card, SectionTitle, StatusChip } from "../../../components/ui";

export default function KycReviewPage() {
  return (
    <Shell title="KYC Review Timeline" eyebrow="Compliance">
      <Card className="max-w-3xl">
        <SectionTitle title="Decision trail" text="Audit trail for simulated reviewer decisions." />
        <div className="grid gap-4">
          {[
            ["Started", "Profile created after registration", "neutral"],
            ["Submitted", "Documents and selfie uploaded", "neutral"],
            ["Approved", "Auto-screening passed with low-risk profile", "success"],
          ].map(([label, text, tone]) => (
            <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
              <div>
                <p className="font-medium text-slate-900">{label}</p>
                <p className="text-sm text-slate-500">{text}</p>
              </div>
              <StatusChip tone={tone as "neutral" | "success"}>{label}</StatusChip>
            </div>
          ))}
        </div>
      </Card>
    </Shell>
  );
}
