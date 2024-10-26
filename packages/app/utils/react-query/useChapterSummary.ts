import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'

const useChapterSummary = (limit?: number) => {
  const supabase = useSupabase()

  return useQuery(['chapters'], async () => {
    let query = supabase.rpc('get_chapter_summary').select('*')

    if (typeof limit === 'number') {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      // no rows - edge case of user being deleted
      if (error.code === 'PGRST116') {
        await supabase.auth.signOut()
        return null
      }
      throw new Error(error.message)
    }

    return data
  })
}

export default useChapterSummary
