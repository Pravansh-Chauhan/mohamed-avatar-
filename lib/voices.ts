import { demoVoices } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";
import { VoicePersona } from "@/lib/types";

export async function listVoices(): Promise<VoicePersona[]> {
  if (!prisma) return demoVoices;

  const dbVoices = await prisma.voice.findMany({ where: { isActive: true }, orderBy: { createdAt: "asc" } });
  return dbVoices.map((voice) => ({
    id: voice.id,
    name: voice.name,
    gender: voice.gender,
    style: voice.style,
    locale: voice.locale,
    previewText: voice.previewText,
  }));
}
