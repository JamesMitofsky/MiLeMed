import { ChapterLectureCard } from '@my/ui'
import { ChapterLectureCardSkeleton } from '@my/ui/src/components/ChapterLectureCardSkeleton'
import { Text, Theme } from 'tamagui'

import { useChaptersWithLectures } from '../../../utils/hooks/queryHooks'
import { Chapter } from '../../../utils/supabase/databaseTypes'

type ListOfChaptersProps = {
  limit?: number
  lockCardWidth?: boolean
  mode?: Chapter['mode']
}

const ListOfChapters = ({ limit, lockCardWidth, mode }: ListOfChaptersProps) => {
  const { data: chaptersWithLectures, isLoading, error } = useChaptersWithLectures(mode)

  if (isLoading) {
    return (
      <>
        <ChapterLectureCardSkeleton lockCardWidth={lockCardWidth} />
        <ChapterLectureCardSkeleton lockCardWidth={lockCardWidth} />
        <ChapterLectureCardSkeleton lockCardWidth={lockCardWidth} />
      </>
    )
  }

  if (error) {
    return <Text>Fehler beim Laden der Kapitel: {error.message}</Text>
  }

  if (!chaptersWithLectures) {
    return <Text>Keine Kapitel gefunden.</Text>
  }

  return (
    <>
      {chaptersWithLectures.slice(0, limit).map((chapter) => {
        const full = chapter.lectures.length
        const current = chapter.lectures.reduce((count, lecture) => {
          return lecture.is_completed ? count + 1 : count
        }, 0)

        const safeCurrentValue = Math.floor(current || 0)
        const safeFullValue = Math.floor(full || 0)

        return (
          <Theme key={chapter.id} name={mode === 'PRACTICAL' ? 'dark' : 'light_accent'}>
            <ChapterLectureCard
              w={lockCardWidth ? 300 : '100%'}
              title={chapter.title}
              progress={{
                current: safeCurrentValue,
                full: safeFullValue,
                label: 'Lektionen',
              }}
              action={{
                text: 'Weiter',
                href: `/chapters/${chapter.id}`,
              }}
            />
          </Theme>
        )
      })}
    </>
  )
}

export default ListOfChapters
