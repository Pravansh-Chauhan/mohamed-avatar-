import { GenerationRecord, SessionUser, VoicePersona } from "@/lib/types";

export const demoVoices: VoicePersona[] = [
  {
    id: "darija-laila",
    name: "ليلى الأطلس",
    gender: "أنثى",
    style: "إعلاني دافئ",
    locale: "ar-MA",
    previewText: "سلام عليكم، هذا مثال صوتي باللهجة المغربية.",
  },
  {
    id: "darija-youssef",
    name: "يوسف كازا",
    gender: "ذكر",
    style: "بودكاست شبابي",
    locale: "ar-MA",
    previewText: "مرحبا بكم، نقدر نحول النص ديالك لصوت واضح.",
  },
  {
    id: "darija-salma",
    name: "سلمى فاس",
    gender: "أنثى",
    style: "رواية هادئة",
    locale: "ar-MA",
    previewText: "الواجهة هنا مصممة باش تخدم بسهولة على الهاتف والحاسوب.",
  },
];

export const demoUser: SessionUser = {
  id: "demo-user-1",
  email: "demo@sawtatlas.local",
  name: "مستخدم تجريبي",
  role: "ADMIN",
};

export const demoPlans = [
  { code: "starter", name: "Starter", monthlyCredits: 10000, priceMad: 99 },
  { code: "pro", name: "Pro", monthlyCredits: 50000, priceMad: 249 },
];

export const inMemoryGenerations: GenerationRecord[] = [];
