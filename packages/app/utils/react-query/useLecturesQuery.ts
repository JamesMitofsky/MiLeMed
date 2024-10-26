import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'

export type AllSortedLecturesRow = {
  chapter_id: number | null
  chapter_sort_order: number | null
  lecture_content: string | null
  lecture_id: number | null
  lecture_sort_order: number | null
  lecture_title: string | null
}

// Query to get sorted lectures from the view
const getLectures = async (supabase) => {
  // TODO: come back and improve this
  const { data, error }: { data: AllSortedLecturesRow[]; error: any } = await supabase
    .from('all_sorted_lectures')
    .select('*')

  if (error) {
    throw new Error(error.message)
  }

  console.log('data', data)
  return data
}

// Custom hook to fetch lectures with sorting
function useLecturesQuery() {
  const supabase = useSupabase()
  const queryKey = ['lectures']

  const queryFn = async () => {
    return getLectures(supabase)
  }

  return useQuery({ queryKey, queryFn })
}

export default useLecturesQuery
