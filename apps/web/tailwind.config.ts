import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#ffffff",
        ink: "#111827",
        muted: "#6b7280",
        line: "#e5e7eb",
        accent: "#0f172a",
        soft: "#f8fafc",
      },
      boxShadow: {
        card: "0 8px 30px rgba(15, 23, 42, 0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
