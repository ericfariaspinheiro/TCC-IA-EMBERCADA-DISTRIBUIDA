import axios from "axios"
import "dotenv/config"
import { Tweet } from "../types/Tweet"

const API_URL = "https://api.twitterapi.io/twitter/tweet/advanced_search"

function buildQuery(baseQuery: string): string {

  const filters = [
    "lang:en",
    "-is:retweet",
    "-is:reply",
    "min_faves:1"
  ]

  return `${baseQuery} ${filters.join(" ")}`
}

function cleanTweetText(text: string): string {

  return text
    .replace(/http\S+/g, "")
    .replace(/@\w+/g, "")
    .replace(/\s+/g, " ")
    .trim()

}

export async function searchTweets(query: string): Promise<Tweet[]> {

  const finalQuery = buildQuery(query)

  const response = await axios.get(API_URL, {
    headers: {
      "X-API-Key": process.env.TWITTERAPI_KEY
    },
    params: {
      query: finalQuery,
      limit: 10
    }
  })

  const tweets = response.data.tweets ?? []

  return tweets
    .filter((tweet: any) => tweet.text && tweet.text.length > 20)
    .map((tweet: any) => ({
      id: tweet.id,
      text: cleanTweetText(tweet.text),
      author: tweet.author?.username ?? "unknown",
      createdAt: tweet.createdAt,
      likes: tweet.likeCount ?? 0
    }))
}