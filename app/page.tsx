import Link from "next/link";

const features = [
  "تحويل نصوص الدارجة لصوت احترافي",
  "إدارة الرصيد والخطط",
  "لوحة تحكم RTL متجاوبة",
  "وضع تجريبي آمن بدون مفاتيح API",
];

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-12 md:px-8">
      <section className="mx-auto max-w-6xl rounded-3xl border border-white/15 bg-[#0f1f3d]/80 p-8 shadow-2xl">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-orange-300">منصة أصلية مستوحاة من تجارب الدارجة المغربية</p>
            <h1 className="mt-3 text-4xl font-bold">Sawt Atlas</h1>
            <p className="mt-3 max-w-2xl text-white/80">
              استوديو تحويل النص إلى صوت بواجهة عربية RTL، مع معمارية جاهزة للإنتاج، دمج مزودات TTS، وإدارة الرصيد.
            </p>
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-400"
            href="/dashboard"
          >
            دخول لوحة التحكم
          </Link>
        </header>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature} className="card rounded-2xl p-5">
              <h2 className="text-lg font-semibold">{feature}</h2>
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="card rounded-2xl p-5">
            <h3 className="font-semibold">التغطية اللهجية</h3>
            <p className="mt-2 text-sm text-white/75">كازا، الرباط، فاس، مراكش، لهجة ميديا إعلانية.</p>
          </div>
          <div className="card rounded-2xl p-5">
            <h3 className="font-semibold">الأسعار والرصيد</h3>
            <p className="mt-2 text-sm text-white/75">خطط شهرية مع تتبع دقيق لكل حرف مستخدم.</p>
          </div>
          <div className="card rounded-2xl p-5">
            <h3 className="font-semibold">الأسئلة الشائعة</h3>
            <p className="mt-2 text-sm text-white/75">يتحول تلقائيا للوضع التجريبي إذا لم تضف مفاتيح المزود.</p>
          </div>
        </section>
      </section>
    </main>
  );
}
