import { env, isDemoMode } from "@/lib/env";
import { mockTtsProvider } from "@/lib/tts/mock-provider";

export type TtsProvider = {
  name: string;
  synthesize: (input: { text: string; voiceId: string }) => Promise<{
    audioBuffer: Buffer;
    format: "wav" | "mp3";
    durationSec: number;
    meta: Record<string, string>;
  }>;
};

const providerRegistry: Record<string, TtsProvider> = {
  mock: mockTtsProvider,
};

export function getTtsProvider(): TtsProvider {
  if (isDemoMode) return mockTtsProvider;

  return providerRegistry[env.ttsProvider] ?? mockTtsProvider;
}
