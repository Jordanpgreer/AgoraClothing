// One-off seed: takes content/site.json and writes it into Supabase.
// Run with: node scripts/seed-supabase.mjs
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

// Load .env.local manually
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2];
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const sitePath = path.join(process.cwd(), "content", "site.json");
const data = JSON.parse(fs.readFileSync(sitePath, "utf-8"));

const { error } = await supabase
  .from("site_content")
  .upsert({ id: "main", data, updated_at: new Date().toISOString() });

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}
console.log("✓ Seeded site_content row 'main' with", Object.keys(data).length, "top-level sections.");
