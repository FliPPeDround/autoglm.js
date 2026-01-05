import type { HelpContent as HelpContentType } from '../types/help'
import { Box, Text } from 'ink'
import { useTranslation } from 'react-i18next'

interface HelpContentProps {
  content: HelpContentType
}

function HelpSection({ title, items }: { title: string, items: any[] }) {
  const { t } = useTranslation()

  return (
    <Box flexDirection="column" marginBottom={2}>
      <Box marginBottom={1}>
        <Text color="blue" bold>
          {t(title)}
        </Text>
      </Box>
      {items.map((item, index) => (
        <Box key={index} flexDirection="row" marginBottom={1}>
          {item.step && (
            <Box width={4} marginRight={1}>
              <Text color="yellow" bold>
                {item.step}
                .
              </Text>
            </Box>
          )}
          <Box flexGrow={1}>
            <Text color={item.important ? 'yellow' : 'white'} bold={item.important}>
              {t(item.text)}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export function HelpContent({ content }: HelpContentProps) {
  const { t } = useTranslation()

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={2}>
        <Text color={content.titleColor || 'red'} bold>
          {t(content.title)}
        </Text>
        {content.errorCode && (
          <Text color="gray" dimColor>
            {t('Error Code:')}
            {' '}
            {content.errorCode}
          </Text>
        )}
      </Box>

      {content.sections.map((section, index) => (
        <HelpSection key={index} title={section.title} items={section.items} />
      ))}

      {content.footer && (
        <Box marginTop={2}>
          <Text color={content.footer.color || 'green'} bold>
            {t(content.footer.text)}
          </Text>
        </Box>
      )}
    </Box>
  )
}
