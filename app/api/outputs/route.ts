// app/api/outputs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("[api] GET /api/outputs @", new Date().toISOString());
    const items = await prisma.htmlOutput.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (err) {
    console.error("[api] GET /api/outputs error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    console.log("[api] POST /api/outputs @", new Date().toISOString());
    const body = await req.json().catch(() => null);
    const title = String(body?.title ?? "").trim();
    const content = String(body?.content ?? "");

    if (!title || !content) {
      return NextResponse.json(
        { error: "title & content required" },
        { status: 400 }
      );
    }

    const created = await prisma.htmlOutput.create({
      data: { title, content },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[api] POST /api/outputs error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
