import { Buffer } from 'node:buffer'
import { runAdbCommand } from './utils'

/**
 * Detect if ADB Keyboard is available and set it as the default keyboard.
 */
export async function detectAndSetAdbKeyboard(deviceId?: string): Promise<{ success: boolean, message: string }> {
  try {
    // Check if ADB Keyboard is installed
    const checkResult = await runAdbCommand(deviceId, ['shell', 'pm', 'list', 'packages', 'com.android.adbkeyboard'])

    if (!checkResult.stdout.includes('com.android.adbkeyboard')) {
      return { success: false, message: 'ADB Keyboard is not installed' }
    }

    // Set ADB Keyboard as the default
    await runAdbCommand(deviceId, ['shell', 'ime', 'set', 'com.android.adbkeyboard/.AdbIME'])

    return { success: true, message: 'ADB Keyboard set successfully' }
  }
  catch (error) {
    return { success: false, message: `Failed to set ADB Keyboard: ${error instanceof Error ? error.message : 'Unknown error'}` }
  }
}

/**
 * Restore the previous keyboard.
 */
export async function restoreKeyboard(_deviceId?: string): Promise<void> {
  // This is a placeholder - in practice, we'd need to remember the previous keyboard
  // For now, we'll just do nothing
}

/**
 * Type text using ADB Keyboard.
 */
export async function typeText(text: string, deviceId?: string): Promise<void> {
  // First, ensure ADB Keyboard is set
  await detectAndSetAdbKeyboard(deviceId)
  const encodedText = Buffer.from(text, 'utf8').toString('base64')
  // Type the text
  await runAdbCommand(deviceId, ['shell', 'am', 'broadcast', '-a', 'ADB_INPUT_B64', '--es', 'msg', encodedText])
  await new Promise(resolve => setTimeout(resolve, 500))
}

/**
 * Clear text by sending backspace keystrokes.
 */
export async function clearText(count: number = 100, deviceId?: string): Promise<void> {
  // Send backspace key multiple times
  for (let i = 0; i < count; i++) {
    await runAdbCommand(deviceId, ['shell', 'input', 'keyevent', '67'])
  }
  await new Promise(resolve => setTimeout(resolve, 500))
}
