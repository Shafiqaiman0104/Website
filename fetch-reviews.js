const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  try {
    console.log("⏳ Starting to fetch Elfsight reviews...");

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      // Use Puppeteer's bundled Chromium
      executablePath: puppeteer.executablePath(),
    });

    const page = await browser.newPage();

    const filePath = `file:${path.join(__dirname, "fetch.html")}`;
    await page.goto(filePath, { waitUntil: "networkidle2" });

    const selector = ".elfsight-app-6a852654-1103-4583-a6fc-9830b6732e40";

    // Wait for Elfsight widget with retries
    const maxRetries = 3;
    let found = false;

    for (let i = 0; i < maxRetries; i++) {
      try {
        await page.waitForSelector(selector, { timeout: 20000 });
        found = true;
        break;
      } catch {
        console.warn(`⚠️ Attempt ${i + 1} failed, retrying...`);
      }
    }

    if (!found) throw new Error("Elfsight widget not found after retries");

    // Wait extra 10 seconds for widget JS to load
    if (typeof page.waitForTimeout === "function") {
      await page.waitForTimeout(10000);
    } else {
      await new Promise((r) => setTimeout(r, 10000));
    }

    // Grab inner HTML
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
