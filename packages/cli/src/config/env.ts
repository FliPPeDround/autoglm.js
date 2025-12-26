import process from 'node:process'

export function getEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] ?? defaultValue
}

export function getEnvNumber(key: string, defaultValue?: number): number | undefined {
  const value = process.env[key]
  if (value === undefined)
    return defaultValue
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? defaultValue : parsed
}

export function getEnvBoolean(key: string, defaultValue?: boolean): boolean | undefined {
  const value = process.env[key]
  if (value === undefined)
    return defaultValue
  return value.toLowerCase() === 'true' || value === '1'
}

export const ENV_KEYS = {
  API_KEY: 'AUTOGLM_API_KEY',
  BASE_URL: 'AUTOGLM_BASE_URL',
  MODEL: 'AUTOGLM_MODEL',
  MAX_STEPS: 'AUTOGLM_MAX_STEPS',
  LANGUAGE: 'AUTOGLM_LANGUAGE',
  DEVICE_ID: 'AUTOGLM_DEVICE_ID',
} as const

export function loadEnvConfig(): {
  apiKey: string
  baseUrl: string
  model: string
  maxSteps: number
  lang: 'cn' | 'en'
  deviceId?: string
} {
  const apiKey = getEnv(ENV_KEYS.API_KEY)
  const baseUrl = getEnv(ENV_KEYS.BASE_URL)
  const model = getEnv(ENV_KEYS.MODEL)
  const maxSteps = getEnvNumber(ENV_KEYS.MAX_STEPS, 100)
  const lang = getEnv(ENV_KEYS.LANGUAGE) as 'cn' | 'en' | undefined
  const deviceId = getEnv(ENV_KEYS.DEVICE_ID)

  if (!apiKey) {
    throw new Error(`Missing required environment variable: ${ENV_KEYS.API_KEY}`)
  }
  if (!baseUrl) {
    throw new Error(`Missing required environment variable: ${ENV_KEYS.BASE_URL}`)
  }
  if (!model) {
    throw new Error(`Missing required environment variable: ${ENV_KEYS.MODEL}`)
  }

  return {
    apiKey,
    baseUrl,
    model,
    maxSteps: maxSteps ?? 100,
    lang: lang ?? 'cn',
    deviceId,
  }
}
