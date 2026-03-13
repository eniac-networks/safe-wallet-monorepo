import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import zhTW from './locales/zh-TW.json'

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  'zh-TW': '繁體中文',
} as const

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'zh-TW': { translation: zhTW },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh-TW'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'safe-wallet-language',
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
