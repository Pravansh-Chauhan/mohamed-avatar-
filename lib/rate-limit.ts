import { env } from "@/lib/env";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return { allowed: true, remaining: env.rateLimitPerMinute - 1 };
  }

  if (current.count >= env.rateLimitPerMinute) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  return { allowed: true, remaining: env.rateLimitPerMinute - current.count };
}
