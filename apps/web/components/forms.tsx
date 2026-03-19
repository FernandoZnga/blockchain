"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiFetch } from "../lib/api";
import { useAuth } from "../providers/auth-provider";

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const depositSchema = z.object({
  amount: z.coerce.number().positive(),
  cardHolderName: z.string().min(1),
  cardNumber: z.string().min(12),
  expiryMonth: z.string().min(2),
  expiryYear: z.string().min(2),
  cvv: z.string().min(3),
  billingZip: z.string().min(3),
});

const sendSchema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  walletAddress: z.string().optional().or(z.literal("")),
  amount: z.coerce.number().positive(),
});

const onchainSchema = z.object({
  toAddress: z.string().min(10),
  amount: z.coerce.number().positive(),
});

const bankDepositSchema = z.object({
  accountHolderName: z.string().min(1),
  bankName: z.string().min(1),
  routingNumber: z.string().min(4),
  accountNumber: z.string().min(4),
  accountType: z.string().min(3),
  amount: z.coerce.number().positive(),
});

const kycSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  lastName: z.string().min(1),
  dateOfBirth: z.string().min(1),
  country: z.string().min(2),
  nationality: z.string().min(2),
  phoneNumber: z.string().min(4),
  addressLine1: z.string().min(3),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  documentType: z.enum(["PASSPORT", "NATIONAL_ID", "DRIVER_LICENSE"]),
  documentNumber: z.string().min(4),
  issuingCountry: z.string().min(2),
  expirationDate: z.string().min(1),
  frontImageUrl: z.string().url(),
  backImageUrl: z.string().url().optional().or(z.literal("")),
  selfieImageUrl: z.string().url(),
});

function FormField({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="grid min-w-0 gap-2 text-sm text-slate-600">
      <span>{label}</span>
      <input {...props} className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400" />
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const { setToken, refreshMe, notify } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit(async (values) => {
        try {
          const response = await apiFetch<{ accessToken: string }>("/auth/register", { method: "POST", body: JSON.stringify(values) });
          setToken(response.accessToken);
          await refreshMe();
          reset();
          notify("Account created. Redirecting to your dashboard.");
          router.push("/dashboard");
        } catch {
          notify("Unable to create account.", "error");
        }
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="First name" error={errors.firstName?.message} {...register("firstName")} />
        <FormField label="Last name" error={errors.lastName?.message} {...register("lastName")} />
      </div>
      <FormField label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <FormField label="Password" type="password" error={errors.password?.message} {...register("password")} />
      <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white" disabled={isSubmitting}>
        Create account
      </button>
    </form>
  );
}

export function LoginForm() {
  const router = useRouter();
  const { setToken, refreshMe, notify } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit(async (values) => {
        try {
          const response = await apiFetch<{ accessToken: string }>("/auth/login", { method: "POST", body: JSON.stringify(values) });
          setToken(response.accessToken);
          await refreshMe();
          reset();
          notify("Signed in successfully.");
          router.push("/dashboard");
        } catch {
          notify("Login failed. Check your credentials.", "error");
        }
      })}
    >
      <FormField label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <FormField label="Password" type="password" error={errors.password?.message} {...register("password")} />
      <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white" disabled={isSubmitting}>
        Sign in
      </button>
    </form>
  );
}

export function CardDepositForm() {
  const { notify } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(depositSchema),
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit(async (values) => {
        const token = localStorage.getItem("educhain-token");
        try {
          await apiFetch("/deposits/card", {
            method: "POST",
            body: JSON.stringify(values),
            headers: { Authorization: `Bearer ${token}` },
          });
          reset();
          notify("Simulated card deposit submitted.");
        } catch {
          notify("Unable to submit the deposit request.", "error");
        }
      })}
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <FormField label="Card holder name" error={errors.cardHolderName?.message} {...register("cardHolderName")} />
        <FormField label="Amount" type="number" step="0.01" error={errors.amount?.message} {...register("amount")} />
      </div>
      <FormField label="Card number" error={errors.cardNumber?.message} {...register("cardNumber")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Expiry month" error={errors.expiryMonth?.message} {...register("expiryMonth")} />
        <FormField label="Expiry year" error={errors.expiryYear?.message} {...register("expiryYear")} />
      </div>
      <FormField label="CVV" error={errors.cvv?.message} {...register("cvv")} />
      <FormField label="Billing ZIP" error={errors.billingZip?.message} {...register("billingZip")} />
      <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white" disabled={isSubmitting}>
        Submit simulated card deposit
      </button>
    </form>
  );
}

export function SendForm() {
  const { notify } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(sendSchema),
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit(async (values) => {
        const token = localStorage.getItem("educhain-token");
        try {
          const payload = {
            ...(values.email ? { email: values.email } : {}),
            ...(values.walletAddress ? { walletAddress: values.walletAddress } : {}),
            amount: values.amount,
          };
          await apiFetch("/transfers/internal", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { Authorization: `Bearer ${token}` },
          });
          notify("Transfer submitted.");
        } catch {
          notify("Unable to submit transfer.", "error");
        }
      })}
    >
      <FormField label="Recipient email" error={errors.email?.message} {...register("email")} />
      <FormField label="Or destination wallet address" error={errors.walletAddress?.message} {...register("walletAddress")} />
      <FormField label="Amount" type="number" step="0.01" error={errors.amount?.message} {...register("amount")} />
      <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white" disabled={isSubmitting}>
        Send funds
      </button>
    </form>
  );
}

