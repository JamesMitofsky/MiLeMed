import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'

const getLectureById = async (supabase, id) => {
  return supabase.from('lectures').select('*').eq('id', id).single()
}

function useFetchSingleLecture(id) {
  const supabase = useSupabase()
  const queryKey = ['lecture', id]

  const queryFn = async () => {
    return getLectureById(supabase, id).then((result) => result.data)
  }

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!id, // Only run the query if id is available
  })
}

export default useFetchSingleLecture
