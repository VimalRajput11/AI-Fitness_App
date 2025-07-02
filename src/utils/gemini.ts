import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY); // Replace with your actual API key
console.log("API KEY:", import.meta.env.VITE_GEMINI_API_KEY);
export const getFitnessAdvice = async (
  bmi: number,
  category: string,
  activityLevel: string,
  language: string
): Promise<string[]> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Give 3 personalized fitness tips for:
- BMI: ${bmi}
- Category: ${category}
- Activity Level: ${activityLevel}
- Language: ${language}

Respond only in ${language}. Use short, practical advice.
`;

  try {
    const result = await model.generateContent([prompt]); // ✅ Correct format for v1
    const text = await result.response.text();            // Ensure you await .text()
    return text.split(/\n+/).filter(line => line.trim().length > 0);
  } catch (error) {
    console.error('Gemini error:', error);
    return ['Unable to generate suggestions. Please try again later.'];
  }
};
