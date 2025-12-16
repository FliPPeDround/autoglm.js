import type { AgentConfigType } from '@/config/types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { $t } from '@/locales'

/**
 * 加载并解析配置文件
 */
export function loadConfigFile(configPath: string): AgentConfigType {
  let resolvedPath: string

  // 解析配置文件路径
  if (path.isAbsolute(configPath)) {
    resolvedPath = configPath
  }
  else {
    resolvedPath = path.resolve(process.cwd(), configPath)
  }

  // 检查文件是否存在
  if (!fs.existsSync(resolvedPath)) {
    throw new Error($t('config.errors.fileNotFound') + resolvedPath)
  }

  // 检查文件扩展名
  const ext = path.extname(resolvedPath).toLowerCase()
  if (ext !== '.json') {
    throw new Error($t('config.errors.invalidFormat') + ext)
  }

  try {
    // 读取文件内容
    const fileContent = fs.readFileSync(resolvedPath, 'utf-8')

    // 解析 JSON
    const config = JSON.parse(fileContent) as AgentConfigType

    return config
  }
  catch (error) {
    throw new Error($t('config.errors.genericReadError') + (error instanceof Error ? error.message : String(error)))
  }
}
