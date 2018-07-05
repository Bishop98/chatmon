const puppeteer = require('puppeteer');


var loggedIn = false;
var gPage = "";

var last = {user: "", msg: ""};


var scrape = async () => {
  if (loggedIn === false) {
    console.log("waiting for page");
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto("https://www.reddit.com/chat/r/community_chat/channel/200020_bed753beb7c944a947229ae87a28db8adf2f72a4");
    await page.waitFor(3000);
    console.log("page loaded");
    await page.$eval('#loginUsername', el => el.value = "AresPhobos");
    await page.$eval('#loginPassword', el => el.value = "");
    await page.click(".AnimatedForm__submitButton");
    await page.waitFor(200);
    console.log("logging in");
    await page.keyboard.press("Enter");
    await page.waitFor(10000);
    gPage = page;
    loggedIn = true;
    scrape();
  } else {
    try {
      var result = await gPage.evaluate(() => {
        var user = document.querySelector("#tooltip-container > div > div:last-child > div > div > div > a:last-of-type > h4").innerHTML;
        var msg = document.querySelector("#tooltip-container > div > div:last-child > div > div > div > div:last-child > div > pre").innerHTML;
        return {
          user, msg
        }
      });
    } catch (e) {
      console.log("WARNING: CHAT STICKERS NOT SUPPOERTED");
    }
    if (result.msg !== last.msg) {
      console.log(result.user + ": " + result.msg);
      last = result;
    }
  }
}

scrape();

setInterval(function(){if (loggedIn) {scrape()} else {} }, 200);
