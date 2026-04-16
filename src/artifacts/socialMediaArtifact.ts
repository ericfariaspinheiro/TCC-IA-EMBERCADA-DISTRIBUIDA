import { getLastTweetWithReplies } from "../infrastructure/xCollector"
import { Tweet } from "../types/Tweet"
import { generateContent } from "../infrastructure/LLMAdapter"

export type Sentiment = "positive" | "negative" | "neutral"

export class SocialMediaArtifact {

  // 🔹 MEDIAÇÃO COM AMBIENTE (Twitter)
  async perceive(username: string): Promise<{
    tweet: Tweet | null
    replies: Tweet[]
  }> {
    return await getLastTweetWithReplies(username)
  }

  // 🔹 MEDIAÇÃO COM AMBIENTE (LLM)
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

      const raw = await generateContent(prompt)

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

      console.log("❌ Erro no artifact ao processar resposta da LLM:", error)

      return limitedReplies.map(() => "neutral")
    }
  }
}