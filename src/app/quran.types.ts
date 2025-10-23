// src/types.ts

export interface Word {
  id: number;
  position: number;
  text_uthmani: string;
  text_indopak?: string;
  text_imlaei?: string;
  verse_key: string;
  page_number?: number;      // deprecated page_number field
  v1_page?: number;          // preferred page field
  line_number?: number;
  audio_url?: string;
  location?: string;
  char_type_name: string;
  code_v1?: string;
  code_v2?: string;
}

export interface AudioSegment {
  url: string;
  duration: number;
  format: string;
}

export interface Audio {
  url: string;
  duration: number;
  format: string;
  segments?: AudioSegment[];
}

export interface Verse {
  id: number;
  chapter_id?: number;
  chapter_number: number;
  verse_number: number;
  verse_key: string;
  verse_index?: number;
  text_uthmani?: string;
  text_uthmani_simple?: string;
  text_imlaei?: string;
  text_imlaei_simple?: string;
  text_indopak?: string;
  text_uthmani_tajweed?: string;
  juz_number: number;
  hizb_number: number;
  rub_number: number;
  page_number?: number;       // deprecated
  v1_page?: number;           // preferred
  image_url?: string;
  image_width?: number;
  words?: Word[];
  translations?: Translation[];
  audio?: Audio;
}

export interface RandomVerse {
  id: number;
  verse_number: number;
  verse_key: string;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: number | null;
  page_number: number;
  juz_number: number;
}

export interface RandomVerseResponse {
  verse: Verse;
}

export interface VerseResponse {
  verse: Verse;
}

export interface TranslatedName {
  language_name: string;
  name: string;
}

export interface Language {
  id: number;
  name: string;
  native_name: string;
  iso_code: string;
  direction: "ltr" | "rtl";
  translated_names: TranslatedName[];
}

export interface LanguagesResponse {
  languages: Language[];
}

// src/types/quran.ts

// Single translation of a verse
export interface Translation {
  resource_id: number;     // Translation resource ID
  resource_name: string;   // Name of the translation (e.g., "Sahih International")
  id: number;              // Unique ID of this translation record
  text: string;            // Translated text
  verse_id?: number;       // Optional: ID of the verse
  verse_key?: string;      // Optional: e.g., "2:255"
  language?: string;       // Optional: language code, e.g., "id"
  foot_notes?: Record<string, string>; // Optional footnotes keyed by footnote ID
}

// Response containing one or more translations
export interface TranslationResponse {
  translations: Translation[];
}

// Translation resource info
export interface TranslationResource {
  id: number;
  language_name: string;
  name: string;
  translator_name: string;
  direction: "ltr" | "rtl";
  author_name: string;
  slug: string;
}

// Response for list of translations
export interface TranslationResourcesResponse {
  translations: TranslationResource[];
}

// Single verse translation
export interface VerseTranslation {
  resource_id: number;
  resource_name: string;
  id: number;
  text: string;
  verse_key: string;
  language: string;
  foot_notes?: Record<string, string>;
}

// Response for verse translations
export interface VerseTranslationResponse {
  translations: VerseTranslation[];
}

// Single verse translation
export interface VerseTranslation {
  resource_id: number;
  resource_name: string;
  id: number;
  text: string;
  verse_key: string;
  language: string;
  foot_notes?: Record<string, string>;
}

// Response for verse translations
export interface VerseTranslationResponse {
  translations: VerseTranslation[];
}

export const allFields = [
  "chapter_id",
  "text_indopak",
  "text_imlaei_simple",
  "text_imlaei",
  "text_uthmani",
  "text_uthmani_simple",
  "text_uthmani_tajweed",
  "text_qpc_hafs",
  "text_qpc_nastaleeq_hafs",
  "text_qpc_nastaleeq",
  "text_indopak_nastaleeq",
  "image_url",
  "image_width",
  "code_v1",
  "code_v2",
  "page_number",
  "v1_page",
  "v2_page"
].join(",");
