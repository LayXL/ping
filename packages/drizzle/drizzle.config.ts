import { defineConfig } from "drizzle-kit"

require("dotenv").config({ path: "../../.env" })

if (!process.env.DB_URL) {
  throw new Error("DB_URL is not defined")
}

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  schema: "./schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL,
  },
  verbose: true,
  strict: true,
})
