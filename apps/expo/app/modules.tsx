import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import ViewModulesScreen from '../../../packages/app/features/view/screen'

export default function Screen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'View Modules' }} />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <ViewModulesScreen />
      </SafeAreaView>
    </>
  )
}
