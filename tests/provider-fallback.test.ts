import { describe, expect, it } from "vitest";
import { getTtsProvider } from "@/lib/tts/provider";

describe("provider fallback", () => {
  it("uses mock provider by default", () => {
    const provider = getTtsProvider();
    expect(provider.name).toBe("mock");
  });
});
