import { z } from "zod";

export const generationSchema = z.object({
  voiceId: z.string().min(2),
  text: z.string().min(5, "النص قصير جدا").max(3000, "النص طويل جدا"),
  tone: z.string().min(2).max(40),
  dialect: z.string().min(2).max(40),
  speed: z.number().min(0.7).max(1.4).default(1),
  includeMusic: z.boolean().default(false),
});

export type GenerationInput = z.infer<typeof generationSchema>;
