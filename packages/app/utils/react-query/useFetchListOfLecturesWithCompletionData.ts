import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'

type UseFetchListOfLecturesWithCompletionDataProps = {
  chapterId: number
  limit?: number
}

const useFetchListOfLecturesWithCompletionData = ({
  chapterId,
  limit,
}: UseFetchListOfLecturesWithCompletionDataProps) => {
  const supabase = useSupabase()

  const { data, error, isLoading } = useQuery(
    ['lectures_with_completion', chapterId],
    async () => {
      const { data, error } = await supabase
        .rpc('get_lectures_with_completion', {
          p_chapter_id: chapterId,
        })
        .order('sort_order', { ascending: true })

      if (error) {
        throw new Error(error.message)
      }

      // Apply limit if necessary
      if (limit && data) {
        return data.slice(0, limit)
      }

      return data
    },
    {
      enabled: !!chapterId,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
    }
  )

  return {
    data,
    isLoading,
    error,
  }
}

export default useFetchListOfLecturesWithCompletionData
