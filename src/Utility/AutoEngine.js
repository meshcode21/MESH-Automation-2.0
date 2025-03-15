import puppeteer from "puppeteer";
import { get_captcha_text } from "./CaptchaToText.js";

async function Engine(user) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // while (true) {
  await page.goto("https://dvprogram.state.gov/ESC/Default.aspx");
  await page.waitForSelector("#escform");

  await page.click(`::-p-xpath(//*[@id="main"]/div[2]/div/p[3]/a)`);

  //   initialization of input fields...
  const CN_inputField = await page.waitForSelector(
    "::-p-xpath(//*[@id='txtCN'])"
  );
  const LastName_inputField = await page.waitForSelector(
    `::-p-xpath(//*[@id="txtLastName"])`
  );
  const YOB_inputField = await page.waitForSelector(
    `::-p-xpath(//*[@id="txtYOB"])`
  );

  //   initialization of client data...
  const cn = "20259SC6X7G99LKE";
  const lastName = "udas";
  const yob = "2003";

  //   typing data in input fields...
  await CN_inputField.type(cn);
  await LastName_inputField.type(lastName);
  await YOB_inputField.type(yob);

  //   await new Promise((resolve) => setTimeout(resolve, 2000));

  for (let i = 0; i < 6; i++) {
    const SubmitButton = await page.waitForSelector(
      `::-p-xpath(//*[@id="btnCSubmit"])`
    );

    //   save captcha image...
    const CaptchaImageElement = await page.waitForSelector(
      `::-p-xpath(//*[@id="c_checkstatus_uccaptcha30_CaptchaImage"])`
    );
    await CaptchaImageElement.screenshot({ path: "captcha.png" });

    //convert and fill the captcha text...
    const Code_inputField = await page.waitForSelector(
      `::-p-xpath(//*[@id="txtCodeInput"])`
    );
    // const captchaText = await CaptchaToText("captcha.png");
    const captchaText = await get_captcha_text("captcha.png");
    await Code_inputField.type(captchaText != "" ? captchaText : "xxxx");

    await SubmitButton.focus();
    // await new Promise((resolve) => setTimeout(resolve, 100));
    await SubmitButton.click();

    // logic to check the captcha is correct or not...
    const container = await page.waitForSelector(`::-p-xpath(//*[@id="main"])`);
    const captchaRight = await container.evaluate((el) => {
      if (el.childElementCount < 2) return true;
      else return false;
    });

    if (captchaRight) break;
  }
  // }
}
