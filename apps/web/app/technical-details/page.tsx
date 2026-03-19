import { Shell } from "../../components/shell";
import { Card, SectionTitle } from "../../components/ui";

const topics: [string, string][] = [
  ["Blockchain", "A blockchain is a shared append-only ledger. In this demo it runs locally on Hardhat."],
  ["Wallet", "A wallet groups keys and addresses used to authorize transfers."],
  ["Public address", "The public address is safe to share and is used to receive demo funds."],
  ["Private key", "The private key proves control. Here it is encrypted in the database for educational purposes."],
  ["Signing", "Signing produces a cryptographic proof that a transfer was authorized."],
  ["Block and confirmation", "Transactions are grouped into blocks. Confirmation means the network accepted the transaction."],
  ["Gas", "Gas represents execution cost on EVM-compatible chains."],
  ["KYC", "Know Your Customer checks identity before operations are allowed."],
  ["AML", "Anti-money laundering controls monitor screening and suspicious activity rules."],
  ["Internal ledger vs blockchain", "The exchange tracks balances internally while optionally mirroring key activity on-chain."],
];

export default function TechnicalDetailsPage() {
  return (
    <Shell title="How It Works" eyebrow="Learn">
      <div className="grid gap-5 lg:grid-cols-2">
        {topics.map(([title, text]) => (
          <Card key={title}>
            <SectionTitle title={title} />
            <p className="text-sm leading-7 text-slate-600">{text}</p>
          </Card>
        ))}
      </div>
    </Shell>
  );
}
