import { Shell } from "../../components/shell";
import { ReceiveView } from "../../components/views";

export default function ReceivePage() {
  return (
    <Shell title="Receive" eyebrow="Wallet">
      <ReceiveView />
    </Shell>
  );
}
