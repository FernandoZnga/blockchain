import "./globals.css";
import type { Metadata } from "next";
import { QueryProvider } from "../providers/query-provider";

export const metadata: Metadata = {
  title: "EduChain Exchange",
  description: "Educational crypto exchange demo with simulated KYC and a local blockchain.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
