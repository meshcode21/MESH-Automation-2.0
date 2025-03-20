import puppeteer from "puppeteer";
import { get_captcha_text } from "./CaptchaToText.js";
import { getIsRunning } from "../dataStore.js";

export async function AutoEngine(data, statusCallback) {
  let status = "";

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (let count = 0; count < data.length; count++) {
    await statusCallback({index: count, status: "running"})
    await page.goto("https://dvprogram.state.gov/ESC/Default.aspx");
    await page.waitForSelector("#escform");

    await page.click(`::-p-xpath(//*[@id="main"]/div[2]/div/p[3]/a)`);

    //   initialization of input fields...
    const CN_inputField = await page.waitForSelector("::-p-xpath(//*[@id='txtCN'])");
    const LastName_inputField = await page.waitForSelector(`::-p-xpath(//*[@id="txtLastName"])`);
    const YOB_inputField = await page.waitForSelector(`::-p-xpath(//*[@id="txtYOB"])`);

    //   initialization of client data...
    const cn = data[count].confirmationNumber;
    const lastName = data[count].name.split(",")[0];
    const yob = data[count].DOB;

    //   typing data in input fields...
    await CN_inputField.type(cn);
    await LastName_inputField.type(lastName);
    await YOB_inputField.type(yob);

    //   await new Promise((resolve) => setTimeout(resolve, 2000));

    while(true) {
      const SubmitButton = await page.waitForSelector(`::-p-xpath(//*[@id="btnCSubmit"])`);

      //   save captcha image...
      const CaptchaImageElement = await page.waitForSelector(`::-p-xpath(//*[@id="c_checkstatus_uccaptcha30_CaptchaImage"])`);
      await CaptchaImageElement.screenshot({ path: "captcha.png" });

      //convert and fill the captcha text...
      const Code_inputField = await page.waitForSelector(`::-p-xpath(//*[@id="txtCodeInput"])`);
      // const captchaText = await CaptchaToText("captcha.png");
      const captchaText = await get_captcha_text("captcha.png");
      await Code_inputField.type(captchaText != "" ? captchaText : "xxxx");

      await SubmitButton.focus();
      await new Promise((resolve) => setTimeout(resolve, 100));
      await SubmitButton.click();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // submit to check the captcha is correct or not...
      const container = await page.waitForSelector(`::-p-xpath(//*[@id="main"])`);
      const why_page_change = await container.evaluate((el) => {
        if (el.childElementCount < 2) {
          if (el.children[0].children[0].childElementCount > 1) return "captchaRight";
          else return "timeOut";
        } else return "captchaWrong";
      });

      if (why_page_change == "captchaRight") {
        const text = await container.evaluate((el) => {
          return el.children[0].children[0].children[0].children[0].innerText;
        });

        if (text == "HAS NOT BEEN SELECTED") status = "not selected";
        else status = "selected";

        await statusCallback({index: count,status: status});
        break;

      } else if (why_page_change == "timeOut") {
        status = "time out";

        await statusCallback({index: count,status: status});
        break;
      }
    }
    if(!getIsRunning()) break;
  }
  browser.close();
}
