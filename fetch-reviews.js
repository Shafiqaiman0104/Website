// fetch-reviews.js
const fs = require("fs");

const CACHE_FILE = "./reviews.json";

// ✅ Just store the iframe/embed code (no puppeteer needed)
async function fetchReviews() {
  try {
    const embedCode = `
      <script src="https://elfsightcdn.com/platform.js" async></script>
      <div class="elfsight-app-6a852654-1103-4583-a6fc-9830b6732e40" data-elfsight-app-lazy></div>
    `;

    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify({ content: embedCode }, null, 2),
      "utf8"
    );

    console.log("✅ Embed code cached in", CACHE_FILE);
  } catch (err) {
    console.error("❌ Fetch failed:", err.message);
  }
}

fetchReviews();
