import puppeteer from "puppeteer";
import { CaptchaToText } from "./CaptchaToText.js";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://dvprogram.state.gov/ESC/CheckStatus.aspx", {
    waitUntil: "networkidle0",
  });
  await page.waitForSelector("#escbodytag");

  //   initialization of input fields...
  const CN_inputField = await page.waitForSelector("::-p-xpath(//*[@id='txtCN'])");
  const LastName_inputField = await page.waitForSelector(`::-p-xpath(//*[@id="txtLastName"])`);
  const YOB_inputField = await page.waitForSelector(`::-p-xpath(//*[@id="txtYOB"])`);
  const Code_inputField = await page.waitForSelector(`::-p-xpath(//*[@id="txtCodeInput"])`);
  const SubmitButton = await page.waitForSelector(`::-p-xpath(//*[@id="btnCSubmit"])`);

  
  //   initialization of client data...
  const cn = "20259SC6X7G99LKE";
  const lastName = "udas";
  const yob = "2003";
  
  //   typing data in input fields...
  await CN_inputField.type(cn);
  await LastName_inputField.type(lastName);
  await YOB_inputField.type(yob);
  
//   await new Promise((resolve) => setTimeout(resolve, 2000));

  //   save captcha image...
  const CaptchaImageElement = await page.waitForSelector(`::-p-xpath(//*[@id="c_checkstatus_uccaptcha30_CaptchaImage"])`);
  await CaptchaImageElement.screenshot({ path: "captcha.png" });

  //convert and fill the captcha text...
  const captchaText = await CaptchaToText();
//   console.log(captchaText);
  await Code_inputField.type(captchaText!=""?captchaText:"xxxx");

//   await SubmitButton.click();

  // wait for 3 sec...
  // browser.close();
})();
