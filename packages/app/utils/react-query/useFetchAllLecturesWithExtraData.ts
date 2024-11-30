import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'

function useFetchAllLecturesWithExtraData() {
  const supabase = useSupabase()
  const queryKey = ['sortedLectures']

  const queryFn = async () => {
    const { data, error } = await supabase.rpc('get_all_sorted_lectures').select('*')

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  return useQuery({
    queryKey,
    queryFn,
  })
}

export default useFetchAllLecturesWithExtraData
