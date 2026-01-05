import { Box, Text } from 'ink'
import { useTranslation } from 'react-i18next'

export default function Welcome() {
  const { t } = useTranslation()

  return (
    <Box flexDirection="column" alignItems="center" marginBottom={4} marginTop={2}>

      {/* Main Action */}
      <Box marginBottom={3} flexDirection="column" alignItems="center">
        <Box marginBottom={1}>
          <Text color="white" bold>
            {t('welcome.enterTask')}
          </Text>
        </Box>
        <Text color="gray" dimColor>
          {t('welcome.example')}
        </Text>
      </Box>

      {/* Subtle Hints */}
      <Box flexDirection="column" alignItems="center" gap={1}>
        <Text color="gray" dimColor>
          {t('welcome.enter')}
          {' '}
          {t('welcome.pressEnter')}
        </Text>
        <Text color="gray" dimColor>
          {t('welcome.slash')}
          {' '}
          {t('welcome.typeSlash')}
        </Text>
      </Box>
    </Box>
  )
}
