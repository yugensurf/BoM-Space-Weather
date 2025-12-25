import fs from "node:fs";
import path from "node:path";

const API_KEY = process.env.SPACEWEATHER_API_KEY;
if (!API_KEY) throw new Error("Missing SPACEWEATHER_API_KEY env var (GitHub Actions Secret).");

// BoM Space Weather API base URL (per BoM API spec)
const base = "https://sws-data.sws.bom.gov.au/api/v1"; // citeturn4search1

const OUT_DIR = path.join(process.cwd(), "docs", "data");
fs.mkdirSync(OUT_DIR, { recursive: true });

function pad(n) { return String(n).padStart(2, "0"); }
function toUtcString(d) {
  // "YYYY-MM-DD HH:mm:ss" in UTC (per BoM API spec)
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

async function post(endpoint, body) {
  const res = await fetch(`${base}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${endpoint} failed: ${res.status} ${text}`);
  }
  return res.json();
}

const now = new Date();
const start = new Date(now.getTime() - 72 * 60 * 60 * 1000);

const startStr = toUtcString(start);
const endStr = toUtcString(now);

// K index (Australian region) + aurora notices (alert/watch/outlook)
const [k, alert, watch, outlook] = await Promise.all([
  post("get-k-index", { api_key: API_KEY, options: { location: "Australian region", start: startStr, end: endStr } }),
  post("get-aurora-alert", { api_key: API_KEY }),
  post("get-aurora-watch", { api_key: API_KEY }),
  post("get-aurora-outlook", { api_key: API_KEY })
]);

const kData = (k?.data ?? []).map(x => ({
  valid_time_utc: x.valid_time,
  analysis_time_utc: x.analysis_time,
  index: x.index
}));

const payload = {
  generated_at_utc: toUtcString(now),
  k_last_72h: kData,
  latest_k: kData.length ? kData[kData.length - 1] : null,
  aurora: {
    alert: alert?.data ?? [],
    watch: watch?.data ?? [],
    outlook: outlook?.data ?? []
  }
};

fs.writeFileSync(path.join(OUT_DIR, "latest.json"), JSON.stringify(payload, null, 2));
console.log("Wrote docs/data/latest.json");
