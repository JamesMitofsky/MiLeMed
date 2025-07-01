import IndividualLecture from '@my/app/features/chapters/IndividualLecture'
import { ScrollView } from '@my/ui'
import { Stack, useLocalSearchParams } from 'expo-router'

export default function Screen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Lektion' }} />
      <ScrollView f={1} fb={0} contentContainerStyle={{ flexGrow: 1 }}>
        <IndividualLecture lectureId={id} />
      </ScrollView>
    </>
  )
}
