import { H2, OverviewCard, XStack, YStack } from '@my/ui'
import { ChartArea } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'

import { ScrollAdapt } from './scroll-adapt'
import { useFetchCountOfLecturesCompleted } from '../../../utils/react-query/useFetchCountOfLecturesCompleted'
import { useSupabase } from '../../../utils/supabase/useSupabase'
import { useUser } from '../../../utils/useUser'

export const StatisticsPreviewList = () => {
  const supabase = useSupabase()
  const { user } = useUser()

  const { data: lectureTotals } = useFetchCountOfLecturesCompleted()

  const { data: chapterCompletion } = useQuery(
    ['chapterCompletionCounts'],
    async () => {
      if (!user?.id) throw new Error('User ID is not available')
      const { data, error } = await supabase.rpc('get_chapter_completion_counts', {
        user_id: user?.id,
      })

      if (error) {
        console.error('Error fetching chapter completion counts:', error)
        throw new Error(error.message) // Throw an error to be caught by TanStack Query
      }

      // Return the first item directly, assuming data[0] exists
      return data ? data[0] : { total_chapters: 0, completed_chapters: 0 }
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes (optional: cache time)
      retry: false, // Disable retries or customize as needed
      onError: (error) => {
        console.error('Query failed:', error)
      },
    }
  )

  // const { data: usersCount } = useQuery(
  //   ['usersCount'],
  //   async () => {
  //     const { count, error } = await supabase.from('profiles').select('id', { count: 'exact' })

  //     if (error) {
  //       throw new Error(error.message)
  //     }

  //     return count || 0
  //   },
  //   {
  //     staleTime: 1000 * 60 * 5,
  //     cacheTime: 1000 * 60 * 10,
  //     enabled: true,
  //   }
  // )

  // TODO eventually make it so there are loaders when the data is still coming. THere should only be 0 if there is REALLY no chapters done yet

  return (
    <YStack>
      <XStack px="$4.5" ai="center" gap="$2" mb="$3">
        <H2 theme="alt1" fow="400">
          <ChartArea size={25} />
        </H2>
        <H2 theme="alt1" fow="400">
          {' '}
          Statistiken
        </H2>
        {/*TODO: add this back in when more stuff is ready to share <Theme name="alt2">
          <Button size="$2" chromeless iconAfter={ArrowRight}>
            Alle ansehen
          </Button>
        </Theme> */}
      </XStack>

      <ScrollAdapt itemWidth={180} withSnap>
        <XStack fw="wrap" ai="flex-start" jc="flex-start" px="$4" gap="$8" mb="$4">
          <OverviewCard
            title="Kapitel abgeschlossen"
            value={`${chapterCompletion?.completed_chapters ?? '—'} ${
              chapterCompletion?.completed_chapters === 1 ? 'Kapitel' : 'Kapitel'
            }`}
            badgeText={`Gesamt: ${chapterCompletion?.total_chapters} ${
              chapterCompletion?.total_chapters === 1 ? 'Kapitel' : 'Kapitel'
            }`}
            badgeState="success"
          />

          <OverviewCard
            title="Lektion abgeschlossen" // Lectures Completed
            value={`${lectureTotals?.completed_lectures ?? '—'} ${
              lectureTotals?.completed_lectures === 1 ? 'Lektion' : 'Lektionen'
            }`}
            badgeText={`Gesamt: ${lectureTotals?.total_lectures ?? '—'} ${
              lectureTotals?.total_lectures === 1 ? 'Lektion' : 'Lektionen'
            }`}
            badgeState="success"
          />

          {/* <OverviewCard
            title="Durchschnittliche Kursbewertung"
            value={`${averageCourseScore}%`}
            badgeText="+2%"
            badgeState="success"
          /> */}

          {/* <OverviewCard
            title="Neue Benutzer diesen Monat"
            value={`${usersCount ?? '—'} Benutzer`}
            badgeState="success"
          /> */}

          {/* <OverviewCard
            title="Weekly Assignments Submitted"
            value="1,200 Assignments"
            badgeText="+10%"
            badgeState="success"
          /> */}
        </XStack>
      </ScrollAdapt>
    </YStack>
  )
}
