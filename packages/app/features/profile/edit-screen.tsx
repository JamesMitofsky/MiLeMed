import {
  Avatar,
  FullscreenSpinner,
  SubmitButton,
  Theme,
  View,
  YStack,
  useToastController,
} from '@my/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { createParam } from 'solito'
import { SolitoImage } from 'solito/image'
import { useRouter } from 'solito/router'

import { api } from '../../utils/api'
import { z } from '../../utils/zod-de'
import { UploadAvatar } from '../settings/components/upload-avatar'

const { useParams } = createParam<{ edit_name?: '1'; edit_about?: '1' }>()
export const EditProfileScreen = () => {
  const { profile, user } = useUser()

  if (!profile || !user?.id) {
    return <FullscreenSpinner />
  }
  return <EditProfileForm userId={user.id} initial={{ name: profile.name, about: profile.about }} />
}

const ProfileSchema = z.object({
  name: formFields.text.describe('Name // Max Mustermann'), // Changed to a more common German name
  about: formFields.textarea.describe('Über // Erzählen Sie uns ein wenig über sich selbst'),
})

const EditProfileForm = ({
  initial,
  userId,
}: {
  initial: { name: string | null; about: string | null }
  userId: string
}) => {
  const { params } = useParams()
  const supabase = useSupabase()
  const toast = useToastController()
  const queryClient = useQueryClient()
  const router = useRouter()
  const apiUtils = api.useUtils()
  const mutation = useMutation({
    async mutationFn(data: z.infer<typeof ProfileSchema>) {
      await supabase
        .from('profiles')
        .update({ name: data.name, about: data.about })
        .eq('id', userId)
    },

    async onSuccess() {
      toast.show('Erfolgreich aktualisiert!') // Translated message
      await queryClient.invalidateQueries(['profile', userId])
      await apiUtils.greeting.invalidate()
      router.back()
    },
  })

  return (
    <SchemaForm
      schema={ProfileSchema}
      props={{
        name: {
          autoFocus: !!params?.edit_name,
        },
        about: {
          autoFocus: !!params?.edit_about,
        },
      }}
      defaultValues={{
        name: initial.name ?? '',
        about: initial.about ?? '',
      }}
      onSubmit={(values) => mutation.mutate(values)}
      renderAfter={({ submit }) => (
        <Theme inverse>
          <SubmitButton onPress={() => submit()}>Profil aktualisieren</SubmitButton>
        </Theme>
      )}
    >
      {(fields) => (
        <>
          <YStack mb="$4" ai="center">
            <View>
              <UploadAvatar>
                <UserAvatar />
              </UploadAvatar>
            </View>
          </YStack>
          {Object.values(fields)}
        </>
      )}
    </SchemaForm>
  )
}

const UserAvatar = () => {
  const { avatarUrl } = useUser()
  return (
    <Avatar circular size={128}>
      <SolitoImage src={avatarUrl} alt="Ihr Avatar" width={128} height={128} />
    </Avatar>
  )
}
