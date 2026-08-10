# Diet App (MVP)

React Native + Expo food/calorie logging app. Food data comes from the free
Open Food Facts API (search + barcode lookup). Auth and storage run on Supabase.

## What's built

- Email/password auth (Supabase Auth)
- Search food by name, log it with grams -> auto-calculated calories/macros
- Barcode scanner (camera) to look up packaged foods
- Daily dashboard: total calories vs. a 2200 kcal goal (change in `HomeScreen.js`)
- History screen: calories per day

## Setup

### 1. Install dependencies
```
npm install
```

### 2. Create a Supabase project
- Go to supabase.com -> New project (free tier is fine)
- Project Settings -> API -> copy your **Project URL** and **anon public key**
- Paste them into `src/lib/supabase.js` (SUPABASE_URL, SUPABASE_ANON_KEY)

### 3. Create the database table
- In Supabase: SQL Editor -> New query
- Paste the contents of `supabase-schema.sql` -> Run
- This creates the `food_logs` table with row-level security so each user
  only sees their own entries

### 4. Run the app
```
npx expo start
```
Scan the QR code with the **Expo Go** app (App Store / Play Store) on your phone.
Make sure your phone and computer are on the same wifi network.

## Next steps (not built yet)
- Editable daily calorie goal (currently hardcoded, stored per-user in Supabase would be the move)
- Delete/edit a logged entry
- Weight tracking + trend chart
- Push notifications / reminders to log meals

## Sharing with someone else (e.g. your girlfriend)
See the app store / TestFlight notes we discussed — short version:
- Android: `eas build -p android --profile preview` gives you an installable `.apk`
- iOS: needs an Apple Developer account + TestFlight, since Apple requires signing
