import type { Emitter } from 'mitt'
import type { EventType, MittEvents } from './events'
import type { AgentConfigStore } from '@/config'
import type { Translator } from '@/locales'
import { log } from '@clack/prompts'
import { bold, cyan } from 'kolorist'
import { defaultAgentConfigStore, getAgentConfig } from '@/config'
import { createTranslator } from '@/locales'
import { emitter as defaultEmitter, emit } from './events'

type LoggerConfig = {
  [K in EventType]: {
    cli: (message: any) => void
    api: (message: any) => void
  }
}

function loggerConfig(targetEmitter: Emitter<MittEvents>, t: Translator): LoggerConfig {
  return {
    thinking: {
      cli: message => log.message(message),
      api: message => emit('thinking', message, targetEmitter),
    },
    action: {
      cli: (message) => {
        log.step(`⚙️  ${bold(t('action'))}`)
        log.message(JSON.stringify(message, null, 2))
      },
      api: message => emit('action', message, targetEmitter),
    },
    task_complete: {
      cli: (message) => {
        log.success(`🎉 ${bold(t('task_completed'))}`)
        log.message(cyan(`${message}`))
      },
      api: message => emit('task_complete', message, targetEmitter),
    },
  }
}

export type LoggerFn = (type: EventType, message: any) => void

export function createLogger(
  store: AgentConfigStore = defaultAgentConfigStore,
  targetEmitter: Emitter<MittEvents> = defaultEmitter,
  t: Translator = createTranslator(store),
): LoggerFn {
  const config = loggerConfig(targetEmitter, t)
  return (type: EventType, message: any) => {
    const mode = getAgentConfig(store).mode
    config[type][mode](message)
  }
}

export const logger = createLogger()
