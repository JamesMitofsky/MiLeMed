import { AchievementCard } from '@my/ui'
import { Users } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'
import { YStack, Text, Spinner, Theme } from 'tamagui'

import { supabase } from '../../../utils/supabase/client.native'

const colors = ['orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red', 'gray'] as const

type ListOfLecturesProps = {
  moduleId: string
  limit?: number
}

const ListOfLectures = ({ moduleId, limit }: ListOfLecturesProps) => {
  const { data: lectures, isLoading } = useQuery(['chapters'], {
    queryFn: async () => {
      let query = supabase.from('lectures').select('*').eq('chapter_id', moduleId)

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

  if (isLoading) {
    return (
      <YStack padding="$4" alignItems="center">
        <Spinner size="small" />
        <Text marginTop="$2">Loading lectures...</Text>
      </YStack>
    )
  }

  return (
    <>
      {lectures?.length === 0 ? (
        <Text>No modules found.</Text>
      ) : (
        lectures?.map((lecture, index) => (
          <Theme key={lecture.id} name={colors[index]}>
            <AchievementCard
              w={300}
              icon={Users}
              title={lecture.title}
              progress={{ current: 1, full: 1 }}
              action={{
                text: 'Continue',
                href: `/lecture/${lecture.id}`,
              }}
            />
          </Theme>
        ))
      )}
    </>
  )
}

export default ListOfLectures
