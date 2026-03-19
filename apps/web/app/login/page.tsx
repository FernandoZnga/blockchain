import { LoginForm } from "../../components/forms";
import { Shell } from "../../components/shell";
import { Card } from "../../components/ui";

export default function LoginPage() {
  return (
    <Shell title="Sign In" eyebrow="Access">
      <Card className="max-w-xl">
        <p className="mb-6 text-sm leading-6 text-slate-500">Use a seeded demo account or register a new one. Tokens are stored locally for the demo session.</p>
        <LoginForm />
      </Card>
    </Shell>
  );
}
