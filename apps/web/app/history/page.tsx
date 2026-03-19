import { Shell } from "../../components/shell";
import { HistoryView } from "../../components/views";

export default function HistoryPage() {
  return (
    <Shell title="History" eyebrow="Activity">
      <HistoryView />
    </Shell>
  );
}
