import { describe, expect, it } from "vitest";
import { calculateCreditCost, estimateDurationSeconds } from "@/lib/credits";

describe("credit calculations", () => {
  it("calculates rounded credit usage", () => {
    expect(calculateCreditCost(0)).toBe(0);
    expect(calculateCreditCost(1000)).toBe(80);
    expect(calculateCreditCost(1500)).toBe(120);
  });

  it("estimates duration by average chars per second", () => {
    expect(estimateDurationSeconds(0)).toBe(0);
    expect(estimateDurationSeconds(16)).toBe(1);
    expect(estimateDurationSeconds(160)).toBe(10);
  });
});
