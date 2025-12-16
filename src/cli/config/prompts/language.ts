import { select } from '@clack/prompts'
import { setAgentConfig } from '@/config'

export default async () => {
  const lang = await select({
    message: 'Please select the language:',
    options: [
      {
        value: 'cn',
        label: '中文',
      },
      {
        value: 'en',
        label: 'English',
      },
    ],
  }) as 'cn' | 'en'
  setAgentConfig({ lang })
  return lang
}
