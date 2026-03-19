"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, formatCurrency, shortAddress } from "../lib/api";
import { useAuth } from "../providers/auth-provider";
import { CopyableField } from "./copyable-field";
import { Card, Field, SectionTitle, StatCard, StatusChip } from "./ui";

type HistoryItem = {
  type: string;
  dateTime: string;
  status: string;
  reference: string | null;
  details: {
    amount?: string | number;
    currency?: string;
    toAddress?: string;
    externalReferenceSimulated?: string;
  };
};

function useAuthedResource<T>(path: string) {
  const { token } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    apiFetch<T>(path, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setIsLoading(false));
  }, [path, token]);

  return { data, isLoading };
}

export function AddFundsView({
  children,
}: {
  children: React.ReactNode;
}) {
  const kyc = useAuthedResource<{
    status: string;
    manualReviewRequired: boolean;
  }>("/kyc/status");

  const blocked = kyc.data?.status !== "APPROVED";

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <SectionTitle title="Funding eligibility" text="Deposits only unlock when the authenticated account has KYC approved." />
            <p className="text-sm text-slate-600">
              Current KYC status: <span className="font-medium">{kyc.data?.status ?? "Loading"}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusChip tone={blocked ? "warning" : "success"}>{kyc.data?.status ?? "Loading"}</StatusChip>
            {blocked ? (
              <>
                <Link href="/kyc/start" className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white">
                  Complete KYC
                </Link>
                <Link href="/kyc/status" className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700">
                  View status
                </Link>
              </>
            ) : null}
          </div>
        </div>
        {blocked ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-900">
            <p>If your KYC status is `NOT_STARTED` or `IN_PROGRESS`, submit your simulated KYC from the KYC page.</p>
            <p>If your status is `UNDER_REVIEW`, an admin or compliance reviewer must approve it from the admin console.</p>
            <p>If your status is `REJECTED` or `NEEDS_RESUBMISSION`, update the KYC submission and send it again.</p>
          </div>
        ) : null}
      </Card>
      {blocked ? (
        <Card className="lg:col-span-2">
          <SectionTitle title="Deposits are locked" text="Finish the KYC flow first, then return here to add funds." />
        </Card>
      ) : (
        children
      )}
    </div>
  );
}

