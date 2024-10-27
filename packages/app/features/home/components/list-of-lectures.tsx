import { AchievementCard } from '@my/ui'
import { useQuery } from '@tanstack/react-query'
import { YStack, Text, Spinner, Theme, useMedia } from 'tamagui'

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
      <YStack padding="$4" alignItems="center">
        <Spinner size="small" />
        <Text marginTop="$2">Lade Lektion...</Text>
      </YStack>
    )
  }

  return (
    <>
      {lectures?.length === 0 ? (
        <Text>Keine Lektionen gefunden.</Text>
      ) : (
        <YStack px="$4" fw="wrap" f={1} gap="$3">
          {lectures?.map((lecture, index) => (
            <Theme key={lecture.id} name={colors[index]}>
              <AchievementCard
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
