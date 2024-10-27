import IndividualLecture from '@my/app/features/chapters/IndividualLecture'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Lektion' }} />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <IndividualLecture />
      </SafeAreaView>
    </>
  )
}
