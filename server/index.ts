import puppeteer from 'puppeteer';
import cors from 'cors';
import * as cheerio from 'cheerio';
import express from 'express';

const app = express();
const port = 8000;

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://jdshaeffer.github.io'],
  }),
);

app.get('/api/events', async (req, res) => {
  const getBikepackingEvents = async () => {
    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();
    await page.goto('https://bikepacking.com/events');

    const eventsHTML = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('div[id^="post-"]'),
        (e) => e.innerHTML,
      ),
    );

    const events = eventsHTML.map((event) => {
      const $ = cheerio.load(event);
      const dateAndPrice = $('div.event-list-when');
      const [category, location] = $('div.event-list-where')
        .text()
        .split(' / ');
      const titleAndDistance = $('h2').text().split('(');
      const distance = titleAndDistance.pop()!.slice(0, -1);
      const title =
        titleAndDistance.length > 1
          ? `${titleAndDistance[0]}(${titleAndDistance[1]}`
          : titleAndDistance[0];

      return {
        title,
        distance,
        eventUrl: $('a').attr('href'),
        date: dateAndPrice.find('span.tribe-event-date-start').text(),
        price: dateAndPrice.find('span:not(.tribe-event-date-start)').text(),
        category,
        location,
        detail: $('p').text(),
      };
    });

    return events;
  };

  console.log('getting events...');
  const events = await getBikepackingEvents();
  res.json(events);
  console.log('events sent');
});

app.listen(port, () => {
  console.log(`running server on ${port}`);
});
