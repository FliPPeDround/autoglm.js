import { Box, Text } from 'ink'
import { useDeviceInfo } from '@/hooks/useAutoGLM'
import SystemStatus from './SystemStatus'

export default function Info() {
  const { version, hasDevices, primaryDevice } = useDeviceInfo()

  return (
    <Box justifyContent="space-between">
      <Box gap={2}>
        {hasDevices && primaryDevice && (
          <Box gap={2}>
            <Box>
              <Text color="gray">DEVICE:</Text>
              <Text color="white" bold>
                {' '}
                {primaryDevice.model}
              </Text>
            </Box>
            <Box>
              <Text color="gray">TYPE:</Text>
              <Text color="white" bold>
                {' '}
                {primaryDevice.connectionType.toLocaleUpperCase()}
              </Text>
            </Box>
            <Box>
              <Text color="gray">deviceID:</Text>
              <Text color="white" bold>
                {' '}
                {primaryDevice.deviceId}
              </Text>
            </Box>
          </Box>
        )}

        <Box>
          <Text color="gray">ADB:</Text>
          <Text color="white" bold>
            {' '}
            {version}
          </Text>
        </Box>
      </Box>

      <SystemStatus />
    </Box>
  )
}
