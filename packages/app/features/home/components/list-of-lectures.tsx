import { ChapterLectureCard } from '@my/ui'
import { ChapterLectureCardSkeleton } from '@my/ui/src/components/ChapterLectureCardSkeleton'
import { YStack, Text, useMedia, Theme } from 'tamagui'

import { colors } from '../../../utils/constants/colors'
import { useLectures } from '../../../utils/hooks/queryHooks'

type ListOfLecturesProps = {
  chapterId: string
  limit?: number
}

const ListOfLectures = ({ chapterId, limit }: ListOfLecturesProps) => {
  const { getLecturesWithCompletion } = useLectures()
  const { data: lectures, isLoading } = getLecturesWithCompletion(parseInt(chapterId, 10))
  const { md } = useMedia()

  if (isLoading || !lectures) {
    return (
      <YStack fw="wrap" f={1} gap="$3">
        <ChapterLectureCardSkeleton isDense />
        <ChapterLectureCardSkeleton isDense />
      </YStack>
    )
  }

  if (lectures.length === 0) {
    return <Text>Keine Lektionen gefunden.</Text>
  }

  return (
    <YStack my="$4" fw="wrap" gap="$3">
      {lectures.map((lecture, index) => (
        <Theme key={lecture.id} name={colors[index]}>
          <ChapterLectureCard
            dense
            w={md ? '100%' : 300}
            title={lecture.title}
            action={{
              text: lecture.is_completed ? 'Erneut ansehen' : 'Loslegen',
              href: `/lecture/${lecture.id}`,
            }}
            isDone={lecture.is_completed}
            index={index}
          />
        </Theme>
      ))}
    </YStack>
  )
}

export default ListOfLectures
