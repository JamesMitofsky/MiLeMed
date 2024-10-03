import { CreateScreen } from 'app/features/create/screen'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />
      <CreateScreen />
    </SafeAreaView>
  )
}
