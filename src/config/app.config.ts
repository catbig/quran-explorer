interface OAuthConfig {
  TOKEN_URL: string;
  USERINFO_URL: string;
}

interface Endpoints {
  RANDOM_VERSE: string;
  VERSE_BY_KEY: string;
  CHAPTERS: string;
  LIST_AYAH_TRANSLATIONS: string;
  RESOURCE: {
    LANGUAGE: string;
    TRANSLATION: string;
  };
}

interface AppConfig {
  appName: string;
  env: string;
  debug: boolean;
  API_BASE_URL: string;
  OAUTH: OAuthConfig;
  ENDPOINT: Endpoints;
}

const ENV = process.env.NODE_ENV || "development";

const CONFIG: AppConfig = {
  appName: "Quran Explorer",
  env: ENV,
  debug: true,
  API_BASE_URL:
    ENV === "development"
      ? "https://apis-prelive.quran.foundation/content/api/v4"
      : "https://apis.quran.foundation",
  OAUTH: {
    TOKEN_URL:
      ENV === "development"
        ? "https://prelive-oauth2.quran.foundation/oauth2/token"
        : "https://oauth2.quran.foundation/oauth2/token",
    USERINFO_URL:
      ENV === "development"
        ? "https://prelive.api.quran.foundation/api/me"
        : "https://api.quran.foundation/api/me",
  },
  ENDPOINT: {
    RANDOM_VERSE: "/verses/random",
    VERSE_BY_KEY: "/verses/by_key",
    CHAPTERS: "/chapters/:id",
    LIST_AYAH_TRANSLATIONS: "/translations/:translation_id/by_ayah/:verse_key",
    RESOURCE: {
      LANGUAGE: "/resources/languages",
      TRANSLATION: "/resources/translations",
    }
  },
};

export default CONFIG;
