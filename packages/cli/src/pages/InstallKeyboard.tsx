import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import { useTranslation } from 'react-i18next'

export default function InstallKeyboard() {
  // const navigate = useNavigate()
  const { t } = useTranslation()

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigate('/')
  //   }, 3000)
  //   return () => clearTimeout(timer)
  // }, [navigate])

  return (
    <Box flexDirection="column" alignItems="center" paddingY={2}>
      <Box marginBottom={2} gap={2} alignItems="center">
        <Spinner type="dots" />
        <Text color="cyan" bold>
          {t('installKeyboard.title')}
        </Text>
      </Box>

      <Box flexDirection="column" marginBottom={2} width={60}>
        <Text color="gray">
          {t('installKeyboard.description')}
        </Text>
      </Box>

      <Box flexDirection="column" width={60}>
        <Text color="yellow">
          {t('installKeyboard.confirmPrompt')}
        </Text>
        <Text color="gray" dimColor>
          {t('installKeyboard.confirmHint')}
        </Text>
      </Box>

      <Box marginTop={3} flexDirection="column" width={60}>
        <Text color="gray" dimColor>
          {t('installKeyboard.manualInstall.hint')}
        </Text>
        <Text color="blue">
          {t('installKeyboard.manualInstall.link')}
        </Text>
        <Text color="gray" dimColor>
          {t('installKeyboard.manualInstall.instruction')}
        </Text>
      </Box>
    </Box>
  )
}
