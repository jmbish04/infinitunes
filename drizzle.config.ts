import { defineConfig } from "drizzle-kit";

import { siteConfig } from "./src/config/site";

if (
  !process.env.CLOUDFLARE_DATABASE_ID ||
  !process.env.CLOUDFLARE_ACCOUNT_ID ||
  !process.env.CLOUDFLARE_D1_TOKEN
) {
  console.warn(
    "Cloudflare D1 credentials are missing from environment variables. Local migrations will default to SQLite."
  );
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
  tablesFilter: [`${siteConfig.name.toLowerCase().replace(/\s/g, "_")}_*`],
});
