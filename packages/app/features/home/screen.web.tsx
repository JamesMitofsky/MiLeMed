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
  Text,
  Link,
  DatePickerForControl,
  Checkbox,
} from '@my/ui'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Check } from '@tamagui/lucide-icons'
import { useCallback, useEffect, useRef } from 'react'
import ReactCanvasConfetti from 'react-canvas-confetti'
import { TCanvasConfettiInstance } from 'react-canvas-confetti/dist/types'
import { Controller, useForm } from 'react-hook-form'

import { GenderType, ProfilesType, UserRoleType } from '../../utils/supabase/databaseTypes'
import { useUser } from '../../utils/useUser'
import { z } from '../../utils/zod-de'
import { CustomSelect } from '../general/CustomSelect'

type ProfileFormType = Pick<
  ProfilesType,
  'name' | 'gender' | 'clinical_semester' | 'overall_semester' | 'birthdate' | 'role'
>

const getRoleByEmailEnding = (email: string): UserRoleType => {
  if (email.endsWith('@uni-bonn.de')) {
    return 'STUDENT'
  }
  return 'MEDICAL_PROFESSIONAL'
}

interface GenderOption {
  label: string
  value: GenderType
}
const genderOptions: GenderOption[] = [
  { label: 'Weiblich', value: 'FEMALE' },
  { label: 'Männlich', value: 'MALE' },
  { label: 'Divers', value: 'OTHER' },
]

// Dynamic Zod Schema
const profileSchema = (isStudent: boolean) =>
  z.object({
    name: z.string().min(1, { message: 'Name ist erforderlich' }),
    birthdate: isStudent
      ? z.date({ required_error: 'Alter ist erforderlich' })
      : z.date().optional(),
    gender: isStudent
      ? z.enum(['FEMALE', 'MALE', 'OTHER'], {
          errorMap: () => ({ message: 'Geschlecht ist erforderlich' }),
        })
      : z.enum(['FEMALE', 'MALE', 'OTHER']).optional(),
    overall_semester: isStudent
      ? z.number().min(1, { message: 'Semesterzahl ist erforderlich' })
      : z.number().optional(),
    hasDoneClinicalSemester: z.boolean().optional(),
    clinical_semester: isStudent
      ? z
          .number()
          .min(1, { message: 'Semesterzahl ist erforderlich' })
          .max(6, {
            message:
              'Klinisches Semester muss zwischen 1 und 6 liegen. Wenn Sie denken, dass Sie eine Ausnahme sind, kontaktieren Sie uns bitte unter hilfe@milemed.de',
          })
          .optional()
      : z.number().optional(),
  })

type ProfileInputType = z.infer<ReturnType<typeof profileSchema>>

export function HomeScreen() {
  const supabase = useSupabaseClient()
  const { profile, updateProfile, user } = useUser()
  const toast = useToastController()
  const { md } = useMedia()
  const isUserWithStudentEmail = user?.email?.endsWith('@uni-bonn.de')

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileInputType>({
    resolver: zodResolver(profileSchema(isUserWithStudentEmail || false)),
    defaultValues: {
      name: '',
      birthdate: undefined,
      gender: undefined,
      clinical_semester: undefined,
      overall_semester: undefined,
      hasDoneClinicalSemester: false,
    },
  })

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
  }, [md])

  const onSubmit = async ({ hasDoneClinicalSemester, ...data }: ProfileInputType) => {
    const role = getRoleByEmailEnding(user?.email || '')
    const transformedData: ProfileFormType = {
      ...data,
      birthdate: data.birthdate ? data.birthdate.toISOString() : null,
      gender: data.gender || null,
      clinical_semester: data.clinical_semester || null,
      overall_semester: data.overall_semester || null,
      role,
    }

    const { data: responseData, error } = await supabase
      .from('profiles')
      .update(transformedData)
      .eq('id', profile?.id)

    if (error) {
      toast.show('Beim Aktualisieren des Profils ist ein Fehler aufgetreten.', { type: 'error' })
    } else {
      updateProfile()
      toast.show('Profil erfolgreich aktualisiert.', { type: 'success' })
    }
  }

  useEffect(() => {
    if (profile?.role) {
      onShootHandler()
    }
  }, [profile?.role])

  const hasDoneClinicalSemester = watch('hasDoneClinicalSemester')

  return (
    <XStack maw={1480} als="center" ai="center" f={1}>
      <ReactCanvasConfetti onInit={onInitHandler} />
      <ScrollView f={1} fb={0}>
        <YStack gap="$6" p="$10" f={1}>
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

              {isUserWithStudentEmail && (
                <>
                  <Controller
                    name="birthdate"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePickerForControl
                        placeholder="Geburtsdatum"
                        onChangeText={(dateAsString) => onChange(new Date(dateAsString))}
                      />
                    )}
                  />
                  {errors.birthdate && <Text color="red">{errors.birthdate.message}</Text>}

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
                    name="overall_semester"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Fachsemester"
                        keyboardType="numeric"
                        value={value ? value.toString() : ''}
                        onChangeText={(text) => onChange(Number(text))}
                        style={{ borderColor: errors.overall_semester ? 'red' : undefined }}
                      />
                    )}
                  />
                  {errors.overall_semester && (
                    <Text color="red">{errors.overall_semester.message}</Text>
                  )}

                  <XStack gap="$3">
                    <SizableText>Hast du schon mal ein klinisches Semester gemacht?</SizableText>
                    <Controller
                      name="hasDoneClinicalSemester"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(v === true)}
                          size="$4"
                        >
                          <Checkbox.Indicator>
                            <Check />
                          </Checkbox.Indicator>
                        </Checkbox>
                      )}
                    />
                  </XStack>

                  {hasDoneClinicalSemester && (
                    <>
                      <Controller
                        name="clinical_semester"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Input
                            placeholder="Klinisches Semester"
                            keyboardType="numeric"
                            value={value ? value.toString() : ''}
                            onChangeText={(text) => onChange(Number(text))}
                            style={{ borderColor: errors.clinical_semester ? 'red' : undefined }}
                          />
                        )}
                      />
                      {errors.clinical_semester && (
                        <Text color="red">{errors.clinical_semester.message}</Text>
                      )}
                    </>
                  )}
                </>
              )}
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
