import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { YStack, Text, Separator, ScrollView, SizableText } from 'tamagui'

import { useSupabase } from '../../utils/supabase/useSupabase'
import { Skeleton } from '../general/Skeleton'
import ListOfLectures from '../home/components/list-of-lectures'

export const IndividualChapter = () => {
  // const { id } = useSearchParams()
  const { id }: { id: string } = useLocalSearchParams()

  const supabase = useSupabase()
  // Use the ID to query specific module data
  const { data: chapter, isPending } = useQuery({
    queryKey: ['chapter', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('content_chapters')
        .select('*')
        .eq('id', parseInt(id, 10))
        .single()
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
    <YStack padding="$4" flex={1} mb="$4" bg="white">
      {isPending ? (
        <YStack o={0.5} gap="$2" pb="$4">
          <Skeleton height={16} width="100%" />
          <YStack gap="$2" mt="$3">
            <Skeleton height={12} width="75%" />
            <Skeleton height={12} width="90%" />
            <Skeleton height={12} width="35%" />
          </YStack>
        </YStack>
      ) : (
        <YStack gap="$2" py="$4">
          <SizableText size="$8" fontWeight="bold" marginBottom="$4">
            {chapter.title}
          </SizableText>
          <Text fontSize="$4" marginBottom="$4">
            {chapter.description}
          </Text>
        </YStack>
      )}
      <Separator />

      <ScrollView>
        <ListOfLectures chapterId={id || ''} />
      </ScrollView>
    </YStack>
  )
}
