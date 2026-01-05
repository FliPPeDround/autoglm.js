import type { ScrollListRef } from 'ink-scroll-list'
import type { CommandHandler } from '@/commands/commands'
import { Box, Text, useInput } from 'ink'
import { ScrollList } from 'ink-scroll-list'
import { useMemo, useRef, useState } from 'react'
import { getAllCommands } from '@/commands/commands'
import { useAgentContext } from '@/context/AgentContext'
import { useTranslation } from '@/locales'
import { useUserInputStore } from '@/store/userInputStore'

interface CommandMenuProps {
  query: string
  commands: CommandHandler[]
  onCommandSelect: (command: string) => void
}

export function CommandMenu({ query, commands, onCommandSelect }: CommandMenuProps) {
  const { t } = useTranslation()
  const listRef = useRef<ScrollListRef>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredCommands = useMemo(() => {
    const searchTerm = query.slice(1).toLowerCase()
    return commands
      .filter(cmd =>
        cmd.name.toLowerCase().includes(searchTerm),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [query, commands])

  useInput((_input, key) => {
    if (key.upArrow) {
      const newIndex = listRef.current?.selectPrevious() ?? 0
      setSelectedIndex(newIndex)
    }
    if (key.downArrow) {
      const newIndex = listRef.current?.selectNext() ?? 0
      setSelectedIndex(newIndex)
    }
    if (key.return) {
      const selectedCommand = filteredCommands[selectedIndex]?.name
      if (selectedCommand) {
        onCommandSelect(selectedCommand)
      }
    }
  })

  return (
    <Box height={10}>
      <ScrollList
        ref={listRef}
        selectedIndex={selectedIndex}
        onSelectionChange={setSelectedIndex}
      >
        {filteredCommands.map((cmd, i) => (
          <Box key={cmd.name} flexDirection="row">
            <Box width={20}>
              <Text
                color={i === selectedIndex ? 'cyan' : 'gray'}

              >
                {i === selectedIndex ? '> ' : '  '}
                {`/${cmd.name}`}
              </Text>
            </Box>
            <Box flexGrow={1}>
              <Text color={i === selectedIndex ? 'cyan' : 'gray'}>
                {t(cmd.description)}
              </Text>
            </Box>
          </Box>
        ))}
      </ScrollList>
    </Box>
  )
}

export function CommandMenuContainer() {
  const context = useAgentContext()

  const {
    query,
    handleCommandSelect,
    isCommand,
  } = useUserInputStore()

  if (!isCommand) {
    return null
  }

  return (
    <CommandMenu
      commands={getAllCommands()}
      query={query}
      onCommandSelect={command => handleCommandSelect(command, context)}
    />
  )
}
