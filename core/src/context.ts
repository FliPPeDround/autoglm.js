import type { Emitter } from 'mitt'
import type { AgentConfigStore, AgentConfigType } from './config'
import type { Translator } from './locales'
import type { MittEvents } from './utils/events'
import type { LoggerFn } from './utils/logger'
import type { SpinnerInstance } from './utils/spinner'
import { createAgentConfigStore, defaultAgentConfigStore } from './config'
import { createTranslator } from './locales'
import { createEmitter, emitter as defaultEmitter } from './utils/events'
import { createLogger, logger as defaultLogger } from './utils/logger'
import defaultSpinner, { createSpinner } from './utils/spinner'

export interface AgentContext {
  configStore: AgentConfigStore
  emitter: Emitter<MittEvents>
  logger: LoggerFn
  spinner: SpinnerInstance
  t: Translator
}

export function createAgentContext(config: Partial<AgentConfigType>): AgentContext {
  const configStore = createAgentConfigStore(config)
  const emitter = createEmitter()
  const t = createTranslator(configStore)
  const logger = createLogger(configStore, emitter, t)
  const spinner = createSpinner()

  return {
    configStore,
    emitter,
    logger,
    spinner,
    t,
  }
}

export const defaultAgentContext: AgentContext = {
  configStore: defaultAgentConfigStore,
  emitter: defaultEmitter,
  logger: defaultLogger,
  spinner: defaultSpinner,
  t: createTranslator(defaultAgentConfigStore),
}
