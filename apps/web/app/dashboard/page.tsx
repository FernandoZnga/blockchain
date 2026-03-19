import { Shell } from "../../components/shell";
import { DashboardView } from "../../components/views";

export default function DashboardPage() {
  return (
    <Shell title="Dashboard" eyebrow="Overview">
      <DashboardView />
    </Shell>
  );
}
