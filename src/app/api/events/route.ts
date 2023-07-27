import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import * as cheerio from 'cheerio';

const LOCAL_CHROME_EXECUTABLE =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export async function GET(req: NextRequest) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath:
      process.env.NODE_ENV === 'development'
        ? LOCAL_CHROME_EXECUTABLE
        : await chromium.executablePath,
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto('https://bikepacking.com/events', {
    waitUntil: 'networkidle2',
  });

  const eventsHTML = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('div[id^="post-"]'),
      (e) => e.innerHTML
    )
  );

  const events = eventsHTML.map((event) => {
    const $ = cheerio.load(event);
    const dateAndPrice = $('div.event-list-when');
    const [category, location] = $('div.event-list-where').text().split(' / ');
    return {
      title: $('h2').text(),
      eventUrl: $('a').attr('href'),
      imgSrc: $('img').attr('src'),
      date: dateAndPrice.find('span.tribe-event-date-start').text(),
      price: dateAndPrice.find('span:not(.tribe-event-date-start)').text(),
      category,
      location,
      detail: $('p').text(),
    };
  });

  await browser.close();

  return NextResponse.json(events);
}
