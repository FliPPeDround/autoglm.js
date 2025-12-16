import { group, intro } from '@clack/prompts'
import { cyan } from 'kolorist'
import { $t } from '@/locales'
import s from '@/utils/spinner'
import { maxSteps } from './agent'
import { printCancel } from './cancel'
import lang from './language'
import { apiKey, baseUrl, model } from './model'

export async function getConfig() {
  intro(cyan(`Config Your AutoGLM.js`))
  const config = await group(
    {
      lang,
      model,
      baseUrl,
      apiKey,
      maxSteps,
    },
    {
      onCancel() {
        printCancel()
      },
    },
  )
  s.start($t('prompt.checking'))
  // outro(cyan($t('prompt.done')))

  return config
}
