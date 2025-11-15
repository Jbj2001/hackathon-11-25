// src/hooks/useJobParser.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define the type for the parsed job data
export interface ParsedJob {
  jobTitle: string;
  companyName: string;
  description: string;
  requirements: string[];
  companyInfo: string;
  location?: string;
  jobType?: string;
  salaryRange?: string;
}

// Initialize the Gemini API
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function parseHtml(html: string): Promise<ParsedJob> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `
      Extract all required job details from the HTML provided below. 
      If a field is not explicitly found, return an empty string or empty array for that field.

      HTML:
      ${html}
    `;

    const result = await model.generateContent({
      contents: [
        { 
          role: "user", 
          parts: [
            { 
              text: `Analyze the provided HTML and use it along with your knowledge to provide detailed job information. 
              Extract and enhance the following details, using your knowledge to fill in any gaps where the HTML is incomplete:
                - jobTitle (string): The official job title (be specific and professional)
                - companyName (string): The full, official company name
                - description (string): A comprehensive summary of the role, including key responsibilities and day-to-day tasks
                - requirements (string[]): A detailed list of required and preferred qualifications, skills, and experience
                - companyInfo (string): Insightful information about the company, including industry, size, and culture
                - location (string, optional): Job location with city and state/country if available
                - jobType (string, optional): Employment type (e.g., Full-time, Part-time, Contract, etc.)
                - salaryRange (string, optional): Estimated salary range based on the role and location if not provided
                
                Use your knowledge to provide the most accurate and helpful information possible, even if some details aren't explicitly stated in the HTML.
                
                HTML: ${html}
                
                Return the response as a valid JSON object with the fields listed above.`
            }
          ] 
        }
      ]
    });

    let responseText = await result.response.text();    
    // Remove markdown code block markers if present
    responseText = responseText.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
    
    // Parse the JSON response
    const parsedData = JSON.parse(responseText) as Partial<ParsedJob>;

    // Ensure all required fields are present and correctly typed
    return {
      jobTitle: parsedData.jobTitle || 'No title found',
      companyName: parsedData.companyName || 'Company name not specified',
      description: parsedData.description || 'No description available',
      // Ensure requirements is an array of strings
      requirements: Array.isArray(parsedData.requirements) ? parsedData.requirements.filter(r => typeof r === 'string') : [],
      companyInfo: parsedData.companyInfo || 'No company information available',
      // Optional fields
      location: parsedData.location || '',
      jobType: parsedData.jobType || '',
      salaryRange: parsedData.salaryRange || '',
    };
  } catch (error) {
    console.error('Error parsing HTML with Gemini:', error);
    throw new Error('Failed to parse job posting. Please try again.');
  }
}