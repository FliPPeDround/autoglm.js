export interface AgentConfigType {
  mode: 'cli' | 'api'
  maxSteps: number
  lang: 'cn' | 'en'
  deviceId?: string
  systemPrompt?: string
  // ModelConfigType
  baseUrl: string
  apiKey: string
  model: string
  maxTokens: number
  temperature: number
  topP: number
  frequencyPenalty: number
}
