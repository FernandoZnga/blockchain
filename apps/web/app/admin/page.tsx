import { Shell } from "../../components/shell";
import { AdminView } from "../../components/views";

export default function AdminPage() {
  return (
    <Shell title="Admin Console" eyebrow="Operations">
      <AdminView />
    </Shell>
  );
}
