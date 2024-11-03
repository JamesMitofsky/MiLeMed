import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { YStack, Text, Separator, ScrollView } from 'tamagui'

import { useSupabase } from '../../utils/supabase/useSupabase'
import { Skeleton } from '../general/Skeleton'
import ListOfLectures from '../home/components/list-of-lectures'

const IndividualChapterScreen = () => {
  // const { id } = useSearchParams()
  const { id }: { id: string } = useLocalSearchParams()

  const supabase = useSupabase()
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
        {isLoading ? (
          <YStack o={0.5} padding="$4" gap="$2">
            <Skeleton height={16} width="100%" />
            <YStack gap="$2" mt="$3">
              <Skeleton height={12} width="75%" />
              <Skeleton height={12} width="90%" />
              <Skeleton height={12} width="35%" />
            </YStack>
          </YStack>
        ) : (
          <>
            <Text fontSize="$5" fontWeight="bold" marginBottom="$4">
              {chapter.title}
            </Text>
            <Text fontSize="$4" marginBottom="$6">
              {chapter.description}
            </Text>
          </>
        )}
        <Separator />

        <ListOfLectures chapterId={id || ''} />
      </YStack>
    </ScrollView>
  )
}

export default IndividualChapterScreen
