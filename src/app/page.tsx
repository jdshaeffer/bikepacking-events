import puppeteer from 'puppeteer';
import chromium from 'chrome-aws-lambda';
import * as cheerio from 'cheerio';

const getBikepackingEvents = async () => {
  const browser = await chromium.puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.goto('https://bikepacking.com/events');

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
  return events;
};

export default async function Home() {
  const events = await getBikepackingEvents();
  console.log(events);

  return (
    <main>
      <h1>hello</h1>
    </main>
  );
}
