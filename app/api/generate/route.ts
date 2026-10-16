import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createGeneration } from "@/lib/generations";
import { checkRateLimit } from "@/lib/rate-limit";
import { generationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const limiter = checkRateLimit(`generate:${user.id}`);
    if (!limiter.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const json = await request.json();
    const parsed = generationSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const generation = await createGeneration(user.id, parsed.data);
    return NextResponse.json({ generation, remaining: limiter.remaining });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: "Generation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
