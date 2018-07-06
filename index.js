const puppeteer = require('puppeteer');
const fs = require("fs");
const os = require('os');

var ver = "0.1.0";

var loggedIn = false;
var gPage = "";
var last = {t: "", user: "", msg: ""};

var cmds = {

};


var scrape = async () => {
  if (loggedIn === false) { // If not logged in, log in

    console.log("waiting for page");
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto("https://www.reddit.com/chat/r/community_chat/channel/200020_bed753beb7c944a947229ae87a28db8adf2f72a4");
    await page.waitFor(2000);
    console.log("page loaded");
    await page.$eval('#loginUsername', el => el.value = "harvis_bot");
    await page.$eval('#loginPassword', el => el.value = "");
    await page.click(".AnimatedForm__submitButton");
    await page.waitFor(200);
    console.log("logging in");
    await page.keyboard.press("Enter");
    await page.waitFor(8000);
    gPage = page;
    loggedIn = true;
    scrape();

  } else { // If logged in, evaluate page and process data collected. Also throw errors ALOT
    var result = await gPage.evaluate(() => {
      try {
        var user = document.querySelector("#tooltip-container > div > div:last-child > div > div > div > a:last-of-type > h4").innerHTML;
        var msg = document.querySelector("#tooltip-container > div > div:last-child > div > div > div > div:last-child > div > pre").innerHTML;
        var t = document.querySelector("#tooltip-container > div > div:last-child > div > div > div > a:last-of-type > time").innerHTML;

        return {
          t, user, msg
        }
      } catch (e) {

      }
    });
    if (result.msg !== last.msg) {
      if (result.msg.toLowerCase() == "h" && result.user == "AresPhobos") {
        // #MessageInputTooltip--Container > button
        await gPage.type("#MessageInputTooltip--Container > textarea", "it is i, harvis!!!")
        await gPage.click("#MessageInputTooltip--Container > button");
      } else if (result.msg == "$commands") {
        await gPage.type("#MessageInputTooltip--Container > textarea", "No commands as of yet!!")
        await gPage.click("#MessageInputTooltip--Container > button");
      }
      console.log(result.t);
      console.log(result.user + ": " + result.msg);
      fs.appendFile("log.txt", result.t + "    " + result.user + ": " + result.msg + os.EOL, function(err) {
        if (err) throw err;
      })
      last = result;
    }
  }
}

scrape();

setInterval(function(){if (loggedIn) {scrape()} else {} }, 200);
