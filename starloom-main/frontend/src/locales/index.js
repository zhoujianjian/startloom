import { createI18n } from 'vue-i18n'

import zh from './zh.js'
import en from './en.js'
import western from './western.js'

// 根据 URL 路径判断初始语言
let lang = 'zh'
if (typeof window !== 'undefined') {
  const path = window.location.pathname
  if (path.startsWith('/en')) {
    lang = 'en'
  } else {
    lang = 'zh'
  }
}

localStorage.setItem('lang', lang)
console.log('setlang,,,', lang)

const i18n = createI18n({
    legacy: false,
    locale: lang,
    messages: {
        zh,
        en: western  // 西方版本使用 western 翻译
    }
})
export default i18n