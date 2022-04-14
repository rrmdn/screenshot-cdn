import express from "express";
import puppeteer from "puppeteer";

const app = express();

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.get<
  any,
  any,
  any,
  { url?: string; device?: string; quality?: string; delay?: string }
>("/v1/screenshot", async (req, res) => {
  const { url, device, quality, delay } = req.query;
  if (!url) return res.sendStatus(404);
  const parsedQuality = parseInt(quality);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.emulate(
    puppeteer.devices[device] || puppeteer.devices["Galaxy S5"]
  );
  await page.goto(url, { waitUntil: "networkidle0" });
  await new Promise((resolve) => setTimeout(resolve, parseInt(delay) || 0));
  const buffer = await page.screenshot({
    encoding: "binary",
    type: "jpeg",
    quality: parsedQuality > 0 && parsedQuality <= 100 ? parsedQuality : 50,
  });
  await browser.close();
  res.writeHead(200, {
    "Content-Type": "image/jpeg",
    "Content-Length": buffer.length,
    "Cache-Control": "public, max-age=2419200", // 60 * 60 * 24 * 7 * 4
  });
  res.end(buffer);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Running on port", PORT);
});
