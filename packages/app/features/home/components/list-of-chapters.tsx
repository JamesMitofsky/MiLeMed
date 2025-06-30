import { ChapterLectureCard } from '@my/ui'
import { ChapterLectureCardSkeleton } from '@my/ui/src/components/ChapterLectureCardSkeleton'
import { Text, Theme } from 'tamagui'

import { colors } from '../../../utils/constants/colors'
import { useChapters } from '../../../utils/hooks/queryHooks'
import { Chapter } from '../../../utils/supabase/databaseTypes'

type ListOfChaptersProps = {
  limit?: number
  lockCardWidth?: boolean
  mode?: Chapter['mode']
}

const ListOfChapters = ({ limit, lockCardWidth, mode }: ListOfChaptersProps) => {
  const { data: chapters, isLoading } = useChapters(mode)

  if (isLoading) {
    return (
      <>
        <ChapterLectureCardSkeleton lockCardWidth={lockCardWidth} />
        <ChapterLectureCardSkeleton lockCardWidth={lockCardWidth} />
        <ChapterLectureCardSkeleton lockCardWidth={lockCardWidth} />
      </>
    )
  }

  return (
    <>
      {!chapters || chapters.length === 0 ? (
        <Text>Keine Kapitel gefunden.</Text>
      ) : (
        chapters.map((chapter, index) => (
          <Theme
            key={chapter.id}
            name={mode === 'PRACTICAL' ? colors[colors.length - 1 - index] : colors[index]}
          >
            <ChapterLectureCard
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
