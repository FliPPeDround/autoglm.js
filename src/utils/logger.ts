import type { EventType } from './events'
import { log } from '@clack/prompts'
import { bold, cyan } from 'kolorist'
import { getAgentConfig } from '@/config'
import { $t } from '@/locales'
import { emit } from './events'

type LoggerConfig = {
  [K in EventType]: {
    cli: (message: any) => void
    api: (message: any) => void
  }
}

const loggerConfig: LoggerConfig = {
  thinking: {
    cli: message => log.message(message),
    api: message => emit('thinking', message),
  },
  action: {
    cli: (message) => {
      log.step(`⚙️  ${bold($t('action'))}`)
      log.message(JSON.stringify(message, null, 2))
    },
    api: message => emit('action', message),
  },
  task_complete: {
    cli: (message) => {
      log.success(`🎉 ${bold($t('task_completed'))}`)
      log.message(cyan(`${message}`))
    },
    api: message => emit('task_complete', message),
  },
}

export function logger(type: EventType, message: any) {
  const mode = getAgentConfig().mode
  const config = loggerConfig[type]
  config[mode](message)
}
