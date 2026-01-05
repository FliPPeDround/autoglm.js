import { version as coreVersion } from 'autoglm.js/package.json' with { type: 'json' }
import { Box, Text, useInput } from 'ink'
import BigText from 'ink-big-text'
import Gradient from 'ink-gradient'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { version as cliVersion } from './../../package.json' with { type: 'json' }

interface VersionPageProps {
  onExit: () => void
}

const EMOJI_SEQUENCE = ['🚀', '✨', '🌟', '💫', '⭐', '🌈', '🎉', '🎊', '🎯', '🔮']
const GRADIENT_NAMES = ['pastel', 'morning', 'summer', 'cristal', 'mind', 'atlas'] as const

export default function VersionPage({ onExit }: VersionPageProps) {
  const { t } = useTranslation()
  const [currentEmoji, setCurrentEmoji] = useState(0)
  const [gradientIndex, setGradientIndex] = useState(0)

  useInput(() => {
    onExit()
  })

  useEffect(() => {
    const emojiTimer = setInterval(() => {
      setCurrentEmoji(e => (e + 1) % EMOJI_SEQUENCE.length)
    }, 200)

    const gradientTimer = setInterval(() => {
      setGradientIndex(g => (g + 1) % GRADIENT_NAMES.length)
    }, 1500)

    return () => {
      clearInterval(emojiTimer)
      clearInterval(gradientTimer)
    }
  }, [])

  return (
    <Box flexDirection="column" alignItems="center" paddingTop={2}>
      {/* Animated BigText with Gradient */}
      <Box marginBottom={2}>
        <Gradient name={GRADIENT_NAMES[gradientIndex]}>
          <BigText text="AutoGLM.js" />
        </Gradient>
      </Box>

      {/* Version Info with Modern Border */}
      <Box
        marginBottom={3}
        borderStyle="round"
        borderColor={GRADIENT_NAMES[gradientIndex] === 'pastel' ? 'cyan' : 'blue'}
        paddingX={4}
        paddingY={2}
        flexDirection="column"
        alignItems="center"
        borderLeft={false}
        borderRight={false}
      >
        {/* Animated Header with Gradient */}
        <Box marginBottom={1}>
          <Gradient name={GRADIENT_NAMES[gradientIndex]}>
            <Text bold>
              {EMOJI_SEQUENCE[currentEmoji]}
              {' '}
              {t('version.title')}
              {' '}
              {EMOJI_SEQUENCE[currentEmoji]}
            </Text>
          </Gradient>
        </Box>

        {/* Version Details with Enhanced Styling */}
        <Box flexDirection="column" alignItems="center" gap={1}>
          <Box>
            <Text color="cyan" bold>
              CLI Version:
              {' '}
            </Text>
            <Gradient name="teen">
              <Text bold>
                v
                {cliVersion}
              </Text>
            </Gradient>
            <Text color="gray"> | </Text>
            <Text color="blue" bold>
              Core Version:
              {' '}
            </Text>
            <Gradient name="pastel">
              <Text bold>
                v
                {coreVersion}
              </Text>
            </Gradient>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box flexDirection="column" alignItems="center" gap={1}>
        <Text color="gray" dimColor>
          {t('version.builtWith')}
        </Text>
      </Box>

      {/* Easter Egg Counter */}
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          v
        </Text>
      </Box>
    </Box>
  )
}
