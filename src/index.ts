import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer';

(async () => {
  const app = express();
  app.get('/', (req: Request, res: Response) => {
    res.send('hello!');
  });

  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.goto('https://bikepacking.com/events');

  const events = await page.evaluate(() =>
    // Array.from(document.querySelectorAll('div[id^="post"]'), (e) => )
    document.querySelectorAll('div[id^="post"]'),
  );

  await browser.close();
  console.log(events);

  const port = 9000;
  app.listen(port, () => {
    console.log(`server is running at ${port}`);
  });
})();
