import "dotenv/config"
import { ReflexAgent } from "./agent/reflexAgent"

let hasRun = false

async function main() {
  if (hasRun) {
    console.log("⚠️ Agent já executado. Ignorando nova execução...")
    return
  }

  hasRun = true

  console.log("🚀 Iniciando execução do agente...\n")

  const agent = new ReflexAgent()

  await agent.run("LulaOficial")
}

main()