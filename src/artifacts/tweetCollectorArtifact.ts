import axios from "axios"
import "dotenv/config"
import { Tweet } from "../types/Tweet"

const USER_TWEETS_URL = "https://api.twitterapi.io/twitter/user/last_tweets"
const TWEET_REPLIES_URL_V2 = "https://api.twitterapi.io/twitter/tweet/replies/v2"

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function cleanTweetText(text: string): string {
  return text
    .replace(/http\S+/g, "")
    .replace(/@\w+/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

// cache permanece igual
let cache: {
  username: string
  data: { tweet: Tweet | null, replies: Tweet[] }
} | null = null

export class TweetCollectorArtifact {

  async perceive(username: string): Promise<{
    tweet: Tweet | null
    replies: Tweet[]
  }> {

    if (cache && cache.username === username) {
      console.log("⚡ Usando cache")
      return cache.data
    }

    try {

      const tweetResponse = await axios.get(USER_TWEETS_URL, {
        headers: {
          "X-API-Key": process.env.TWITTERAPI_KEY
        },
        params: {
          userName: username,
          limit: 3
        }
      })

      const tweets = tweetResponse.data?.data?.tweets ?? []

      if (!tweets.length) {
        return { tweet: null, replies: [] }
      }

      for (const t of tweets) {

        const tweet: Tweet = {
          id: t.id,
          text: cleanTweetText(t.text),
          author: t.author?.username ?? username,
          createdAt: t.createdAt,
          likes: t.likeCount ?? 0
        }

        await sleep(4500)

        const repliesResponse = await axios.get(TWEET_REPLIES_URL_V2, {
          headers: {
            "X-API-Key": process.env.TWITTERAPI_KEY
          },
          params: {
            tweetId: tweet.id,
            cursor: "",
            queryType: "Latest"
          }
        })

        const repliesRaw =
          repliesResponse.data?.replies ??
          repliesResponse.data?.tweets ??
          []

        const replies: Tweet[] = repliesRaw
          .filter((r: any) => r.text && r.text.length > 3)
          .map((r: any) => ({
            id: r.id,
            text: cleanTweetText(r.text),
            author: r.author?.userName ?? "unknown",
            createdAt: r.createdAt,
            likes: r.likeCount ?? 0
          }))

        if (replies.length > 0) {

          const result = { tweet, replies }

          cache = {
            username,
            data: result
          }

          return result
        }
      }

      return { tweet: null, replies: [] }

    } catch (error: any) {

      if (error.response?.status === 429) {
        console.log("🚨 Rate limit atingido")
      }

      console.log("Erro ao buscar dados:", error?.response?.data || error.message)

      return { tweet: null, replies: [] }
    }
  }
}