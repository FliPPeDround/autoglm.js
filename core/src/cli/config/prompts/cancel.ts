import process from 'node:process'
import { cancel } from '@clack/prompts'
import { $t } from '@/locales'

export function printCancel() {
  cancel($t('prompt.cancel'))
  process.exit(0)
}
