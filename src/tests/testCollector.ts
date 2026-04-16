// Não to usando mais, foi para testes

import { searchTweets } from "../infrastructure/xCollector"

async function main() {

  const tweets = await searchTweets("elonmusk")

  console.log("Tweets encontrados:")
  console.log(tweets)

}

main()