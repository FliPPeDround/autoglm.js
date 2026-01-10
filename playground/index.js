/* eslint-disable no-console */
import { AutoGLM } from 'autoglm.js'

async function main() {
  const agent = new AutoGLM({
    maxSteps: 100,
    lang: 'cn',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
    apiKey: '',
    model: 'autoglm-phone',
  })

  const result = await agent.run('打开微信')
  console.log(result)
}

main()
