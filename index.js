import fs from "fs";

const parseResponse = async (response) => {
  console.info("Parsing response...");
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let postContent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.trim()) {
        try {
          const json = JSON.parse(line);

          if (json.response) {
            postContent += json.response;
            // console.log("teste", postContent);
          }
        } catch (error) {
          console.error("Error parsing JSON: ", error);
        }
      }
    }
  }
  console.info("Response was parsed successfully.");
  return postContent.trim();
};

const main = async () => {
  try {
    console.info("Generating post...");
    const topic = "Difference between CommonJs and ESM in nodejs";

    const payload = {
      model: "llama2",
      prompt: `Create LinkedIn post on: "${topic}". Make it more friendly and easy to understand as possible.`,
    };

    const url = "http://localhost:11434/api/generate";

    const options = {
      method: "POST",
      "Content-Type": "application/json",
      body: JSON.stringify(payload),
    };
    const response = await parseResponse(await fetch(url, options));

    fs.writeFileSync(`./posts/${topic.slice(0, 10)}.txt`, response, {
      encoding: "utf-8",
    });

    return;
  } catch (error) {
    console.error("Error: ", error);
  }
};

main();
