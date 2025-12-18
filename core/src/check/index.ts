import process from 'node:process'
import consola from 'consola'
import OpenAI from 'openai'
import { ADBConnection } from '@/adb/connection'
import { ADBKeyboard } from '@/adb/keybord'
import { getAgentConfig } from '@/config'
import { $t } from '@/locales'
import { getSystem } from '@/utils/getSystem'

export async function checkSystemRequirements() {
  /**
   * check adb connection
   */
  const conn = new ADBConnection()
  const key = new ADBKeyboard()
  try {
    // check 1: adb installed
    const result = await conn.version()
    if (!result.success) {
      consola.error($t('adb.unInstalledHint.message'))
      consola.info($t(`adb.unInstalledHint.hint.message`))
      consola.info($t(`adb.unInstalledHint.hint.${getSystem()}`))
      process.exit(1)
    }

    // check 2: device connected
    const devices = await conn.devices()
    if (!devices.success) {
      consola.error($t('adb.deviceUnconnectedHint.message'))
      consola.info($t(`adb.deviceUnconnectedHint.hint.step1`))
      consola.info($t(`adb.deviceUnconnectedHint.hint.step2`))
      consola.info($t(`adb.deviceUnconnectedHint.hint.step3`))
      process.exit(1)
    }

    // check 3: ADB Keyboard connected
    const keyboard = await key.isKeyboardInstalled()
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

export async function checkModelApi() {
  const config = getAgentConfig()
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
      consola.error($t('model.check.empty'))
      process.exit(1)
    }
  }
  catch (error) {
    consola.error(`Model API check error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    process.exit(1)
  }
}
