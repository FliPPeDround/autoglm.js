import type { AgentConfigStore } from '@/config'
import { defaultAgentConfigStore, getAgentConfig } from '@/config'
import enUS from './en-US'
import zhCN from './zh-CN'

const t_map = {
  cn: zhCN,
  en: enUS,
} as Record<string, any>

export type Translator = (key: string) => string

export function createTranslator(store: AgentConfigStore = defaultAgentConfigStore): Translator {
  return (key: string) => {
    const locale = getAgentConfig(store).lang
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
}

export const $t = createTranslator()
