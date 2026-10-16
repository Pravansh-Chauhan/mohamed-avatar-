import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDemoCreditSummary, listGenerations } from "@/lib/generations";

export async function GET() {
  try {
    const user = await requireUser();
    const generations = await listGenerations(user.id);
    const credits = getDemoCreditSummary();
    return NextResponse.json({ generations, credits });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
