import { BankDepositForm, CardDepositForm } from "../../components/forms";
import { Shell } from "../../components/shell";
import { Card, SectionTitle } from "../../components/ui";

export default function AddFundsPage() {
  return (
    <Shell title="Add Funds" eyebrow="Deposits">
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Simulated card deposit" text="Cards and bank accounts are validated locally only. No external processor is involved." />
          <CardDepositForm />
        </Card>
        <Card>
          <SectionTitle title="Simulated bank deposit" text="Bank funding follows the same demo-only processing logic." />
          <BankDepositForm />
        </Card>
        <Card className="lg:col-span-2">
          <SectionTitle title="Processing rules" />
          <div className="space-y-3 text-sm leading-7 text-slate-600">
            <p>Deposits require KYC approval.</p>
            <p>Most demo requests are approved. Some fail to demonstrate operational handling.</p>
            <p>Approved requests credit the internal ledger and can be reflected as demo tokens on the local chain.</p>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