export function DashboardView() {
  const { user, notify } = useAuth();
  const wallet = useAuthedResource<{ id: string; address: string; internalBalance: string | number; tokenBalance: string | number }>("/wallets/me");
  const history = useAuthedResource<HistoryItem[]>("/history");
  const blockchain = useAuthedResource<{ online: boolean; blockNumber: number | null }>("/system/blockchain-status");

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-3">
        <StatCard label="Available balance" value={formatCurrency(wallet.data?.internalBalance ?? 0)} hint="Internal demo ledger balance" />
        <Card>
          <p className="text-sm text-slate-500">Wallet address</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-3xl font-semibold tracking-tight text-slate-950">
              {wallet.data?.address ? shortAddress(wallet.data.address) : "Loading..."}
            </p>
            {wallet.data?.address ? (
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(wallet.data.address);
                  notify("Wallet address copied.");
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                aria-label="Copy wallet address"
                title="Copy wallet address"
              >
                <span className="text-sm">⧉</span>
              </button>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-slate-500">Auto-generated on registration</p>
        </Card>
        <StatCard label="KYC status" value={user?.kycProfile?.status ?? "Unknown"} hint="Required for deposits and transfers" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <SectionTitle title={`Welcome, ${user?.firstName ?? "User"}`} text="This dashboard is loaded from the authenticated account." />
          <div className="grid gap-4">
            {(history.data ?? []).slice(0, 5).map((item) => (
              <div key={`${item.type}-${item.reference}-${item.dateTime}`} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
                <div>
                  <p className="font-medium capitalize text-slate-900">{item.type.replace("_", " ")}</p>
                  <p className="text-sm text-slate-500">
                    {item.details.amount ? `${item.details.amount} ${item.details.currency ?? ""}`.trim() : item.reference ?? "Activity"}
                  </p>
                </div>
                <StatusChip tone={item.status === "APPROVED" ? "success" : item.status === "FAILED" ? "danger" : "neutral"}>{item.status}</StatusChip>
              </div>
            ))}
            {!history.isLoading && !history.data?.length ? <p className="text-sm text-slate-500">No activity yet for this account.</p> : null}
          </div>
        </Card>
        <Card>
          <SectionTitle title="Network health" text="Private/local blockchain status." />
          <div className="grid gap-4">
            <div className="rounded-2xl border border-slate-200 px-4 py-4">
              <p className="text-sm text-slate-500">Hardhat node</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{blockchain.data?.online ? "Online" : "Offline"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 px-4 py-4">
              <p className="text-sm text-slate-500">Current block</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{blockchain.data?.blockNumber ?? "-"}</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export function HistoryView() {
  const history = useAuthedResource<HistoryItem[]>("/history");

  return (
    <Card>
      <SectionTitle title="Unified history" text="Only the authenticated account's activity is shown here." />
      <div className="grid gap-4">
        {(history.data ?? []).map((item) => (
          <div key={`${item.type}-${item.reference}-${item.dateTime}`} className="grid gap-3 rounded-2xl border border-slate-200 px-4 py-4 md:grid-cols-[1fr_1fr_auto] md:items-center">
            <div>
              <p className="font-medium capitalize text-slate-900">{item.type.replace("_", " ")}</p>
              <p className="text-sm text-slate-500">{item.reference ?? "No reference"}</p>
            </div>
            <p className="text-sm text-slate-600">{new Date(item.dateTime).toLocaleString()}</p>
            <StatusChip tone={item.status === "APPROVED" ? "success" : item.status === "FAILED" ? "danger" : "neutral"}>{item.status}</StatusChip>
          </div>
        ))}
        {!history.isLoading && !history.data?.length ? <p className="text-sm text-slate-500">No activity yet.</p> : null}
      </div>
    </Card>
  );
}

export function WalletView() {
  const wallet = useAuthedResource<{ id: string; address: string; publicKey?: string | null; internalBalance: string | number; tokenBalance: string | number }>("/wallets/me");
  const technical = useAuthedResource<{ publicKey?: string | null }>("/wallets/me/technical-details");

  return (
    <Card>
      <SectionTitle title="Wallet summary" text="These values are loaded for the authenticated account." />
      <div className="grid gap-4 md:grid-cols-2">
        <CopyableField label="Wallet address" value={wallet.data?.address ?? "Loading..."} />
        <CopyableField label="Public key" value={technical.data?.publicKey ?? wallet.data?.publicKey ?? "Not available"} />
        <Field label="Internal balance" value={`${wallet.data?.internalBalance ?? 0} EDU`} />
        <Field label="On-chain token balance" value={`${wallet.data?.tokenBalance ?? 0} EDU`} />
      </div>
    </Card>
  );
}

export function ReceiveView() {
  const wallet = useAuthedResource<{ address: string }>("/wallets/me");

  return (
    <Card className="max-w-3xl">
      <SectionTitle title="Your educational wallet" text="Share the public address only." />
      <div className="grid gap-4">
        <Field label="Public address" value={wallet.data?.address ?? "Loading..."} />
        <Field label="Network" value="Hardhat local private network (chain ID 31337)" />
      </div>
    </Card>
  );
}

export function KycStatusView() {
  const kyc = useAuthedResource<{
    status: string;
    riskScore: number;
    sanctionsScreeningStatus: string;
    pepStatus: string;
    manualReviewRequired: boolean;
  }>("/kyc/status");

  return (
    <Card>
      <div className="flex items-center justify-between">
        <SectionTitle title="Current status" text="Loaded from the authenticated user's KYC profile." />
        <StatusChip tone={kyc.data?.status === "APPROVED" ? "success" : kyc.data?.status === "REJECTED" ? "danger" : "warning"}>
          {kyc.data?.status ?? "Loading"}
        </StatusChip>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Risk score" value={`${kyc.data?.riskScore ?? 0} / 100`} />
        <Field label="Sanctions screening" value={kyc.data?.sanctionsScreeningStatus ?? "Loading"} />
        <Field label="PEP status" value={kyc.data?.pepStatus ?? "Loading"} />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {kyc.data?.status !== "APPROVED" ? (
          <Link href="/kyc/start" className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white">
            Submit or update KYC
          </Link>
        ) : null}
        {kyc.data?.status === "UNDER_REVIEW" || kyc.data?.manualReviewRequired ? (
          <p className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
            Your submission is waiting for admin/compliance approval.
          </p>
        ) : null}
      </div>
    </Card>
  );
}

export function AdminView() {
  const { user, token, notify } = useAuth();
  const [cases, setCases] = useState<Array<{ id: string; status: string; user: { email: string } }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || user?.role === "USER") {
      setIsLoading(false);
      return;
    }

    apiFetch<Array<{ id: string; status: string; user: { email: string } }>>("/admin/kyc/cases", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(setCases)
      .catch(() => setCases([]))
      .finally(() => setIsLoading(false));
  }, [token, user?.role]);

  if (user?.role === "USER") {
    return (
      <Card>
        <SectionTitle title="Admin access required" text="This section is only available to admin and compliance roles." />
      </Card>
    );
  }

  const updateCase = async (id: string, action: "approve" | "reject" | "request-resubmission") => {
    if (!token) return;

    try {
      const updated = await apiFetch<{ id: string; status: string }>("/admin/kyc/cases/" + id + "/" + action, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      });
      setCases((current) => current.map((item) => (item.id === id ? { ...item, status: updated.status } : item)));
      notify(`KYC case updated to ${updated.status}.`);
    } catch {
      notify("Unable to update KYC case.", "error");
    }
  };

  return (
    <Card>
      <SectionTitle title="KYC queue" text="Reviewer-facing summary from the backend." />
      <div className="grid gap-3">
        {cases.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-slate-700">{item.user.email}</p>
              <StatusChip tone={item.status === "APPROVED" ? "success" : item.status === "REJECTED" ? "danger" : "warning"}>{item.status}</StatusChip>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => updateCase(item.id, "approve")} className="rounded-2xl bg-slate-950 px-3 py-2 text-sm text-white">
                Approve
              </button>
              <button onClick={() => updateCase(item.id, "reject")} className="rounded-2xl border border-rose-300 px-3 py-2 text-sm text-rose-700">
                Reject
              </button>
              <button
                onClick={() => updateCase(item.id, "request-resubmission")}
                className="rounded-2xl border border-slate-300 px-3 py-2 text-sm text-slate-700"
              >
                Request resubmission
              </button>
            </div>
          </div>
        ))}
        {!isLoading && cases.length === 0 ? <p className="text-sm text-slate-500">No KYC cases available.</p> : null}
      </div>
    </Card>
  );
}
