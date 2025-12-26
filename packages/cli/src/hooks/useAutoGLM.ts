import { useCallback, useState } from 'react'
import { useAgentContext } from '@/context/AgentContext'

export function useAutoGLM() {
  const context = useAgentContext()
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const run = useCallback(async (query: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await context.run(query)
    }
    catch (e) {
      const error = e instanceof Error ? e : new Error(String(e))
      setError(error)
      throw error
    }
    finally {
      setIsLoading(false)
    }
  }, [context.run])

  const stop = useCallback(() => {
    context.stop()
  }, [context.stop])

  const clearEvents = useCallback(() => {
    context.clearEvents()
  }, [context.clearEvents])

  return {
    ...context,
    error,
    isLoading,
    run,
    stop,
    clearEvents,
  }
}

export function useDeviceInfo() {
  const { devices, version, refreshDevices } = useAgentContext()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await refreshDevices()
    }
    finally {
      setIsRefreshing(false)
    }
  }, [refreshDevices])

  return {
    devices,
    version,
    isRefreshing,
    refresh,
    hasDevices: devices.length > 0,
    primaryDevice: devices[0] ?? null,
  }
}

export function useSystemCheck() {
  const { systemCheck, apiCheck, checkSystem, checkApi } = useAgentContext()
  const [isChecking, setIsChecking] = useState(false)

  const runChecks = useCallback(async () => {
    setIsChecking(true)
    try {
      await Promise.all([checkSystem(), checkApi()])
    }
    finally {
      setIsChecking(false)
    }
  }, [checkSystem, checkApi])

  return {
    systemCheck,
    apiCheck,
    isChecking,
    runChecks,
    isSystemReady: systemCheck === true,
    isApiReady: apiCheck === true,
  }
}
