import { text } from '@clack/prompts'
import { $t } from '@/locales'

export async function maxSteps() {
  const result = await text({
    message: $t('prompt.maxSteps'),
    placeholder: '100',
    defaultValue: '100',
  })

  return typeof result === 'string' ? Number.parseInt(result, 10) : 100
}
