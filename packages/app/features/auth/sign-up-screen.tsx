import {
  Button,
  FormWrapper,
  H2,
  Paragraph,
  SizableText,
  SubmitButton,
  Text,
  Theme,
  XStack,
  YStack,
} from '@my/ui'
import { LogIn } from '@tamagui/lucide-icons'
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useEffect } from 'react'
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form'
import { createParam } from 'solito'
import { useLink, Link } from 'solito/link'
import { useRouter } from 'solito/router'

import { z } from '../../utils/zod-de'

const { useParams, useUpdateParams } = createParam<{ email?: string }>()

const emailPattern = /^[a-zA-Z0-9._%+-]+@uni-bonn\.de$|^jamesmitofsky@gmail\.com$/

const SignUpSchema = z.object({
  email: formFields.text
    .email()
    .regex(emailPattern, 'E-Mail muss die Domain "@uni-bonn.de" haben') // Validate domain
    .describe('E-Mail // jona@uni-bonn.de'),
  password: formFields.text.min(6).describe('Passwort // Wähle ein Passwort'),
  hasAgreedToPrivacyPolicy: formFields.boolean_checkbox.describe(''),
})

const PrivacyPolicyDescription = () => (
  <YStack theme="alt1" width="80%">
    <XStack>
      <SizableText size="$2">Ich willige in </SizableText>
      <Link {...useLink({ href: '/privacy-policy' })}>
        <SizableText size="$2" textDecorationLine="underline" color="$blue10Light">
          die Nutzung meiner Daten
        </SizableText>
      </Link>
    </XStack>
    <SizableText size="$2">
      durch diese App in dieser Studie und in zukünftigen Studien ein.
    </SizableText>
  </YStack>
)

// //TODO import this from supabase/auth
type ErrorCode =
  | 'unexpected_failure'
  | 'validation_failed'
  | 'bad_json'
  | 'email_exists'
  | 'phone_exists'
  | 'bad_jwt'
  | 'not_admin'
  | 'no_authorization'
  | 'user_not_found'
  | 'session_not_found'
  | 'flow_state_not_found'
  | 'flow_state_expired'
  | 'signup_disabled'
  | 'user_banned'
  | 'provider_email_needs_verification'
  | 'invite_not_found'
  | 'bad_oauth_state'
  | 'bad_oauth_callback'
  | 'oauth_provider_not_supported'
  | 'unexpected_audience'
  | 'single_identity_not_deletable'
  | 'email_conflict_identity_not_deletable'
  | 'identity_already_exists'
  | 'email_provider_disabled'
  | 'phone_provider_disabled'
  | 'too_many_enrolled_mfa_factors'
  | 'mfa_factor_name_conflict'
  | 'mfa_factor_not_found'
  | 'mfa_ip_address_mismatch'
  | 'mfa_challenge_expired'
  | 'mfa_verification_failed'
  | 'mfa_verification_rejected'
  | 'insufficient_aal'
  | 'captcha_failed'
  | 'saml_provider_disabled'
  | 'manual_linking_disabled'
  | 'sms_send_failed'
  | 'email_not_confirmed'
  | 'phone_not_confirmed'
  | 'reauth_nonce_missing'
  | 'saml_relay_state_not_found'
  | 'saml_relay_state_expired'
  | 'saml_idp_not_found'
  | 'saml_assertion_no_user_id'
  | 'saml_assertion_no_email'
  | 'user_already_exists'
  | 'sso_provider_not_found'
  | 'saml_metadata_fetch_failed'
  | 'saml_idp_already_exists'
  | 'sso_domain_already_exists'
  | 'saml_entity_id_mismatch'
  | 'conflict'
  | 'provider_disabled'
  | 'user_sso_managed'
  | 'reauthentication_needed'
  | 'same_password'
  | 'reauthentication_not_valid'
  | 'otp_expired'
  | 'otp_disabled'
  | 'identity_not_found'
  | 'weak_password'
  | 'over_request_rate_limit'
  | 'over_email_send_rate_limit'
  | 'over_sms_send_rate_limit'
  | 'bad_code_verifier'

