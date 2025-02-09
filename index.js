import fs from "fs";

// Constants
const API_URL = "http://localhost:11434/api/generate";
const OUTPUT_DIR = "./posts";

// Configuration
const config = {
  model: "llama2",
  topic: "Difference between CommonJs and ESM in nodejs",
};

// API helpers
const createPrompt = (topic) => ({
  model: config.model,
  prompt: `Create LinkedIn post on: "${topic}". Make it more friendly and easy to understand as possible.`,
});

const fetchOptions = (payload) => ({
  method: "POST",
  "Content-Type": "application/json",
  body: JSON.stringify(payload),
});

// Response parsing
const parseResponse = async (response) => {
  console.info("Parsing response...");
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let postContent = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      postContent += parseChunk(chunk);
    }

    console.info("Response parsed successfully.");
    return postContent.trim();
  } catch (error) {
    throw new Error(`Failed to parse response: ${error.message}`);
  }
};

const parseChunk = (chunk) => {
  let content = "";
  const lines = chunk.split("\n");

  for (const line of lines) {
    if (!line.trim()) continue;

    try {
      const json = JSON.parse(line);
      if (json.response) content += json.response;
    } catch (error) {
      console.error("Error parsing JSON line:", error);
    }
  }

  return content;
};

// File operations
const savePost = (topic, content) => {
  const filename = `${topic.slice(0, 10)}.txt`;
  const filepath = `${OUTPUT_DIR}/${filename}`;

  fs.writeFileSync(filepath, content, { encoding: "utf-8" });
  console.info(`Post saved to ${filepath}`);
};

// Main execution
const generatePost = async () => {
  try {
    console.info("Generating post...");
    const payload = createPrompt(config.topic);
    const response = await fetch(API_URL, fetchOptions(payload));
    const content = await parseResponse(response);
    savePost(config.topic, content);
  } catch (error) {
    console.error("Failed to generate post:", error);
    throw error;
  }
};

// Execute
generatePost().catch(console.error);
