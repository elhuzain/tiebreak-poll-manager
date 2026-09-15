import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiebreak — Group decisions, sorted",
  description: "Create a poll, share one link with your crew, and settle the group chat's next decision together.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
