import { zodResolver } from '@hookform/resolvers/zod'
import {
  ScrollView,
  YStack,
  useToastController,
  FullscreenSpinner,
  XStack,
  SizableText,
  useMedia,
  Button,
  H1,
  Input,
  Progress,
  Text,
  Link,
} from '@my/ui'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import ReactCanvasConfetti from 'react-canvas-confetti'
import { TCanvasConfettiInstance } from 'react-canvas-confetti/dist/types'
import { Controller, useForm } from 'react-hook-form'

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
  { label: 'Student', value: UserRoleEnum.STUDENT },
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
    watch,
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
  const { profile, updateProfile } = useUser()
  const toast = useToastController()
  // means medium or smaller
  const { md } = useMedia()

  const instance = useRef<TCanvasConfettiInstance>()

  const onInitHandler = ({ confetti }: { confetti: TCanvasConfettiInstance }) =>
    (instance.current = confetti)

  const onShootHandler = useCallback(() => {
    instance.current?.({
      particleCount: md ? 70 : 170,
      spread: md ? 60 : 120,
      origin: { x: 0.5, y: md ? 0.64 : 0.4 },
      ticks: 250,
    })
  }, [md, instance])

  console.log(md)

  const onSubmit = async (data) => {
    const { data: responseData, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', profile?.id)
    if (error) toast.show('Something went wrong with the update')
    else {
      // onShootHandler()
      updateProfile()
      console.log('successfully updated user', responseData)
      // toast.show('Profile updated successfully')
    }
  }

  useEffect(() => {
    if (profile?.role) {
      onShootHandler()
    }
  }, [profile?.role])

  const formValues = watch()
  const progress = useMemo(() => {
    const totalFields = 5
    const filledFields = Object.values(formValues).filter(
      (value) => value !== undefined && value !== ''
    ).length
    return (filledFields / totalFields) * 100
  }, [formValues])

  return (
    <XStack maw={1480} als="center" ai="center" f={1}>
      <ReactCanvasConfetti onInit={onInitHandler} />
      <ScrollView f={1} fb={0}>
        <YStack gap="$4" p="$10" f={1}>
          {!profile?.id ? (
            <FullscreenSpinner />
          ) : profile?.role ? (
            <YStack pb="$10" gap="$6" justifyContent="center" alignItems="center" pt="$0">
              <SizableText size="$6" textAlign="center">
                Ihr Profil ist vollständig eingerichtet, gute Arbeit!
              </SizableText>

              <XStack>
                <SizableText>Weiter in </SizableText>

                <Link
                  style={{ textDecoration: 'underline', color: '#408bab' }}
                  href="de.milemed.app://sign-in"
                >
                  Gehe zu den Kapiteln
                </Link>

                <SizableText> 🙌</SizableText>
              </XStack>
            </YStack>
          ) : (
            <>
              <H1 size="$9" fontWeight="bold">
                Registrierung abschließen
              </H1>
              <Progress value={progress}>
                <Progress.Indicator animation="bouncy" />
              </Progress>
              <Controller
                name="name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Name"
                    value={value || ''}
                    autoComplete="given-name"
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
                    autoComplete="birthdate-year"
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
                    placeholder="Wer bist du?"
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
