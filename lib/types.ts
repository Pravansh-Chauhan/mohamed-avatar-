export type AppRole = "USER" | "ADMIN";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: AppRole;
};

export type VoicePersona = {
  id: string;
  name: string;
  gender: string;
  style: string;
  locale: string;
  previewText: string;
};

export type GenerationRecord = {
  id: string;
  userId: string;
  voiceId: string;
  text: string;
  tone: string;
  dialect: string;
  charCount: number;
  estimatedDurationSec: number;
  estimatedCostCredits: number;
  audioUrl: string;
  format: "wav" | "mp3";
  status: "SUCCESS" | "FAILED";
  createdAt: string;
};
