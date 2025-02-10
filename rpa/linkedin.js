import puppeteer from "puppeteer";

const post = async (email, password, content) => {
  try {
    if (!email || !password || !content) {
      const error = "Email, password, and content are required.";
      throw new Error(error);
    }

    console.log("Posting to LinkedIn...");
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // navigate to linkedin page
    await page.goto("https://www.linkedin.com/");
    await page.type("#username", username);
    await page.type("#password", password);
    await page.click('[type-="submit"]');
    await page.waitForNavigation();

    // navigate to create the post
    await page.goto("https://www.linkedin.com/feed/");
    await page.click(".share-box-feed-entry__trigger"); // open post box
    await page.waitForSelector(".mentions-texteditor__content"); // wait for post box to be loaded
    await page.type(".mentions-texteditor__content", content);
    await page.click(".share-box-feed-entry__submit-button"); // submit post

    await page.waitForNavigation();
    console.log("Post was successfully posted.");

    return true;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
};

export default {
  post,
};
