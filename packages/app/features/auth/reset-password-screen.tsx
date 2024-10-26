import { Button, FormWrapper, H2, Paragraph, SubmitButton, Text, Theme, YStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useEffect } from 'react'
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form'
import { createParam } from 'solito'
import { Link } from 'solito/link'

import { z } from '../../utils/zod-de'

const { useParams, useUpdateParams } = createParam<{ email?: string }>()

const ResetPasswordSchema = z.object({
  email: formFields.text.email().describe('E-Mail // deine@uni-bonn.de'),
})

export const ResetPasswordScreen = () => {
  const supabase = useSupabase()
  const { params } = useParams()
  const updateParams = useUpdateParams()
  useEffect(() => {
    if (params?.email) {
      updateParams({ email: undefined }, { web: { replace: true } })
    }
  }, [params?.email, updateParams])

  const form = useForm<z.infer<typeof ResetPasswordSchema>>()

  async function resetPassword({ email }: z.infer<typeof ResetPasswordSchema>) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      const errorMessage = error?.message.toLowerCase()
      if (errorMessage.includes('email')) {
        form.setError('email', { type: 'custom', message: errorMessage })
      } else {
        form.setError('email', { type: 'custom', message: errorMessage })
      }
    }
  }

  return (
    <FormProvider {...form}>
      {form.formState.isSubmitSuccessful ? (
        <CheckYourEmail />
      ) : (
        <SchemaForm
          form={form}
          schema={ResetPasswordSchema}
          defaultValues={{
            email: params?.email || '',
          }}
          onSubmit={resetPassword}
          renderAfter={({ submit }) => {
            return (
              <>
                <Theme inverse>
                  <SubmitButton onPress={() => submit()} br="$10">
                    Link senden
                  </SubmitButton>
                </Theme>
                <SignInLink />
              </>
            )
          }}
        >
          {(fields) => (
            <>
              <YStack gap="$3" mb="$4">
                <H2 $sm={{ size: '$8' }}>Setze dein Passwort zurück</H2>
                <Paragraph theme="alt1">
                  Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen deines
                  Passworts
                </Paragraph>
              </YStack>
              {Object.values(fields)}
            </>
          )}
        </SchemaForm>
      )}
    </FormProvider>
  )
}

const CheckYourEmail = () => {
  const email = useWatch<z.infer<typeof ResetPasswordSchema>>({ name: 'email' })
  const { reset } = useFormContext()

  return (
    <FormWrapper>
      <FormWrapper.Body>
        <YStack gap="$3">
          <H2>Überprüfe deine E-Mail</H2>
          <Paragraph theme="alt1">
            Wir haben dir einen Bestätigungslink gesendet. Bitte überprüfe deine E-Mail ({email})
            und bestätige sie.
          </Paragraph>
        </YStack>
      </FormWrapper.Body>
      <FormWrapper.Footer>
        <Button themeInverse icon={ChevronLeft} br="$10" onPress={() => reset()}>
          Zurück
        </Button>
      </FormWrapper.Footer>
    </FormWrapper>
  )
}

const SignInLink = () => {
  const email = useWatch<z.infer<typeof ResetPasswordSchema>>({ name: 'email' })

  return (
    <Link href={`/sign-in?${new URLSearchParams(email ? { email } : undefined)}`}>
      <Paragraph ta="center" theme="alt1">
        Passwort zurückgesetzt? <Text textDecorationLine="underline">Einloggen</Text>
      </Paragraph>
    </Link>
  )
}
