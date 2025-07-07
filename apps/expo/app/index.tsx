import { HomeScreen } from '@my/app/features/home/screen'
import { ScrollView, Button, YStack, SizableText } from '@my/ui'
import { useVersion } from 'app/provider'
import * as WebBrowser from 'expo-web-browser'

export default function RootLayout() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      f={1}
      fb={0}
      contentContainerStyle={{ flexGrow: 1 }}
      pt="$6"
    >
      <AppVersionCheck MainComponent={<HomeScreen />} />
    </ScrollView>
  )
}

// Version check component that prompts for update when app version is less than remote version
function AppVersionCheck({ MainComponent }: { MainComponent: JSX.Element }) {
  const { needsUpdate } = useVersion()

  if (needsUpdate) {
    return (
      <YStack
        flex={1}
        height="100%"
        alignItems="center"
        justifyContent="center"
        pb="$18"
        px="$6"
        gap="$6"
      >
        <SizableText size="$9" fontWeight="bold" textAlign="center">
          Zeit für dein Glow-Up! ✨
        </SizableText>
        <SizableText size="$6" textAlign="center">
          Ups! Deine App braucht ein kleines Zauber-Upgrade!
        </SizableText>
        <SizableText size="$5" textAlign="center">
          Wir haben ein paar fantastische neue Features für dich parat!
        </SizableText>
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

  return <>{MainComponent}</>
}
