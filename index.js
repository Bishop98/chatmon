const puppeteer = require('puppeteer');



let scrape = async () => {

  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  await page.goto("https://www.reddit.com/chat/r/community_chat/channel/200020_bed753beb7c944a947229ae87a28db8adf2f72a4");
  await page.waitFor(1000);

  await page.$eval('#loginUsername', el => el.value = "AresPhobos");
  // await page.click("#loginUsername");
  await page.$eval('#loginPassword', el => el.value = "");
  await page.click(".AnimatedForm__submitButton");
  await page.waitFor(200);
  await page.keyboard.press("Enter");
  await page.waitFor(15000);

  const result = await page.evaluate(() => {
    // document.querySelector("body > ul > li.login.page > div > h3").innerHTML
    var v = document.querySelector("#tooltip-container > div > div:last-child > div > div > div > div:last-child > div > pre").innerHTML;

    return {
      v
    }
  });

  browser.close();
  return result;
}

scrape().then((value) => {
  console.log(value);
});

// });
