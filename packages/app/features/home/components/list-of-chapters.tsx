import { AchievementCard, FullscreenSpinner } from '@my/ui'
import { Text, Theme } from 'tamagui'

import { colors } from '../../../utils/constants/colors'
import useChapterSummary from '../../../utils/react-query/useChapterSummary'
import { ModeType } from '../../../utils/supabase/databaseTypes'

type ListOfChaptersProps = {
  limit?: number
  lockCardWidth?: boolean
  mode?: ModeType
}

const ListOfChapters = ({ limit, lockCardWidth, mode }: ListOfChaptersProps) => {
  const { data: chapters, isLoading } = useChapterSummary(limit, mode)

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
              w={lockCardWidth ? 300 : '100%'}
              title={chapter.title}
              progress={{
                current: chapter.lectures_completed,
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
