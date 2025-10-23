# Quran Explorer

A small Next.js project demonstrating integration with **Quran.Foundation APIs**. This project showcases **OAuth2 authentication**, and **API fetching**, while keeping all constants in a central config file.

---

## Features

* Next.js 15.x with Tailwind CSS
* OAuth2 login via Quran.Foundation
* Public callback URL using `ngrok`
* Fetch random ayah and translations from **prelive API**
* All constants and URLs centralized in `config/app.config.ts`

---

## Project Setup

```bash
npx create-next-app@15.5.6 quran-explorer
cd quran-explorer
npm install axios next-auth html-react-parser
npm install ngrok --save-dev
```

---

## Directory Structure

```
quran-explorer/
├─ app/ or pages/                     
│  └─ page.jsx                        # Home page
├─ components/
│  └─ QuranDemo.jsx                   # Main component
├─ pages/
│  └─ api/
│      ├─ auth/
│      │   └─ [...nextauth].js       # OAuth2 config
│      └─ proxy/
│          └─ [endpoint].js          # Server-side API proxy
├─ config/
│  └─ app.config.ts                   # API URLs, OAuth endpoints, translations
├─ __tests__/
│  └─ QuranDemo.test.jsx              # Unit tests
├─ public/
├─ styles/
│  └─ globals.css
├─ .env.local
├─ package.json
└─ tailwind.config.js
```

---

## Getting Started

### Prerequisite

Install ngrok:

1. Sign up for ngrok to get the token
2. `ngrok config add-authtoken <your-token>`
3. `brew install ngrok` (Mac) or download from [ngrok.com](https://ngrok.com/)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd quran-explorer
npm install
```

### 2. Publish your local server using ngrok

```bash
ngrok http 3000
```

* This provides a public HTTPS URL accessible by OAuth2 for callback.
* Update Quran.Foundation OAuth2 redirect URI with the generated public URL.

### 3. Run the Project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## OAuth2 Authentication

* Implemented using **NextAuth.js**.
* OAuth endpoints and scopes are defined in `config/app.config.ts`.
* Reuses **access token** for authenticated API calls.
* Server-side API proxy handles API requests securely.

---

## Usage

1. Log in via Quran.Foundation OAuth2
2. Search for surahs or fetch random ayah
3. View translations in your preferred language
4. Bookmark verses for quick access

---

## Notes

* Uses **prelive API** for testing; production URL is commented in config.
* OAuth2 callback is public via **ngrok** for local development.
* Tailwind CSS is used for UI styling.
* All constants, endpoints, and translations are centralized in `config/app.config.ts`.
