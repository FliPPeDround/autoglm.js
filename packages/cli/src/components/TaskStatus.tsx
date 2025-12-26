import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'

interface TaskStatusProps {
  isRunning: boolean
  currentTask: string | null
}

export default function TaskStatus({ isRunning, currentTask }: TaskStatusProps) {
  if (!isRunning && !currentTask) {
    return null
  }

  return (
    <Box marginBottom={1} flexDirection="column">
      <Box gap={2}>
        <Box width={8}>
          <Text color="gray">STATUS:</Text>
        </Box>
        <Text color={isRunning ? 'cyan' : 'green'} bold>
          {isRunning ? 'RUNNING' : 'IDLE'}
          {isRunning && <Spinner type="dots" />}
        </Text>
      </Box>
      {currentTask && (
        <Box gap={2}>
          <Box width={8}>
            <Text color="gray">TASK:</Text>
          </Box>
          <Text color="white">{currentTask}</Text>
        </Box>
      )}
    </Box>
  )
}
