import type { EventType } from 'autoglm.js'
import type { AgentEvent } from '@/config/types'
import { useCallback, useMemo, useState } from 'react'
import { EVENT_TYPE_LABELS } from '@/constants'
import { useAgentContext } from '@/context/AgentContext'

export function useEventLog() {
  const { events, isRunning, clearEvents } = useAgentContext()

  const formattedEvents = useMemo(() => {
    return events.map((event) => {
      const typeInfo = EVENT_TYPE_LABELS[event.type] ?? {
        label: event.type.toUpperCase(),
        color: 'white',
      }
      const data = formatEventData(event)

      return {
        type: event.type as EventType,
        label: typeInfo.label,
        color: typeInfo.color,
        data,
        time: event.time,
        deviceId: event.deviceId,
      }
    })
  }, [events])

  const latestEvent = useMemo(() => {
    if (events.length === 0)
      return null
    return formattedEvents[formattedEvents.length - 1]
  }, [events, formattedEvents])

  const hasEvents = events.length > 0 || isRunning

  const clear = useCallback(() => {
    clearEvents()
  }, [clearEvents])

  const eventCount = events.length

  return {
    events: formattedEvents,
    latestEvent,
    hasEvents,
    clear,
    eventCount,
  }
}

function formatEventData(event: AgentEvent): string {
  const data = (event.data as { message?: unknown })?.message ?? event.data

  if (typeof data === 'string') {
    return data.trim()
  }

  if (data && typeof data === 'object') {
    const typedData = data as Record<string, unknown>

    const formatters: Record<string, (value: unknown) => string> = {
      action: v => String(v),
      start: v => `: [${v}]`,
      end: v => ` -> [${v}]`,
      app: v => `: ${v}`,
      element: v => `: [${v}]`,
      text: v => `: ${v}`,
      duration: v => `: ${v}s`,
      result: v => String(v),
    }

    return Object.entries(formatters)
      .filter(([key]) => typedData[key] != null)
      .map(([key, format]) => format(typedData[key]))
      .join('')
  }

  try {
    return JSON.stringify(data)
  }
  catch {
    return String(data)
  }
}

export function useEventFilter() {
  const { events } = useAgentContext()
  const [filter, setFilter] = useState<string>('')

  const filteredEvents = useMemo(() => {
    if (!filter)
      return events

    const lowerFilter = filter.toLowerCase()
    return events.filter((event) => {
      const data = formatEventData(event)
      return event.type.toLowerCase().includes(lowerFilter)
        || data.toLowerCase().includes(lowerFilter)
    })
  }, [events, filter])

  const setSearchFilter = useCallback((query: string) => {
    setFilter(query)
  }, [])

  return {
    filter,
    setFilter: setSearchFilter,
    filteredEvents,
    hasFilter: filter.length > 0,
  }
}
