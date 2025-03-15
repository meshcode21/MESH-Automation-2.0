import Tesseract from "tesseract.js";

export async function CaptchaToText(image_path) {
  try {
    const {data: { text }} = await Tesseract.recognize(image_path, "eng");

    const captchaText = text.split(/[\n ]/)[0].trim();

    console.log("Extracted Text:", captchaText);

    return captchaText; // Return the extracted text
  } catch (err) {
    console.error("Error:", err);
    return ""; // Return an empty string in case of error
  }
}

// CaptchaToText();
