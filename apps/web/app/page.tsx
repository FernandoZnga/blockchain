import Link from "next/link";
import { Card } from "../components/ui";

const pillars = [
  "Simulated registration, KYC, deposits, and transfers",
  "Automatic wallet creation with educational key handling",
  "Internal ledger plus optional on-chain event reflection",
  "Minimal admin tooling for compliance review and operations",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-8 border-b border-slate-200 pb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Educational Exchange Demo</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-950">Crypto exchange flows, simplified for learning.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              EduChain Exchange demonstrates auth, simulated KYC, internal balances, local-chain token logic, and admin review
              in a private full-stack environment.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/register" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white">
              Register
            </Link>
            <Link href="/login" className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700">
              Sign in
            </Link>
          </div>
        </header>

        <section className="grid gap-5 py-10 md:grid-cols-2">
          {pillars.map((item) => (
            <Card key={item}>
              <p className="text-lg leading-8 text-slate-700">{item}</p>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
