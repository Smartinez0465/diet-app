# Diet App UI Toolkit

A small design system for every screen in the app: tokens, themed components, and a
migration path. Open `preview.html` in a browser to see everything in one place
(palette, type scale, components, light/dark toggle).

Nothing in `src/screens/*.js` was changed. The toolkit is additive; two example
conversions live in `src/screens/examples/` and are not wired into navigation.

## What was found in the repo

The app currently has no theme layer. Every screen carries its own `StyleSheet` with
hardcoded hex values (`#0F172A` background, `#1E293B` cards, `#22C55E` accent,
`#F8FAFC` / `#94A3B8` / `#64748B` text), the same button and row styles copied across
four files, and dark mode only (`app.json` pins `userInterfaceStyle` to `light`, the
status bar is forced to `light`). There is no `react-native-svg` dependency and no
MyPlate graphic or food-database browsing screen in this checkout yet, so the toolkit
provides those building blocks (`MacroRing`, `PlateChart`) ready for you to use.

The toolkit keeps your existing slate + green look exactly (the dark theme equals today's
hex values) and adds a light theme plus MyPlate-derived accent colors.

## Layout

```
src/theme/
  tokens.js         raw palette, MyPlate colors, spacing, radii, typography, shadows, motion
  themes.js         semantic color sets: darkTheme (today's look) and lightTheme
  ThemeProvider.js  <ThemeProvider> + useTheme()  ("system" | "light" | "dark")
  navigation.js     makeNavigationTheme / makeTabScreenOptions / makeStackScreenOptions
  index.js          barrel export
src/components/ui/
  Text, Screen, Button, Card, TextField, ListRow, MacroBar, Chip, Sheet,
  StateViews (EmptyState, LoadingState, ErrorState)         <- no new dependencies
  MacroRing, PlateChart, useAnimatedNumber                  <- need react-native-svg
src/screens/examples/   HomeScreen.example.js, LoginScreen.example.js
docs/ui-toolkit/        README.md, SCREEN_REVIEW.md, preview.html
```

## Wire-up (one-time, ~10 minutes)

1. `npx expo install react-native-svg` (only needed for `MacroRing` / `PlateChart`; `MacroBar`
   and everything else works without it).
2. `app.json`: change `"userInterfaceStyle": "light"` to `"automatic"` so the app can follow the OS.
3. `App.js`:
   ```jsx
   import { ThemeProvider } from "./src/theme";
   export default function App() {
     return (
       <ThemeProvider>
         <AuthProvider>
           <StatusBar style="auto" />
           <AppNavigator />
         </AuthProvider>
       </ThemeProvider>
     );
   }
   ```
4. `AppNavigator.js`: call `useTheme()` and pass `theme={makeNavigationTheme(theme)}` to
   `NavigationContainer`, spread `makeTabScreenOptions(theme)` / `makeStackScreenOptions(theme)`
   into the navigators, and replace the hardcoded loading background with `theme.colors.background`.
5. Convert screens one at a time following `SCREEN_REVIEW.md`.

Rule of thumb for new code: **no hex strings and no magic numbers in screens.** Colors come
from `useTheme().colors`, spacing from `spacing`, text from `<Text variant=...>`.

## Tokens

**Color roles** (semantic; both themes define all of them)

| Role | Dark | Light | Use |
|---|---|---|---|
| background | #0F172A | #F8FAFC | screen background |
| surface | #1E293B | #FFFFFF | cards, rows, inputs |
| surfaceRaised | #273449 | #F1F5F9 | pressed rows, modals, soft panels |
| border | #334155 | #E2E8F0 | hairlines, input borders |
| text / textMuted | #F8FAFC / #94A3B8 | #0F172A / #475569 | primary / secondary copy |
| textSubtle | #64748B | #64748B | placeholders and disabled only |
| primary / onPrimary | #22C55E / #0F172A | #15803D / #FFFFFF | filled buttons, focus ring |
| primaryText | #22C55E | #15803D | brand-colored text and icons |
| danger, warning, info (+ Soft) | red/amber/blue 400 | red/amber/blue 700 | status, 16% tinted fills |
| track | #334155 | #E2E8F0 | empty part of bars and rings |

