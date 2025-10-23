// src/app/api/verse/route.ts
import { getRandomVerse } from "@/utils/quranClient";


export async function GET(request: Request) {
  return getRandomVerse(request);
}