// error codes based on the auth docs: https://supabase.com/docs/guides/auth/debugging/error-codes
const errorMessages: Partial<Record<ErrorCode, string>> = {
  bad_code_verifier:
    'Der Code-Überprüfer entspricht nicht dem erwarteten Wert. Dies deutet auf einen Fehler in der Implementierung der Client-Bibliothek hin.',
  bad_json: 'Der HTTP-Body der Anfrage ist kein gültiges JSON.',
  bad_jwt: 'Das JWT im Authorization-Header ist ungültig.',
  bad_oauth_callback:
    'Der OAuth-Callback vom Anbieter enthält nicht alle erforderlichen Attribute (z. B. state). Dies deutet auf ein Problem mit dem OAuth-Anbieter oder der Client-Bibliothek hin.',
  bad_oauth_state:
    'Der OAuth-State hat nicht das richtige Format. Dies deutet auf ein Integrationsproblem mit dem OAuth-Anbieter hin.',
  captcha_failed:
    'Die Captcha-Herausforderung konnte nicht verifiziert werden. Überprüfen Sie die Captcha-Integration.',
  conflict:
    'Datenbankkonflikt, z. B. durch gleichzeitige Anfragen auf Ressourcen, die nicht gleichzeitig bearbeitet werden dürfen.',
  email_conflict_identity_not_deletable:
    'Das Entfernen dieser Identität würde zu einem Konflikt mit einer bereits verwendeten E-Mail-Adresse führen.',
  email_exists: 'Die E-Mail-Adresse ist bereits im System vorhanden.',
  email_not_confirmed: 'Anmeldung nicht möglich, da die E-Mail-Adresse nicht bestätigt ist.',
  email_provider_disabled: 'E-Mail- und Passwort-Registrierungen sind deaktiviert.',
  flow_state_expired: 'Der PKCE-Zustand ist abgelaufen. Bitte melden Sie sich erneut an.',
  flow_state_not_found: 'Der PKCE-Zustand existiert nicht mehr. Bitte melden Sie sich erneut an.',
  identity_already_exists: 'Die Identität ist bereits mit einem Benutzer verknüpft.',
  identity_not_found: 'Die Identität existiert nicht (z. B. wurde sie gelöscht).',
  insufficient_aal:
    'Der Benutzer muss ein höheres Authentifikationsniveau haben, um diese API aufzurufen.',
  invite_not_found: 'Die Einladung ist abgelaufen oder wurde bereits verwendet.',
  manual_linking_disabled:
    'Manuelle Verknüpfungen der Benutzeridentität sind auf dem Auth-Server deaktiviert.',
  mfa_challenge_expired:
    'Die MFA-Herausforderung ist abgelaufen. Fordern Sie eine neue Herausforderung an.',
  mfa_factor_name_conflict: 'Die MFA-Faktoren eines Benutzers sollten nicht denselben Namen haben.',
  mfa_factor_not_found: 'Der MFA-Faktor existiert nicht mehr.',
  mfa_ip_address_mismatch:
    'Der MFA-Registrierungsprozess muss mit derselben IP-Adresse beginnen und enden.',
  mfa_verification_failed:
    'MFA-Herausforderung konnte nicht verifiziert werden (falscher TOTP-Code).',
  mfa_verification_rejected: 'Weitere MFA-Verifizierung abgelehnt.',
  no_authorization: 'Für diese Anfrage ist ein Authorization-Header erforderlich.',
  not_admin: 'Der Benutzer, der auf die API zugreift, ist kein Administrator.',
  oauth_provider_not_supported: 'Ein OAuth-Anbieter wird auf dem Auth-Server nicht unterstützt.',
  otp_disabled: 'Anmeldung über OTPs ist deaktiviert. Überprüfen Sie die Serverkonfiguration.',
  otp_expired: 'Der OTP-Code ist abgelaufen. Bitte erneut anmelden.',
  over_email_send_rate_limit: 'Es wurden zu viele E-Mails an diese Adresse gesendet. Bitte warten.',
  over_request_rate_limit:
    'Zu viele Anfragen von diesem Client. Versuchen Sie es in ein paar Minuten erneut.',
  over_sms_send_rate_limit:
    'Zu viele SMS-Nachrichten an diese Telefonnummer gesendet. Bitte warten.',
  phone_exists: 'Die Telefonnummer ist bereits im System vorhanden.',
  phone_not_confirmed: 'Anmeldung nicht möglich, da die Telefonnummer nicht bestätigt ist.',
  phone_provider_disabled: 'Registrierungen über Telefon und Passwort sind deaktiviert.',
  provider_disabled: 'Der OAuth-Anbieter ist deaktiviert. Überprüfen Sie die Konfiguration.',
  provider_email_needs_verification:
    'Bestätigung der E-Mail-Adresse durch den OAuth-Anbieter erforderlich.',
  reauthentication_needed:
    'Der Benutzer muss sich erneut authentifizieren, um das Passwort zu ändern.',
  reauthentication_not_valid:
    'Verifizierung der erneuten Authentifizierung fehlgeschlagen. Bitte neuen Code eingeben.',
  same_password: 'Das neue Passwort darf nicht dasselbe wie das aktuelle Passwort sein.',
  saml_assertion_no_email:
    'SAML-Assertion enthält keine E-Mail-Adresse. Überprüfen Sie die Anbieter-Konfiguration.',
  saml_assertion_no_user_id:
    'SAML-Assertion enthält keine Benutzer-ID. Überprüfen Sie die Konfiguration des SAML-Anbieters.',
  saml_entity_id_mismatch:
    'Aktualisierung der SAML-Metadaten nicht möglich, da die Entity-ID nicht übereinstimmt.',
  saml_idp_already_exists: 'Ein SAML-Identitätsanbieter wurde bereits hinzugefügt.',
  saml_idp_not_found: 'SAML-Identitätsanbieter nicht gefunden.',
  saml_metadata_fetch_failed: 'SAML-Metadaten konnten nicht vom angegebenen URL abgerufen werden.',
  saml_provider_disabled: 'SAML 2.0 SSO ist auf dem Auth-Server nicht aktiviert.',
  saml_relay_state_expired: 'Der SAML-Relay-Status ist abgelaufen. Bitte erneut anmelden.',
  saml_relay_state_not_found: 'Der SAML-Relay-Status existiert nicht mehr. Bitte erneut anmelden.',
  session_not_found: 'Die Sitzung existiert nicht mehr.',
  signup_disabled: 'Kontoerstellung ist auf dem Server deaktiviert.',
  single_identity_not_deletable:
    'Ein Benutzer muss mindestens eine Identität haben, daher kann sie nicht gelöscht werden.',
  sms_send_failed:
    'SMS-Nachricht konnte nicht gesendet werden. Überprüfen Sie die SMS-Anbieter-Konfiguration.',
  sso_domain_already_exists:
    'Nur eine SSO-Domain kann pro SSO-Identitätsanbieter registriert werden.',
  sso_provider_not_found:
    'SSO-Anbieter nicht gefunden. Überprüfen Sie die Argumente in supabase.auth.signInWithSSO().',
  too_many_enrolled_mfa_factors:
    'Ein Benutzer kann nur eine begrenzte Anzahl von MFA-Faktoren haben.',
  unexpected_audience: 'Der X-JWT-AUD-Anspruch stimmt nicht mit dem Audience-Wert des JWT überein.',
  unexpected_failure: 'Auth-Dienst ist beeinträchtigt oder ein Fehler liegt vor.',
  user_already_exists: 'Ein Benutzer mit diesen Informationen kann nicht erneut erstellt werden.',
  user_banned: 'Der Benutzer ist gesperrt. Weitere API-Anfragen sollten unterlassen werden.',
  user_not_found: 'Der Benutzer existiert nicht mehr.',
  user_sso_managed:
    'Wenn ein Benutzer über SSO kommt, können bestimmte Felder des Benutzers nicht aktualisiert werden.',
  validation_failed: 'Die bereitgestellten Parameter haben nicht das erwartete Format.',
  weak_password: 'Das Passwort erfüllt nicht die Mindestanforderungen für die Stärke.',
}

