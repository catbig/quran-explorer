import fs from "fs";
import path from "path";

// Load secrets from revealed file
const secretsPath = path.resolve(process.cwd(), "src/.env.client");
const secretsClient = fs.readFileSync(secretsPath, "utf-8")
  .split("\n")
  .reduce<Record<string, string>>((acc, line) => {
    const [key, val] = line.split("=");
    if (key && val) acc[key] = val;
    return acc;
  }, {});

interface AppSecret {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
}

const SECRETS: AppSecret = {
  CLIENT_ID: secretsClient.CLIENT_ID,
  CLIENT_SECRET: secretsClient.CLIENT_SECRET,
}

export default SECRETS;