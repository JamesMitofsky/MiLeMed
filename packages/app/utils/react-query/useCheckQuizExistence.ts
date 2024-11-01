import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'

export const useCheckQuizExistence = (lectureId: string) => {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ['quizExists', lectureId],
    queryFn: async (lectureId) => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('id', { count: 'exact', head: true })
        .eq('lecture_id', lectureId)

      if (error) throw new Error(error.message)

      return { exists: data.length > 0 }
    },
    staleTime: Infinity, // adjust based on your app's needs
    cacheTime: Infinity, // adjust based on your app's needs
  })
}
