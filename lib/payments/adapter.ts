import { env } from "@/lib/env";

export const paymentAdapter = {
  isConfigured: Boolean(env.stripeSecretKey),
  checkoutBoundaryMessage:
    "Stripe adapter boundary: configure STRIPE_SECRET_KEY and webhook handling to enable live billing.",
};
