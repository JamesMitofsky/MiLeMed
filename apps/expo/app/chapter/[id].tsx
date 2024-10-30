import IndividualChapter from '@my/app/features/chapters/IndividualChapter'
import { ScrollView, View } from '@my/ui'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Lektionen' }} />
      <ScrollView f={1} fb={0}>
        <View mb="$8">
          <IndividualChapter />
        </View>
      </ScrollView>
    </>
  )
}
