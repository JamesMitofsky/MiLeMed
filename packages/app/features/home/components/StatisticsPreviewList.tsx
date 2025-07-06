import { OverviewCard } from '@my/ui'
import { XStack } from 'tamagui'

import { useUserProfile } from '../../../utils/hooks/queryHooks'

const StatisticsPreviewList = () => {
  const { getCompletionStats } = useUserProfile()
  const { data: stats } = getCompletionStats()
  const statsData = stats?.[0] ?? {
    total_chapters: 0,
    completed_chapters: 0,
    total_lectures: 0,
    completed_lectures: 0,
    completion_percentage: 0,
  }

  return (
    <XStack ai="flex-start" jc="flex-start" px="$4" gap="$8" mb="$4">
      <OverviewCard
        title="Lektionen"
        value={`${statsData.completed_lectures} ${
          statsData.completed_lectures === 1 ? 'Lektion' : 'Lektionen'
        }`}
        badgeText={`Gesamt: ${statsData.total_lectures} ${
          statsData.total_lectures === 1 ? 'Lektion' : 'Lektionen'
        }`}
        badgeState="success"
      />

      <OverviewCard
        title="Kapitel"
        value={`${statsData.completed_chapters} ${
          statsData.completed_chapters === 1 ? 'Kapitel' : 'Kapitel'
        }`}
        badgeText={`Gesamt: ${statsData.total_chapters} ${
          statsData.total_chapters === 1 ? 'Kapitel' : 'Kapitel'
        }`}
        badgeState="success"
      />
    </XStack>
  )
}

export default StatisticsPreviewList
