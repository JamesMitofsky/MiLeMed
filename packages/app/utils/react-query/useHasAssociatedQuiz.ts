import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'

export const useHasAssociatedQuiz = (lectureId: number) => {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['quizExists', lectureId],
    queryFn: async ({ queryKey }) => {
      const [_key, lectureId] = queryKey

      const { data, error } = await supabase
        .from('quiz_questions')
        .select('id')
        .eq('lecture_id', lectureId)
        .limit(1)

      if (error) throw new Error(error.message)

      return { exists: data.length > 0 }
    },
    staleTime: Infinity, // adjust based on your app's needs
    cacheTime: Infinity, // adjust based on your app's needs
  })
}
