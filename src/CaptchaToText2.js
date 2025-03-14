import fs from "fs";

export async function get_captcha(imagePath) {
  // Read image file as base64
  const image_data = fs.readFileSync(imagePath).toString("base64");

  const params = {
    userid: process.env.USER_ID,
    apikey: process.env.API_KEY,
    data: image_data,
  };

  const url = "https://api.apitruecaptcha.org/one/gettext";

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (data.success) {
      console.log("CAPTCHA Text:", data.result);
      return data.result;
    } 
    else {
      console.error("Captcha Error response:\n",data);
      return "";
    }
  } catch (error) {
    console.error("Error fetching CAPTCHA:", error);
  }
}

// Call function with an image file path
// get_captcha("captcha.png");
