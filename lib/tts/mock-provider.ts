import { estimateDurationSeconds } from "@/lib/credits";

type MockTtsInput = {
  text: string;
  voiceId: string;
};

function makeSineWaveWav(durationSec: number) {
  const sampleRate = 16_000;
  const totalSamples = sampleRate * Math.max(durationSec, 1);
  const bytesPerSample = 2;
  const dataSize = totalSamples * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * bytesPerSample, 28);
  buffer.writeUInt16LE(bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < totalSamples; i += 1) {
    const t = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * 440 * t) * 0.2;
    buffer.writeInt16LE(sample * 32_767, 44 + i * 2);
  }

  return buffer;
}

export const mockTtsProvider = {
  name: "mock",
  async synthesize(input: MockTtsInput) {
    const seconds = estimateDurationSeconds(input.text.length);
    const wav = makeSineWaveWav(Math.min(Math.max(seconds, 1), 15));
    return {
      audioBuffer: wav,
      format: "wav" as const,
      durationSec: Math.min(Math.max(seconds, 1), 15),
      meta: {
        provider: "mock",
        voice: input.voiceId,
      },
    };
  },
};
