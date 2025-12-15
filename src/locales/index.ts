import { getLocale } from '@/utils/getLanguage'
import zhCN from './zh-CN'

const t_map = {
  'zh-CN': zhCN,
} as Record<string, any>

export function $t(key: string) {
  const locale = getLocale()
  const message = t_map[locale] || t_map['zh-CN']

  // Support nested key access using dot notation (e.g., 'adb.connection.error')
  const keys = key.split('.')
  let result = message

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k]
    }
    else {
      return key // Return the original key if not found
    }
  }

  return result
}
