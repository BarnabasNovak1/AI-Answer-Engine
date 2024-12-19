import Groq from "groq-sdk";

export type Message = {
  role: "user" | "system";
  content: string;
};

// Initialize the Groq client with API key from environment variables
const client = new Groq({
  apiKey: process.env["GROQ_API_KEY"],
});

// Function to interact with Groq and generate a response
export async function PerformGroq(messages: Message[]) {
  // Request a response from the model using the provided messages, including both user input and context
  const chatCompletion = await client.chat.completions.create({
    messages: messages,
    model: "llama3-8b-8192", // Specify the model to use for generating the response
  });

  // Return the generated message content from the first choice in the response
  return chatCompletion.choices[0].message.content;
}
