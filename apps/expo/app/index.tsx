import { HomeScreen } from '@my/app/features/home/screen'
import { ScrollView, Button, YStack } from '@my/ui'
import { useVersion } from 'app/provider'
import * as WebBrowser from 'expo-web-browser'
import { Text } from 'react-native'

export default function RootLayout() {
  return (
    <AppVersionCheck>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        f={1}
        fb={0}
        contentContainerStyle={{ flexGrow: 1 }}
        pt="$6"
      >
        <HomeScreen /> {/* this is still being put in like it's a slot idk why... */}
      </ScrollView>
    </AppVersionCheck>
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
