import { AutoGLM } from 'autoglm.js'

async function main() {
  const agent = await AutoGLM.createAgent({
    maxSteps: 100,
    lang: 'cn',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
    apiKey: '74fab98ebabd483a9fb88e311c14f61c.OIQrXM8thm8vSxo1',
    model: 'autoglm-phone',
  })

  const handler = agent.run('返回桌面')
  handler.on('*', (_type, _message) => {
    // console.log(type, message)
  })
}

main()
