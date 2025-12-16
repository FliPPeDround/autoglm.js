#!/usr/bin/env node

import process from 'node:process'
import { cancel, intro, isCancel, outro, text } from '@clack/prompts'
import { bold, cyan } from 'kolorist'
import minimist from 'minimist'
import { PhoneAgent } from './agent'
import { checkModelApi, checkSystemRequirements } from './check'
import { commandAction } from './cli/action'
import { printBanner } from './cli/banner'
import { getConfig } from './cli/config/prompts'
import { setAgentConfig } from './config'
import { $t } from './locales'
import s from './utils/spinner'

/**
 * AutoGLM.js CLI
 */
async function main() {
  printBanner()
  const argv = minimist(process.argv.slice(2), {
    alias: {
      help: 'h',
      config: 'c',
    },
  })
  const config = commandAction(argv)
  setAgentConfig(config || await getConfig())

  // check system requirements
  await checkSystemRequirements()
  await checkModelApi()
  if (!config) {
    s.stop($t('prompt.checking'))
    outro($t('prompt.done'))
  }

  // create agent
  const agent = new PhoneAgent()

  // 使用更好的交互界面
  intro(bold(cyan(`🤖 ${$t('prompt.interactiveMode')}`)))

  let isFirstTask = true

  while (true) {
    const task = await text({
      message: bold(`💬 ${$t('prompt.task')}`),
      placeholder: isFirstTask ? $t('prompt.placeholder') : undefined,
    })
    if (isCancel(task)) {
      cancel($t('prompt.cancel'))
      process.exit(0)
    }
    if (task) {
      await agent.run(task)
      isFirstTask = false
    }
  }
}

main().catch((error) => {
  console.error('CLI执行错误:', error)
  process.exit(1)
})
