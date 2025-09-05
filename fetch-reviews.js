const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  try {
    console.log("⏳ Starting to fetch Elfsight reviews...");

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    // Go to the Elfsight widget URL
    const widgetUrl = "https://apps.elfsight.com/widget/6a852654-1103-4583-a6fc-9830b6732e40/";
    await page.goto(widgetUrl, { waitUntil: "networkidle2" });

    // Wait for iframe to appear
    const iframeElement = await page.waitForSelector("iframe", { timeout: 60000 });
    const iframe = await iframeElement.contentFrame();

    // Wait for the reviews container inside the iframe
    await iframe.waitForSelector(".eapps-google-reviews", { timeout: 60000 });

    // Extract the reviews HTML
    const reviewsHtml = await iframe.$eval(".eapps-google-reviews", el => el.outerHTML);

    // Save to reviews.json
    fs.writeFileSync("reviews.json", JSON.stringify({ content: reviewsHtml }, null, 2));

    console.log("✅ Reviews successfully saved to reviews.json");

    await browser.close();
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    // Keep old reviews.json intact if error occurs
  }
})();
