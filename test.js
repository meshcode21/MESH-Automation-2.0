import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  console.log("Navigating to example.com...");
  await page.goto("https://example.com");

  console.log("Waiting for 3 seconds...");
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log("Done waiting!");
  await browser.close();
})();
