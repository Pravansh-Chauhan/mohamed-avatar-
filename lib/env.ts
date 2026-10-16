export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: process.env.DATABASE_URL,
  authProvider: process.env.AUTH_PROVIDER ?? "demo",
  demoAuthEnabled: process.env.DEMO_AUTH_ENABLED !== "false",
  demoAuthUserId: process.env.DEMO_AUTH_USER_ID ?? "demo-user-1",
  demoMonthlyCredits: Number.parseInt(process.env.DEMO_MONTHLY_CREDITS ?? "10000", 10),
  ttsProvider: process.env.TTS_PROVIDER ?? "mock",
  ttsApiKey: process.env.TTS_API_KEY,
  storageProvider: process.env.STORAGE_PROVIDER ?? "local",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  rateLimitPerMinute: Number.parseInt(process.env.RATE_LIMIT_PER_MINUTE ?? "30", 10),
};

export const isDatabaseConfigured = Boolean(env.databaseUrl);
export const isDemoMode = env.ttsProvider === "mock" || !env.ttsApiKey;
