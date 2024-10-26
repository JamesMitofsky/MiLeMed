import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'
import { useUser } from '../useUser'

const getLectureEvents = async (supabase, userId) => {
  return supabase
    .from('lecture_events')
    .select('*')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })
    .limit(4)
}

function useEventsQuery() {
  const supabase = useSupabase()
  const queryKey = ['lecture_events']
  const { user } = useUser()

  const queryFn = async () => {
    return getLectureEvents(supabase, user?.id).then((result) => result.data)
  }

  return useQuery({ queryKey, queryFn })
}

export default useEventsQuery