export const SignUpScreen = () => {
  const supabase = useSupabase()
  const updateParams = useUpdateParams()
  const { params } = useParams()

  useEffect(() => {
    if (params?.email) {
      updateParams({ email: undefined }, { web: { replace: true } })
    }
  }, [params?.email, updateParams])

  const form = useForm<z.infer<typeof SignUpSchema>>()

  const hasAgreedToPrivacyPolicy = useWatch<z.infer<typeof SignUpSchema>>({
    name: 'hasAgreedToPrivacyPolicy',
    control: form.control,
  }) as boolean

  async function signUpWithEmail({ email, password }: z.infer<typeof SignUpSchema>) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}`,
        // To take user's name other info
        data: {
          // first_name: firstName, // coming from state
          // last_name: lastName,
        },
      },
    })

    if (error && error.code) {
      const serverMessage = error?.message.toLowerCase()
      const errorMessage = errorMessages[error.code]

      if (serverMessage.includes('email')) {
        form.setError('email', { type: 'custom', message: errorMessage })
      } else if (serverMessage.includes('password')) {
        form.setError('password', { type: 'custom', message: errorMessage })
      } else {
        form.setError('password', { type: 'custom', message: errorMessage })
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
          schema={SignUpSchema}
          defaultValues={{
            email: params?.email || '',
            password: '',
            hasAgreedToPrivacyPolicy: false,
          }}
          props={{
            password: {
              secureTextEntry: true,
            },
            hasAgreedToPrivacyPolicy: {
              size: '$5',
              customLabel: <PrivacyPolicyDescription />,
            },
          }}
          onSubmit={signUpWithEmail}
          renderAfter={({ submit }) => (
            <>
              <Theme inverse>
                <SubmitButton
                  disabled={!hasAgreedToPrivacyPolicy}
                  disabledStyle={{ backgroundColor: '$gray10' }}
                  onPress={() => submit()}
                  br="$10"
                >
                  Registrieren
                </SubmitButton>
              </Theme>
              <SignInLink />
            </>
          )}
        >
          {(fields) => (
            <>
              <YStack gap="$3">
                <H2 $sm={{ size: '$9' }}>Loslegen</H2>
                <Paragraph theme="alt2">Neues Konto erstellen</Paragraph>
              </YStack>
              {Object.values(fields)}
            </>
          )}
        </SchemaForm>
      )}
    </FormProvider>
  )
}

const SignInLink = () => {
  type SignUpSchemaType = z.infer<typeof SignUpSchema>
  const email = useWatch<SignUpSchemaType>({ name: 'email' }) as string | undefined

  return (
    <Link href={`/sign-in?${new URLSearchParams(email ? { email } : undefined).toString()}`}>
      <Paragraph ta="center" theme="alt1" mt="$2">
        Bereits registriert? <Text textDecorationLine="underline">Anmelden</Text>
      </Paragraph>
    </Link>
  )
}

const CheckYourEmail = () => {
  const email = useWatch<z.infer<typeof SignUpSchema>>({ name: 'email' })
  const { reset } = useFormContext()
  const router = useRouter()

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
        <Button themeInverse icon={LogIn} br="$10" onPress={() => router.push('/sign-in')}>
          Zur Anmeldung
        </Button>
      </FormWrapper.Footer>
    </FormWrapper>
  )
}
