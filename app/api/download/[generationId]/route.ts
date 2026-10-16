import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getGenerationAudio } from "@/lib/generations";

export async function GET(_: Request, { params }: { params: Promise<{ generationId: string }> }) {
  try {
    const user = await requireUser();
    const { generationId } = await params;
    const audio = await getGenerationAudio(generationId, user.id);
    if (!audio) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const type = audio.format === "mp3" ? "audio/mpeg" : "audio/wav";
    return new NextResponse(audio.content, {
      headers: {
        "content-type": type,
        "content-disposition": `attachment; filename=voice-${generationId}.${audio.format}`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
