import path from "node:path";
import { readFile } from "node:fs/promises";
import { calculateCreditCost, estimateDurationSeconds } from "@/lib/credits";
import { inMemoryGenerations } from "@/lib/demo-data";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { getStorageAdapter } from "@/lib/storage/adapter";
import { getTtsProvider } from "@/lib/tts/provider";
import { GenerationInput } from "@/lib/validation";

export async function createGeneration(userId: string, input: GenerationInput) {
  const provider = getTtsProvider();
  const tts = await provider.synthesize({ text: input.text, voiceId: input.voiceId });
  const id = crypto.randomUUID();
  const fileName = `${id}.${tts.format}`;
  const storage = getStorageAdapter();
  const saved = await storage.save(fileName, tts.audioBuffer);

  const charCount = input.text.length;
  const credits = calculateCreditCost(charCount);
  const duration = estimateDurationSeconds(charCount);

  const record = {
    id,
    userId,
    voiceId: input.voiceId,
    text: input.text,
    tone: input.tone,
    dialect: input.dialect,
    charCount,
    estimatedDurationSec: duration,
    estimatedCostCredits: credits,
    audioUrl: saved.publicUrl,
    format: tts.format,
    status: "SUCCESS" as const,
    createdAt: new Date().toISOString(),
  };

  if (!prisma) {
    inMemoryGenerations.unshift(record);
    return record;
  }

  await prisma.voiceGeneration.create({
    data: {
      id,
      userId,
      voiceId: input.voiceId,
      scriptText: input.text,
      tone: input.tone,
      dialect: input.dialect,
      charCount,
      estimatedDurationSec: duration,
      estimatedCostCredits: credits,
      status: "SUCCESS",
      providerName: provider.name,
      format: tts.format.toUpperCase() as "WAV" | "MP3",
      storagePath: saved.publicUrl,
      fileSizeBytes: tts.audioBuffer.length,
      checksum: `demo-${id}`,
    },
  });

  await prisma.creditLedger.create({
    data: {
      userId,
      amount: -credits,
      reason: "GENERATION",
      generationId: id,
    },
  });

  return record;
}

export async function listGenerations(userId: string) {
  if (!prisma) {
    return inMemoryGenerations.filter((item) => item.userId === userId);
  }

  const rows = await prisma.voiceGeneration.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { voice: true },
    take: 20,
  });

  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    voiceId: row.voiceId,
    text: row.scriptText,
    tone: row.tone,
    dialect: row.dialect,
    charCount: row.charCount,
    estimatedDurationSec: row.estimatedDurationSec,
    estimatedCostCredits: row.estimatedCostCredits,
    audioUrl: row.storagePath,
    format: row.format.toLowerCase() as "wav" | "mp3",
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    voiceName: row.voice.name,
  }));
}

export async function getGenerationAudio(generationId: string, userId: string) {
  const local = inMemoryGenerations.find((item) => item.id === generationId && item.userId === userId);
  if (local) {
    const filePath = path.join(process.cwd(), "public", local.audioUrl.replace(/^\//, ""));
    const content = await readFile(filePath);
    return { content, format: local.format };
  }

  if (!prisma) return null;

  const row = await prisma.voiceGeneration.findFirst({ where: { id: generationId, userId } });
  if (!row) return null;

  const filePath = path.join(process.cwd(), "public", row.storagePath.replace(/^\//, ""));
  const content = await readFile(filePath);
  return { content, format: row.format.toLowerCase() as "wav" | "mp3" };
}

export function getDemoCreditSummary() {
  const used = inMemoryGenerations.reduce((sum, g) => sum + g.estimatedCostCredits, 0);
  const monthly = env.demoMonthlyCredits;
  return { monthly, used, remaining: Math.max(monthly - used, 0) };
}
