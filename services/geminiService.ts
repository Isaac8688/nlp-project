
import { GoogleGenAI, Type } from "@google/genai";
import { EssayResult, EducationLevel } from "../types";

export const gradeEssay = async (text: string, level: EducationLevel): Promise<EssayResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Grade the following essay for a ${level} student. 
    Analyze it based on NLP metrics (word count, sentence complexity, etc.) and traditional writing rubrics.
    
    Essay Content:
    ${text}
    `,
    config: {
      systemInstruction: `You are an expert academic writing assessor. 
      Evaluate the essay provided and return a structured JSON response.
      The scores should be between 0 and 100.
      Sentence complexity is a decimal from 0 to 10.
      Lexical diversity is a decimal from 0 to 1.
      Readability score should be a common scale (e.g., Flesch-Kincaid equivalent or grade level).`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          rubricScores: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.NUMBER },
              organization: { type: Type.NUMBER },
              grammar: { type: Type.NUMBER },
              vocabulary: { type: Type.NUMBER },
            },
            required: ["content", "organization", "grammar", "vocabulary"]
          },
          metrics: {
            type: Type.OBJECT,
            properties: {
              wordCount: { type: Type.NUMBER },
              sentenceCount: { type: Type.NUMBER },
              readabilityScore: { type: Type.STRING },
              lexicalDiversity: { type: Type.NUMBER },
              sentenceComplexity: { type: Type.NUMBER },
            },
            required: ["wordCount", "sentenceCount", "readabilityScore", "lexicalDiversity", "sentenceComplexity"]
          },
          feedback: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                type: { type: Type.STRING, description: "Must be 'positive' or 'improvement'" },
                text: { type: Type.STRING },
              },
              required: ["category", "type", "text"]
            }
          },
          summary: { type: Type.STRING }
        },
        required: ["overallScore", "rubricScores", "metrics", "feedback", "summary"]
      }
    },
  });

  const jsonStr = response.text.trim();
  return JSON.parse(jsonStr) as EssayResult;
};
