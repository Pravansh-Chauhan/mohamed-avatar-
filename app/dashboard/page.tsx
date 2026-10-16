import { headers } from "next/headers";

export const instant = false;
import { redirect } from "next/navigation";
import { DashboardClient } from "@/app/dashboard/dashboard-client";
import { requireUser } from "@/lib/auth";
import { getDemoCreditSummary, listGenerations } from "@/lib/generations";
import { listVoices } from "@/lib/voices";

export default async function DashboardPage() {
  await headers();

  const user = await requireUser().catch(() => null);
  if (!user) {
    redirect("/");
  }

  const [voices, history] = await Promise.all([listVoices(), listGenerations(user.id)]);
  const credits = getDemoCreditSummary();

  return <DashboardClient user={user} voices={voices} history={history} credits={credits} />;
}
