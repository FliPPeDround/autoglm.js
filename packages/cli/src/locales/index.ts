import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import enUS from './en-US'
import zhCN from './zh-CN'

// 初始化i18next
i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enUS,
      },
      zh: {
        translation: zhCN,
      },
    },
    lng: 'zh', // 默认语言
    fallbackLng: 'en', // 回退语言
    interpolation: {
      escapeValue: false, // React已经处理了XSS
    },
  })

// 导出i18next实例和类型
export default i18next
export { useTranslation } from 'react-i18next'
