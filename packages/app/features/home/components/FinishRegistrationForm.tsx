import { zodResolver } from '@hookform/resolvers/zod'
import { Database } from '@my/supabase/types'
import {
  Button,
  Checkbox,
  FullscreenSpinner,
  H1,
  Input,
  ScrollView,
  SizableText,
  Text,
  XStack,
  YStack,
  useToastController,
} from '@my/ui'
import { Check } from '@tamagui/lucide-icons'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { useUserProfile } from 'app/utils/hooks/queryHooks'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { UserProfile } from 'app/utils/supabase/databaseTypes'
import { CustomSelect } from '../../general/CustomSelect'
import { MinimalDatePicker } from './MinimalDatePicker'

type ProfileFormType = Partial<UserProfile>

const getRoleByEmailEnding = (email: string): Database['public']['Enums']['user_role'] => {
  if (email.endsWith('@uni-bonn.de')) {
    return 'STUDENT'
  }
  return 'MEDICAL_PROFESSIONAL'
}

interface GenderOption {
  label: string
  value: Database['public']['Enums']['gender']
}

const genderOptions: GenderOption[] = [
  { label: 'Weiblich', value: 'FEMALE' },
  { label: 'Männlich', value: 'MALE' },
  { label: 'Divers', value: 'OTHER' },
]

// Dynamic Zod Schema
const profileSchema = (isStudent: boolean) =>
  z
    .object({
      name: z.string().min(1, { message: 'Dein Name ist erforderlich' }),
      birthdate: isStudent
        ? z.date({ required_error: 'Dein Alter ist erforderlich' })
        : z.date().optional(),
      gender: isStudent
        ? z.enum(['FEMALE', 'MALE', 'OTHER'], {
            errorMap: () => ({ message: 'Dein Geschlecht ist erforderlich' }),
          })
        : z.enum(['FEMALE', 'MALE', 'OTHER']).optional(),
      overall_semester: isStudent
        ? z.number().min(1, { message: 'Deine Semesterzahl ist erforderlich' })
        : z.number().optional(),
      hasDoneClinicalSemester: z.boolean().optional(),
      clinical_semester: z
        .number()
        .min(1, { message: 'Deine Semesterzahl ist erforderlich' })
        .max(6, {
          message:
            'Das klinische Semester muss zwischen 1 und 6 liegen. Wenn du denkst, dass du eine Ausnahme bist, kontaktiere uns bitte unter hilfe@milemed.de.',
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.hasDoneClinicalSemester &&
        (data.clinical_semester == null || data.clinical_semester === undefined)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom, // Required to specify the type of issue
          path: ['clinical_semester'], // Path to the problematic field
          message:
            'Wenn du ein klinisches Semester absolviert hast, gib bitte an, in welchem Semester du dich befindest. Falls nicht, aktiviere das Kästchen nicht.',
        })
      }
    })

type ProfileInputType = z.infer<ReturnType<typeof profileSchema>>

interface FinishRegistrationFormProps {
  onSuccess?: () => void
}

export const FinishRegistrationForm: React.FC<FinishRegistrationFormProps> = ({ onSuccess }) => {
  const supabase = useSupabase()
  const { user } = useUser()
  const userProfile = useUserProfile()
  const toast = useToastController()
  const [isPendingUpdate, setIsPendingUpdate] = useState(false)

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

  const onSubmit = async ({ hasDoneClinicalSemester, ...data }: ProfileInputType) => {
    if (!user?.id) {
      toast.show('Beim Aktualisieren des Profils ist ein Fehler aufgetreten.', { type: 'error' })
      return
    }

    setIsPendingUpdate(true)

    const role = getRoleByEmailEnding(user?.email || '')

    const transformedData: ProfileFormType = {
      ...data,
      birthdate: data.birthdate ? data.birthdate.toISOString() : null,
      gender: data.gender || null,
      clinical_semester: data.clinical_semester || null,
      overall_semester: data.overall_semester || null,
      role,
    }

    // Try to update first, if that fails (no profile exists), then create one
    const { error: updateError } = await supabase
      .from('users_profiles')
      .update(transformedData)
      .eq('id', user.id)

    if (updateError?.code === 'PGRST116') {
      // No rows updated
      // Create new profile
      const { error: insertError } = await supabase
        .from('users_profiles')
        .insert({ ...transformedData, id: user.id })
        .select()
        .single()

      if (insertError) {
        toast.show('Beim Erstellen des Profils ist ein Fehler aufgetreten.', { type: 'error' })
        setIsPendingUpdate(false)
        return
      }
    } else if (updateError) {
      toast.show('Beim Aktualisieren des Profils ist ein Fehler aufgetreten.', { type: 'error' })
      setIsPendingUpdate(false)
      return
    }

    try {
      await userProfile.updateProfile.mutateAsync(transformedData)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.show('Beim Aktualisieren des Profils ist ein Fehler aufgetreten.', { type: 'error' })
    } finally {
      setIsPendingUpdate(false)
    }
  }

  const hasDoneClinicalSemester = watch('hasDoneClinicalSemester')

  return isPendingUpdate ? (
    <FullscreenSpinner />
  ) : (
    <XStack maw={1480} als="center" ai="center" f={1}>
      <ScrollView f={1} fb={0}>
        <YStack gap="$6" p="$5" f={1}>
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
                  <MinimalDatePicker placeholder="Geburtsdatum" onChange={onChange} value={value} />
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

              <XStack gap="$3" ai="center">
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
        </YStack>
      </ScrollView>
    </XStack>
  )
}
