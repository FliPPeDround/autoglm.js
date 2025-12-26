import type { DeviceInfo, EventType } from 'autoglm.js'

export interface AgentConfig {
  maxSteps: number
  lang: 'cn' | 'en'
  baseUrl: string
  apiKey: string
  model: string
  deviceId?: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
  topP?: number
  frequencyPenalty?: number
}

export interface AgentEvent {
  type: string
  data: unknown
  time: string
}

export type EventCallback = (data: unknown) => void

export interface AgentState {
  isRunning: boolean
  currentTask: string | null
  events: AgentEvent[]
  version: string
  devices: DeviceInfo[]
  systemCheck: boolean | null
  apiCheck: boolean | null
}

export interface AgentActions {
  run: (query: string) => Promise<void>
  stop: () => void
  clearEvents: () => void
  refreshDevices: () => Promise<void>
  checkSystem: () => Promise<void>
  checkApi: () => Promise<void>
}

export type AgentContextValue = AgentState & AgentActions

export type Locale = 'cn' | 'en'

export interface LocaleMessages {
  [key: string]: string | LocaleMessages
}

export interface CommandInfo {
  name: string
  description: string
  execute: () => void
}

export type EventHandlerMap = {
  [K in EventType]: EventCallback
}
