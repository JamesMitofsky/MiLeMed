# Setup
1. After doing normal setup, had to add lines from `.env.example` to `.env.local` to add EXPO prefixed keys. Eg:

```env
EXPO_PUBLIC_URL=http://localhost:3000
# Use NEXT_PUBLIC_URL=https://localhost:3000 if you're running next with --experimental-https
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=OBFUSCATED_KEY
```