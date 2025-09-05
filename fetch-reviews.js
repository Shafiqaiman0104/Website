// fetch-reviews.js
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  try {
    console.log("⏳ Starting to fetch Elfsight reviews...");

    // Detect system Chromium for Coolify / Docker
    const chromiumPaths = [
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
      puppeteer.executablePath(), // fallback to Puppeteer bundled
    ];
    let executablePath = chromiumPaths.find((p) => fs.existsSync(p));
    if (!executablePath) {
      console.warn("⚠️ Chromium not found, using Puppeteer default");
      executablePath = puppeteer.executablePath();
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath,
    });

    const page = await browser.newPage();

    const filePath = `file:${path.join(__dirname, "fetch.html")}`;
    await page.goto(filePath, { waitUntil: "networkidle2" });

    // Wait for Elfsight container with retries
    const selector = ".elfsight-app-6a852654-1103-4583-a6fc-9830b6732e40";
    const maxRetries = 3;
    let found = false;

    for (let i = 0; i < maxRetries; i++) {
      try {
        await page.waitForSelector(selector, { timeout: 20000 });
        found = true;
        break;
      } catch (err) {
        console.warn(`⚠️ Attempt ${i + 1} failed, retrying...`);
      }
    }

    if (!found) {
      throw new Error("Elfsight widget not found after retries");
    }

    // Safe waitForTimeout fallback
    if (typeof page.waitForTimeout === "function") {
      await page.waitForTimeout(10000); // wait extra 10s
    } else {
      await new Promise((r) => setTimeout(r, 10000));
    }

    // Grab the inner HTML of the widget
    const reviewsHtml = await page.$eval(selector, (el) => el.innerHTML);

    fs.writeFileSync(
      "reviews.json",
      JSON.stringify({ content: reviewsHtml }, null, 2)
    );

    console.log("✅ Reviews successfully saved to reviews.json");

    await browser.close();
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
  }
})();
