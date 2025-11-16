import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs"; // important: Gemini SDK needs Node, not Edge

// Initialize the Google Generative AI client
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

type InterviewAnalysis = {
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  score: number;
};

/**
 * Attempt to extract a JSON object from a raw model response.
 * Handles:
 * - Markdown code fences ```json ... ```
 * - Extra text before/after the JSON (we grab the first {...} block)
 */
function extractJsonObject(raw: string): any {
  let text = raw.trim();

  // If the model wrapped output in a code block, strip it
  if (text.startsWith("```")) {
    text = text
      // remove ```json or ```JSON
      .replace(/^```json/i, "")
      // remove plain ``` at the start if present
      .replace(/^```/, "")
      // remove trailing ```
      .replace(/```$/, "")
      .trim();
  }

  // Find the first JSON object in the text
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new Error("No JSON object found in model response");
  }

  const jsonSlice = text.slice(firstBrace, lastBrace + 1);

  return JSON.parse(jsonSlice);
}

async function analyzeWithGemini(transcript: string): Promise<InterviewAnalysis> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
    // Hint to Gemini that we want JSON
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `
You are an expert interview coach.

Analyze the following interview transcript and respond with *only* a valid JSON object.
Do not include any explanations, markdown, or backticks.

The JSON must have this exact structure:

{
  "summary": "A 2-3 paragraph summary of the interview conversation",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "areasForImprovement": ["area 1", "area 2", "area 3"],
  "score": 75
}

Where "score" is an integer from 0 to 100.

Transcript:
${transcript}
  `.trim();

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text(); // don't trim yet; let extractor handle it

  try {
    // Optional: uncomment if you want to see what Gemini is returning
    // console.log("Gemini raw response:", text);

    const parsed = extractJsonObject(text);

    // Basic shape validation (to avoid weird outputs)
    if (
      typeof parsed.summary !== "string" ||
      !Array.isArray(parsed.strengths) ||
      !Array.isArray(parsed.areasForImprovement) ||
      typeof parsed.score !== "number"
    ) {
      throw new Error("Response JSON did not match expected schema");
    }

    return parsed as InterviewAnalysis;
  } catch (err) {
    console.error("Failed to parse Gemini response as JSON", { text, err });
    throw new Error("Could not parse analysis response from Gemini");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const transcript: string | undefined = body?.transcript;

    if (!transcript || typeof transcript !== "string" || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: "No transcript provided" },
        { status: 400 }
      );
    }

    const analysis = await analyzeWithGemini(transcript);

    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    console.error("Error in analyze-interview API:", error);
    return NextResponse.json(
      { error: "Failed to analyze interview" },
      { status: 500 }
    );
  }
}
