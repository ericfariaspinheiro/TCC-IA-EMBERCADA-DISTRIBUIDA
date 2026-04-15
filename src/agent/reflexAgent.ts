import { SocialMediaArtifact, Sentiment } from "../artifacts/socialMediaArtifact"

export class ReflexAgent {

  private artifact = new SocialMediaArtifact()

  private negativeCount = 0
  private positiveCount = 0
  private neutralCount = 0

  async run(query: string) {

    console.log("Starting Social Media Sentiment Agent\n")

    const tweets = await this.artifact.getTweets(query)

    const result = await this.artifact.analyzeCampaign(tweets)

    const { sentiments, isCampaign, explanation } = result

    for (let i = 0; i < tweets.length; i++) {

      const sentiment = sentiments[i]

      console.log("\n--- Agent Cycle ---")
      console.log("Tweet:", tweets[i]?.text)
      console.log("Sentiment:", sentiment)

      if (sentiment) {
        this.act(sentiment)
      }
    }

    if (isCampaign) {
      console.log("\n🚨 ALERTA DE CAMPANHA DETECTADA")
      console.log("Motivo:", explanation)
    }

    this.printSummary()
  }

  private act(sentiment: Sentiment) {

    if (sentiment === "positive") {
      this.positiveCount++
    }

    else if (sentiment === "negative") {
      this.negativeCount++
      console.log("Post negativo detectado.")
    }

    else {
      this.neutralCount++
    }

  }

  private printSummary() {

    console.log("\n📊 RESUMO FINAL")
    console.log("Positivos:", this.positiveCount)
    console.log("Negativos:", this.negativeCount)
    console.log("Neutros:", this.neutralCount)

  }

}