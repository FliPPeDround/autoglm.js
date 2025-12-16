import { MESSAGES_EN } from './prompts_en'
import { MESSAGES_ZH } from './prompts_zh'

/**
 * Get messages based on the language.
 */
export function getMessages(lang: 'cn' | 'en'): typeof MESSAGES_ZH {
  return lang === 'cn' ? MESSAGES_ZH : MESSAGES_EN
}
