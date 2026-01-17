import { chromium } from 'playwright';
const url = process.argv[2] || 'http://localhost:5175/';
const out = process.argv[3] || 'screenshot.png';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  console.log('Opening', url);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: out, fullPage: true });
  await browser.close();
  console.log('Saved screenshot to', out);
})();
