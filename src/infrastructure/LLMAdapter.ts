import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
})

export async function generateContent(prompt: string): Promise<string> {
  try {

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    })

    return response.text || ""

  } catch (error) {

    console.log("❌ Erro no LLMAdapter:", error)

    throw error
  }
}