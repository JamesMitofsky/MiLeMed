import { config } from '@my/ui'

export type Conf = typeof config

declare module '@my/ui' {
  interface TamaguiCustomConfig extends Conf {}
}

// TODO: why is this not working? Used override in _layout.tsx for the mean time
declare module '*.png' {
  const value: string
  export default value
}
