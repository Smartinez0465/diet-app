# Screen-by-screen review

Ordered by priority: what to change first to get the most visible improvement per hour.
Each item names the toolkit pieces to use. Items marked **bug** are not styling issues but
were found while reading the screens.

## 0. Foundation (do once, before any screen)

`App.js`, `app.json`, `src/navigation/AppNavigator.js`

- Wrap the app in `ThemeProvider`, set `StatusBar style="auto"`, set `userInterfaceStyle` to `automatic`.
- AppNavigator repeats `#0F172A` / `#22C55E` / `#64748B` in four places. Replace with
  `makeNavigationTheme`, `makeTabScreenOptions`, `makeStackScreenOptions`. This also fixes the
  white flash during screen transitions in dark mode (no navigation theme is set today).
- Tab bar: labels only, no icons. Add `@expo/vector-icons` icons (home, calendar) for scanability.
- `LogoutButton` is a bare green text with no touch padding (about 20px tall). Use `<Button variant="ghost" size="sm" fullWidth={false}>`
  now, and move it to a Settings screen later so the header stays clean.

## 1. HomeScreen (highest traffic, biggest payoff)

Converted in `src/screens/examples/HomeScreen.example.js`.

- Summary card shows only a number. Replace with `MacroRing` (calories) plus `MacroBar` for
  protein/carbs/fat. The `food_logs` table already stores these; they are fetched with `select("*")` but never displayed.
- "Log food" button: swap for `Button`. Consider a floating or pinned primary action so it stays
  reachable as the list grows (today it scrolls away with the header block only because the list is separate; fine for now).
- Entries: `ListRow` with kcal as the tabular value, plus a meal-time subtitle (`10:42 AM · 150g`).
- Empty text (`#64748B` on `#0F172A`, 3.7:1) fails contrast: use `EmptyState` with a "Log food" action.
- Errors from Supabase are silently dropped (`if (!error) setEntries`). Add `ErrorState` with retry; add pull-to-refresh.
- `DAILY_GOAL` constant: pass goals via a `GOALS` object now, user settings later. Over-goal shows warning color, not red.
- Later: swipe-to-delete (the RLS policy for delete already exists) with a `Sheet` confirmation; `PlateChart` below the bars.

## 2. AddFoodScreen (largest screen, most states)

- Two screens in one component (search vs. selected food). Keep that, but style both from the toolkit;
  extracting `FoodDetail` into its own component would cut the file by ~40%.
- **bug:** the results `FlatList` lacks `keyboardShouldPersistTaps="handled"`, so with the keyboard open the first tap on a result only dismisses the keyboard.
- Search: `TextField` with a `right` slot for a clear button; make "Scan barcode" the prominent
  `Button variant="secondary"` with a camera icon, "Search" primary or submit-on-enter only.
- States missing today: no-results (`EmptyState`: "No matches for 'x'. Try a simpler name or scan the barcode"), loading
  (`LoadingState` instead of changing the button label), network failure (`searchFoods` is wrapped but `getFoodByBarcode` is not, so a network error is an unhandled rejection; show `ErrorState`).
- Results: `ListRow` with brand as subtitle and `kcal/100g` as the unit; add a small P/C/F line using `Chip color={foodGroups.*}`
  or just colored text from `theme.macros`.
- Selected food view: only calories are shown. Show the full macro set for the chosen amount using `MacroBar`s
  (or three compact stats), update live as grams change, and offer quick-amount `Chip`s (50 g, 100 g, 150 g, 200 g).
- Grams input: `TextField` with `right={<Text>g</Text>}`, validation (0 or empty currently logs a 0-kcal entry via `parseFloat(grams) || 0`), `error` text instead of silent acceptance.
- Replace `Alert.alert` for recoverable errors (search failed, log failed) with inline `ErrorState`/`TextField error`; keep Alert for the camera-permission prompt.
- Log button: `Button loading` to prevent double-submits (nothing disables it while the insert is in flight).
- Scanner modal: add a framed viewfinder overlay and helper text ("Point at a barcode"); the Cancel button reuses the
  green primary style, so use `Button variant="secondary"` over the camera view for contrast. Consider `Sheet` for the not-found case with a "Search by name" action.

## 3. HistoryScreen

- Dates render as raw ISO strings (`2026-11-09`). Format as "Today", "Yesterday", "Mon, Nov 9".
- **bug:** days are grouped with `entry.logged_at.slice(0, 10)`, which is the UTC date. Evening entries in US timezones land on the next day, and the Today screen uses a local-day range, so totals can disagree between tabs. Group by local date (`new Date(logged_at).toLocaleDateString("en-CA")`).
- Rows show only a total. Use `ListRow` with a `MacroBar` (calories vs goal) as `trailing`/below, so a week is readable at a glance; tap to see that day's entries.
- Limit is 200 entries, so long histories silently truncate; add paging or a date-range query when this matters.
- Empty and error states: `EmptyState` ("Your history will show up here after your first logged day") and `ErrorState`.
- Later: a 7-day bar chart header built from the same tokens.

## 4. LoginScreen

Converted in `src/screens/examples/LoginScreen.example.js`.

- `TextField` with visible labels (placeholders alone disappear while typing), correct `autoComplete` / `textContentType`.
- `Button loading` replaces the `"..."` label; ghost button for the sign-up toggle (bigger touch target than the bare text).
- Add `KeyboardAvoidingView` (the form can sit under the keyboard on small phones), a brand mark/title above the form, inline errors instead of `Alert` for wrong password, and a show-password toggle.
- Sign-up success uses an Alert; consider an `EmptyState`-style confirmation panel ("Check your inbox").

## 5. Cross-cutting

- Replace the four copies of `entryName / entryMeta / entryCalories / emptyText` styles with `Text` variants; delete each screen's `StyleSheet` as it is converted.
- Add a light-mode pass: test each converted screen in both modes before merging.
- Reduce-motion: `MacroRing`/`PlateChart` animations are short; if you add more, gate them on `AccessibilityInfo.isReduceMotionEnabled()`.
- Settings screen (goals, theme preference, log out) is the natural home for `ThemeProvider.setPreference` and persistence via AsyncStorage.
