import { headers } from "next/headers";

export const instant = false;
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { demoPlans, demoVoices } from "@/lib/demo-data";

export default async function AdminPage() {
  await headers();

  const admin = await requireAdmin().catch(() => null);
  if (!admin) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
        <p className="text-sm text-white/70">حدود إدارة الأصوات والخطط والاستهلاك (مهيأة لربطها بقواعد الإنتاج).</p>

        <section className="card rounded-2xl p-5">
          <h2 className="font-semibold">الأصوات</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {demoVoices.map((voice) => (
              <li key={voice.id}>{voice.name} · {voice.style}</li>
            ))}
          </ul>
        </section>

        <section className="card rounded-2xl p-5">
          <h2 className="font-semibold">الخطط</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {demoPlans.map((plan) => (
              <li key={plan.code}>{plan.name} · {plan.monthlyCredits} credits · {plan.priceMad} MAD</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
