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
3. Update the email templates for Supabase in 3 locations:

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