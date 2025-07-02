import { SidebarDrawer } from '@my/app/features/profile/screen'
import { Button, YStack } from '@my/ui'
import type { Session } from '@supabase/supabase-js'
import { Provider, loadThemePromise, useVersion } from 'app/provider'
import { supabase } from 'app/utils/supabase/client.native'
import { useFonts } from 'expo-font'
import { SplashScreen } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import * as WebBrowser from 'expo-web-browser'
import { useCallback, useEffect, useState } from 'react'
import { LogBox, Text } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

SplashScreen.preventAutoHideAsync()

LogBox.ignoreLogs([
  'Cannot update a component',
  'You are setting the style',
  'No route',
  'duplicate ID',
  'Require cycle',
])

export default function RootLayout() {
  const [fontLoaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  const { isLoading: isVersionCheckLoading } = useVersion()

  const [themeLoaded, setThemeLoaded] = useState(false)
  const [sessionLoadAttempted, setSessionLoadAttempted] = useState(false)
  const [initialSession, setInitialSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data) {
          setInitialSession(data.session)
        }
      })
      .finally(() => {
        setSessionLoadAttempted(true)
      })
  }, [])

  useEffect(() => {
    loadThemePromise.then(() => {
      setThemeLoaded(true)
    })
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded && sessionLoadAttempted && !isVersionCheckLoading) {
      await SplashScreen.hideAsync()
    }
  }, [fontLoaded, sessionLoadAttempted])

  if (!fontLoaded || !themeLoaded || !sessionLoadAttempted) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Provider initialSession={initialSession}>
        <AppVersionCheck>
          {/* <View style={{ flex: 1 }} onLayout={onLayoutRootView}> */}
          <Drawer
            screenOptions={{
              title: '',
              // headerRight: () => <Image marginRight="$3" height="$1" width="$9" src={logoText} />,
              sceneContainerStyle: { backgroundColor: 'white' },
              drawerStyle: {
                backgroundColor: 'white',
                width: '80%',
              },
              drawerType: 'front',
              overlayColor: 'rgba(0,0,0,0.5)',
            }}
            drawerContent={(props) => <SidebarDrawer {...props} />}
          />
          {/* </View> */}
        </AppVersionCheck>
      </Provider>
    </GestureHandlerRootView>
  )
}

// Version check component that prompts for update when app version is less than remote version
function AppVersionCheck({ children }: { children: React.ReactNode }) {
  const { needsUpdate } = useVersion()

  if (needsUpdate) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$6" gap="$4">
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>
          Zeit für dein Glow-Up! ✨
        </Text>
        <Text style={{ fontSize: 22, textAlign: 'center', marginBottom: 14 }}>
          Ups! Deine App braucht ein kleines Zauber-Upgrade!
        </Text>
        <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 24 }}>
          Wir haben ein paar fantastische neue Features für dich parat!
        </Text>
        <Button
          onPress={() => WebBrowser.openBrowserAsync('https://www.milemed.de/app')}
          size="$6"
          theme="brandPrimary"
        >
          Los geht’s! 🚀
        </Button>
      </YStack>
    )
  }

  return <>{children}</>
}
