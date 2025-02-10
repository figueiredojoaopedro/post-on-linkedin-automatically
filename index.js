import fs from "fs";
import linkedin from "./rpa/linkedin.js";
import path from "path";
import dotenv from "dotenv";
import deepseek from "./services/deepseek.js";
dotenv.config();

// Constants
const OUTPUT_DIR = "./posts";

// API helpers
const prompt = (topic) =>
  `Create LinkedIn post on: "${topic}". Make it more friendly and easy to understand as possible.`;

// File operations
const savePost = (topic, content) => {
  const filename = `${topic.slice(0, 10)}.txt`;
  const filepath = path.join(OUTPUT_DIR, filename);

  fs.writeFileSync(filepath, content, { encoding: "utf-8" });
  console.info(`Post saved to ${filepath}`);
};

const postLinkedin = async (content) => {
  try {
    const email = process.env.LINKEDIN_EMAIL;
    const password = process.env.LINKEDIN_PASSWORD;

    if (!email || !password) {
      console.error("Email and password are required.");
      return;
    }

    await linkedin.post(email, password, content);

    console.info("Post was successfully posted to LinkedIn.");
    return true;
  } catch (error) {
    console.error("Failed to post to LinkedIn:", error);
    return false;
  }
};

// Main execution
const generatePost = async () => {
  try {
    console.info("Generating post...");
    const result = await deepseek.generate(
      prompt("Difference between JavaScript and TypeScript")
    );

    console.log("teste result", result);

    // const content = await parseResponse(result);

    // Post to LinkedIn
    const post_result = await postLinkedin(result);

    if (!post_result) {
      console.error("Failed to post to LinkedIn.");
      return;
    }

    // move the content file to posts folder
    savePost(config.topic, content);

    console.info("Job done.");
  } catch (error) {
    console.error("Failed to generate post:", error);
    throw error;
  }
};

// Execute
generatePost().catch(console.error);
