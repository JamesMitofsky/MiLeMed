import { defaultConfig } from '@tamagui/config/v4'
import { shorthands } from '@tamagui/shorthands'
import { createTokens, createTamagui, setupDev } from 'tamagui'

import { animations } from './config/animations'
import { bodyFont, headingFont } from './config/fonts'
import { media, mediaQueryDefaultActive } from './config/media'
import { color } from './themes/token-colors'
import { radius } from './themes/token-radius'
import { size } from './themes/token-size'
import { space } from './themes/token-space'
import { zIndex } from './themes/token-z-index'
import { themes as customTheme } from './themes/custom-theme'

// Hold down Option for a second to see some helpful visuals
setupDev({
  visualizer: true,
})

/**
 * This avoids shipping themes as JS. Instead, Tamagui will hydrate them from CSS.
 */

// Always use themes regardless of environment to prevent 'Missing theme' errors
// Note to self: just continuing this pattern because idk if it's of consequence
const themes = customTheme

export const config = createTamagui({
  ...defaultConfig,
  themes,
  defaultFont: 'body',
  animations,
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  mediaQueryDefaultActive,
  selectionStyles: (theme) => ({
    backgroundColor: theme.color5,
    color: theme.color11,
  }),
  onlyAllowShorthaxnds: false,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  tokens: createTokens({
    color: {
      ...color,
      brandPrimary: '#2CB7F5',
      brandSecondary: '#FF8502',
    },
    radius,
    zIndex,
    space,
    size,
  }),
  media,
  settings: {
    allowedStyleValues: 'somewhat-strict',
    autocompleteSpecificTokens: 'except-special',
    fastSchemeChange: true,
  },
})

export default config
