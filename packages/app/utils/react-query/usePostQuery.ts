import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'

const getLectures = async (supabase) => {
  return supabase.from('lectures').select('*').order('sort_order', { ascending: false })
}

function useLecturesQuery() {
  const supabase = useSupabase()
  const queryKey = ['lectures']

  const queryFn = async () => {
    return getLectures(supabase).then((result) => result.data)
  }

  return useQuery({ queryKey, queryFn })
}

export default useLecturesQuery
