import { H2, SubmitButton, Theme, YStack, isWeb, useToastController } from '@my/ui'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useRouter } from 'solito/router'
import { z } from 'zod'

const ChangePasswordSchema = z
  .object({
    password: formFields.text.min(6).describe('Neues Passwort // Geben Sie Ihr neues Passwort ein'), // New Password // Enter your new password
    passwordConfirm: formFields.text
      .min(6)
      .describe('Passwort bestätigen // Wiederholen Sie Ihr Passwort'), // Confirm Password // Repeat your password
  })
  .superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        path: ['passwordConfirm'],
        code: 'custom',
        message: 'Die Passwörter stimmen nicht überein', // The passwords do not match
      })
    }
  })
export const ChangePasswordScreen = () => {
  const supabase = useSupabase()
  const toast = useToastController()
  const router = useRouter()

  const handleChangePassword = async ({ password }: z.infer<typeof ChangePasswordSchema>) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      toast.show(error.message)
    } else {
      toast.show('Erfolgreich aktualisiert!')
      if (!isWeb) {
        router.back()
      }
    }
  }

  return (
    <SchemaForm
      onSubmit={handleChangePassword}
      schema={ChangePasswordSchema}
      defaultValues={{
        password: '',
        passwordConfirm: '',
      }}
      props={{
        password: {
          secureTextEntry: true,
        },
        passwordConfirm: {
          secureTextEntry: true,
        },
      }}
      renderBefore={() =>
        isWeb && (
          <YStack px="$4" py="$4" pb="$2">
            <H2>Passwort ändern</H2>
          </YStack>
        )
      }
      renderAfter={({ submit }) => (
        <Theme inverse>
          <SubmitButton onPress={() => submit()}>Passwort aktualisieren</SubmitButton>
        </Theme>
      )}
    />
  )
}
