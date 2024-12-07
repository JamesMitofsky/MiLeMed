import {
  Avatar,
  FullscreenSpinner,
  SizableText,
  SubmitButton,
  Theme,
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
import { UserRoleType } from '../../utils/supabase/databaseTypes'
import { z } from '../../utils/zod-de'

const { useParams } = createParam<{ edit_name?: ''; edit_about?: '' }>()
export const EditProfileScreen = () => {
  const { profile, user } = useUser()

  if (!profile || !user?.id) {
    return <FullscreenSpinner />
  }
  return (
    <EditProfileForm
      userId={user.id}
      initial={{
        name: profile.name,
        role: profile.role,
        clinicalSemeseter: profile.clinical_semester,
        overallSemester: profile.overall_semester,
      }}
    />
  )
}

const ProfileSchema = z.object({
  name: formFields.text.describe('Name // Max Mustermann'), // Changed to a more common German name
})

const EditProfileForm = ({
  initial,
  userId,
}: {
  initial: {
    name: string | null
    role: UserRoleType | null
    clinicalSemeseter: number | null
    overallSemester: number | null
  }
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
      await supabase.from('profiles').update({ name: data.name }).eq('id', userId)
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
      }}
      defaultValues={{
        name: initial.name ?? '',
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
            <UserAvatar />
          </YStack>
          {Object.values(fields)}
          {initial.role === 'STUDENT' && (
            <>
              <YStack gap="$2">
                <SizableText size="$4">Fachsemester</SizableText>
                <SizableText size="$3">
                  {initial.overallSemester
                    ? initial.overallSemester
                    : 'Fachsemester nicht angegeben'}
                </SizableText>
              </YStack>
              <YStack gap="$2">
                <SizableText size="$4">Klinisches Semester</SizableText>
                <SizableText size="$3">
                  {initial.clinicalSemeseter
                    ? initial.clinicalSemeseter
                    : 'Klinisches Semester nicht angegeben'}
                </SizableText>
              </YStack>
            </>
          )}
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
