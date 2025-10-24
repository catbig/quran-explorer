import { NextResponse } from "next/server";
import axios from "axios";
import CONFIG from "../config/app.config";
import { getAccessToken } from "./oauth";
import { ChapterResponse, RandomVerseResponse, TranslationResource, TranslationResourcesResponse, VerseTranslationResponse } from "@/app/quran.types";
import SECRETS from "@/config/app.secret";

async function getHeaders() {
  return {
      "x-client-id": SECRETS.CLIENT_ID,
      "x-auth-token": await getAccessToken(), // your helper function
  }
}

export async function getVerseByKey(request: Request, key?: string) {
  const url = new URL(request.url);
  const verseKey = key ?? url.searchParams.get("verse_key");

  if (!verseKey) {
      return NextResponse.json({ error: "Missing verse_key" }, { status: 400 });
  }
  const base = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINT.VERSE_BY_KEY}`;
  const fields = "text_uthmani";
  const endpoint = `${base}/${verseKey}?fields=${fields}&language=id`;

  if (CONFIG.debug) {
    console.log("[quranClient] endpoint:", endpoint);
  }

  // Fetch verse by verse_key
  const response = await axios.get(
      endpoint,
      { headers: await getHeaders() }
  );

  if (CONFIG.debug) {
    console.log("[quranClient] response:", response.data);
  }

  return NextResponse.json(response.data);
}

  // Fetch translation resources (get translation ID based on language)
export async function getTranslationResources(language = "indonesian"): Promise<TranslationResource> {
  const endpoint = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINT.RESOURCE.TRANSLATION}?language=${language}`;
  if (CONFIG.debug) {
    console.log("[quranClient.getTranslation] endpoint:", endpoint);
  }

  const res = await axios.get(
    endpoint,
    { headers: await getHeaders() }
  );

  if (!res.data) throw new Error(`Failed to fetch translation resources: ${res.status}`);
  const trData = (await res.data) as TranslationResourcesResponse;
  const translation = trData.translations.find((l) => l.language_name === language);
  if (CONFIG.debug) {
    console.log("[quranClient.getTranslationResources] translation:", translation);
  }
  return translation as TranslationResource;
}

// Get translation for a verse
// https://api-docs.quran.foundation/docs/content_apis_versioned/list-ayah-translations
export async function getTranslation(
  verseKey: string,
  language = "english"
  // language1 = "indonesian"
) {
  const trResponse = await getTranslationResources(language);
  const ep = CONFIG.ENDPOINT.LIST_AYAH_TRANSLATIONS
    .replace(":translation_id", trResponse.id.toString())
    .replace(":verse_key", verseKey);
  const url = new URL(`${CONFIG.API_BASE_URL}${ep}`);

  const endpoint = url.toString();
  if (CONFIG.debug) {
    console.log("[quranClient.getTranslation] endpoint:", endpoint);
  }

  const res = await axios.get(
    endpoint,
    { headers: await getHeaders() }
  );

  if (!res.data) throw new Error(`[getVerseTranslation] Failed to fetch verse translation: ${res.status}`);

  const data = (await res.data) as VerseTranslationResponse;

  if (CONFIG.debug) {
    console.log("[quranClient.getTranslation] data:", data);
  }
  return data;
}

/**
 * Fetch chapter details by chapter number
 * @param chapterNumber number of the chapter (1-114)
 * @returns Chapter object
 */
export async function getChapter(chapterNumber: number) {
  const ep = CONFIG.ENDPOINT.CHAPTERS
    .replace(":id", chapterNumber.toString());
  const url = new URL(`${CONFIG.API_BASE_URL}${ep}`);
  url.searchParams.append(
    "fields",
    "name_complex,name_arabic"
  );

  console.log("[quranClient.getChapter] endpoint: ", url.toString());
  
  const res = await axios.get(
    url.toString(),
    { headers: await getHeaders() }
  );

  const chapterResponse = await res.data as ChapterResponse;
  if (CONFIG.debug) {
    console.log("[getChapter] chapterResponse:", chapterResponse);
  }

  return chapterResponse;
}

export async function getRandomVerse(request: Request) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;

    // Optional filters, e.g. chapter_number, juz_number, etc.
    const chapter = params.get("chapter_number");
    const page = params.get("page_number");
    const juz = params.get("juz_number");
    const hizb = params.get("hizb_number");
    const rub = params.get("rub_el_hizb_number");
    const ruku = params.get("ruku_number");
    const manzil = params.get("manzil_number");

    // Build query string
    const query: Record<string, string> = {};
    if (chapter) query["chapter_number"] = chapter;
    if (page) query["page_number"] = page;
    if (juz) query["juz_number"] = juz;
    if (hizb) query["hizb_number"] = hizb;
    if (rub) query["rub_el_hizb_number"] = rub;
    if (ruku) query["ruku_number"] = ruku;
    if (manzil) query["manzil_number"] = manzil;
    query["fields"] = "text_uthmani";
    query["translations"] = "id";

    // Default: no filters => entire Quran
    const base = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINT.RANDOM_VERSE}`;
    const queryString = new URLSearchParams(query).toString();
    const endpoint = queryString ? `${base}?${queryString}` : base;

    // Debug log
    if (CONFIG.debug) {
      console.log("[getRandomVerse] Fetching random verse from:", endpoint);
      console.log("[getRandomVerse] Query string:", queryString);
    }

    const res = await axios.get(
      endpoint,
      { headers: await getHeaders() }
    );
    const randomResponse = await res.data as RandomVerseResponse;
    if (CONFIG.debug) {
      console.log("[getRandomVerse] randomResponse:", randomResponse);
    }

    if(randomResponse) {
      const verseKey = randomResponse.verse.verse_key;
      const [chapterStr] = verseKey.split(":");
      randomResponse.verse.chapter_number = parseInt(chapterStr,10);

      const translationResponse = await getTranslation(verseKey);
      if (translationResponse) randomResponse.verse.translations = translationResponse.translations;

      const chapterResponse = await getChapter(randomResponse.verse.chapter_number);
      if (chapterResponse) randomResponse.chapter = chapterResponse.chapter;
    }

    return NextResponse.json(randomResponse);
  } catch (error: any) {
    console.error(`quranClient:183:5 Error:`, error.response?.data ?? error.message);
    return NextResponse.json(
      { error: "Failed to fetch random verse" },
      { status: 500 }
    );
  }
}
