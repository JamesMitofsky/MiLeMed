import { AchievementCard } from '@my/ui'
import { Users } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'
import { YStack, Text, Spinner, Theme } from 'tamagui'

import { supabase } from '../../../utils/supabase/client.native'

const colors = ['orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red', 'gray'] as const

type ListOfModulesProps = {
  limit?: number
}

const ListOfModules = ({ limit }: ListOfModulesProps) => {
  const { data: modules, isLoading } = useQuery(['chapters'], {
    queryFn: async () => {
      let query = supabase.from('chapters').select('*')

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
    },
  })

  if (isLoading) {
    return (
      <YStack padding="$4" alignItems="center">
        <Spinner size="small" />
        <Text marginTop="$2">Loading modules...</Text>
      </YStack>
    )
  }

  return (
    <>
      {modules?.length === 0 ? (
        <Text>No modules found.</Text>
      ) : (
        modules?.map((project, index) => (
          <Theme key={project.id} name={colors[index]}>
            <AchievementCard
              w={300}
              icon={Users}
              title={project.name}
              progress={{ current: 1, full: 1 }}
              action={{
                text: 'Continue',
                href: `/module/${project.id}`,
              }}
            />
          </Theme>
        ))
      )}
    </>
  )
}

export default ListOfModules
