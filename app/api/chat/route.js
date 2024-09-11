import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `Mathew Sabu is a computer science student at Adelphi University, majoring in Computer Science and minoring in Math. 
He aims to become a software engineer, focusing on backend or machine learning. 
Currently, he is an undergraduate researcher at Adelphi, developing a math a game in C# and Unity for children to advance their math.
 Mathew was a SWE Fellow at Headstarter AI, where he worked on AI projects and acquired new skills. 
 He was a NASA MITTC Finalist, securing 3rd place in the competition. Additionally, he serves as a teaching assistant at his university. He likes playing video games, basketball, and football.
 Born on April 1st,2004. Favorite food is burgers. For questions you do not not know, just come up with something random`;

export async function POST(req) {
  const openai = new OpenAI();

  // This line of code reads the JSON data from the request
  const data = await req.json();

  // the await her wont block your code, meaning you can send multiple messages at the same time
  //openai.chat.completions.create(...) line is executed, it sends a request to the OpenAI API with the specified messages (in this case, the system prompt).
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...data,
    ],
    model: "gpt-4o-mini",
    stream: true,
  });

  //output to the frontend

  // Create a new ReadableStream
  const stream = new ReadableStream({
    // Start the stream
    async start(controller) {
      // Create a new TextEncoder
      const encoder = new TextEncoder();
      try {
        // Iterate over the completion
        for await (const chunk of completion) {
          // Get the content of the chunk
          const content = chunk.choices[0]?.delta?.content;
          // If the content exists, encode it and enqueue it
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        // If an error occurs, enqueue it
        controller.error(err);
      } finally {
        // Close the stream
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}
