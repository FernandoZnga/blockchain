import { OnchainSendForm, SendForm } from "../../components/forms";
import { Shell } from "../../components/shell";
import { Card, SectionTitle } from "../../components/ui";

export default function SendPage() {
  return (
    <Shell title="Send Funds" eyebrow="Transfers">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionTitle title="Internal transfer" text="Send by recipient email or by destination wallet address inside the demo environment." />
          <SendForm />
        </Card>
        <Card>
          <SectionTitle title="On-chain educational transfer" text="This uses the dedicated endpoint and stores a demo hash plus block reference." />
          <OnchainSendForm />
        </Card>
      </div>
    </Shell>
  );
}
