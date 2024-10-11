import {
  FullscreenSpinner,
  SubmitButton,
  Theme,
  useMedia,
  useToastController,
  YStack,
} from '@my/ui'
import { useMutation } from '@tanstack/react-query'
import { formFields, SchemaForm } from 'app/utils/SchemaForm'
import { useGlobalStore } from 'app/utils/global-store'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { useRouter } from 'solito/router'
import { z } from 'zod'

const CreateProjectSchema = z.object({
  title: formFields.text.min(10).describe('Name // Name of the module'),
  description: formFields.textarea.describe(
    'Description // Maternity tracking is more than just following mothers...'
  ),
})
export const CreateProjectForm = () => {
  const { setToggleCreateModal } = useGlobalStore()
  const { sm } = useMedia()
  const toast = useToastController()
  const router = useRouter()
  // const apiUtils = api.useUtils()
  const { profile, user } = useUser()
  const supabase = useSupabase()
  // const queryClient = useQueryClient()
  const mutation = useMutation({
    async onError(error) {
      console.log('error', error)
    },
    async mutationFn(data: z.infer<typeof CreateProjectSchema>) {
      await supabase.from('projects').insert({
        name: data.title,
        description: data.description,
        profile_id: user?.id,
      })
    },

    async onSuccess() {
      console.log('success')
      toast.show('Successfully created!')
      if (sm) {
        router.back()
      } else {
        setToggleCreateModal()
      }
      // await queryClient.invalidateQueries(['profile', user.id])
      // await apiUtils.greeting.invalidate()
    },
  })

  if (!profile || !user?.id) {
    return <FullscreenSpinner />
  }

  return (
    <>
      <SchemaForm
        onSubmit={(values) => mutation.mutate(values)}
        schema={CreateProjectSchema}
        defaultValues={{
          title: '',
          description: '',
        }}
        props={{}}
        renderAfter={({ submit }) => (
          <Theme inverse>
            <SubmitButton onPress={() => submit()}>Create Module</SubmitButton>
          </Theme>
        )}
      >
        {(fields) => (
          <YStack gap="$2" py="$4" pb="$0" pt="$0" minWidth="100%" $gtSm={{ minWidth: 480 }}>
            {Object.values(fields)}
          </YStack>
        )}
      </SchemaForm>
    </>
  )
}
