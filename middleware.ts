import { NextResponse } from "next/server";

export function middleware(req: Request) {
  try {
    const url = new URL(req.url);
    // Log pageview cho mọi trang UI (trừ /api/* để bớt ồn)
    if (!url.pathname.startsWith("/api/")) {
      console.log("[instrument] pageview", {
        path: url.pathname,
        t: new Date().toISOString(),
      });
    }
  } catch {
    // ignore
  }
  return NextResponse.next();
}
