import path from 'node:path'
import consola from 'consola'
import { exec } from 'tinyexec'
import { $t } from '@/locales'

export class ADBKeyboard {
  /**
   * Check ADB Keyboard is installed.
   */
  async isKeyboardInstalled() {
    try {
      // 首先检查已启用的输入法
      const enabledResult = await exec('adb', ['shell', 'ime', 'list', '-s'])
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
        await this.installKeyboard()
        return { success: true, message: 'ADB Keyboard is installed' }
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
  async installKeyboard() {
    try {
      consola.start($t('adb.installKeyboard.start'))
      const apkPath = path.join(__dirname, '../asset/ADBKeyboard.apk')
      await exec('adb', ['install', apkPath])
      await exec('adb', ['shell', 'ime', 'enable', 'com.android.adbkeyboard/.AdbIME'])
      consola.success($t('adb.installKeyboard.success'))
    }
    catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
