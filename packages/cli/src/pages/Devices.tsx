import type { ScrollListRef } from 'ink-scroll-list'
import { Box, Text, useInput } from 'ink'
import { ScrollList } from 'ink-scroll-list'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAgentContext } from '@/context/AgentContext'
import { useDeviceInfo } from '@/hooks/useAutoGLM'
import { useUserInputStore } from '@/store/userInputStore'

interface DeviceItemProps {
  device: any
  isSelected: boolean
  isCurrentDevice: boolean
}

function DeviceItem({ device, isSelected, isCurrentDevice }: DeviceItemProps) {
  const { t } = useTranslation()
  const statusColor = device.status === 'device' ? 'green' : device.status === 'unauthorized' ? 'yellow' : 'red'
  const statusText = device.status === 'device'
    ? t('devices.online')
    : device.status === 'unauthorized'
      ? t('devices.unauthorized')
      : t('devices.offline')

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box flexDirection="row">
        <Box width={4}>
          <Text color={isSelected ? 'cyan' : 'gray'}>
            {isSelected ? '> ' : '  '}
          </Text>
        </Box>
        <Box width={50}>
          <Text color={isSelected ? 'cyan' : 'white'} bold={isSelected}>
            {device.model || device.deviceId}
          </Text>
          {isCurrentDevice && (
            <Text color="green" bold>
              {' '}
              (
              {t('devices.current')}
              )
            </Text>
          )}
        </Box>
        <Box width={12}>
          <Text color={statusColor}>
            {statusText}
          </Text>
        </Box>
      </Box>
      {isSelected && (
        <Box flexDirection="column" marginLeft={6}>
          <Box flexDirection="row">
            <Box width={15}>
              <Text color="gray">
                {t('devices.deviceId')}
                :
              </Text>
            </Box>
            <Box>
              <Text color="white">{device.deviceId}</Text>
            </Box>
          </Box>
          <Box flexDirection="row">
            <Box width={15}>
              <Text color="gray">
                {t('devices.connection')}
                :
              </Text>
            </Box>
            <Box>
              <Text color="white">{device.connectionType.toUpperCase()}</Text>
            </Box>
          </Box>
          {device.brand && (
            <Box flexDirection="row">
              <Box width={15}>
                <Text color="gray">
                  {t('devices.brand')}
                  :
                </Text>
              </Box>
              <Box>
                <Text color="white">{device.brand}</Text>
              </Box>
            </Box>
          )}
          {device.androidVersion && (
            <Box flexDirection="row">
              <Box width={15}>
                <Text color="gray">
                  {t('devices.android')}
                  :
                </Text>
              </Box>
              <Box>
                <Text color="white">
                  {device.androidVersion}
                  {' '}
                  (
                  {t('devices.api')}
                  {' '}
                  {device.apiLevel}
                  )
                </Text>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default function Devices() {
  const { updateConfig, getConfig, abort } = useAgentContext()
  const { devices, isRefreshing, refresh } = useDeviceInfo()
  const listRef = useRef<ScrollListRef>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { isCommand } = useUserInputStore()
  const { t } = useTranslation()

  const currentConfig = getConfig()
  const currentDeviceId = currentConfig.deviceId

  const sortedDevices = useMemo(() => {
    return [...devices].sort((a, b) => {
      return a.deviceId.localeCompare(b.deviceId)
    })
  }, [devices, currentDeviceId])

  const selectDevice = useCallback((index: number) => {
    const device = sortedDevices[index]
    if (device && device.deviceId !== currentDeviceId) {
      abort()
      updateConfig({ deviceId: device.deviceId })
    }
  }, [sortedDevices, currentDeviceId, updateConfig, abort])

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
      selectDevice(selectedIndex)
    }
    if (key.ctrl && _input === 'r') {
      refresh()
    }
  }, { isActive: !isCommand })

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text color="blue" bold>
          {t('devices.title')}
        </Text>
      </Box>

      {sortedDevices.length === 0
        ? (
            <Box flexDirection="column">
              <Box marginBottom={1}>
                <Text color="yellow">{t('devices.noDevices')}</Text>
              </Box>
              <Box marginBottom={1}>
                <Text color="gray">{t('devices.refreshHint')}</Text>
              </Box>
            </Box>
          )
        : (
            <Box flexDirection="column">
              <Box flexDirection="row" marginBottom={1}>
                <Box width={4} />
                <Box width={50}>
                  <Text color="gray" bold>
                    {t('devices.device')}
                  </Text>
                </Box>
                <Box width={12}>
                  <Text color="gray" bold>
                    {t('devices.status')}
                  </Text>
                </Box>
              </Box>

              <ScrollList
                ref={listRef}
                selectedIndex={selectedIndex}
                onSelectionChange={setSelectedIndex}
              >
                {sortedDevices.map((device, index) => (
                  <DeviceItem
                    key={device.deviceId}
                    device={device}
                    isSelected={index === selectedIndex}
                    isCurrentDevice={device.deviceId === currentDeviceId}
                  />
                ))}
              </ScrollList>

              <Box marginTop={1}>
                <Text color="gray">
                  {t('devices.navigateHint')}
                </Text>
              </Box>
            </Box>
          )}

      {isRefreshing && (
        <Box marginTop={1}>
          <Text color="cyan">{t('devices.refreshing')}</Text>
        </Box>
      )}
    </Box>
  )
}
