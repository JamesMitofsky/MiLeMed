import { AchievementCard, FullscreenSpinner } from '@my/ui'
import { Text, Theme } from 'tamagui'

import { colors } from '../../../utils/constants/colors'
import useChapterSummary from '../../../utils/react-query/useChapterSummary'

type ListOfChaptersProps = {
  limit?: number
}

const ListOfChapters = ({ limit }: ListOfChaptersProps) => {
  const { data: chapters, isLoading } = useChapterSummary(limit)

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
