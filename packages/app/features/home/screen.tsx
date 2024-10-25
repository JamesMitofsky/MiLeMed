import { zodResolver } from '@hookform/resolvers/zod'
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
import { z } from '../../utils/zod-de'
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

// Define Zod schema for validation
const profileSchema = z.object({
  name: z.string().min(1, { message: 'Name ist erforderlich' }),
  age: z.number().min(1, { message: 'Alter ist erforderlich' }),
  gender: z.enum(['FEMALE', 'MALE', 'OTHER'], {
    errorMap: () => ({ message: 'Geschlecht ist erforderlich' }),
  }),
  semester_number: z.number().min(1, { message: 'Semesterzahl ist erforderlich' }),
  role: z.nativeEnum(UserRoleEnum, { errorMap: () => ({ message: 'Rolle ist erforderlich' }) }),
})

export function HomeScreen() {
  const supabase = useSupabaseClient()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      age: undefined,
      gender: undefined,
      semester_number: undefined,
      role: undefined,
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
            <YStack p="$10" gap="$6" justifyContent="center" alignItems="center" mt="$10">
              <SizableText size="$6">
                Ihr Profil ist vollständig eingerichtet, gute Arbeit! 🙌
              </SizableText>
              <SizableText>Weiter in der App</SizableText>
              {/* TODO: Add confetti animation here */}
            </YStack>
          ) : (
            <>
              <H1 size="$9" fontWeight="bold">
                Registrierung abschließen
              </H1>
              <Controller
                name="name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Name"
                    value={value || ''}
                    onChangeText={onChange}
                    style={{ borderColor: errors.name ? 'red' : undefined }}
                  />
                )}
              />
              {errors.name && <Text color="red">{errors.name.message}</Text>}

              <Controller
                name="age"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Alter"
                    keyboardType="numeric"
                    value={value ? value.toString() : ''}
                    onChangeText={(text) => onChange(Number(text))}
                    style={{ borderColor: errors.age ? 'red' : undefined }}
                  />
                )}
              />
              {errors.age && <Text color="red">{errors.age.message}</Text>}

              <Controller
                name="gender"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <CustomSelect
                    placeholder="Geschlecht"
                    value={value || ''}
                    {...field}
                    items={genderOptions}
                  />
                )}
              />
              {errors.gender && <Text color="red">{errors.gender.message}</Text>}

              <Controller
                name="semester_number"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Semesterzahl"
                    keyboardType="numeric"
                    value={value ? value.toString() : ''}
                    onChangeText={(text) => onChange(Number(text))}
                    style={{ borderColor: errors.semester_number ? 'red' : undefined }}
                  />
                )}
              />
              {errors.semester_number && <Text color="red">{errors.semester_number.message}</Text>}

              <Controller
                name="role"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <CustomSelect
                    placeholder="Rolle"
                    value={value || ''}
                    {...field}
                    items={roleOptions}
                  />
                )}
              />
              {errors.role && <Text color="red">{errors.role.message}</Text>}

              <Button onPress={handleSubmit(onSubmit)}>
                <Text>Absenden</Text>
              </Button>
            </>
          )}
        </YStack>
      </ScrollView>
    </XStack>
  )
}
