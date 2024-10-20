import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { YStack, Text, Spinner } from 'tamagui'

import { supabase } from '../../utils/supabase/client.native'

const IndividualLecture = () => {
  // const { id } = useSearchParams()
  const { id }: { id: string } = useLocalSearchParams()

  // Use the ID to query specific module data
  const { data: lecture, isLoading } = useQuery(['lecture', id], {
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase.from('lectures').select('*').eq('id', id).single()
      if (error) {
        throw new Error(error.message)
      }
      return data
    },
    enabled: !!id, // Only run the query if 'id' is available
  })

  if (isLoading) {
    return (
      <YStack padding="$4" alignItems="center">
        <Spinner size="small" />
        <Text marginTop="$2">Loading lecture...</Text>
      </YStack>
    )
  }

  if (!lecture) {
    return (
      <YStack padding="$4" alignItems="center">
        <Text marginTop="$2">Lecture not found.</Text>
      </YStack>
    )
  }

  return (
    <YStack padding="$4">
      <Text fontSize="$5" fontWeight="bold" marginBottom="$4">
        {lecture.title}
      </Text>
      <Text fontSize="$4" marginBottom="$2">
        {lecture.content}
      </Text>
    </YStack>
  )
}

export default IndividualLecture
