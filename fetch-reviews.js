// fetch-reviews.js
import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  try {
    // Start headless browser
    const browser = await puppeteer.launch({
      headless: true, // run in background
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    // Go to your Elfsight widget page
    // Replace with your real widget link
    const widgetUrl = "https://apps.elfsight.com/widget/6a852654-1103-4583-a6fc-9830b6732e40/";
    await page.goto(widgetUrl, { waitUntil: "networkidle2" });

    // Wait until reviews load
    await page.waitForSelector(".eapps-google-reviews", { timeout: 30000 });

    // Extract final rendered reviews HTML
    const reviewsHtml = await page.$eval(
      ".eapps-google-reviews",
      (el) => el.outerHTML
    );

    // Save into reviews.json
    fs.writeFileSync(
      "reviews.json",
      JSON.stringify({ content: reviewsHtml }, null, 2)
    );

    console.log("✅ Reviews saved to reviews.json");

    await browser.close();
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
  }
})();
