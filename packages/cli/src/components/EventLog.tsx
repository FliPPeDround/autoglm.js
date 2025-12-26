import type { ScrollViewRef } from 'ink-scroll-view'
import { Box, Text, useInput, useStdout } from 'ink'
import { ScrollView } from 'ink-scroll-view'
import { useEffect, useRef } from 'react'
import { useEventLog } from '@/hooks'
import { SCROLL_VIEW_HEIGHT } from '@/utils/constants'

interface FormattedEvent {
  id: string
  type: string
  label: string
  color: string
  data: string
  time: string
}

function EmptyState() {
  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" height={20}>
      <Box marginBottom={1}>
        <Text color="cyan" bold>Welcome to AutoGLM.js</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="white">Enter your task below to get started</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="gray" dimColor>Example: "Open the browser"</Text>
      </Box>
      <Box>
        <Text color="gray" dimColor>Press Enter to submit your task</Text>
      </Box>
    </Box>
  )
}

function EventList({ events, enableKeyboard = true }: { events: FormattedEvent[], enableKeyboard?: boolean }) {
  const scrollRef = useRef<ScrollViewRef>(null)
  const { stdout } = useStdout()

  useEffect(() => {
    const handleResize = () => scrollRef.current?.remeasure()
    stdout?.on('resize', handleResize)
    return () => {
      stdout?.off('resize', handleResize)
    }
  }, [stdout])

  useInput((_input, key) => {
    if (!enableKeyboard || !scrollRef.current)
      return
    if (key.upArrow) {
      scrollRef.current.scrollBy(-1)
    }
    if (key.downArrow) {
      scrollRef.current.scrollBy(1)
    }
    if (key.pageUp) {
      const height = scrollRef.current.getViewportHeight() || 1
      scrollRef.current.scrollBy(-height)
    }
    if (key.pageDown) {
      const height = scrollRef.current.getViewportHeight() || 1
      scrollRef.current.scrollBy(height)
    }
  }, { isActive: enableKeyboard })

  useEffect(() => {
    if (events.length > 0) {
      const lastEvent = events[events.length - 1]
      if (lastEvent.type === 'task_complete' || lastEvent.type === 'error') {
        scrollRef.current?.scrollToBottom()
      }
    }
  }, [events])

  return (
    <Box marginBottom={1} flexDirection="column">
      <Box marginBottom={1} justifyContent="space-between">
        <Text color="gray" bold>ACTIVITY:</Text>
        <Text color="gray" dimColor>↑↓ Scroll | PgUp/PgDn Page</Text>
      </Box>
      <Box
        height={SCROLL_VIEW_HEIGHT}
        width="100%"
      >
        <ScrollView ref={scrollRef}>
          {events.map(event => (
            <Box key={event.id} justifyContent="space-between" width="100%" marginBottom={1} alignItems="flex-start">
              <Box flexDirection="row">
                <Box width={13}>
                  <Text color={event.color} bold>
                    {`[${event.label}]`}
                  </Text>
                </Box>
                <Box>
                  <Text color="white">
                    {event.data.trim()}
                  </Text>
                </Box>
              </Box>
              <Box width={16} justifyContent="flex-end">
                <Text color="gray" dimColor>
                  {event.time}
                </Text>
              </Box>
            </Box>
          ))}
        </ScrollView>
      </Box>

    </Box>
  )
}

export default function EventLog({ enableKeyboard = true }: { enableKeyboard?: boolean }) {
  const { hasEvents, events } = useEventLog()

  if (!hasEvents) {
    return <EmptyState />
  }

  return <EventList events={events} enableKeyboard={enableKeyboard} />
}
