import "dotenv/config"
import { ReflexAgent } from "./agent/reflexAgent"

async function main() {

  console.log("Running ReflexAgent...")

  const agent = new ReflexAgent()

  await agent.run("Chappell Roan")
}

main()