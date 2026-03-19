import { Shell } from "../../../components/shell";
import { KycStatusView } from "../../../components/views";

export default function KycStatusPage() {
  return (
    <Shell title="KYC Status" eyebrow="Compliance">
      <KycStatusView />
    </Shell>
  );
}
