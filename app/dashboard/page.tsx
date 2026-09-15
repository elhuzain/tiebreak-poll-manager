import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/containers/admin-dashboard";
import { getCreator } from "@/lib/data/auth";

export const metadata: Metadata = {
  title: "My polls — Tiebreak",
  description: "Manage your Tiebreak polls.",
};

export default async function DashboardPage() {
  const creator = await getCreator();
  if (!creator) redirect("/login");
  return <AdminDashboard email={creator.email} />;
}
