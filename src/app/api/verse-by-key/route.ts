// src/app/api/verse-by-key/route.ts
import { NextResponse } from "next/server";
import { getVerseByKey } from "@/utils/quranClient";

export async function GET(request: Request) {
  try {
    const res = await getVerseByKey(request);
    return NextResponse.json(res.json());
  } catch (error: any) {
    console.error("[API] Error fetching verse by key:", error.response?.data ?? error.message);
    return NextResponse.json(
      { error: "Failed to fetch verse" },
      { status: 500 }
    );
  }
}
