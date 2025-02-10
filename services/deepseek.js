import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.openai.com/v1",
});

const generate = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7, // Controls randomness (0 = precise, 1 = creative)
      max_tokens: 500, // Maximum number of tokens in the response
    });

    console.info("Response generated successfully.");
    console.log("Tokens used:", response.usage.total_tokens);

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating response:", error);
    return null;
  }
};

export default {
  generate,
};
