import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'
import * as Colors from '@tamagui/colors'

const darkPalette = [
  'hsla(210, 30%, 8%, 1)',
  'hsla(210, 31%, 12%, 1)',
  'hsla(210, 32%, 17%, 1)',
  'hsla(210, 34%, 21%, 1)',
  'hsla(210, 35%, 25%, 1)',
  'hsla(210, 36%, 30%, 1)',
  'hsla(210, 37%, 35%, 1)',
  'hsla(210, 38%, 40%, 1)',
  'hsla(210, 39%, 45%, 1)',
  'hsla(210, 40%, 50%, 1)',
  'hsla(210, 30%, 85%, 1)',
  'hsla(210, 25%, 95%, 1)',
]
const lightPalette = [
  'hsla(210, 30%, 97%, 1)',
  'hsla(210, 31%, 94%, 1)',
  'hsla(210, 32%, 91%, 1)',
  'hsla(210, 34%, 88%, 1)',
  'hsla(210, 35%, 85%, 1)',
  'hsla(210, 36%, 78%, 1)',
  'hsla(210, 37%, 71%, 1)',
  'hsla(210, 38%, 64%, 1)',
  'hsla(210, 39%, 57%, 1)',
  'hsla(210, 40%, 50%, 1)',
  'hsla(210, 30%, 20%, 1)',
  'hsla(210, 25%, 5%, 1)',
]

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
}

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
}

// we're adding some example sub-themes for you to show how they are done, "success" "warning", "error":

const builtThemes = createThemes({
  componentThemes: defaultComponentThemes,

  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    extra: {
      light: {
        ...Colors.green,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  accent: {
    palette: {
      dark: [
        'hsla(30, 60%, 15%, 1)',
        'hsla(30, 61%, 19%, 1)',
        'hsla(30, 63%, 22%, 1)',
        'hsla(30, 64%, 26%, 1)',
        'hsla(30, 65%, 30%, 1)',
        'hsla(30, 66%, 34%, 1)',
        'hsla(30, 67%, 38%, 1)',
        'hsla(30, 68%, 42%, 1)',
        'hsla(30, 69%, 46%, 1)',
        'hsla(30, 70%, 50%, 1)',
        'hsla(30, 65%, 80%, 1)',
        'hsla(30, 60%, 95%, 1)',
      ],
      light: [
        'hsla(30, 60%, 90%, 1)',
        'hsla(30, 61%, 86%, 1)',
        'hsla(30, 63%, 83%, 1)',
        'hsla(30, 64%, 79%, 1)',
        'hsla(30, 65%, 75%, 1)',
        'hsla(30, 66%, 70%, 1)',
        'hsla(30, 67%, 65%, 1)',
        'hsla(30, 68%, 60%, 1)',
        'hsla(30, 69%, 55%, 1)',
        'hsla(30, 70%, 50%, 1)',
        'hsla(30, 65%, 25%, 1)',
        'hsla(30, 60%, 10%, 1)',
      ],
    },
  },

  childrenThemes: {
    brandPrimary: {
      palette: {
        light: ['#2CB7F5'],
        dark: ['#2CB7F5'],
      },
    },

    brandSecondary: {
      palette: {
        light: ['#FF8502'],
        dark: ['#FF8502'],
      },
    },

    warning: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: Object.values(Colors.yellow),
      },
    },

    error: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: Object.values(Colors.red),
      },
    },

    success: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: Object.values(Colors.green),
      },
    },
  },

  // optionally add more,

  // grandChildrenThemes: {
  //   alt1: {
  //     template: 'alt1',
  //   },
  //   alt2: {
  //     template: 'alt2',
  //   },
  //   surface1: {
  //     template: 'surface1',
  //   },
  //   surface2: {
  //     template: 'surface2',
  //   },
  //   surface3: {
  //     template: 'surface3',
  //   },
  // },
})

export type Themes = typeof builtThemes

// the process.env conditional here is optional but saves web client-side bundle
// size by leaving out themes JS. tamagui automatically hydrates themes from CSS
// back into JS for you, and the bundler plugins set TAMAGUI_ENVIRONMENT. so
// long as you are using the Vite, Next, Webpack plugins this should just work,
// but if not you can just export builtThemes directly as themes:
export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' && process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any)
