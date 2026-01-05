import { join } from 'node:path'
import { AUTOGLM_FILEPATH } from 'autoglm.js'

export const APP_NAME = 'AutoGLM.js'

export const EVENT_TYPE_LABELS: Record<string, { label: string, color: string }> = {
  start: { label: 'START', color: 'cyan' },
  thinking: { label: 'THINKING', color: 'yellow' },
  action: { label: 'ACTION', color: 'blue' },
  task_complete: { label: 'COMPLETE', color: 'green' },
  error: { label: 'ERROR', color: 'red' },
  aborted: { label: 'ABORTED', color: 'magenta' },
}

export const DEFAULT_CONFIG = {
  maxSteps: 100,
  lang: 'cn' as const,
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
  apiKey: '',
  model: 'autoglm-phone',
  maxTokens: 2048,
  temperature: 0.5,
  topP: 0.5,
  frequencyPenalty: 0.5,
  screenshotQuality: 80,
}

export const AUTOGLM_CONFIG_FILEPATH = join(AUTOGLM_FILEPATH, 'config.json')
