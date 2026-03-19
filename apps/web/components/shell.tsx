import Link from "next/link";

const navItems = [
  ["Dashboard", "/dashboard"],
  ["KYC", "/kyc/status"],
  ["Add Funds", "/add-funds"],
  ["Send", "/send"],
  ["Receive", "/receive"],
  ["History", "/history"],
  ["Wallet", "/wallet-details"],
  ["Learn", "/technical-details"],
  ["Admin", "/admin"],
];

export function Shell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
        <aside className="border-b border-slate-200 bg-white px-6 py-6 md:min-h-screen md:w-72 md:border-b-0 md:border-r">
          <div className="mb-8">
            <Link href="/" className="text-sm font-semibold tracking-[0.24em] text-slate-500 uppercase">
              EduChain Exchange
            </Link>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Educational crypto exchange demo with simulated compliance and a local blockchain.
            </p>
          </div>
          <nav className="grid gap-2">
            {navItems.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 px-5 py-6 md:px-10 md:py-10">
          <header className="mb-8">
            {eyebrow ? <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p> : null}
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
