export const CREDITS_PER_1000_CHAR = 80;
export const AVG_CHARS_PER_SECOND = 16;

export function calculateCreditCost(charCount: number) {
  if (charCount <= 0) return 0;
  return Math.ceil((charCount / 1000) * CREDITS_PER_1000_CHAR);
}

export function estimateDurationSeconds(charCount: number) {
  if (charCount <= 0) return 0;
  return Math.ceil(charCount / AVG_CHARS_PER_SECOND);
}
