import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { listVoices } from "@/lib/voices";

export async function GET(_: Request, { params }: { params: Promise<{ voiceId: string }> }) {
  try {
    await requireUser();
    const { voiceId } = await params;
    const voice = (await listVoices()).find((item) => item.id === voiceId);
    if (!voice) {
      return NextResponse.json({ error: "Voice not found" }, { status: 404 });
    }

    return NextResponse.json({ previewText: voice.previewText, previewUrl: null });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
