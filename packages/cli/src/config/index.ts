import type { AgentConfig } from './types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadConfigFile } from '../cli/config/loader'
import { loadEnvConfig } from './env'

export interface ConfigSource {
  type: 'env' | 'file' | 'default'
  config: Partial<AgentConfig>
}

export function findConfigFile(): string | null {
  const configNames = ['autoglm.config.json', '.autoglmrc', 'autoglm.json']
  const cwd = process.cwd()

  for (const name of configNames) {
    const filePath = path.resolve(cwd, name)
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }

  return null
}

export function mergeConfig(
  fileConfig: Partial<AgentConfig> | undefined,
  envConfig: ReturnType<typeof loadEnvConfig>,
): AgentConfig {
  return {
    maxSteps: fileConfig?.maxSteps ?? envConfig.maxSteps ?? 100,
    lang: fileConfig?.lang ?? envConfig.lang ?? 'cn',
    baseUrl: fileConfig?.baseUrl ?? envConfig.baseUrl,
    apiKey: fileConfig?.apiKey ?? envConfig.apiKey,
    model: fileConfig?.model ?? envConfig.model,
    deviceId: fileConfig?.deviceId ?? envConfig.deviceId,
    systemPrompt: fileConfig?.systemPrompt,
    maxTokens: fileConfig?.maxTokens,
    temperature: fileConfig?.temperature,
    topP: fileConfig?.topP,
    frequencyPenalty: fileConfig?.frequencyPenalty,
  }
}

export function loadConfig(configPath?: string): AgentConfig {
  const envConfig = loadEnvConfig()

  if (configPath) {
    const fileConfig = loadConfigFile(configPath)
    return mergeConfig(fileConfig, envConfig)
  }

  const foundPath = findConfigFile()
  if (foundPath) {
    const fileConfig = loadConfigFile(foundPath)
    return mergeConfig(fileConfig, envConfig)
  }

  return mergeConfig(undefined, envConfig)
}

export function createAgentConfig(config: Partial<AgentConfig>): AgentConfig {
  const defaultConfig: AgentConfig = {
    maxSteps: 100,
    lang: 'cn',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
    apiKey: '',
    model: 'autoglm-phone',
  }

  return { ...defaultConfig, ...config }
}
