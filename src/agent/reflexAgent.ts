import { TweetCollectorArtifact } from "../artifacts/tweetCollectorArtifact"
import { SentimentAnalysisArtifact, Sentiment } from "../artifacts/sentimentAnalysisArtifact"

let hasRun = false

export class ReflexAgent {

  private collector = new TweetCollectorArtifact()
  private analyzer = new SentimentAnalysisArtifact()

  private negativeCount = 0
  private positiveCount = 0
  private neutralCount = 0

  async run(username: string) {

    if (hasRun) {
      console.log("⚠️ Agente já executado.")
      return
    }

    hasRun = true

    console.log("Starting Social Media Sentiment Agent\n")

    // PERCEPÇÃO (artifact de coleta)
    const { tweet, replies } = await this.collector.perceive(username)

    if (!tweet) {
      console.log("Nenhum tweet encontrado.")
      return
    }

    console.log("\n📌 Tweet analisado:")
    console.log(tweet.text)

    // RACIOCÍNIO (artifact de LLM)
    const sentiments = await this.analyzer.reason(replies)

    // AÇÃO (continua igual)
    for (let i = 0; i < sentiments.length; i++) {

      const sentiment = sentiments[i]

      console.log("\n--- Agent Cycle ---")
      console.log("Reply:", replies[i]?.text)
      console.log("Sentiment:", sentiment)

      this.act(sentiment)
    }

    this.printSummary()
  }

  private act(sentiment: Sentiment) {

    if (sentiment === "positive") this.positiveCount++
    else if (sentiment === "negative") {
      this.negativeCount++
      console.log("⚠️ Resposta negativa detectada.")
    }
    else this.neutralCount++
  }

  private printSummary() {

    console.log("\n📊 RESUMO FINAL")
    console.log("Positivos:", this.positiveCount)
    console.log("Negativos:", this.negativeCount)
    console.log("Neutros:", this.neutralCount)
  }
}