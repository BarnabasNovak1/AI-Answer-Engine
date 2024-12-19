// TODO: Implement the chat API with Groq and web scraping using Cheerio and Puppeteer
// For guidance on reading the Request body, check Next.js Docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// Learn more about the Groq SDK: https://www.npmjs.com/package/groq-sdk
// Explore the Cheerio documentation here: https://cheerio.js.org/docs/basics/loading
// For Puppeteer, refer to: https://pptr.dev/guides/what-is-puppeteer

import { NextResponse } from "next/server";

import { Logger } from "@/app/utils/logger";
import { performScrape, ScrapedContent } from "@/app/utils/scrape";
import { Message, PerformGroq } from "@/app/utils/chat";
import { prompt } from "@/app/utils/prompt";

const logger = new Logger("scraper");

// Regex for identifying URLs
const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

// Function to extract URLs from the message, scrape content, and provide it to the Groq model
export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    // Extract URLs from the message text
    const extractedUrls = message.match(URL_REGEX) || [];
    if (extractedUrls.length > 0) {
      console.log("URLs extracted:", extractedUrls);
    }

    // Scrape content from each URL
    const scrapedResults: ScrapedContent[] = [];
    for (const url of extractedUrls) {
      const result = await performScrape(url);
      scrapedResults.push(result);
    }

    // Combine scraped content into a single context string
    const scrapedContext = scrapedResults
      .map(
        result =>
          `Content from ${result.url}:\nTitle: ${result.title}\n` +
          result.sections
            .map(section => `${section.type.toUpperCase()}: ${section.content}`)
            .join("\n")
      )
      .join("\n\n");

    // Prepare the messages to pass to the LLM
    const messages = [
      {
        role: "system",
        content: prompt,
      },
      // Add previous messages for better context
      ...context.map((msg: Message) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: `Question: ${message}\n\nScraped Context:\n${scrapedContext}`,
      },
    ];

    const response = await PerformGroq(messages);

    return NextResponse.json({ role: "system", content: response });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
