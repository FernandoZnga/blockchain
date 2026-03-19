import { Shell } from "../../components/shell";
import { WalletView } from "../../components/views";

export default function WalletDetailsPage() {
  return (
    <Shell title="Wallet Details" eyebrow="Technical View">
      <WalletView />
    </Shell>
  );
}