The light-mode brand color is deliberately a darker green (#15803D): the dark-theme
green #22C55E is only 2.3:1 on white, while #15803D is 5.0:1. Measured ratios (WCAG):
body text 14-17:1 in both modes, textMuted 5.7:1 (dark) / 7.2:1 (light), primary button
label 7.8:1 (dark) / 5.0:1 (light). The one known sub-AA pair is `textSubtle` on dark surfaces
(3.1:1), so it is reserved for placeholders and disabled states; empty-state copy uses `textMuted`.

**MyPlate colors** (`theme.foodGroups`, `theme.macros`): fruits red, vegetables green, grains
orange, protein purple, dairy blue. Macros reuse the plate: protein = purple, carbs = orange
(grains), fat = gold, calories = brand green. Each has a `fill` (decorative: rings, bars) and
a `text` variant adjusted for contrast in the current mode.

**Spacing** (4pt grid): xs 4, sm 8, md 12, lg 16, xl 20 (screen padding), xxl 24, xxxl 32.
**Radii:** sm 6, md 10 (buttons, inputs, rows), lg 16 (cards), xl 24 (sheets), pill.
**Type scale** (system font): display 36/42 800, h1 28/34, h2 22/28, h3 18/24, body 16/24,
small 14/20, caption 12/16, overline 12 caps, number 15 tabular figures, button 16.
**Elevation:** light mode uses soft shadows; dark mode uses surface lightness + a 1px border.
**Motion:** 120 / 220 / 450 ms, ring fill 800 ms.

## Components

Import from `src/components/ui`. All read the theme; none take color props except `Chip color`.

| Component | Props | Spec notes |
|---|---|---|
| `Text` | `variant`, `tone` (default, muted, subtle, primary, danger, warning, info, inverse) | single entry point for typography |
| `Screen` | `padded` | themed background, 20px padding |
| `Button` | `title, onPress, variant` (primary, secondary, ghost, danger)`, size` (md, sm)`, loading, disabled, fullWidth, icon` | 48px min height, 10px radius, pressed = darker fill, loading keeps size, disabled 40% |
| `Card` | `tone` (default, raised, primary)`, onPress, padded` | 16px radius, shadow (light) or border (dark) |
| `TextField` | `label, hint, error, right` + any TextInput prop | 52px, label above, border green on focus / red on error |
| `ListRow` | `title, subtitle, value, unit, leading, trailing, onPress` | 56px min, tabular numbers, pressed = raised |
| `MacroBar` | `macro, label, value, goal, unit` | 8px animated bar, over goal turns warning (never red) |
| `MacroRing` | `macro, value, goal, size, strokeWidth, centerValue, centerLabel, children` | SVG, starts at 12 o'clock, 800ms fill, over goal = full warning ring |
| `PlateChart` | `progress` ({fruits, vegetables, grains, protein, dairy} each 0..1), `size` | MyPlate quadrants fill from the center outward |
| `Chip` | `label, selected, onPress, color` | pill, 36px min, selected = soft green fill; `color={theme.foodGroups.protein}` for tags |
| `Sheet` | `visible, onClose, title` | bottom sheet, scrim, grab handle, back-to-dismiss |
| `EmptyState` | `title, message, actionLabel, onAction, art` | say what's empty, then the next step |
| `LoadingState` | `label` | first-load spinner; use `Button loading` for actions |
| `ErrorState` | `title, message, onRetry` | what failed + a retry; never blame the user |
| Tab bar | `makeTabScreenOptions(theme)` | surface background, 1px top border, 60px tall, green active tint |

Accessibility baked in: roles and labels on pressables, `accessibilityState` for disabled/busy/selected,
44px+ touch targets (Chip and small Button add `hitSlop`), tabular numerals for totals,
and every colored data mark (ring/bar) is paired with a text value so color is never the only signal.

## Example conversions

`src/screens/examples/HomeScreen.example.js` replaces HomeScreen's summary card with a calorie
ring + protein/carb/fat bars (the DB already stores them; the current screen never shows them),
adds an error state and an actionable empty state. `LoginScreen.example.js` shows `TextField`,
`Button loading`, and keyboard avoidance. Both keep the original Supabase logic untouched.

## Not done / assumptions

- Not run on a device: this environment has no simulator. All files were syntax-checked with the
  project's Babel preset and the semantic color keys were cross-checked against both themes;
  please give the example screens a quick look in Expo Go before adopting.
- Icons: none are bundled. `@expo/vector-icons` ships with Expo and is the natural choice for tab icons.
- Goals (2200 kcal, macro targets) are still constants; a Settings screen backed by a Supabase
  `profiles` table is the follow-up the README already lists.
