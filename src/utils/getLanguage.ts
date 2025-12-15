/*
 * Copyright (c) FliPPeDround
 *
 * This file incorporates work covered by the following copyright:
 * @vuejs/create-vue - Copyright (c) Vue.js contributors (MIT)
 * https://github.com/vuejs/create-vue
 */
import * as fs from 'node:fs'
import * as path from 'node:path'
import process from 'node:process'

interface LanguageItem {
  hint?: string
  message: string
  invalidMessage?: string
  dirForPrompts?: {
    current: string
    target: string
  }
  toggleOptions?: {
    active: string
    inactive: string
  }
  selectOptions?: {
    [key: string]: { title: string, desc?: string }
  }
}

interface Language {
  projectName: LanguageItem
  shouldOverwrite: LanguageItem
  packageName: LanguageItem
  featureSelection: LanguageItem
  needsTypeScript: LanguageItem
  needsJsx: LanguageItem
  needsRouter: LanguageItem
  needsPinia: LanguageItem
  needsVitest: LanguageItem
  needsE2eTesting: LanguageItem
  needsEslint: LanguageItem
  needsPrettier: LanguageItem
  e2eSelection: LanguageItem & {
    selectOptions?: {
      [key: string]: { title: string, desc?: string, hintOnComponentTesting?: string }
    }
  }
  needsExperimental: LanguageItem
  needsExperimentalFeatures: LanguageItem
  needsOxlint: LanguageItem
  needsRolldownVite: LanguageItem
  needsBareboneTemplates: LanguageItem
  errors: {
    operationCancelled: string
  }
  defaultToggleOptions: {
    active: string
    inactive: string
  }
  infos: {
    scaffolding: string
    done: string
    optionalGitCommand: string
  }
}

/**
 *
 * This function is used to link obtained locale with correct locale file in order to make locales reusable
 *
 * @param locale the obtained locale
 * @returns locale that linked with correct name
 */
function linkLocale(locale: string) {
  // The C locale is the default system locale for POSIX systems.
  // https://docs.oracle.com/cd/E36784_01/html/E36823/glmar.html
  // https://sourceware.org/glibc/wiki/Proposals/C.UTF-8
  // It is common among containerized environments or minimal virtual environments
  // though most user-facing systems would have a more specific locale set.
  // The problem here is that the C locale is not a valid language tag for the Intl API.
  // But it is not desirable to throw an error in this case.
  // So we map it to 'en-US'.
  if (locale === 'C') {
    return 'en-US'
  }

  let linkedLocale = Intl.getCanonicalLocales(locale)[0]
  if (linkedLocale.startsWith('zh-')) {
    linkedLocale = 'zh-CN'
  }
  else {
    linkedLocale = locale
  }

  return linkedLocale
}

export function getLocale() {
  const shellLocale
    = process.env.LC_ALL // POSIX locale environment variables
      || process.env.LC_MESSAGES
      || process.env.LANG
      || Intl.DateTimeFormat().resolvedOptions().locale // Built-in ECMA-402 support
      || 'en-US' // Default fallback

  return linkLocale(shellLocale.split('.')[0].replace('_', '-'))
}

async function loadLanguageFile(filePath: string): Promise<Language> {
  return await fs.promises.readFile(filePath, 'utf-8').then((data) => {
    const parsedData = JSON.parse(data)
    if (parsedData) {
      return parsedData
    }
  })
}

export default async function getLanguage(localesRoot: string) {
  const locale = getLocale()

  const languageFilePath = path.resolve(localesRoot, `${locale}.json`)
  const fallbackPath = path.resolve(localesRoot, 'en-US.json')

  const doesLanguageExist = fs.existsSync(languageFilePath)
  const lang: Language = doesLanguageExist
    ? await loadLanguageFile(languageFilePath)
    : await loadLanguageFile(fallbackPath)

  return lang
}
