import { searchTweets } from "../collectors/xCollector"
import { Tweet } from "../types/Tweet"
import { GoogleGenAI } from "@google/genai"

export type Sentiment = "positive" | "negative" | "neutral"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
})

export class SocialMediaArtifact {

  // 🔹 PERCEPÇÃO
  async getTweets(query: string): Promise<Tweet[]> {
    return await searchTweets(query)
  }

  // 🔹 RACIOCÍNIO AVANÇADO (BATCH + CAMPANHA)
  async analyzeCampaign(tweets: Tweet[]): Promise<{
    sentiments: Sentiment[]
    isCampaign: boolean
    explanation: string
  }> {

    const formattedTweets = tweets
      .map((t, i) => `${i + 1}. ${t.text}`)
      .join("\n")

    const prompt = `
You are analyzing social media activity.

Tasks:
1. Classify each tweet as: positive, negative, or neutral
2. Determine if there is a coordinated negative campaign

A campaign means:
- many negative posts
- similar tone or intent
- repeated accusations or narratives

Return ONLY a JSON object like:

{
  "sentiments": ["positive", "negative", "neutral"],
  "isCampaign": true,
  "explanation": "short explanation"
}

Tweets:
${formattedTweets}
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

      return {
        sentiments: parsed.sentiments.map((s: string) => {
          const normalized = s.toLowerCase().replace(/[^a-z]/g, "")

          if (normalized === "positive") return "positive"
          if (normalized === "negative") return "negative"
          return "neutral"
        }),
        isCampaign: parsed.isCampaign,
        explanation: parsed.explanation
      }

    } catch (error) {

      console.log("ERRO NA ANÁLISE DE CAMPANHA:")
      console.log(error)

      return {
        sentiments: tweets.map(() => "neutral"),
        isCampaign: false,
        explanation: "fallback"
      }

    }

  }

}