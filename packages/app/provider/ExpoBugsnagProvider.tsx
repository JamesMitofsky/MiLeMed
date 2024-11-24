import Bugsnag from '@bugsnag/expo'
import { SizableText, View } from '@my/ui'
import React, { useEffect } from 'react'

import { useUser } from '../utils/useUser'
Bugsnag.start()

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)
const FallbackComponent = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SizableText>
        Oh nein! Wir hatten ein Problem, diesen Teil der App darzustellen – unser Fehler! Wenn du
        uns unter hilfe@milemed.de kontaktierst, machen wir es so schnell wie möglich wieder gut! 🙏
      </SizableText>
    </View>
  )
}

type BugsnagProviderProps = {
  children: React.ReactNode
}

export const ExpoBugsnagProvider: React.FC<BugsnagProviderProps> = ({ children }) => {
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      Bugsnag.setUser(user.id, user.email)
    }
  }, [user?.id, user?.email])

  return <ErrorBoundary FallbackComponent={FallbackComponent}>{children}</ErrorBoundary>
}
