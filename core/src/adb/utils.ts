/**
 * Get ADB command prefix with optional device specifier.
 */
export function getAdbPrefix(deviceId?: string): string[] {
  return deviceId ? ['adb', '-s', deviceId] : ['adb']
}
