import type { AgentConfigType } from 'autoglm.js'
import fs from 'node:fs'
import { loadConfigSync } from 'unconfig'
import { AUTOGLM_CONFIG_FILEPATH, DEFAULT_CONFIG } from '@/constants'

export function loadCliConfig(customConfigPath?: string) {
  const configPath = customConfigPath ?? AUTOGLM_CONFIG_FILEPATH
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
