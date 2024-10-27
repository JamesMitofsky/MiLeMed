import i18next from 'i18next'
import { z } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'
import translation from 'zod-i18n-map/locales/de/zod.json'
import 'intl-pluralrules'

i18next.init({
  lng: 'de',
  resources: {
    de: { zod: translation },
  },
})
z.setErrorMap(zodI18nMap)

export { z }
