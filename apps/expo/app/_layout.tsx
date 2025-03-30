import { SidebarDrawer } from '@my/app/features/profile/screen'
import { Image } from '@my/ui'
import { DrawerToggleButton } from '@react-navigation/drawer'
import type { Session } from '@supabase/supabase-js'
import { Provider, loadThemePromise } from 'app/provider'
import { ExpoBugsnagProvider } from 'app/provider/ExpoBugsnagProvider'
import { supabase } from 'app/utils/supabase/client.native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import { useCallback, useEffect, useState } from 'react'
import { LogBox, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

// @ts-ignore
import logoText from '../assets/logoText.png'

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Provider initialSession={initialSession}>
          <ExpoBugsnagProvider>
            <Drawer
              screenOptions={{
                title: '',
                headerShown: ({ route }) => {
                  // Hide header on auth routes
                  return !route.name?.startsWith('(auth)')
                },
                headerLeft: () => (
                  <DrawerToggleButton tintColor="black" pressColor="rgba(0,0,0,0.1)" />
                ),
                headerRight: () => <Image marginRight="$3" height="$1" width="$9" src={logoText} />,
                sceneContainerStyle: { backgroundColor: 'white' },
                drawerStyle: {
                  backgroundColor: 'white',
                  width: '80%',
                },
                drawerType: 'front',
                overlayColor: 'rgba(0,0,0,0.5)',
              }}
              drawerContent={(props) => <SidebarDrawer {...props} />}
            >
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: 'white' },
                }}
              >
                <Stack.Screen
                  name="(learning)"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="settings"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="(auth)"
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack>
            </Drawer>
          </ExpoBugsnagProvider>
        </Provider>
      </View>
    </GestureHandlerRootView>
  )
}
