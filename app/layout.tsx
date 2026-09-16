import type { Metadata } from "next";
import "./globals.css";
import { Gabarito, Karla } from "next/font/google";

const gabarito = Gabarito({ subsets: ["latin"], weight: ["500","700","800","900"], variable: "--font-display", display: "swap" });
const karla = Karla({ subsets: ["latin"], weight: ["400","700","800"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Tiebreak — Group decisions, sorted",
  description: "Create a poll, share one link with your crew, and settle the group chat's next decision together.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${gabarito.variable} ${karla.variable}`}>
      <body>{children}</body>
    </html>
  );
}
