const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  try {
    console.log("⏳ Starting to fetch Elfsight reviews...");

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    const filePath = `file:${path.join(__dirname, "fetch.html")}`;
    await page.goto(filePath, { waitUntil: "networkidle2" });

    // Wait for Elfsight container
    await page.waitForSelector(".elfsight-app-6a852654-1103-4583-a6fc-9830b6732e40", { timeout: 60000 });

    // Corrected function name
    await page.waitForTimeout(10000); // wait extra 10 seconds for widget JS

    // Grab the inner HTML of the container
    const reviewsHtml = await page.$eval(
      ".elfsight-app-6a852654-1103-4583-a6fc-9830b6732e40",
      el => el.innerHTML
    );

    fs.writeFileSync("reviews.json", JSON.stringify({ content: reviewsHtml }, null, 2));

    console.log("✅ Reviews successfully saved to reviews.json");

    await browser.close();
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
  }
})();
