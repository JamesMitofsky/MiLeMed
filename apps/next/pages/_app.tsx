import '../public/web.css'
import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'
import { useRootTheme } from '@tamagui/next-theme'
import { Provider } from 'app/provider'
import { AuthProviderProps } from 'app/provider/auth'
import { api } from 'app/utils/api'
import { NextPage } from 'next'
import Head from 'next/head'
import 'raf/polyfill'
import { ReactElement, ReactNode, useEffect } from 'react'
import type { SolitoAppProps } from 'solito'

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css')
}

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

function MyApp({
  Component,
  pageProps,
}: SolitoAppProps<{ initialSession: AuthProviderProps['initialSession'] }>) {
  // reference: https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts
  const getLayout = Component.getLayout || ((page) => page)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_theme, setTheme] = useRootTheme()

  //TODO: look in TamaguiProvider.tsx also. This with that override the theme to be light
  useEffect(() => {
    if (_theme === 'dark') {
      setTheme('light')
    }
  }, [_theme, setTheme])

  return (
    <>
      <Head>
        <title>MiLeMed</title>
        <meta
          name="description"
          content="MiLeMed ist eine Mikro-Lernplattform für die medizinische Ausbildung. Sie bietet kurze Vorlesungen und Quizze, die Studierenden und Fachleuten helfen, ihr Wissen in verschiedenen medizinischen Fachgebieten zu vertiefen. Mit einem Fokus auf interaktives Lernen macht MiLeMed komplexe Themen zugänglicher und bietet flexible, mobile Bildung für vielbeschäftigte Lernende."
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {/* <NextThemeProvider
        onChangeTheme={(next) => {
          setTheme(next as ColorScheme)
        }}
      > */}
      <Provider initialSession={pageProps.initialSession}>
        {getLayout(<Component {...pageProps} />)}
      </Provider>
      {/* </NextThemeProvider> */}
    </>
  )
}

export default api.withTRPC(MyApp)
