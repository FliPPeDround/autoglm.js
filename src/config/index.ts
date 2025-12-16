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
class AgentConfig {
  private static instance: AgentConfig | null = null
  private config: AgentConfigType = {
    maxSteps: 100,
    lang: 'cn',
    verbose: true,
    baseUrl: 'http://localhost:8000/v1',
    apiKey: '',
    systemPrompt: undefined,
    model: 'autoglm-phone',
    maxTokens: 3000,
    temperature: 0.0,
    topP: 0.85,
    frequencyPenalty: 0.2,
  }

  public static getInstance(): AgentConfig {
    if (AgentConfig.instance === null) {
      AgentConfig.instance = new AgentConfig()
    }
    return AgentConfig.instance
  }

  private constructor() {
    if (this.config.systemPrompt === undefined) {
      this.config.systemPrompt = getSystemPrompt(this.config.lang)
    }
  }

  setConfig(config: Partial<AgentConfigType>) {
    this.config = { ...this.config, ...config }
  }

  getConfig(): AgentConfigType {
    return this.config
  }
}

const agentConfig = AgentConfig.getInstance()

export function getAgentConfig() {
  return agentConfig.getConfig()
}

export function setAgentConfig(config: Partial<AgentConfigType>) {
  agentConfig.setConfig(config)
}

export type { AgentConfigType }
