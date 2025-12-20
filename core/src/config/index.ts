import type { AgentConfigType } from './types'
import { SYSTEM_PROMPT_EN } from '@/constants/prompts_en'
import { SYSTEM_PROMPT_ZH } from '@/constants/prompts_zh'

/**
 * Get the system prompt based on the language.
 */
export function getSystemPrompt(lang: 'cn' | 'en'): string {
  return lang === 'cn' ? SYSTEM_PROMPT_ZH : SYSTEM_PROMPT_EN
}

/**
 * Configuration for the model.
 */
class AgentConfigStore {
  private config: AgentConfigType = {
    mode: 'cli',
    maxSteps: 100,
    lang: 'cn',
    baseUrl: 'http://localhost:8000/v1',
    apiKey: '',
    systemPrompt: undefined,
    model: 'autoglm-phone',
    maxTokens: 3000,
    temperature: 0.0,
    topP: 0.85,
    frequencyPenalty: 0.2,
  }

  constructor(initialConfig?: Partial<AgentConfigType>) {
    if (initialConfig) {
      this.setConfig(initialConfig)
    }
    this.ensureSystemPrompt()
  }

  setConfig(config: Partial<AgentConfigType>) {
    this.config = { ...this.config, ...config }
    this.ensureSystemPrompt()
  }

  getConfig(): AgentConfigType {
    return this.config
  }

  private ensureSystemPrompt() {
    if (!this.config.systemPrompt) {
      this.config.systemPrompt = getSystemPrompt(this.config.lang)
    }
  }
}

const defaultAgentConfigStore = new AgentConfigStore()

export function createAgentConfigStore(config?: Partial<AgentConfigType>) {
  return new AgentConfigStore(config)
}

export function getAgentConfig(store: AgentConfigStore = defaultAgentConfigStore) {
  return store.getConfig()
}

export function setAgentConfig(config: Partial<AgentConfigType>, store: AgentConfigStore = defaultAgentConfigStore) {
  store.setConfig(config)
}

export { AgentConfigStore, defaultAgentConfigStore }
export type { AgentConfigType }
