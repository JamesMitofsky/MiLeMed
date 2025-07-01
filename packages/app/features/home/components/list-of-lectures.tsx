import { ChapterLectureCard } from '@my/ui'
import { ChapterLectureCardSkeleton } from '@my/ui/src/components/ChapterLectureCardSkeleton'
import { YStack, Text, useMedia } from 'tamagui'

import { useLectures } from '../../../utils/hooks/queryHooks'

type ListOfLecturesProps = {
  chapterId: string
  limit?: number
}

const ListOfLectures = ({ chapterId, limit }: ListOfLecturesProps) => {
  const { data: lectures, isLoading } = useLectures(parseInt(chapterId, 10))
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
        <ChapterLectureCard
          key={lecture.id}
          dense
          w={md ? '100%' : 300}
          title={lecture.title}
          action={{
            text: lecture.is_completed ? 'Erneut ansehen' : 'Loslegen',
            href: `/lectures/${lecture.id}`,
          }}
          isDone={lecture.is_completed}
          index={index}
        />
      ))}
    </YStack>
  )
}

export default ListOfLectures
