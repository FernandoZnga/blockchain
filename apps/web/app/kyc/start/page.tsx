import { KycFlowForm } from "../../../components/forms";
import { Shell } from "../../../components/shell";
import { KycStatusView } from "../../../components/views";
import { Card, Field, SectionTitle, StatusChip } from "../../../components/ui";

export default function KycStartPage() {
  return (
    <Shell title="Simulated KYC" eyebrow="Compliance">
      <Card className="max-w-4xl">
        <SectionTitle title="How the demo KYC flow works" text="This is a deterministic educational simulation, not real verification." />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Step 1" value="Personal information" />
          <Field label="Step 2" value="Identity document upload" />
          <Field label="Step 3" value="Selfie / simulated face match" />
          <Field label="Step 4" value="Automated demo screening and optional manual review" />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <StatusChip tone="warning">Pending approval blocks deposits and transfers</StatusChip>
        </div>
      </Card>
      <div className="mt-6">
        <KycStatusView />
      </div>
      <div className="mt-6">
        <Card className="max-w-5xl">
          <SectionTitle title="Submit KYC details" text="This form chains the simulated KYC API endpoints in sequence." />
          <KycFlowForm />
        </Card>
      </div>
      <div className="mt-6">
        <Card className="max-w-5xl">
          <SectionTitle title="Who approves KYC?" text="The user submits the simulated KYC. Admin or compliance users can approve cases from the admin console when manual review is required." />
        </Card>
      </div>
    </Shell>
  );
}
