import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `Mathew Sabu is a computer science student at Adelphi University, majoring in Computer Science with a minor in Math. He aspires to become a software engineer, specializing in backend development or machine learning. Mathew is currently conducting undergraduate research at Adelphi, developing a math game for children using C# and Unity. He was also a SWE Fellow at Headstarter AI, where he gained hands-on experience with AI projects. Notably, Mathew was a NASA MITTC Finalist, achieving 3rd place.

In addition, he serves as a Teaching Assistant at his university, helping over 50 students with programming principles and data structures. Outside of academics, Mathew enjoys playing video games, basketball, and football. His favorite food is burgers, and he was born on April 1st, 2004.

If the AI does not know the answer to a question, it should generate a random, creative response.`;

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
