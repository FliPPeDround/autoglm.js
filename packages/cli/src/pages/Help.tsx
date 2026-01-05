import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { HelpContent } from '../components/HelpContent'
import { defaultHelpContent, helpContentMap } from '../config/helpContent'

export default function Help() {
  const location = useLocation()
  const code = location.state?.code
  const { t } = useTranslation()

  const content = code ? helpContentMap[code] : null

  if (content) {
    return <HelpContent content={content} />
  }

  return (
    <HelpContent
      content={{
        ...defaultHelpContent,
        errorCode: code ? t('help.noErrorCode', { code }) : undefined,
      }}
    />
  )
}
