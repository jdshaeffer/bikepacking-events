import puppeteer from 'puppeteer';

const getBikepackingEvents = async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.goto('https://bikepacking.com/events');

  const events = await page.evaluate(() =>
    // Array.from(document.querySelectorAll('div[id^="post"]'), (e) => )
    document.querySelectorAll('div[id^="post"]')
  );

  await browser.close();
  return events;
};

export default async function Home() {
  const events = await getBikepackingEvents();
  // console.log('event div:', events);

  return (
    <main>
      <h1>hello</h1>
    </main>
  );
}
