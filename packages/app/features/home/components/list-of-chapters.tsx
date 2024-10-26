import { AchievementCard, FullscreenSpinner } from '@my/ui'
import { useQuery } from '@tanstack/react-query'
import { Text, Theme } from 'tamagui'

import { colors } from '../../../utils/constants/colors'
import { useSupabase } from '../../../utils/supabase/useSupabase'

type ListOfChaptersProps = {
  limit?: number
}

const ListOfChapters = ({ limit }: ListOfChaptersProps) => {
  const supabase = useSupabase()
  const { data: chapters, isLoading } = useQuery(['chapters'], {
    queryFn: async () => {
      let query = supabase.rpc('get_chapter_summary').select('*')

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
    return <FullscreenSpinner />
  }

  return (
    <>
      {chapters?.length === 0 ? (
        <Text>Keine Kapitel gefunden.</Text>
      ) : (
        chapters?.map((chapter, index) => (
          <Theme key={chapter.id} name={colors[index]}>
            <AchievementCard
              w={300}
              // icon={Users}
              title={chapter.title}
              progress={{
                current: chapter.lectures_completed || 0,
                full: chapter.lecture_count,
                label: 'Lektionen',
              }}
              action={{
                text: 'Weiter',
                href: `/chapter/${chapter.id}`,
              }}
            />
          </Theme>
        ))
      )}
    </>
  )
}

export default ListOfChapters
