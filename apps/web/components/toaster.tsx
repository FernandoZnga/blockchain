"use client";

import { useAuth } from "../providers/auth-provider";

export function Toaster() {
  const { toasts } = useAuth();

  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-50 grid w-[min(92vw,32rem)] -translate-x-1/2 gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-[22px] border px-5 py-4 text-sm shadow-card ${
            toast.tone === "success" ? "border-emerald-200 bg-emerald-50 text-slate-900" : "border-rose-200 bg-rose-50 text-slate-900"
          }`}
        >
          <p className="font-medium">{toast.tone === "success" ? "Success" : "Action failed"}</p>
          <p className="mt-1 leading-6">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
