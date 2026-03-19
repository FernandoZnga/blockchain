import { Shell } from "../../../components/shell";
import { Card, Field, SectionTitle, StatusChip } from "../../../components/ui";

export default function KycStatusPage() {
  return (
    <Shell title="KYC Status" eyebrow="Compliance">
      <Card>
        <div className="flex items-center justify-between">
          <SectionTitle title="Current status" text="User is blocked from transacting until approval." />
          <StatusChip tone="success">Approved</StatusChip>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Risk score" value="22 / 100" />
          <Field label="Sanctions screening" value="Clear" />
          <Field label="PEP status" value="Clear" />
        </div>
      </Card>
    </Shell>
  );
}
