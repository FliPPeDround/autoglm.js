import { text } from '@clack/prompts'
import { $t } from '@/locales'

export function model() {
  return text({
    message: $t('prompt.model'),
    placeholder: 'autoglm-phone',
    defaultValue: 'autoglm-phone',
  })
}

export function baseUrl() {
  return text({
    message: $t('prompt.baseURL'),
    placeholder: 'https://open.bigmodel.cn/api/paas/v4/',
    defaultValue: 'https://open.bigmodel.cn/api/paas/v4/',
  })
}

export function apiKey() {
  return text({
    message: $t('prompt.apiKey'),
    placeholder: '',
  })
}
