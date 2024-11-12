import { ViewChaptersScreen } from '@my/app/features/chapters/ViewChaptersScreen'
import { ScrollView, View } from '@my/ui'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Kapitel' }} />
      <ScrollView f={1} fb={0}>
        <View mb="$8">
          <ViewChaptersScreen />
        </View>
      </ScrollView>
    </>
  )
}
