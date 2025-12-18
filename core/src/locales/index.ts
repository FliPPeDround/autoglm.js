import { getAgentConfig } from '@/config'
import enUS from './en-US'
import zhCN from './zh-CN'

const t_map = {
  cn: zhCN,
  en: enUS,
} as Record<string, any>

export function $t(key: string) {
  const locale = getAgentConfig().lang
  const message = t_map[locale] || t_map.cn

  const keys = key.split('.')
  let result = message

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k]
    }
    else {
      return key
    }
  }

  return result
}
