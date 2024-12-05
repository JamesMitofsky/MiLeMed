import { ChapterLectureCard } from '@my/ui'
import { ChapterLectureCardSkeleton } from '@my/ui/src/components/ChapterLectureCardSkeleton'
import { YStack, Text, useMedia, Theme } from 'tamagui'

import { colors } from '../../../utils/constants/colors'
import { useFetchListOfLecturesWithCompletionData } from '../../../utils/react-query/useFetchListOfLecturesWithCompletionData'

type ListOfLecturesProps = {
  chapterId: string
  limit?: number
}

const ListOfLectures = ({ chapterId, limit }: ListOfLecturesProps) => {
  const {
    data: lectures,
    // isLoading,
    // error,
  } = useFetchListOfLecturesWithCompletionData({
    chapterId: parseInt(chapterId, 10),
    limit,
  })

  const { md } = useMedia()

  // const lecturesCompleted = useMemo(() => {
  //   if (!lectures) return 0
  //   return lectures.filter((lecture) => lecture.is_completed).length
  // }, [lectures])

  if (!lectures) {
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
      {/* <SizableText size="$3">
        {lecturesCompleted} / {lectures.length}
      </SizableText> */}
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
