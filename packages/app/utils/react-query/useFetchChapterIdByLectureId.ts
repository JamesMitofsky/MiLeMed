import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'

/**
 * Fetches the chapter ID by lecture ID using the Supabase client.
 * @param supabase - The Supabase client instance.
 * @param lectureId - The ID of the lecture to fetch the chapter ID for.
 * @returns The chapter ID or null if not found.
 */

/**
 * Custom hook to fetch the chapter ID by lecture ID using TanStack Query.
 * @param lectureId - The ID of the lecture to fetch the chapter ID for.
 * @returns The query result containing data, error, and loading state.
 */
export const useFetchChapterIdByLectureId = (lectureId: number) => {
  const supabase = useSupabase()

  return useQuery(
    ['chapterId', lectureId],
    async () => {
      if (!lectureId) throw new Error('Lecture ID is required')

      const { data, error } = await supabase
        .from('lectures') // Replace with your table name
        .select('chapter_id') // Adjust column name to match your schema
        .eq('id', lectureId)
        .single()

      if (error) throw new Error(error.message)

      return data?.chapter_id
    },
    {
      enabled: !!lectureId, // Only fetch if lectureId is provided
      staleTime: 5 * 60 * 1000, // Cache result for 5 minutes
    }
  )
}
