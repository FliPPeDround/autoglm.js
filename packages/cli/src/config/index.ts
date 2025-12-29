import type { AgentConfigType } from 'autoglm.js'
import fs from 'node:fs'
import { join } from 'node:path'
import { AUTOGLM_FILEPATH } from 'autoglm.js'
import { loadConfigSync } from 'unconfig'

const DEFAULT_CONFIG: AgentConfigType = {
  maxSteps: 100,
  lang: 'cn',
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
  apiKey: '',
  model: 'autoglm-phone',
  maxTokens: 2048,
  temperature: 0.5,
  topP: 0.5,
  frequencyPenalty: 0.5,
  screenshotQuality: 80,
}

export function loadCliConfig(customConfigPath?: string) {
  const configPath = customConfigPath ?? join(AUTOGLM_FILEPATH, 'config.json')
  if (!customConfigPath && !fs.existsSync(configPath)) {
    return DEFAULT_CONFIG
  }
  const { config } = loadConfigSync<AgentConfigType>({
    sources: [{
      files: configPath,
    }],
    defaults: DEFAULT_CONFIG,
    merge: true,
  })
  return config
}

export type { AgentConfigType }
