import { describe, expect, it } from "vitest";
import { generationSchema } from "@/lib/validation";

describe("generation validation", () => {
  it("accepts valid payload", () => {
    const result = generationSchema.safeParse({
      voiceId: "darija-laila",
      text: "مرحبا بكم في المنصة",
      tone: "دافئ",
      dialect: "دارجة",
      speed: 1,
      includeMusic: false,
    });

    expect(result.success).toBe(true);
  });

  it("rejects too short text", () => {
    const result = generationSchema.safeParse({
      voiceId: "darija-laila",
      text: "قصير",
      tone: "دافئ",
      dialect: "دارجة",
      speed: 1,
      includeMusic: false,
    });

    expect(result.success).toBe(false);
  });
});
