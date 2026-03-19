import { Shell } from "../../components/shell";
import { Card, Field, SectionTitle } from "../../components/ui";

export default function ReceivePage() {
  return (
    <Shell title="Receive" eyebrow="Wallet">
      <Card className="max-w-3xl">
        <SectionTitle title="Your educational wallet" text="Share the public address only. Private keys remain encrypted and hidden by default." />
        <div className="grid gap-4">
          <Field label="Public address" value="0x8a72c412bf0ab7c3f16855fe0b7a5f139baf19bf" />
          <Field label="Network" value="Hardhat local private network (chain ID 31337)" />
          <Field label="Receive explanation" value="Incoming demo deposits or user-to-user transfers update your internal balance and may register an on-chain event." />
        </div>
      </Card>
    </Shell>
  );
}
