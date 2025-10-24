# 📖 Quran Explorer

A **Next.js 15.x** project demonstrating integration with **Quran.Foundation APIs**.
This project showcases **OAuth2 authentication**, **API fetching**, and centralized configuration management.

---

## 🧩 Tech Stack & Architecture

### 🏗️ Core Stack

| Layer                  | Technology                                                 | Description                                          |
| ---------------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| **Frontend Framework** | [Next.js 15.x](https://nextjs.org/)                        | React-based framework for full-stack web development |
| **Styling**            | [Tailwind CSS](https://tailwindcss.com/)                   | Utility-first CSS framework                          |
| **Auth**               | [NextAuth.js](https://next-auth.js.org/)                   | OAuth2 authentication integration                    |
| **API Data**           | [Quran.Foundation API](https://api-docs.quran.foundation/) | Quranic data (ayahs, surahs, translations)           |
| **HTTP Client**        | [Axios](https://axios-http.com/)                           | Simplified HTTP requests                             |
| **Dev Tunneling**      | [ngrok](https://ngrok.com/)                                | Secure public URL for local development              |
| **Secrets Management** | [git-secret](https://git-secret.io/)                       | Encrypt OAuth credentials securely                   |

---

### ⚙️ High-Level Architecture

```text
+----------------------------------------------------------+
|                      Quran Explorer                      |
|----------------------------------------------------------|
|                    Next.js Frontend                      |
| - React Components (Navbar)                              |
| - Tailwind CSS UI                                        |
| - NextAuth.js Login UI                                   |
+-------------------------▲--------------------------------+
                          │ OAuth2
+-------------------------┼--------------------------------+
|           Quran.Foundation Authorization Server          |
|   - Issues access tokens via OAuth2                      |
+-------------------------┼--------------------------------+
                          │ API calls (Bearer token)
+-------------------------▼--------------------------------+
|             Quran.Foundation API (Prelive)               |
| - Random Ayah / Verse endpoints                          |
| - Translations                                           |
| - Resource Translations                                  |
| - Chapter                                                |
| - JSON responses handled by quranClient.ts               |
+----------------------------------------------------------+
```

---

### 🔄 Data Flow Summary

1. User logs in via **Quran.Foundation OAuth2** → access token retrieved via **NextAuth.js**.
2. Access token is stored in the session (encrypted).
3. Next.js API route (`/api/verse`) fetches a random verse using that token.
4. UI renders ayah text and translation in real time.

---

### 💡 Design Principles

* **Separation of concerns:** Config, endpoints, and OAuth logic are isolated in `src/config` and `src/utils`.
* **Security:** OAuth credentials are stored in encrypted files managed with **git-secret**, never hardcoded.
* **Extensibility:** New API endpoints or translation providers can be added by extending `quranClient.ts`.

---

## ✨ Features

* Next.js 15.x + Tailwind CSS
* OAuth2 login via [Quran.Foundation](https://quran.foundation)
* Public callback URL using **ngrok**
* Fetch **random ayah** and **translations** from the prelive API
* Centralized configuration in `config/app.config.ts`
* TypeScript-enabled for type safety

---

## ⚙️ Project Setup

Use this step if you want to set up the project from scratch.

```bash
npx create-next-app@15.5.6 quran-explorer
cd quran-explorer
npm install axios next-auth html-react-parser
npm install ngrok --save-dev
```

---

## 📁 Directory Structure

```
quran-explorer/
├── public/
├── README.md
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── verse
│   │   │   │   └── route.ts
│   │   │   └── verse-by-key
│   │   │       └── route.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── quran.types.ts
│   ├── components
│   │   ├── Footnote.tsx
│   │   └── Navbar.tsx
│   ├── config
│   │   ├── app.config.ts
│   │   └── app.secret.ts       # decrypt OAuth credentials
│   ├── utils
│   │   ├── oauth.ts
│   │   └── quranClient.ts
│   └── .env.client.secret      # encrypted OAuth credentials
└── tsconfig.json
```

---

## 🔧 Prerequisites

### ngrok

```bash
brew install ngrok
```

1. Sign up on [ngrok.com](https://ngrok.com/) and get your token.
2. Run:

```bash
ngrok config add-authtoken <your-token>
```

---

### git-secret

```bash
brew install git-secret
```

1. Generate a GPG key:

```bash
gpg --full-generate-key
# Type: 1 (RSA and RSA)
# Key size: 4096
# Expiration: 0 (never)
# Enter name, email, and passphrase
```

2. Verify:

```bash
gpg --list-keys
```

3. Add your key to git-secret:

```bash
git secret tell your.email@example.com
```

4. Create secrets file:

```bash
echo "CLIENT_ID=your-client-id" > src/.env.client
echo "CLIENT_SECRET=your-client-secret" >> src/.env.client
```

5. Encrypt secrets:

```bash
git secret add src/.env.client
git secret hide   # encrypt
git secret reveal # decrypt
```

---

## 🚀 Running the Project

### 1. Clone & Install

```bash
git clone https://github.com/catbig/quran-explorer.git
cd quran-explorer
npm install
```

### 2. Expose Local Server with ngrok

```bash
ngrok http 3000
```

Copy the HTTPS URL and update your **Quran.Foundation OAuth2 redirect URI**.

### 3. Request API Access & Configure Callback

Visit [Quran.Foundation API Access](https://api-docs.quran.foundation/request-access)
and use your ngrok URL as the **Callback URL**.

### 4. Run the Development Server

```bash
npm run dev
```

Then open your ngrok URL in the browser.

---

## 🌐 Development URL

You can access the live development instance of **Quran Explorer** here:

👉 [https://macrographic-regardful-bell.ngrok-free.dev/](https://macrographic-regardful-bell.ngrok-free.dev/)

> Note: This URL is temporary and may change whenever ngrok restarts.

---

## 🔐 OAuth2 Authentication

* Implemented using **NextAuth.js**
* OAuth endpoints and scopes defined in `config/app.config.ts`
* Access token reused for authenticated API calls
* Server-side API routes securely proxy requests to Quran.Foundation

---

## 💡 Usage

1. Click **Get Random Verse**
2. Fetch a random ayah
3. View translations for that ayah

---

## 🖼️ Display Mockup

Below is a preview of the **Quran Explorer** interface:

<img width="499" height="654" alt="gambar" src="https://github.com/user-attachments/assets/7d11703c-0570-457d-bf11-7e3b95493670" />

---

## 🐞 Bugs Found (Quran.Foundation API)

These issues were observed while testing the **Quran.Foundation API (Prelive)** environment.
They are **API-side bugs**, not related to the Quran Explorer implementation.

1. **`/resource/translation`**

   * Cannot filter by `language`.

2. **`/resource/language`**

   * Cannot filter by `language`.

3. **`/verses/random`**

   * Returns an error when chapter number, juz number, or both are used as filters.

```json
{
  "message": "The server encountered an internal error and was unable to complete your request",
  "type": "internal_server_error"
}
```

> I will report these issues to the Quran.Foundation API team for review if they have not been reported yet.


---

## 📝 Notes

* Uses **prelive API** for development; production URL is commented in config.
* OAuth2 callback exposed via **ngrok** during local testing.
* UI styled with **Tailwind CSS**.
* Constants, endpoints, and translations centralized in `config/app.config.ts`.

---