export function OnchainSendForm() {
  const { notify } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(onchainSchema),
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit(async (values) => {
        const token = localStorage.getItem("educhain-token");
        try {
          await apiFetch("/transfers/onchain", {
            method: "POST",
            body: JSON.stringify(values),
            headers: { Authorization: `Bearer ${token}` },
          });
          notify("On-chain transfer submitted.");
        } catch {
          notify("Unable to submit on-chain transfer.", "error");
        }
      })}
    >
      <FormField label="Destination address" error={errors.toAddress?.message} {...register("toAddress")} />
      <FormField label="Amount" type="number" step="0.01" error={errors.amount?.message} {...register("amount")} />
      <button className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700" disabled={isSubmitting}>
        Register on-chain transfer
      </button>
    </form>
  );
}

export function BankDepositForm() {
  const { notify } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(bankDepositSchema),
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit(async (values) => {
        const token = localStorage.getItem("educhain-token");
        try {
          await apiFetch("/deposits/bank", {
            method: "POST",
            body: JSON.stringify(values),
            headers: { Authorization: `Bearer ${token}` },
          });
          reset();
          notify("Simulated bank deposit submitted.");
        } catch {
          notify("Unable to submit bank deposit request.", "error");
        }
      })}
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <FormField label="Account holder name" error={errors.accountHolderName?.message} {...register("accountHolderName")} />
        <FormField label="Bank name" error={errors.bankName?.message} {...register("bankName")} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <FormField label="Routing number" error={errors.routingNumber?.message} {...register("routingNumber")} />
        <FormField label="Account number" error={errors.accountNumber?.message} {...register("accountNumber")} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <FormField label="Account type" error={errors.accountType?.message} {...register("accountType")} />
        <FormField label="Amount" type="number" step="0.01" error={errors.amount?.message} {...register("amount")} />
      </div>
      <button className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700" disabled={isSubmitting}>
        Submit simulated bank deposit
      </button>
    </form>
  );
}

export function KycFlowForm() {
  const { notify } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(kycSchema),
  });

  return (
    <form
      className="grid gap-6"
      onSubmit={handleSubmit(async (values) => {
        const token = localStorage.getItem("educhain-token");
        const auth = { Authorization: `Bearer ${token}` };
        try {
          await apiFetch("/kyc/start", { method: "POST", headers: auth });
          await apiFetch("/kyc/personal-info", {
            method: "PATCH",
            headers: auth,
            body: JSON.stringify({
              firstName: values.firstName,
              middleName: values.middleName,
              lastName: values.lastName,
              dateOfBirth: values.dateOfBirth,
              country: values.country,
              nationality: values.nationality,
              phoneNumber: values.phoneNumber,
              addressLine1: values.addressLine1,
              addressLine2: values.addressLine2,
              city: values.city,
              state: values.state,
              postalCode: values.postalCode,
            }),
          });
          await apiFetch("/kyc/document", {
            method: "POST",
            headers: auth,
            body: JSON.stringify({
              documentType: values.documentType,
              documentNumber: values.documentNumber,
              issuingCountry: values.issuingCountry,
              expirationDate: values.expirationDate,
              frontImageUrl: values.frontImageUrl,
              backImageUrl: values.backImageUrl || undefined,
            }),
          });
          await apiFetch("/kyc/selfie", {
            method: "POST",
            headers: auth,
            body: JSON.stringify({ selfieImageUrl: values.selfieImageUrl }),
          });
          await apiFetch("/kyc/submit", { method: "POST", headers: auth });
          notify("KYC submitted for review.");
        } catch {
          notify("Unable to submit KYC.", "error");
        }
      })}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <FormField label="First name" error={errors.firstName?.message} {...register("firstName")} />
        <FormField label="Middle name" error={errors.middleName?.message} {...register("middleName")} />
        <FormField label="Last name" error={errors.lastName?.message} {...register("lastName")} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <FormField label="Date of birth" type="date" error={errors.dateOfBirth?.message} {...register("dateOfBirth")} />
        <FormField label="Country" error={errors.country?.message} {...register("country")} />
        <FormField label="Nationality" error={errors.nationality?.message} {...register("nationality")} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Phone number" error={errors.phoneNumber?.message} {...register("phoneNumber")} />
        <FormField label="Address line 1" error={errors.addressLine1?.message} {...register("addressLine1")} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <FormField label="Address line 2" error={errors.addressLine2?.message} {...register("addressLine2")} />
        <FormField label="City" error={errors.city?.message} {...register("city")} />
        <FormField label="State" error={errors.state?.message} {...register("state")} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Postal code" error={errors.postalCode?.message} {...register("postalCode")} />
        <label className="grid gap-2 text-sm text-slate-600">
          <span>Document type</span>
          <select {...register("documentType")} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none">
            <option value="PASSPORT">Passport</option>
            <option value="NATIONAL_ID">National ID</option>
            <option value="DRIVER_LICENSE">Driver license</option>
          </select>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <FormField label="Document number" error={errors.documentNumber?.message} {...register("documentNumber")} />
        <FormField label="Issuing country" error={errors.issuingCountry?.message} {...register("issuingCountry")} />
        <FormField label="Expiration date" type="date" error={errors.expirationDate?.message} {...register("expirationDate")} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <FormField label="Front image URL" error={errors.frontImageUrl?.message} {...register("frontImageUrl")} />
        <FormField label="Back image URL" error={errors.backImageUrl?.message} {...register("backImageUrl")} />
        <FormField label="Selfie image URL" error={errors.selfieImageUrl?.message} {...register("selfieImageUrl")} />
      </div>
      <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white" disabled={isSubmitting}>
        Submit simulated KYC
      </button>
    </form>
  );
}
