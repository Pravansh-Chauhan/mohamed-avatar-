import { headers } from "next/headers";
import { demoUser } from "@/lib/demo-data";
import { env } from "@/lib/env";
import { SessionUser } from "@/lib/types";

export async function getSessionUser(): Promise<SessionUser | null> {
  if (env.authProvider === "demo" && env.demoAuthEnabled) {
    return {
      ...demoUser,
      id: env.demoAuthUserId,
      role: env.demoAuthUserId === "admin" ? "ADMIN" : demoUser.role,
    };
  }

  const h = await headers();
  const userId = h.get("x-user-id");
  const email = h.get("x-user-email");
  if (!userId || !email) return null;

  return {
    id: userId,
    email,
    name: h.get("x-user-name") ?? "User",
    role: (h.get("x-user-role") as SessionUser["role"]) ?? "USER",
  };
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
