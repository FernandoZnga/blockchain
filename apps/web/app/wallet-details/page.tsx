import { Shell } from "../../components/shell";
import { Card, Field, SectionTitle } from "../../components/ui";

export default function WalletDetailsPage() {
  return (
    <Shell title="Wallet Details" eyebrow="Technical View">
      <Card>
        <SectionTitle title="Wallet summary" text="Keys are generated automatically at registration time and encrypted before storage." />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Wallet address" value="0x8a72c412bf0ab7c3f16855fe0b7a5f139baf19bf" />
          <Field label="Public key" value="0x04a7...f3e1" />
          <Field label="Internal balance" value="1425 EDU" />
          <Field label="On-chain token balance" value="1425 EDU" />
        </div>
      </Card>
    </Shell>
  );
}
