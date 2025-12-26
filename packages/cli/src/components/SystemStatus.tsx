import { Box, Text } from 'ink'
import { useSystemCheck } from '@/hooks/useAutoGLM'

export default function SystemStatus() {
  const { systemCheck, apiCheck, isChecking } = useSystemCheck()

  const getStatusColor = (status: boolean | null) => {
    if (status === null)
      return 'yellow'
    return status ? 'green' : 'red'
  }

  const getStatusText = (status: boolean | null) => {
    if (status === null)
      return isChecking ? 'Checking...' : 'Unknown'
    return status ? 'OK' : 'Failed'
  }

  return (
    <Box marginBottom={1} gap={4}>
      <Box gap={1}>
        <Text color="gray">SYSTEM:</Text>
        <Text color={getStatusColor(systemCheck)} bold>
          {getStatusText(systemCheck)}
        </Text>
      </Box>
      <Box gap={1}>
        <Text color="gray">API:</Text>
        <Text color={getStatusColor(apiCheck)} bold>
          {getStatusText(apiCheck)}
        </Text>
      </Box>
    </Box>
  )
}
