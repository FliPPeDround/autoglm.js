import type { DeviceInfo } from 'autoglm.js'
import type { ReactNode } from 'react'
import type { AgentContextValue, AgentEvent } from '@/config/types'
import { AutoGLM, EventType } from 'autoglm.js'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const AgentContext = createContext<AgentContextValue | null>(null)

export function useAgentContext(): AgentContextValue {
  const context = useContext(AgentContext)
  if (!context) {
    throw new Error('useAgentContext must be used within an AgentProvider')
  }
  return context
}

interface AgentProviderProps {
  children: ReactNode
  config: {
    maxSteps: number
    lang: 'cn' | 'en'
    baseUrl: string
    apiKey: string
    model: string
    deviceId?: string
  }
}

export function AgentProvider({ children, config }: AgentProviderProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentTask, setCurrentTask] = useState<string | null>(null)
  const [events, setEvents] = useState<AgentEvent[]>([])
  const [version, setVersion] = useState<string>('Loading...')
  const [devices, setDevices] = useState<DeviceInfo[]>([])
  const [systemCheck, setSystemCheck] = useState<boolean | null>(null)
  const [apiCheck, setApiCheck] = useState<boolean | null>(null)

  const agentRef = useRef<AutoGLM | null>(null)
  const cleanupRef = useRef<(() => void)[]>([])

  useEffect(() => {
    const agent = new AutoGLM({
      maxSteps: config.maxSteps,
      lang: config.lang,
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      model: config.model,
      deviceId: config.deviceId,
    })

    agentRef.current = agent

    const handleStart = (data: unknown) => {
      const message = (data as { message?: string })?.message ?? data
      setCurrentTask(String(message))
      setIsRunning(true)
    }

    const handleThinking = (data: unknown) => {
      const time = new Date().toLocaleTimeString()
      setEvents(prev => [...prev, { type: 'thinking', data, time }])
    }

    const handleAction = (data: unknown) => {
      const time = new Date().toLocaleTimeString()
      setEvents(prev => [...prev, { type: 'action', data, time }])
    }

    const handleTaskComplete = (data: unknown) => {
      const time = new Date().toLocaleTimeString()
      setIsRunning(false)
      setEvents(prev => [...prev, { type: 'task_complete', data, time }])
    }

    const handleError = (data: unknown) => {
      const time = new Date().toLocaleTimeString()
      setIsRunning(false)
      setEvents(prev => [...prev, { type: 'error', data, time }])
    }

    agent.on(EventType.START, handleStart)
    agent.on(EventType.THINKING, handleThinking)
    agent.on(EventType.ACTION, handleAction)
    agent.on(EventType.TASK_COMPLETE, handleTaskComplete)
    agent.on(EventType.ERROR, handleError)

    cleanupRef.current.push(() => {
      agent.off(EventType.START, handleStart)
      agent.off(EventType.THINKING, handleThinking)
      agent.off(EventType.ACTION, handleAction)
      agent.off(EventType.TASK_COMPLETE, handleTaskComplete)
      agent.off(EventType.ERROR, handleError)
    })

    const initializeAgent = async () => {
      try {
        const [versionInfo, deviceList] = await Promise.all([
          agent.adb.getVersion(),
          agent.adb.getConnectedDevices(),
        ])
        setVersion(versionInfo.success ? `v${versionInfo.version || 'Not Installed'}` : 'Not Installed')
        setDevices(deviceList)
      }
      catch {
        setVersion('Error')
        setDevices([])
      }
      try {
        const [systemResult, apiResult] = await Promise.all([
          agent.checkSystemRequirements(),
          agent.checkModelApi(),
        ])
        setSystemCheck(systemResult.success)
        setApiCheck(apiResult.success)
      }
      catch {
        setSystemCheck(false)
        setApiCheck(false)
      }
    }

    initializeAgent()

    return () => {
      cleanupRef.current.forEach(cleanup => cleanup())
      cleanupRef.current = []
    }
  }, [config])

  const run = useCallback(async (query: string) => {
    const agent = agentRef.current
    if (!agent) {
      throw new Error('Agent not initialized')
    }
    await agent.run(query)
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
    setCurrentTask(null)
  }, [])

  const clearEvents = useCallback(() => {
    setEvents([])
  }, [])

  const refreshDevices = useCallback(async () => {
    const agent = agentRef.current
    if (!agent)
      return
    try {
      const deviceList = await agent.adb.getConnectedDevices()
      setDevices(deviceList)
    }
    catch {
      setDevices([])
    }
  }, [])

  const checkSystem = useCallback(async () => {
    const agent = agentRef.current
    if (!agent) {
      setSystemCheck(false)
      return
    }
    try {
      const result = await agent.checkSystemRequirements()
      setSystemCheck(result.success)
    }
    catch {
      setSystemCheck(false)
    }
  }, [])

  const checkApi = useCallback(async () => {
    const agent = agentRef.current
    if (!agent) {
      setApiCheck(false)
      return
    }
    try {
      const result = await agent.checkModelApi()
      setApiCheck(result.success)
    }
    catch {
      setApiCheck(false)
    }
  }, [])

  const value: AgentContextValue = {
    isRunning,
    currentTask,
    events,
    version,
    devices,
    systemCheck,
    apiCheck,
    run,
    stop,
    clearEvents,
    refreshDevices,
    checkSystem,
    checkApi,
  }

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  )
}
