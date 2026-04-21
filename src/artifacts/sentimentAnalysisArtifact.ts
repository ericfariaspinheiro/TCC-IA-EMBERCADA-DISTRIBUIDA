import { GoogleGenAI } from "@google/genai"
import { Tweet } from "../types/Tweet"

export type Sentiment = "positive" | "negative" | "neutral"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
})

export class SentimentAnalysisArtifact {

  async reason(replies: Tweet[]): Promise<Sentiment[]> {

    if (!replies.length) return []

    const limitedReplies = replies.slice(0, 20)

    const formattedReplies = limitedReplies
      .map((t, i) => `${i + 1}. ${t.text}`)
      .join("\n")

    const prompt = `
Classify each reply as: positive, negative, or neutral.

Rules:
- Positive: praise, support, enthusiasm
- Negative: criticism, insults, disagreement, hostility
- Neutral: factual or unclear tone

Return ONLY JSON:

{
  "sentiments": ["positive", "negative", "neutral"]
}

Replies:
${formattedReplies}
`

    try {

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      })

      const raw = response.text || ""

      console.log("LLM RAW:", raw)

      const cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

      const parsed = JSON.parse(cleaned)

      const sentiments: Sentiment[] = parsed.sentiments.map((s: string) => {
        const normalized = s.toLowerCase().replace(/[^a-z]/g, "")

        if (normalized === "positive") return "positive"
        if (normalized === "negative") return "negative"
        return "neutral"
      })

      return sentiments

    } catch (error) {

      console.log("❌ Erro ao processar resposta da LLM:", error)

      return limitedReplies.map(() => "neutral")
    }
  }
}