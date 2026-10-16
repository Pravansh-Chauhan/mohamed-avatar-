import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { listVoices } from "@/lib/voices";

export async function GET() {
  try {
    await requireUser();
    const voices = await listVoices();
    return NextResponse.json({ voices });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
