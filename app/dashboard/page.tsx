import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/containers/admin-dashboard";
import { getCreator } from "@/lib/data/auth";
import { getMyPolls } from "@/lib/data/polls";

export const metadata: Metadata = {
  title: "My polls — Tiebreak",
  description: "Manage your Tiebreak polls.",
};

export default async function DashboardPage() {
  const creator = await getCreator();
  if (!creator) redirect("/login");
  const polls = await getMyPolls(creator.id);
  return <AdminDashboard email={creator.email} polls={polls} />;
}
