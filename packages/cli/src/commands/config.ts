import type { AgentContextValue } from '@/config/types'
import process from 'node:process'

export interface CommandHandler {
  name: string
  description: string
  execute: (context: AgentContextValue) => Promise<void> | void
}

export const commands: CommandHandler[] = [
  {
    name: 'exit',
    description: 'commands.exit',
    execute: () => {
      process.exit(0)
    },
  },
  {
    name: 'home',
    description: 'commands.home',
    execute: (context) => {
      context.navigate('/')
    },
  },
  {
    name: 'tasks',
    description: 'commands.tasks',
    execute: (context) => {
      context.navigate('/tasks')
    },
  },
  {
    name: 'config',
    description: 'commands.config',
    execute: (context) => {
      context.navigate('/config')
    },
  },
  {
    name: 'devices',
    description: 'commands.devices',
    execute: (context) => {
      context.navigate('/devices')
    },
  },
  {
    name: 'abort',
    description: 'commands.abort',
    execute: (context) => {
      context.abort('User aborted the task')
    },
  },
]
