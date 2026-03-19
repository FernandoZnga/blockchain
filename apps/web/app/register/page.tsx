import { RegisterForm } from "../../components/forms";
import { Shell } from "../../components/shell";
import { Card } from "../../components/ui";

export default function RegisterPage() {
  return (
    <Shell title="Create Account" eyebrow="Onboarding">
      <Card className="max-w-xl">
        <p className="mb-6 text-sm leading-6 text-slate-500">Registration creates a user, provisions a wallet, and opens a simulated KYC profile in the backend.</p>
        <RegisterForm />
      </Card>
    </Shell>
  );
}
