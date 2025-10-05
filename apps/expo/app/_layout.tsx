import { SidebarDrawer } from '@my/app/features/profile/screen'
import type { Session } from '@supabase/supabase-js'
import { Provider, loadThemePromise } from 'app/provider'
import { supabase } from 'app/utils/supabase/client.native'
import { useFonts } from 'expo-font'
import { SplashScreen } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import { useCallback, useEffect, useState } from 'react'
import { LogBox } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Menu } from '@tamagui/lucide-icons'

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
    if (fontLoaded && sessionLoadAttempted) {
      await SplashScreen.hideAsync()
    }
  }, [fontLoaded, sessionLoadAttempted])

  if (!fontLoaded || !themeLoaded || !sessionLoadAttempted) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Provider initialSession={initialSession}>
        <Drawer
          screenOptions={({ navigation }) => ({
            title: '',
            drawerHideStatusBarOnOpen: true,
            headerLeft: () => (
              <Menu
                size="$2"
                ml="$5"
                onPress={() => {
                  navigation.toggleDrawer()
                }}
              />
            ),
            sceneContainerStyle: { backgroundColor: 'white' },
            drawerStyle: {
              backgroundColor: 'white',
              width: '80%',
            },
            drawerType: 'front',
            overlayColor: 'rgba(0,0,0,0.5)',
          })}
          drawerContent={(props) => <SidebarDrawer {...props} />}
        />
      </Provider>
    </GestureHandlerRootView>
  )
}
