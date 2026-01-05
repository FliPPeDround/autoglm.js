import type { AgentContextValue } from '@/config/types'
import type { RoutePath } from '@/router/routes'
import { sleep } from '@autoglm.js/shared'
import { create } from 'zustand'
import { executeCommand } from '@/commands/commands'

interface UserInputState {
  query: string
  isCommand: boolean
  setQuery: (query: string) => void
  handleSubmit: (value: string, context: AgentContextValue, navigate: (path: RoutePath) => void) => void
  handleCommandSelect: (command: string, context: AgentContextValue) => void
}

function isCommandQuery(query: string): boolean {
  return query.startsWith('/')
}

export const useUserInputStore = create<UserInputState>((set) => {
  return {
    query: '',
    isCommand: false,

    setQuery: (query) => {
      set({
        query,
        isCommand: isCommandQuery(query),
      })
    },

    handleSubmit: async (value, context, navigate) => {
      set({ query: '' })
      if (isCommandQuery(value)) {
        return
      }
      if (value.trim() === '') {
        return
      }
      if (context.isRunning) {
        context.abort()
        await sleep(500)
      }
      context.run(value)
      navigate('/tasks')
    },

    handleCommandSelect: (command, context) => {
      set({ query: '', isCommand: false })
      executeCommand(command, context)
    },
  }
})
