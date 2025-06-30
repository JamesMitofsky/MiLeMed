import { IndividualChapter } from '@my/app/features/chapters/IndividualChapter'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Kapitel' }} />
      <IndividualChapter />
    </>
  )
}
