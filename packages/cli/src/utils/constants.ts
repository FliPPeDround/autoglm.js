export const APP_NAME = 'AutoGLM.js'

export const EVENT_TYPE_LABELS: Record<string, { label: string, color: string }> = {
  start: { label: 'START', color: 'cyan' },
  thinking: { label: 'THINKING', color: 'yellow' },
  action: { label: 'ACTION', color: 'blue' },
  task_complete: { label: 'COMPLETE', color: 'green' },
  error: { label: 'ERROR', color: 'red' },
}

export const DEFAULT_CONFIG = {
  maxSteps: 100,
  lang: 'cn' as const,
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
  model: 'autoglm-phone',
}

export const COMMAND_LIST = [
  { name: 'help', description: 'Show help' },
  { name: 'exit', description: 'Exit the program' },
] as const

export const SCROLL_VIEW_HEIGHT = 20

export const EVENT_LIMIT = 1000

export const LOCAL_STORAGE_KEYS = {
  LAST_CONFIG: 'autoglm_last_config',
  LOCALE: 'autoglm_locale',
} as const
