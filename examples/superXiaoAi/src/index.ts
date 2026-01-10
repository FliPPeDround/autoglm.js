import process from 'node:process'
import { MiGPT } from '@mi-gpt/next'
import { AutoGLM } from 'autoglm.js'
import { classifyTask } from './taskClassification'
import 'dotenv/config'

async function main() {
  const agent = new AutoGLM({
    maxSteps: 100,
    lang: 'cn',
    baseUrl: process.env.AGENT_BASE_URL || '',
    apiKey: process.env.AGENT_API_KEY || '',
    model: process.env.AGENT_MODEL || '',
  })

  // 无线调试
  // agent.adb.enableTCPIP(43929)
  // agent.adb.connect("192.168.31.65:43929")
  // agent.updateConfig({
  //   deviceId: "192.168.31.65:43929",
  // })
  await MiGPT.start({
    speaker: {
      userId: process.env.MIGPT_USER_ID || '',
      password: process.env.MIGPT_PASSWORD || '',
      did: process.env.MIGPT_DID || '',
      passToken: process.env.MIGPT_PASS_TOKEN || '',
    },

    callAIKeywords: ['用手机', '手机', '帮我用手机'],
    async onMessage(engine, { text }) {
      const shouldUsePhone
        = engine.config.callAIKeywords!.some(e => text.startsWith(e))
          || await classifyTask(text)

      if (shouldUsePhone) {
        await engine.speaker.abortXiaoAI()
        await engine.MiNA.pause()
        const answer = await agent.run(text)
        // eslint-disable-next-line no-console
        console.log(`🔊 ${answer}`)
        engine.MiNA.play({ text: answer })

        return { handled: true }
      }
    },

  })
  process.exit(0)
}

main()
