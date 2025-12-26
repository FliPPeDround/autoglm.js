import type { AgentConfig } from '../../config/types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { $t } from '../../locales'

export function loadConfigFile(configPath: string): AgentConfig {
  let resolvedPath: string

  if (path.isAbsolute(configPath)) {
    resolvedPath = configPath
  }
  else {
    resolvedPath = path.resolve(process.cwd(), configPath)
  }

  if (!fs.existsSync(resolvedPath)) {
    throw new Error($t('config.errors.fileNotFound') + resolvedPath)
  }

  const ext = path.extname(resolvedPath).toLowerCase()
  if (ext !== '.json') {
    throw new Error($t('config.errors.invalidFormat') + ext)
  }

  try {
    const fileContent = fs.readFileSync(resolvedPath, 'utf-8')
    const config = JSON.parse(fileContent) as AgentConfig
    return config
  }
  catch (error) {
    throw new Error($t('config.errors.genericReadError') + (error instanceof Error ? error.message : String(error)))
  }
}
