"use client";

import { useMemo, useState } from "react";
import { calculateCreditCost, estimateDurationSeconds } from "@/lib/credits";
import { isDemoMode } from "@/lib/env";
import { SessionUser, VoicePersona } from "@/lib/types";

type HistoryItem = {
  id: string;
  text: string;
  audioUrl: string;
  estimatedDurationSec: number;
  estimatedCostCredits: number;
  createdAt: string;
};

type DashboardClientProps = {
  user: SessionUser;
  voices: VoicePersona[];
  history: HistoryItem[];
  credits: { monthly: number; used: number; remaining: number };
};

const quickChips = ["إعلان منتوج جديد", "بودكاست قصير", "رسالة ترحيبية", "عرض خاص اليوم"];

export function DashboardClient({ user, voices, history: initialHistory, credits }: DashboardClientProps) {
  const [selectedVoice, setSelectedVoice] = useState(voices[0]?.id ?? "");
  const [tone, setTone] = useState("احترافي");
  const [dialect, setDialect] = useState("دارجة حضرية");
  const [speed, setSpeed] = useState(1);
  const [script, setScript] = useState("مرحبا بكم في منصة Sawt Atlas لتحويل النص إلى صوت دارج مغربي.");
  const [history, setHistory] = useState(initialHistory);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [themeDark, setThemeDark] = useState(true);

  const charCount = script.length;
  const estimatedCredits = useMemo(() => calculateCreditCost(charCount), [charCount]);
  const estimatedDuration = useMemo(() => estimateDurationSeconds(charCount), [charCount]);
  const progress = Math.min((credits.used / Math.max(credits.monthly, 1)) * 100, 100);

  const latestAudio = history[0]?.audioUrl;

  async function handleGenerate() {
    setStatus("loading");
    setMessage("جاري التوليد...");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          voiceId: selectedVoice,
          text: script,
          tone,
          dialect,
          speed,
          includeMusic: false,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Generation failed");
      }

      setHistory((current) => [result.generation, ...current]);
      setStatus("success");
      setMessage("تم إنشاء التسجيل بنجاح");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "تعذر إنشاء التسجيل");
    }
  }

  return (
    <main className={themeDark ? "min-h-screen bg-[#09142b] px-4 py-6 text-white" : "min-h-screen bg-slate-100 px-4 py-6 text-slate-900"}>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="card flex flex-col gap-4 rounded-2xl p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sawt Atlas — لوحة التحكم</h1>
            <p className="text-sm text-white/70">مرحبا {user.name} · {isDemoMode ? "وضع تجريبي" : "وضع إنتاج"}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-xl border border-orange-400/40 px-3 py-1">الرصيد المتبقي: {credits.remaining}</span>
            <button className="rounded-xl border border-white/20 px-3 py-1" onClick={() => setThemeDark((v) => !v)}>
              تبديل الثيم
            </button>
            <button className="rounded-xl border border-white/20 px-3 py-1">قائمة المستخدم</button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="card rounded-2xl p-5 lg:col-span-2">
            <h2 className="font-semibold">نص التعليق الصوتي</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickChips.map((chip) => (
                <button key={chip} className="chip rounded-full px-3 py-1 text-sm" onClick={() => setScript((prev) => `${prev} ${chip}`)}>
                  {chip}
                </button>
              ))}
            </div>
            <textarea
              className="mt-4 h-48 w-full rounded-xl border border-white/20 bg-[#081126] p-4 text-right"
              value={script}
              onChange={(e) => setScript(e.target.value)}
            />
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/75">
              <span>الحروف: {charCount}</span>
              <span>المدة المتوقعة: {estimatedDuration} ثانية</span>
              <span>التكلفة: {estimatedCredits} رصيد</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <button className="rounded-lg border border-white/20 px-4 py-2" onClick={() => setScript("")}>مسح</button>
              <button className="rounded-lg border border-white/20 px-4 py-2" onClick={() => navigator.clipboard.writeText(script)}>
                نسخ
              </button>
              <button
                className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white disabled:opacity-60"
                disabled={status === "loading"}
                onClick={handleGenerate}
              >
                {status === "loading" ? "جاري التوليد..." : "إنشاء التعليق الصوتي"}
              </button>
            </div>
            <p className="mt-2 text-sm text-orange-200">{message}</p>
          </article>

          <article className="card rounded-2xl p-5">
            <h2 className="font-semibold">استهلاك الرصيد</h2>
            <div className="mt-4 h-3 rounded-full bg-white/15">
              <div className="h-3 rounded-full bg-orange-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-sm text-white/75">المستخدم {credits.used} من {credits.monthly}</p>
            <h3 className="mt-5 font-semibold">اختيار الصوت</h3>
            <select
              className="mt-2 w-full rounded-lg border border-white/20 bg-[#09142b] p-2"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              {voices.map((voice) => (
                <option key={voice.id} value={voice.id}>{voice.name} · {voice.gender} · {voice.style}</option>
              ))}
            </select>
            <h3 className="mt-4 font-semibold">إعدادات متقدمة</h3>
            <label className="mt-2 block text-sm">النبرة
              <input className="mt-1 w-full rounded-lg border border-white/20 bg-[#09142b] p-2" value={tone} onChange={(e) => setTone(e.target.value)} />
            </label>
            <label className="mt-2 block text-sm">اللهجة
              <input className="mt-1 w-full rounded-lg border border-white/20 bg-[#09142b] p-2" value={dialect} onChange={(e) => setDialect(e.target.value)} />
            </label>
            <label className="mt-2 block text-sm">السرعة ({speed}x)
              <input type="range" min="0.7" max="1.4" step="0.1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="mt-1 w-full" />
            </label>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="card rounded-2xl p-5">
            <h2 className="font-semibold">مشغل النتيجة</h2>
            <div className="mt-3 rounded-xl border border-white/20 p-4">
              <div className="mb-2 h-12 rounded bg-orange-400/10" aria-hidden />
              {latestAudio ? <audio controls className="w-full" src={latestAudio} /> : <p className="text-sm text-white/60">مازال ما كاين حتى تسجيل.</p>}
              {history[0] && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <a className="rounded-lg border border-white/20 px-3 py-1" href={`/api/download/${history[0].id}`}>تحميل WAV</a>
                  <a className="rounded-lg border border-white/20 px-3 py-1" href={`/api/download/${history[0].id}`}>تحميل MP3</a>
                </div>
              )}
            </div>
            <h3 className="mt-4 font-semibold">موسيقى خلفية</h3>
            <div className="mt-2 flex items-center gap-3">
              <select className="rounded-lg border border-white/20 bg-[#09142b] p-2">
                <option>Calm Oud</option>
                <option>Urban Chill</option>
                <option>Atlas Ambient</option>
              </select>
              <input type="range" min="0" max="100" defaultValue="45" aria-label="volume" />
            </div>
          </article>

          <article className="card rounded-2xl p-5">
            <h2 className="font-semibold">سجل التسجيلات</h2>
            <ul className="mt-3 space-y-2">
              {history.slice(0, 8).map((item) => (
                <li key={item.id} className="rounded-xl border border-white/15 p-3 text-sm">
                  <p className="line-clamp-2">{item.text}</p>
                  <p className="mt-1 text-white/60">{item.estimatedDurationSec}ث · {item.estimatedCostCredits} رصيد</p>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {voices.map((voice) => (
            <article key={voice.id} className="card rounded-2xl p-4">
              <h3 className="font-semibold">{voice.name}</h3>
              <p className="mt-1 text-sm text-white/70">{voice.gender} · {voice.style}</p>
              <p className="mt-2 text-xs text-white/60">{voice.previewText}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
