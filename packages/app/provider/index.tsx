import { Session } from '@supabase/supabase-js'
import { GlobalStoreProvider } from 'app/utils/global-store'
import React from 'react'

import { AuthProvider } from './auth'
import { ModeProvider } from './modeProvider'
import { QueryClientProvider } from './react-query'
import { SafeAreaProvider } from './safe-area'
import { TamaguiProvider } from './tamagui'
import { UniversalThemeProvider } from './theme'
import { ToastProvider } from './toast'
import { VersionProvider } from './versionProvider'

export { loadThemePromise } from './theme/UniversalThemeProvider'
export { useVersion } from './versionProvider'

export function Provider({
  initialSession,
  children,
}: {
  initialSession?: Session | null
  children: React.ReactNode
}) {
  return (
    <AuthProvider initialSession={initialSession}>
      <Providers>{children}</Providers>
    </AuthProvider>
  )
}

const compose = (providers: React.FC<{ children: React.ReactNode }>[]) =>
  providers.reduce((Prev, Curr) => ({ children }) => {
    const Provider = Prev ? (
      <Prev>
        <Curr>{children}</Curr>
      </Prev>
    ) : (
      <Curr>{children}</Curr>
    )
    return Provider
  })

const Providers = compose([
  UniversalThemeProvider,
  SafeAreaProvider,
  TamaguiProvider,
  ToastProvider,
  QueryClientProvider,
  GlobalStoreProvider,
  VersionProvider, // Add the new VersionProvider
  ModeProvider,
])
