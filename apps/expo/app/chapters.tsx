import ViewChaptersScreen from '@my/app/features/chapters/ViewChaptersScreen'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Kapitel' }} />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <ViewChaptersScreen />
      </SafeAreaView>
    </>
  )
}
