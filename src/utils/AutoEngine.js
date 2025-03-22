import puppeteer from "puppeteer";
import { get_captcha_text } from "./CaptchaToText.js";
import { getIsRunning, storeResult } from "../data/dataProvider.js";

export async function AutoEngine(currentIndex, data, statusCallback, endCallback) {
  let status = "";

  if (currentIndex == 0) storeResult(null);

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (let i = currentIndex; i < data.length; i++) {
    await statusCallback({ index: i, status: "running" });

    await page.goto("https://dvprogram.state.gov/ESC/Default.aspx");
    await page.waitForSelector("#escform");

    await page.click(`::-p-xpath(//*[@id="main"]/div[2]/div/p[3]/a)`);

    //   initialization of client data...
    const cn = data[i].confirmationNumber;
    const lastName = data[i].name.split(",")[0];
    const yob = data[i].DOB.toString();

    //   initialization of input fields...
    const CN_inputField = await page.waitForSelector("::-p-xpath(//*[@id='txtCN'])");
    const LastName_inputField = await page.waitForSelector(`::-p-xpath(//*[@id="txtLastName"])`);
    const YOB_inputField = await page.waitForSelector(`::-p-xpath(//*[@id="txtYOB"])`);

    await CN_inputField.type(cn);
    await LastName_inputField.type(lastName);
    await YOB_inputField.type(yob);

    //   await new Promise((resolve) => setTimeout(resolve, 2000));

    while (true) {
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
          if (el.children[0].childElementCount == 3) return "captchaRight";
          else{
            if(el.children[0].children[0].childElementCount == 2) return "captchaRight";
            else return "timeOut";
          } 
        } else return "captchaWrong";
      });

      // let status;
      if (why_page_change == "captchaRight") {
        status = await container.evaluate((el) => {
          if (el.children[0].childElementCount == 1) return "not selected";
          else return "selected";
        });

        // if (text == "HAS NOT BEEN SELECTED") status = "not selected";
        // else status = "selected";
        if (status == "selected") {

          const selectedUserAddress = await container.evaluate((el) => {
            const userInfo = el.children[0].children[2].children[0].children[5].innerText.split("\n");
            return  userInfo[2];
          });
          await statusCallback({ index: i, status: status, address: selectedUserAddress });
        } else {
          await statusCallback({ index: i, status: status });
        }
        break;
      } else if (why_page_change == "timeOut") {
        status = "time out";

        await statusCallback({ index: i, status: status });
        break;
      }
    }
    if (!getIsRunning()) break;
  }
  browser.close();
  await endCallback();
}
