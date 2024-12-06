import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'

// Custom hook for fetching lecture completion counts
const useFetchCountOfLecturesCompleted = () => {
  const supabase = useSupabase()

  const fetchLectureCompletionCounts = async () => {
    // Call the Supabase RPC function
    const { data, error } = await supabase.rpc('fetch_lecture_completion_counts')

    if (error) {
      console.error(error.details, error.hint, error.code)
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
  return useQuery(['lectureCompletionCounts'], fetchLectureCompletionCounts, {
    staleTime: 5 * 60 * 1000, // Optionally, set a stale time to avoid refetching too frequently
    retry: false, // Optionally, disable retries if userId is unavailable
  })
}

export { useFetchCountOfLecturesCompleted }
