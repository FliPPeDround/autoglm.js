import process from 'node:process'
import { Box } from 'ink'
import TextInput from 'ink-text-input'
import { useState } from 'react'
import Banner from './components/Banner'
import { CommandMenu } from './components/CommandMenu'
import { ErrorBoundary } from './components/ErrorBoundary'
import EventLog from './components/EventLog'
import Info from './components/Info'
import TaskStatus from './components/TaskStatus'
import { loadConfig } from './config'
import { AgentProvider } from './context/AgentContext'
import { useAutoGLM } from './hooks'

function handleCommand(command: string): boolean {
  switch (command) {
    case 'help':
      console.log('Help: Available commands: /help, /exit')
      return true
    case 'exit':
      process.exit(0)
      return true
    default:
      console.log(`Unknown command: /${command}`)
      return false
  }
}

function AppContent() {
  const [query, setQuery] = useState('')
  const { isRunning, currentTask, run } = useAutoGLM()

  const handleSubmit = async (value: string) => {
    setQuery('')
    if (value.startsWith('/')) {
      const command = value.slice(1)
      handleCommand(command)
    }
    else {
      await run(value)
    }
  }

  const handleCommandSelect = (command: string) => {
    setQuery('')
    handleCommand(command)
  }

  return (
    <Box marginRight={2} marginLeft={2} flexDirection="column">
      <Banner />
      <TaskStatus isRunning={isRunning} currentTask={currentTask} />
      <EventLog enableKeyboard={!query.startsWith('/')} />
      <Box borderStyle="round">
        <TextInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          placeholder="  Please input your task"
        />
      </Box>
      {query.startsWith('/') && (
        <CommandMenu query={query} onCommandSelect={handleCommandSelect} />
      )}
      <Info />
    </Box>
  )
}

function App() {
  let config
  try {
    config = loadConfig()
  }
  catch {
    config = {
      maxSteps: 100,
      lang: 'cn' as const,
      baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
      apiKey: '74fab98ebabd483a9fb88e311c14f61c.OIQrXM8thm8vSxo1',
      model: 'autoglm-phone',
    }
  }

  return (
    <ErrorBoundary>
      <AgentProvider config={config}>
        <AppContent />
      </AgentProvider>
    </ErrorBoundary>
  )
}

export default App
