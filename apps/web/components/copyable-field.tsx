"use client";

import { shortMiddle } from "../lib/api";
import { useAuth } from "../providers/auth-provider";

export function CopyableField({
  label,
  value,
  shorten = true,
}: {
  label: string;
  value: string;
  shorten?: boolean;
}) {
  const { notify } = useAuth();

  return (
    <div className="rounded-2xl border border-slate-200 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            notify(`${label} copied.`);
          }}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          aria-label={`Copy ${label}`}
          title={`Copy ${label}`}
        >
          <span className="text-xs">⧉</span>
        </button>
      </div>
      <p className="mt-2 break-all text-sm text-slate-700">{shorten ? shortMiddle(value) : value}</p>
    </div>
  );
}
