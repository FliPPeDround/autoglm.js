import type { AgentConfigStore } from '@/config'
import type { Translator } from '@/locales'
import process from 'node:process'
import consola from 'consola'
import OpenAI from 'openai'
import { ADBConnection } from '@/adb/connection'
import { ADBAutoInstaller } from '@/adb/installer'
import { ADBKeyboard } from '@/adb/keyboard'
import { defaultAgentConfigStore, getAgentConfig } from '@/config'
import { createTranslator } from '@/locales'
import { getSystem } from '@/utils/getSystem'

export async function checkSystemRequirements(
  configStore: AgentConfigStore = defaultAgentConfigStore,
  t: Translator = createTranslator(configStore),
) {
  const config = getAgentConfig(configStore)
  /**
   * check adb connection
   */
  const conn = new ADBConnection()
  const key = new ADBKeyboard()
  try {
    // check 1: adb installed
    const result = await conn.version()
    if (!result.success) {
      consola.error(t('adb.unInstalledHint.message'))

      // check 1.1: adb not installed
      const confirm = await consola.prompt(t('adb.unInstalledHint.confirm.message'), {
        type: 'confirm',
        default: false,
      })
      if (confirm) {
        const installer = new ADBAutoInstaller()
        await installer.install()
        const installed = await installer.check()
        if (installed) {
          consola.success('adb 安装成功')
        }
        else {
          consola.error('adb 安装失败')
          consola.info(t(`adb.unInstalledHint.hint.message`))
          consola.info(t(`adb.unInstalledHint.hint.${getSystem()}`))
          process.exit(1)
        }
      }
      if (!confirm) {
        consola.info(t(`adb.unInstalledHint.hint.message`))
        consola.info(t(`adb.unInstalledHint.hint.${getSystem()}`))
        process.exit(1)
      }
    }

    // check 2: device connected
    const devices = await conn.devices()
    if (!devices.success) {
      consola.error(t('adb.deviceUnconnectedHint.message'))
      consola.info(t(`adb.deviceUnconnectedHint.hint.step1`))
      consola.info(t(`adb.deviceUnconnectedHint.hint.step2`))
      consola.info(t(`adb.deviceUnconnectedHint.hint.step3`))
      process.exit(1)
    }

    // check 3: ADB Keyboard connected
    const keyboard = await key.isKeyboardInstalled(config.deviceId)
    if (!keyboard.success) {
      process.exit(1)
    }
  }
  catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function checkModelApi(
  configStore: AgentConfigStore = defaultAgentConfigStore,
  t: Translator = createTranslator(configStore),
) {
  const config = getAgentConfig(configStore)
  try {
    const client = new OpenAI({
      baseURL: config.baseUrl,
      apiKey: config.apiKey,
    })

    const response = await client.chat.completions.create({
      model: config.model,
      messages: [{ role: 'user', content: 'hi' }],
      max_tokens: 5,
      temperature: 0.0,
      stream: false,
    })

    const isSuccess = response.choices && response.choices.length > 0

    if (!isSuccess) {
      consola.error(t('model.check.empty'))
      process.exit(1)
    }
  }
  catch (error) {
    consola.error(`Model API check error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    process.exit(1)
  }
}
