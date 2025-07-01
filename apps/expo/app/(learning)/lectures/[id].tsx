import IndividualLecture from '@my/app/features/chapters/IndividualLecture'
import { useLocalSearchParams } from 'expo-router'

export default function Screen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return <IndividualLecture lectureId={id} />
}
