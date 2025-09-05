// fetch-reviews.js
const fs = require("fs");
const fetch = require("node-fetch");

const WIDGET_URL = "https://apps.elfsight.com/widget/6a852654-1103-4583-a6fc-9830b6732e40";
const CACHE_FILE = "./public/reviews.json";

async function fetchReviews() {
  try {
    const res = await fetch(WIDGET_URL);
    if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
    const text = await res.text();

    fs.writeFileSync(CACHE_FILE, JSON.stringify({ content: text }, null, 2), "utf8");
    console.log("✅ Reviews cached in", CACHE_FILE);
  } catch (err) {
    console.error("❌ Fetch failed:", err.message);
  }
}

fetchReviews();
