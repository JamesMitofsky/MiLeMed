import { config, TamaguiProvider as TamaguiProviderOG, useDidFinishSSR } from '@my/ui'

import { useRootTheme, useThemeSetting } from '../theme/UniversalThemeProvider'

export const TamaguiProvider = ({ children }: { children: React.ReactNode }) => {
  const [rootTheme] = useRootTheme()
  const themeSetting = useThemeSetting()
  const isHydrated = useDidFinishSSR()
  // const defaultTheme = isHydrated && isWeb ? themeSetting.resolvedTheme || 'light' : rootTheme
  // TODO -- revise this -- currently overrides the theme to be light
  const defaultTheme = 'light'

  return (
    <TamaguiProviderOG
      config={config}
      disableInjectCSS
      disableRootThemeClass
      defaultTheme={defaultTheme}
    >
      {children}
    </TamaguiProviderOG>
  )
}
