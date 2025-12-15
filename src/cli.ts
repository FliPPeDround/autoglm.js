#!/usr/bin/env node

import type { AgentConfigType } from './config/types'
import process from 'node:process'
import minimist from 'minimist'
import { PhoneAgent } from './agent'
import { checkModelApi, checkSystemRequirements } from './check'
import { commandAction } from './cli/action'
import { setAgentConfig } from './config'

/**
 * AutoGLM.js CLI
 */
async function main() {
  // argv parse
  const argv = minimist(process.argv.slice(2), {
    alias: {
      help: 'h',
    },
    default: {
      modelName: 'autoglm-phone',
      baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
      apiKey: '556166f2553d4fe1bc5a939ad3f9c299.fcYwamM3lViUNmHW',
      maxSteps: 100,
      lang: 'cn',
    },
  })
  commandAction(argv)
  const { _, ...options } = argv
  const task = _[0]

  // set agent config
  setAgentConfig(options as AgentConfigType)

  // check system requirements
  checkSystemRequirements()
  checkModelApi()

  // create agent
  const agent = new PhoneAgent()

  console.log('='.repeat(50))
  console.log('Phone Agent - AI-powered phone automation')
  console.log('='.repeat(50))
  console.log(`Model: ${options.modelName}`)
  console.log(`Base URL: ${options.baseUrl}`)
  console.log(`Max Steps: ${options.maxSteps}`)
  console.log(`Language: ${options.lang}`)

  if (task) {
    console.log(`\nTask: ${task}`)
    const result = await agent.run(task)
    console.log(result)
  }
}

main().catch((error) => {
  console.error('CLI执行错误:', error)
  process.exit(1)
})
