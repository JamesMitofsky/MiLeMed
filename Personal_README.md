# Setup
1. After doing normal setup, had to add lines from `.env.example` to `.env.local` to add EXPO prefixed keys. Eg:

```env
EXPO_PUBLIC_URL=http://localhost:3000
# Use NEXT_PUBLIC_URL=https://localhost:3000 if you're running next with --experimental-https
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=OBFUSCATED_KEY
```


Here is the supabase setup from scratch
1. Add in Supabase Keys to Vercel env vars
  * SUPABASE_SERVICE_ROLE=xxxxxxxxx
  * NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_ID_VALUE_HERE.supabase.co
  * NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxx
2. Connect sendgrid to supabase for emails: https://app.sendgrid.com/guide/integrate/langs/smtp
3. Increase the rate limit of emails per hour from 2
4. Update the email templates for Supabase in 3 locations:

**Reset Password**
```
<h2>Passwort zurücksetzen</h2>

<p>Folgen Sie diesem Link, um das Passwort für Ihren Benutzer zurückzusetzen:</p>
<p>
  <a
    href="{{ .SiteURL }}/api/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password"
    >Passwort zurücksetzen</a
  >
</p>
```

**Accept Invite**
<h2>Du wurdest eingeladen</h2>

<p>Du wurdest eingeladen, einen Benutzer auf {{ .SiteURL }} zu erstellen. Folge diesem Link, um die Einladung anzunehmen:</p>

<a
  href="{{ .SiteURL }}/api/auth/confirm?token_hash={{ .TokenHash }}&type=accept&next=/"
  >Einladung annehmen</a
>

**Confirm Signup**
<h2>Bestätige deine Anmeldung</h2>

<p>Folge diesem Link, um deinen Benutzer zu bestätigen:</p>
<p>
  <a
    href="{{ .SiteURL }}/api/auth/confirm?token_hash={{ .TokenHash }}&type=confirm&next=/"
    >Passwort zurücksetzen</a
  >
</p>

Guided by [these](https://supabase.com/docs/guides/auth/server-side/nextjs) docs


# App Builds
Build local file to upload to test flight using
```bash
yarn eas:build:dev:device:ios:local
```

# Supabase Functions
1. Make sure that supabase is started locally.
2. Run `supabase functions serve` or add a function name after this to serve only one function  (eg. `hello-world`). This will run it locally.
3. Run a curl which matches the local info necessary using the anon_key ([docs](https://supabase.com/docs/guides/functions/quickstart))
4. To deploy, run `supabase functions deploy`
