import type { ADBKeyboardCheckResult } from './types'
import path from 'node:path'
import consola from 'consola'
import { exec } from 'tinyexec'
import { $t } from '@/locales'
import { getAdbPrefix } from './utils'

export class ADBKeyboard {
  /**
   * Check ADB Keyboard is installed.
   */
  async isKeyboardInstalled(deviceId?: string): Promise<ADBKeyboardCheckResult> {
    const adbPrefix = getAdbPrefix(deviceId)

    try {
      // 首先检查已启用的输入法
      const enabledResult = await exec(adbPrefix[0], [...adbPrefix.slice(1), 'shell', 'ime', 'list', '-s'])
      const enabledImeList = enabledResult.stdout.trim()

      if (enabledImeList.includes('com.android.adbkeyboard/.AdbIME')) {
        return { success: true, message: 'ADB Keyboard is installed and enabled' }
      }

      consola.error($t('adb.keyboardUnInstalledHint.message'))
      consola.info($t('adb.keyboardUnInstalledHint.description'))
      const confirm = await consola.prompt($t('adb.keyboardUnInstalledHint.hint.question'), {
        type: 'confirm',
        help: $t('adb.keyboardUnInstalledHint.hint.help'),
      })

      if (confirm) {
        return await this.installKeyboard(deviceId)
      }
      else {
        consola.info($t('adb.keyboardUnInstalledHint.confirmFalse'))
        for (const step of Object.values($t('adb.keyboardUnInstalledHint.confirmFalsehint'))) {
          consola.info(step)
        }
        return { success: false, message: 'ADB Keyboard is not installed' }
      }
    }
    catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Install ADB Keyboard.
   */
  async installKeyboard(deviceId?: string): Promise<ADBKeyboardCheckResult> {
    const adbPrefix = getAdbPrefix(deviceId)

    try {
      consola.start($t('adb.installKeyboard.start'))
      const apkPath = path.join(__dirname, '../asset/ADBKeyboard.apk')
      await exec(adbPrefix[0], [...adbPrefix.slice(1), 'install', apkPath])
      await exec(adbPrefix[0], [...adbPrefix.slice(1), 'shell', 'ime', 'enable', 'com.android.adbkeyboard/.AdbIME'])
      consola.success($t('adb.installKeyboard.success'))
      return { success: true, message: 'ADB Keyboard is installed' }
    }
    catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
