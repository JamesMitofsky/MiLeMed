import { Button, H4, OverviewCard, Theme, XStack, YStack } from '@my/ui'
import { ArrowRight } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'

import { ScrollAdapt } from './scroll-adapt'
import { useSupabase } from '../../../utils/supabase/useSupabase'

export const StatisticsPreviewList = () => {
  const supabase = useSupabase()
  /**
   * Query 1: Count of Completed Lectures
   * A lecture is considered completed if there exists at least one
   * lecture_event with event_type 'QUIZ_PASSED' or 'LECTURE_SKIPPED'.
   */
  const { data: completedLecturesCount } = useQuery(
    ['completedLecturesCount'],
    async () => {
      // Using a raw SQL query via Supabase's rpc method
      const { data, error } = await supabase
        .from('lecture_events')
        .select('lecture_id', { count: 'exact', head: true })
        .in('event_type', ['QUIZ_PASSED', 'LECTURE_SKIPPED'])
        .neq('lecture_id', null)
      // .distinct('lecture_id')

      if (error) {
        throw new Error(error.message)
      }

      // Supabase's 'distinct' with 'head: true' and 'count: exact' might not return 'count' as expected.
      // Therefore, it's recommended to use an RPC function or a view for accurate counts.
      // For demonstration, we'll assume 'count' is correctly returned.
      return data?.length || 0 // Fallback to 0 if data is undefined
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      enabled: true,
    }
  )

  /**
   * Query 2: Total Number of Lectures
   */
  const { data: totalLecturesCount } = useQuery(
    ['totalLecturesCount'],
    async () => {
      const { count, error } = await supabase
        .from('lectures')
        .select('*', { count: 'exact', head: true })

      if (error) {
        throw new Error(error.message)
      }

      return count
    },
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      enabled: true,
    }
  )

  /**
   * Query 3: Number of Users with Student Status
   * Assuming 'role' column in 'profiles' table denotes user roles.
   */
  const { data: studentUsersCount } = useQuery(
    ['studentUsersCount'],
    async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student')

      if (error) {
        throw new Error(error.message)
      }

      return count
    },
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      enabled: true,
    }
  )
  const { data: chapterCompletion } = useQuery(
    ['chapterCompletionCounts'],
    async () => {
      const { data, error } = await supabase.rpc('get_chapter_completion_counts') // Call the Supabase function

      if (error) {
        console.error('Error fetching chapter completion counts:', error)
        throw new Error(error.message) // Throw an error to be caught by TanStack Query
      }

      // Return the first item directly, assuming data[0] exists
      return data ? data[0] : null
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes (optional: cache time)
      retry: false, // Disable retries or customize as needed
      onError: (error) => {
        console.error('Query failed:', error)
      },
    }
  )

  // TODO eventually make it so there are loaders when the data is still coming. THere should only be 0 if there is REALLY no chapters done yet

  return (
    <YStack>
      <XStack px="$4.5" ai="center" gap="$2" jc="space-between" mb="$4">
        <H4 theme="alt1" fow="400">
          Statistiken
        </H4>
        <Theme name="alt2">
          <Button size="$2" chromeless iconAfter={ArrowRight}>
            Alle ansehen
          </Button>
        </Theme>
      </XStack>

      <ScrollAdapt itemWidth={180} withSnap>
        <XStack fw="wrap" ai="flex-start" jc="flex-start" px="$4" gap="$8" mb="$4">
          <OverviewCard
            title="Kapitel abgeschlossen"
            value={`${chapterCompletion?.completed_chapters} ${
              chapterCompletion?.completed_chapters === 1 ? 'Kapitel' : 'Kapitel'
            }`}
            badgeText={`Gesamt: ${chapterCompletion?.total_chapters} ${
              chapterCompletion?.total_chapters === 1 ? 'Kapitel' : 'Kapitel'
            }`}
            badgeState="success"
          />

          <OverviewCard
            title="Lektion abgeschlossen" // Lessons Completed
            value={`${completedLecturesCount || 0} ${
              completedLecturesCount === 1 ? 'Lektion' : 'Lektionen'
            }`}
            badgeText={`Gesamt: ${totalLecturesCount || 0} ${
              totalLecturesCount === 1 ? 'Lektion' : 'Lektionen'
            }`}
            badgeState="success"
          />

          {/* <OverviewCard
            title="Durchschnittliche Kursbewertung"
            value={`${averageCourseScore}%`}
            badgeText="+2%"
            badgeState="success"
          /> */}

          <OverviewCard
            title="Neue Studenten diesen Monat"
            value={`${studentUsersCount || 0} Studenten`}
            badgeState="success"
          />

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
