import { join } from 'node:path'
import { AUTOGLM_FILEPATH } from 'autoglm.js'
import { Box, Text } from 'ink'
import { useTranslation } from 'react-i18next'
import { useAgentContext } from '@/context/AgentContext'

interface ConfigSectionProps {
  title: string
  children: React.ReactNode
}

function ConfigSection({ title, children }: ConfigSectionProps) {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box marginBottom={1}>
        <Text color="blue" bold>
          {title}
        </Text>
      </Box>
      {children}
    </Box>
  )
}

interface ConfigItemProps {
  label: string
  value: string | number | undefined
  description?: string
  color?: string
  important?: boolean
}

function ConfigItem({ label, value, description, color = 'white', important = false }: ConfigItemProps) {
  return (
    <Box flexDirection="row" marginBottom={1}>
      {/* Label column */}
      <Box width={22}>
        <Text color={important ? 'yellow' : 'cyan'} bold={important}>
          {label}
          :
        </Text>
      </Box>

      {/* Value column */}
      <Box width={44} marginRight={2}>
        <Text color={color} bold={important}>
          {value ?? 'N/A'}
        </Text>
      </Box>

      {/* Description column */}
      <Box flexGrow={1}>
        <Text color="gray" dimColor>
          {description}
        </Text>
      </Box>
    </Box>
  )
}

interface ConfigField {
  key: string
  labelKey: string
  descriptionKey: string
  important?: boolean
  getValue: (config: any) => string | number | undefined
}

const configFields: Record<string, ConfigField[]> = {
  api: [
    {
      key: 'baseUrl',
      labelKey: 'baseUrl',
      descriptionKey: 'baseUrlDesc',
      important: true,
      getValue: config => config.baseUrl,
    },
    {
      key: 'apiKey',
      labelKey: 'apiKey',
      descriptionKey: 'apiKeyDesc',
      important: true,
      getValue: config => config.apiKey ? `${config.apiKey.slice(0, 10)}*****${config.apiKey.slice(-10)}` : 'Not Set',
    },
    {
      key: 'model',
      labelKey: 'model',
      descriptionKey: 'modelDesc',
      important: true,
      getValue: config => config.model,
    },
  ],
  generation: [
    {
      key: 'maxTokens',
      labelKey: 'maxTokens',
      descriptionKey: 'maxTokensDesc',
      getValue: config => config.maxTokens,
    },
    {
      key: 'temperature',
      labelKey: 'temperature',
      descriptionKey: 'temperatureDesc',
      getValue: config => config.temperature,
    },
    {
      key: 'topP',
      labelKey: 'topP',
      descriptionKey: 'topPDesc',
      getValue: config => config.topP,
    },
    {
      key: 'frequencyPenalty',
      labelKey: 'frequencyPenalty',
      descriptionKey: 'frequencyPenaltyDesc',
      getValue: config => config.frequencyPenalty,
    },
  ],
  system: [
    {
      key: 'deviceId',
      labelKey: 'deviceId',
      descriptionKey: 'deviceIdDesc',
      getValue: config => config.deviceId,
    },
    {
      key: 'maxSteps',
      labelKey: 'maxSteps',
      descriptionKey: 'maxStepsDesc',
      getValue: config => config.maxSteps,
    },
    {
      key: 'lang',
      labelKey: 'lang',
      descriptionKey: 'langDesc',
      getValue: config => config.lang,
    },
    {
      key: 'screenshotQuality',
      labelKey: 'screenshotQuality',
      descriptionKey: 'screenshotQualityDesc',
      getValue: config => config.screenshotQuality,
    },
  ],
}

export default function Config() {
  const { getConfig } = useAgentContext()
  const { t } = useTranslation()

  const sectionTitles: Record<string, string> = {
    api: t('config.apiSettings'),
    generation: t('config.generationParameters'),
    system: t('config.systemSettings'),
  }
  const config = getConfig()

  const getFieldLabel = (key: string) => t(`config.${key}`)
  const getFieldDescription = (key: string) => t(`config.${key}`)

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* API Settings */}
      <ConfigSection title={sectionTitles.api}>
        {configFields.api.map(field => (
          <ConfigItem
            key={field.key}
            label={getFieldLabel(field.labelKey)}
            value={field.getValue(config)}
            description={getFieldDescription(field.descriptionKey)}
            important={field.important}
          />
        ))}
      </ConfigSection>

      {/* Generation Parameters */}
      <ConfigSection title={sectionTitles.generation}>
        {configFields.generation.map(field => (
          <ConfigItem
            key={field.key}
            label={getFieldLabel(field.labelKey)}
            value={field.getValue(config)}
            description={getFieldDescription(field.descriptionKey)}
            important={field.important}
          />
        ))}
      </ConfigSection>

      {/* System Settings */}
      <ConfigSection title={sectionTitles.system}>
        {configFields.system.map(field => (
          <ConfigItem
            key={field.key}
            label={getFieldLabel(field.labelKey)}
            value={field.getValue(config)}
            description={getFieldDescription(field.descriptionKey)}
            important={field.important}
          />
        ))}
      </ConfigSection>

      {config.systemPrompt && (
        <ConfigSection title={t('config.systemPrompt')}>
          <Box marginBottom={1}>
            <Text color="white">
              {config.systemPrompt.length > 80
                ? `${config.systemPrompt.slice(0, 80)}...`
                : config.systemPrompt}
            </Text>
          </Box>
          <Box>
            <Text color="gray" dimColor>
              {t('systemPrompt.description')}
            </Text>
          </Box>
        </ConfigSection>
      )}

      <Box marginBottom={1}>
        <Text color="white" bold>
          {t('configTip.title')}
          :
          {' '}
        </Text>
        <Text color="gray" dimColor>
          {t('configTip.createConfigFile')}
          {' '}
          {join(AUTOGLM_FILEPATH, 'config.json')}
        </Text>
      </Box>
    </Box>
  )
}
