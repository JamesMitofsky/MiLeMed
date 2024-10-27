import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { YStack, Text, Spinner, Separator, ScrollView } from 'tamagui'

import { supabase } from '../../utils/supabase/client.native'
import ListOfLectures from '../home/components/list-of-lectures'

const IndividualChapterScreen = () => {
  // const { id } = useSearchParams()
  const { id }: { id: string } = useLocalSearchParams()

  // Use the ID to query specific module data
  const { data: chapter, isLoading } = useQuery(['chapter', id], {
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase.from('chapters').select('*').eq('id', id).single()
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
        <Text marginTop="$2">Lade Kapitel...</Text>
      </YStack>
    )
  }

  if (!chapter) {
    return (
      <YStack padding="$4" alignItems="center">
        <Text marginTop="$2">Kapitel nicht gefunden.</Text>
      </YStack>
    )
  }

  return (
    <ScrollView snapToAlignment="start">
      <YStack padding="$4">
        <Text fontSize="$5" fontWeight="bold" marginBottom="$4">
          {chapter.title}
        </Text>
        <Text fontSize="$4" marginBottom="$2">
          {chapter.description}
        </Text>
        <Separator />
        <Text fontSize="$5" marginBottom="$4" marginTop="$5">
          Lektion
        </Text>

        <ListOfLectures moduleId={id || ''} />
      </YStack>
    </ScrollView>
  )
}

export default IndividualChapterScreen
