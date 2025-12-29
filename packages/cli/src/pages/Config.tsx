import { join } from 'node:path'
import { AUTOGLM_FILEPATH } from 'autoglm.js'
import { Box, Text } from 'ink'
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
  label: string
  description: string
  important?: boolean
  getValue: (config: any) => string | number | undefined
}

const configFields: Record<string, ConfigField[]> = {
  api: [
    {
      key: 'baseUrl',
      label: 'Base URL',
      description: 'Base URL for API service',
      important: true,
      getValue: config => config.baseUrl,
    },
    {
      key: 'apiKey',
      label: 'API Key',
      description: 'API key for authentication',
      important: true,
      getValue: config => config.apiKey ? `${config.apiKey.slice(0, 10)}*****${config.apiKey.slice(-10)}` : 'Not Set',
    },
    {
      key: 'model',
      label: 'Model',
      description: 'AI model name to use',
      important: true,
      getValue: config => config.model,
    },
  ],
  generation: [
    {
      key: 'maxTokens',
      label: 'Max Tokens',
      description: 'Maximum length of generated text',
      getValue: config => config.maxTokens,
    },
    {
      key: 'temperature',
      label: 'Temperature',
      description: 'Controls randomness of generated text (0-1)',
      getValue: config => config.temperature,
    },
    {
      key: 'topP',
      label: 'Top P',
      description: 'Nucleus sampling parameter for vocabulary selection',
      getValue: config => config.topP,
    },
    {
      key: 'frequencyPenalty',
      label: 'Frequency Penalty',
      description: 'Reduces repetition of words',
      getValue: config => config.frequencyPenalty,
    },
  ],
  system: [
    {
      key: 'deviceId',
      label: 'Device ID',
      description: 'Unique device identifier',
      getValue: config => config.deviceId,
    },
    {
      key: 'maxSteps',
      label: 'Max Steps',
      description: 'Maximum execution steps',
      getValue: config => config.maxSteps,
    },
    {
      key: 'lang',
      label: 'Language',
      description: 'Interface display language',
      getValue: config => config.lang,
    },
    {
      key: 'screenshotQuality',
      label: 'Screenshot Quality',
      description: 'Quality of screenshots (1-100)',
      getValue: config => config.screenshotQuality,
    },
  ],
}

export default function Config() {
  const { getConfig } = useAgentContext()

  const sectionTitles: Record<string, string> = {
    api: 'API Settings',
    generation: 'Generation Parameters',
    system: 'System Settings',
  }
  const config = getConfig()

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* API Settings */}
      <ConfigSection title={sectionTitles.api}>
        {configFields.api.map(field => (
          <ConfigItem
            key={field.key}
            label={field.label}
            value={field.getValue(config)}
            description={field.description}
            important={field.important}
          />
        ))}
      </ConfigSection>

      {/* Generation Parameters */}
      <ConfigSection title={sectionTitles.generation}>
        {configFields.generation.map(field => (
          <ConfigItem
            key={field.key}
            label={field.label}
            value={field.getValue(config)}
            description={field.description}
            important={field.important}
          />
        ))}
      </ConfigSection>

      {/* System Settings */}
      <ConfigSection title={sectionTitles.system}>
        {configFields.system.map(field => (
          <ConfigItem
            key={field.key}
            label={field.label}
            value={field.getValue(config)}
            description={field.description}
            important={field.important}
          />
        ))}
      </ConfigSection>

      {config.systemPrompt && (
        <ConfigSection title="System Prompt">
          <Box marginBottom={1}>
            <Text color="white">
              {config.systemPrompt.length > 80
                ? `${config.systemPrompt.slice(0, 80)}...`
                : config.systemPrompt}
            </Text>
          </Box>
          <Box>
            <Text color="gray" dimColor>
              System prompt to guide AI behavior and response style
            </Text>
          </Box>
        </ConfigSection>
      )}

      <Box marginBottom={1}>
        <Text color="white" bold>Configuration Tip: </Text>
        <Text color="gray" dimColor>
          Create a config file at
          {' '}
          {join(AUTOGLM_FILEPATH, 'config.json')}
        </Text>
      </Box>
    </Box>
  )
}
