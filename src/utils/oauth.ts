import axios from "axios";
import CONFIG from "@/config/app.config";
import SECRETS from "@/config/app.secret";

interface TokenCache {
  token: string | null;
  expiresAt: number | null; // timestamp in ms
}

const cache: TokenCache = {
  token: null,
  expiresAt: null,
};

/**
 * Get a cached access token or request a new one if expired
 */
export async function getAccessToken(): Promise<string> {
  const now = Date.now();

  // Return cached token if still valid
  if (cache.token && cache.expiresAt && now < cache.expiresAt) {
    if (CONFIG.debug) console.log("[OAuth] Using cached token");
    return cache.token;
  }

  if (CONFIG.debug) console.log("[OAuth] Requesting new token");

  const auth = Buffer.from(`${SECRETS.CLIENT_ID}:${SECRETS.CLIENT_SECRET}`).toString("base64");

  try {
    const res = await axios.post(
      CONFIG.OAUTH.TOKEN_URL,
      "grant_type=client_credentials&scope=content",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, expires_in } = res.data;

    // Save to cache
    cache.token = access_token;
    cache.expiresAt = now + (expires_in - 60) * 1000; // minus 60s for safety

    return access_token;
  } catch (err) {
    console.error("[OAuth] Failed to get token:", err);
    throw err;
  }
}
