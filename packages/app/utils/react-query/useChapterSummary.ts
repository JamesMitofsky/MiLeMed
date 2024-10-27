import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useSupabase } from '../supabase/useSupabase'

const useChapterSummary = (limit?: number) => {
  const supabase = useSupabase()

  const queryFn = useMemo(() => {
    return async () => {
      let query = supabase.rpc('get_chapter_summary').select('*')

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) {
        if (error.code === 'PGRST116') {
          await supabase.auth.signOut()
          return null
        }
        throw new Error(error.message)
      }

      return data
    }
  }, [limit, supabase])

  return useQuery(['chapters', limit], queryFn)
}

export default useChapterSummary
