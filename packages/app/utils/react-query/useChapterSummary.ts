import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useSupabase } from '../supabase/useSupabase'
import { useUser } from '../useUser'

const useChapterSummary = (limit?: number) => {
  const supabase = useSupabase()
  const { user } = useUser()

  const queryFn = useMemo(() => {
    return async () => {
      if (!user?.id) {
        throw new Error('User ID is not available')
      }

      // Define the RPC call
      let query = supabase.rpc('get_chapter_summary', { user_id: user.id })

      // Apply the limit directly on the query
      if (limit) {
        query = query.limit(limit)
      }

      // Execute the query
      const { data, error } = await query

      if (error) {
        // Handle unauthorized access by signing out if relevant
        if (error.code === 'PGRST116') {
          // Confirm that `PGRST116` is an appropriate code for this scenario
          await supabase.auth.signOut()
          return null
        }
        throw new Error(error.message)
      }

      return data
    }
  }, [limit, supabase, user?.id]) // Add `user?.id` to dependencies

  return useQuery(['chapters', user?.id, limit], queryFn) // Add `user?.id` to query key
}

export default useChapterSummary
