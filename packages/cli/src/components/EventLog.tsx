import type { ScrollViewRef } from 'ink-scroll-view'
import { Box, Text, useInput, useStdout } from 'ink'
import { ScrollView } from 'ink-scroll-view'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useEventLog } from '@/hooks/useEventLog'
import { useUserInputStore } from '@/store/userInputStore'

export function EventList() {
  const scrollRef = useRef<ScrollViewRef>(null)
  const { stdout } = useStdout()
  const { events } = useEventLog()
  const { isCommand } = useUserInputStore()

  const [isAtBottom, setIsAtBottom] = useState(true)
  const userScrolledUp = useRef(false)

  // Handle terminal resize to remeasure scroll dimensions
  useEffect(() => {
    const handleResize = () => scrollRef.current?.remeasure()
    stdout?.on('resize', handleResize)
    return () => {
      stdout?.off('resize', handleResize)
    }
  }, [stdout])

  // Check if scroll view is at bottom and update state
  const checkAndUpdateBottom = useCallback(() => {
    if (!scrollRef.current)
      return true

    const atBottom = scrollRef.current.getScrollOffset() >= scrollRef.current.getBottomOffset() - 1
    setIsAtBottom(atBottom)

    return atBottom
  }, [])

  useInput((_input, key) => {
    if (!scrollRef.current)
      return

    // Scroll up - disable auto-follow
    if (key.upArrow) {
      scrollRef.current.scrollBy(-1)
      userScrolledUp.current = !checkAndUpdateBottom()
      return
    }

    // Scroll down - re-enable auto-follow if at bottom
    if (key.downArrow) {
      scrollRef.current.scrollBy(1)
      if (checkAndUpdateBottom())
        userScrolledUp.current = false
      return
    }

    // Page up - disable auto-follow
    if (key.pageUp) {
      const height = scrollRef.current.getViewportHeight() || 1
      scrollRef.current.scrollBy(-height)
      userScrolledUp.current = !checkAndUpdateBottom()
      return
    }

    // Page down - re-enable auto-follow if at bottom
    if (key.pageDown) {
      const height = scrollRef.current.getViewportHeight() || 1
      scrollRef.current.scrollBy(height)
      if (checkAndUpdateBottom())
        userScrolledUp.current = false
    }
  }, { isActive: !isCommand })

  // Auto-scroll on new events (smart follow: only if at bottom or user hasn't scrolled up)
  useEffect(() => {
    if (events.length === 0)
      return

    const lastEvent = events[events.length - 1]

    // Always scroll to bottom on task completion or error
    if (lastEvent.type === 'task_complete' || lastEvent.type === 'error') {
      scrollRef.current?.scrollToBottom()
      setIsAtBottom(true)
      userScrolledUp.current = false
    }
    // Otherwise, only auto-scroll if user hasn't scrolled up
    else if (isAtBottom || !userScrolledUp.current) {
      scrollRef.current?.scrollToBottom()
      setIsAtBottom(true)
    }
  }, [events, isAtBottom])

  return (
    <Box marginBottom={1} flexDirection="column">
      <Box marginBottom={1} justifyContent="space-between">
        <Text color="gray" bold>ACTIVITY:</Text>
        <Text color="gray" dimColor>↑↓ Scroll | PgUp/PgDn Page</Text>
      </Box>
      <Box
        height={20}
        width="100%"
      >
        <ScrollView ref={scrollRef}>
          {events.map((event, index) => (
            <Box key={index} justifyContent="space-between" width="100%" marginBottom={1} alignItems="flex-start">
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
