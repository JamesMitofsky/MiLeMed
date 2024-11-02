import { ChapterLectureCard } from '@my/ui'
import { ChapterLectureCardSkeleton } from '@my/ui/src/components/ChapterLectureCardSkeleton'
import { useQuery } from '@tanstack/react-query'
import { YStack, Text, Theme, useMedia } from 'tamagui'

import { colors } from '../../../utils/constants/colors'
import { useSupabase } from '../../../utils/supabase/useSupabase'

type ListOfLecturesProps = {
  moduleId: string
  limit?: number
}

const ListOfLectures = ({ moduleId, limit }: ListOfLecturesProps) => {
  const supabase = useSupabase()
  const { data: lectures, isLoading } = useQuery(['lectures'], {
    queryFn: async () => {
      let query = supabase
        .from('lectures')
        .select('*')
        .eq('chapter_id', moduleId)
        .order('sort_order', { ascending: true })

      if (typeof limit === 'number') {
        query = query.limit(limit)
      }
      const { data, error } = await query

      if (error) {
        // no rows - edge case of user being deleted
        if (error.code === 'PGRST116') {
          await supabase.auth.signOut()
          return null
        }
        throw new Error(error.message)
      }
      return data
    },
  })

  const { md } = useMedia()

  if (isLoading) {
    return (
      <>
        <ChapterLectureCardSkeleton isDense />
        <ChapterLectureCardSkeleton isDense />
        <ChapterLectureCardSkeleton isDense />
        <ChapterLectureCardSkeleton isDense />
        <ChapterLectureCardSkeleton isDense />
      </>
    )
  }

  return (
    <>
      {lectures?.length === 0 ? (
        <Text>Keine Lektionen gefunden.</Text>
      ) : (
        <YStack fw="wrap" f={1} gap="$3">
          <ChapterLectureCardSkeleton isDense />
          {lectures?.map((lecture, index) => (
            <Theme key={lecture.id} name={colors[index]}>
              <ChapterLectureCard
                dense
                w={md ? '100%' : 300}
                title={lecture.title}
                action={{
                  text: 'Weiter',
                  href: `/lecture/${lecture.id}`,
                }}
              />
            </Theme>
          ))}
        </YStack>
      )}
    </>
  )
}

export default ListOfLectures
