import { Shell } from "../../components/shell";
import { Card, SectionTitle, StatusChip } from "../../components/ui";

const items = [
  { type: "Deposit", amount: "$250.00", from: "Simulated card", to: "Internal wallet", status: "Approved" },
  { type: "Transfer sent", amount: "$25.00", from: "ava@educhain.local", to: "liam@educhain.local", status: "Approved" },
  { type: "KYC event", amount: "Risk score 22", from: "Simulation engine", to: "KYC profile", status: "Approved" },
];

export default function HistoryPage() {
  return (
    <Shell title="History" eyebrow="Activity">
      <Card>
        <SectionTitle title="Unified history" text="Deposits, transfers, blockchain events, and KYC events are consolidated into a single timeline." />
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={`${item.type}-${item.to}`} className="grid gap-3 rounded-2xl border border-slate-200 px-4 py-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
              <div>
                <p className="font-medium text-slate-900">{item.type}</p>
                <p className="text-sm text-slate-500">{item.amount}</p>
              </div>
              <p className="text-sm text-slate-600">From: {item.from}</p>
              <p className="text-sm text-slate-600">To: {item.to}</p>
              <StatusChip tone="success">{item.status}</StatusChip>
            </div>
          ))}
        </div>
      </Card>
    </Shell>
  );
}
