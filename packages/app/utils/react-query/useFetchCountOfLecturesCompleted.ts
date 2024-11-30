import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'
import { useUser } from '../useUser'

// Custom hook for fetching lecture completion counts
const useFetchCountOfLecturesCompleted = () => {
  const supabase = useSupabase()
  const { profile } = useUser()

  const userId = profile?.id

  const fetchLectureCompletionCounts = async () => {
    if (!userId) {
      throw new Error('User ID is not available')
    }

    // Call the Supabase RPC function
    const { data, error } = await supabase.rpc('get_lecture_completion_counts', { user_id: userId })

    if (error) {
      throw new Error(error.message)
    }

    // Handle the case where the response is an array
    if (!data || data.length === 0) {
      return { total_lectures: 0, completed_lectures: 0 }
    }

    // Return the first row as the result
    return data[0]
  }

  // Use TanStack Query's useQuery to fetch data
  return useQuery(['lectureCompletionCounts', userId], fetchLectureCompletionCounts, {
    enabled: !!userId, // Only run the query if userId is provided
    staleTime: 5 * 60 * 1000, // Optionally, set a stale time to avoid refetching too frequently
    retry: false, // Optionally, disable retries if userId is unavailable
  })
}

export default useFetchCountOfLecturesCompleted
