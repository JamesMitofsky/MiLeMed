import { AchievementCard, ScrollView } from '@my/ui'
import { Users } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'
import { useLink } from 'solito/link'
import { YStack, Text, Spinner, Theme } from 'tamagui'

import { supabase } from '../../utils/supabase/client.native'

const colors = ['orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red', 'gray'] as const

const ViewModulesScreen = () => {
  const linkProps = useLink({ href: '#' })

  const { data: modules, isLoading } = useQuery(['projects'], {
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*')
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
    <YStack padding="$4">
      <Text fontSize="$5" fontWeight="bold" marginBottom="$4">
        Modules
      </Text>

      <ScrollView snapToAlignment="start">
        <YStack px="$4" fw="wrap" f={1} gap="$3">
          {modules?.length === 0 ? (
            <Text>No modules found.</Text>
          ) : (
            modules?.map((project, index) => (
              // <ProjectItem key={project.id}>
              //   <Text fontSize="$4">{project.name}</Text>
              //   <Text fontSize="$4">{project.description}</Text>
              //   {/* Add more project details here if needed */}
              // </ProjectItem>
              <Theme name={colors[index]}>
                <AchievementCard
                  w={300}
                  // $gtMd={{
                  //   width: halfMinusSpace,
                  // }}
                  // $gtLg={{
                  //   w: quarterMinusSpace,
                  // }}
                  icon={Users}
                  title={project.name}
                  progress={{ current: 1, full: 1 }}
                  action={{
                    text: project?.description || '',
                    props: linkProps,
                  }}
                />
              </Theme>
            ))
          )}
        </YStack>
      </ScrollView>
    </YStack>
  )
}

export default ViewModulesScreen
