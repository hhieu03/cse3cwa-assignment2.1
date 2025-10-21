/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/outputs/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toId(x: unknown) {
  const n = Number(x);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function GET(_req: Request, { params }: any) {
  try {
    console.log("[api] GET /api/outputs/%s @ %s", params?.id, new Date().toISOString());
    const id = toId(params?.id);
    if (!id) return NextResponse.json({ error: "bad id" }, { status: 400 });

    const item = await prisma.htmlOutput.findUnique({ where: { id } });
    return item
      ? NextResponse.json(item)
      : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (err) {
    console.error("[api] GET /api/outputs/[id] error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: any) {
  try {
    console.log("[api] PUT /api/outputs/%s @ %s", params?.id, new Date().toISOString());
    const id = toId(params?.id);
    if (!id) return NextResponse.json({ error: "bad id" }, { status: 400 });

    const body = await req.json().catch(() => null);
    const title = String(body?.title ?? "").trim();
    const content = String(body?.content ?? "");

    const updated = await prisma.htmlOutput.update({
      where: { id },
      data: { title, content },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[api] PUT /api/outputs/[id] error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: any) {
  try {
    console.log("[api] DELETE /api/outputs/%s @ %s", params?.id, new Date().toISOString());
    const id = toId(params?.id);
    if (!id) return NextResponse.json({ error: "bad id" }, { status: 400 });

    await prisma.htmlOutput.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api] DELETE /api/outputs/[id] error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
