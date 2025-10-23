"use client";

import React, { useState } from "react";
import axios from "axios";
import { RandomVerseResponse, Verse } from "./quran.types";
import CONFIG from "../config/app.config";

export default function HomePage() {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chapter, setChapter] = useState("");
  const [juz, setJuz] = useState("");

  const fetchRandomVerse = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (chapter) params["chapter_number"] = chapter;
      if (juz) params["juz_number"] = juz;

      const query = new URLSearchParams(params).toString();
      const url = query ? `/api/verse?${query}` : `/api/verse`;

      const res = await axios.get<RandomVerseResponse>(url);
      if (CONFIG.debug) {
        console.log("[page] verse:", res.data.verse);
      }
      setVerse(res.data.verse);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch verse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-4 text-green-700">
        Quran Explorer
      </h1>

      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
        <div className="flex gap-3 mb-4">
          <input
            type="number"
            placeholder="Chapter Number (optional)"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="w-1/2 border rounded-lg p-2 focus:outline-none focus:ring focus:ring-green-300"
          />
          <input
            type="number"
            placeholder="Juz Number (optional)"
            value={juz}
            onChange={(e) => setJuz(e.target.value)}
            className="w-1/2 border rounded-lg p-2 focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>

        <button
          onClick={fetchRandomVerse}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          {loading ? "Loading..." : "Get Random Verse"}
        </button>

        {error && <p className="text-red-600 mt-3 text-center">{error}</p>}

        {verse && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-1">
              Chapter {verse.chapter_number}, Verse {verse.verse_number}
            </p>
            <p className="text-2xl font-arabic mb-3 text-gray-900 leading-relaxed">
              {verse.text_uthmani || verse.text_imlaei}
            </p>
            {verse.translations && verse.translations.length > 0 && (
              <p className="text-base italic text-gray-700" 
                dangerouslySetInnerHTML={{ __html: verse.translations[0].text }}
              />
            )}
          </div>
        )}
      </div>

      <footer className="mt-8 text-gray-400 text-sm">
        Powered by Quran.Foundation API
      </footer>
    </main>
  );
}
