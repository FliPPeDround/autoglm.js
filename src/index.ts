import type { AgentConfigType } from '@/config'
import { checkModelApi, checkSystemRequirements } from '@/check'
import { setAgentConfig } from '@/config'
import { getScreenshot } from './adb'
import { tap } from './adb/device'

export async function createAgent(config: AgentConfigType) {
  // await checkSystemRequirements()
  // setModelConfig(config.model)
  // await checkModelApi()
  // setAgentConfig(config.agent)
  await tap(500, 800)
  // const screenshot = await getScreenshot()
  // console.log(screenshot)
}

createAgent({
  maxSteps: 10,
  lang: 'cn',
  verbose: true,
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
  apiKey: '556166f2553d4fe1bc5a939ad3f9c299.fcYwamM3lViUNmHW',
  modelName: 'glm-4.5-flash',
  maxTokens: 2048,
  temperature: 0.5,
  topP: 0.7,
  frequencyPenalty: 0.0,
})
