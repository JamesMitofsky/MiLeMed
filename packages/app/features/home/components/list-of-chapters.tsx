import { ChapterLectureCard } from '@my/ui'
import { ChapterLectureCardSkeleton } from '@my/ui/src/components/ChapterLectureCardSkeleton'
import { Text, Theme } from 'tamagui'

import { colors } from '../../../utils/constants/colors'
import useFetchChapterWithLectureCount from '../../../utils/react-query/useFetchChapterWithLectureCount'
import { ModeType } from '../../../utils/supabase/databaseTypes'

type ListOfChaptersProps = {
  limit?: number
  lockCardWidth?: boolean
  mode?: ModeType
}

const ListOfChapters = ({ limit, lockCardWidth, mode }: ListOfChaptersProps) => {
  const { data: chapters, isLoading } = useFetchChapterWithLectureCount(limit, mode)

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
      {chapters?.length === 0 ? (
        <Text>Keine Kapitel gefunden.</Text>
      ) : (
        chapters?.map((chapter, index) => (
          <Theme
            key={chapter.id}
            name={mode === 'PRACTICAL' ? colors[colors.length - 1 - index] : colors[index]}
          >
            <ChapterLectureCard
              w={lockCardWidth ? 300 : '100%'}
              title={chapter.title}
              progress={{
                current: chapter.completed_lectures,
                full: chapter.total_lectures,
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
