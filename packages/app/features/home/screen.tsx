import {
  ScrollView,
  XStack,
  YStack,
  Input,
  Button,
  Text,
  H1,
  useToastController,
  FullscreenSpinner,
  SizableText,
} from '@my/ui'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useForm, Controller } from 'react-hook-form'

import { UserRoleEnum } from '../../types/userRoleEnum'
import { GenderType, ProfilesType } from '../../utils/supabase/databaseTypes'
import { useUser } from '../../utils/useUser'
import { CustomSelect } from '../general/CustomSelect'

type ProfileFormType = Pick<ProfilesType, 'name' | 'gender' | 'age' | 'semester_number' | 'role'>

interface RoleOption {
  label: string
  value: UserRoleEnum
}

const roleOptions: RoleOption[] = [
  { label: 'Medizinischer Fachmann / Administrator', value: UserRoleEnum.MEDICAL_PROFESSIONAL },
  { label: 'Student', value: UserRoleEnum.STUDENT_TESTER },
]

interface GenderOption {
  label: string
  value: GenderType
}
const genderOptions: GenderOption[] = [
  { label: 'Weiblich', value: 'FEMALE' },
  { label: 'Männlich', value: 'MALE' },
  { label: 'Divers', value: 'OTHER' },
]

export function HomeScreen() {
  const supabase = useSupabaseClient()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormType>({
    defaultValues: {
      name: '',
      age: undefined,
      gender: undefined,
      semester_number: undefined,
    },
  })
  const { profile, isLoadingProfile } = useUser()
  const toast = useToastController()

  const onSubmit = async (data) => {
    const { data: responseData, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', profile?.id)

    if (error) toast.show('Something went wrong with the update')
    else {
      console.log('successfully updated user', responseData)
      toast.show('Profile updated successfully')
    }
  }

  if (isLoadingProfile) {
    return <FullscreenSpinner />
  }

  return (
    <XStack maw={1480} als="center" f={1}>
      <ScrollView f={4} fb={0}>
        <YStack gap="$4" p="$10">
          {profile?.role ? (
            // If the role is already set, show confirmation message
            <YStack p="$10" gap="$6" justifyContent="center" alignItems="center" mt="$10">
              <SizableText size="$6">
                Ihr Profil ist vollständig eingerichtet, gute Arbeit! 🙌
              </SizableText>
              <SizableText>Weiter in der App</SizableText>
              {/* TODO: Add confetti animation here */}
            </YStack>
          ) : (
            // If no role is set, show the form
            <>
              <H1 size="$9" fontWeight="bold">
                Complete Registration
              </H1>
              <Controller
                name="name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input placeholder="Name" value={value || ''} onChangeText={onChange} />
                )}
              />
              <Controller
                name="age"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Age"
                    keyboardType="numeric"
                    value={value ? value.toString() : ''}
                    onChangeText={(text) => onChange(Number(text))}
                  />
                )}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <CustomSelect
                    placeholder="Gender"
                    value={value || ''}
                    {...field}
                    items={genderOptions}
                  />
                )}
              />
              <Controller
                name="semester_number"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Semester Number"
                    keyboardType="numeric"
                    value={value ? value.toString() : ''}
                    onChangeText={(text) => onChange(Number(text))}
                  />
                )}
              />
              <Controller
                name="role"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <CustomSelect
                    placeholder="Role"
                    value={value || ''}
                    {...field}
                    items={roleOptions}
                  />
                )}
              />
              <Button onPress={handleSubmit(onSubmit)}>
                <Text>Submit</Text>
              </Button>
            </>
          )}
        </YStack>
      </ScrollView>
    </XStack>
  )
}
