// Raw design tokens. Screens should NOT import this directly — use `useTheme()`
// (see ThemeProvider.js) so colors follow light/dark mode. Non-color tokens
// (spacing, radii, typography, motion) are mode-independent and safe to import.

// ---- Palette --------------------------------------------------------------
// Slate neutrals + green brand are exactly the hex values the app already uses,
// so adopting the toolkit does not change how the current dark UI looks.
export const palette = {
  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  slate300: "#CBD5E1",
  slate400: "#94A3B8",
  slate500: "#64748B",
  slate600: "#475569",
  slate700: "#334155",
  slate750: "#273449",
  slate800: "#1E293B",
  slate900: "#0F172A",
  white: "#FFFFFF",

  green300: "#86EFAC",
  green500: "#22C55E", // current brand green
  green600: "#16A34A",
  green700: "#15803D", // brand green when used on light backgrounds (AA)
  green100: "#DCFCE7",
  green900: "#14532D",

  red400: "#F87171",
  red700: "#B91C1C",
  red100: "#FEE2E2",
  amber400: "#FBBF24",
  amber700: "#B45309",
  amber100: "#FEF3C7",
  blue400: "#60A5FA",
  blue700: "#1D4ED8",
  blue100: "#DBEAFE"
};

// ---- MyPlate food-group colors -------------------------------------------
// Hues follow the USDA MyPlate icon (fruits red, vegetables green, grains
// orange, protein purple, dairy blue). `dark` variants are tuned to sit on
// slate-800 surfaces; `light` variants are darkened so they pass 4.5:1 as text
// on white. `fill` is the decorative (non-text) color used for rings/bars.
export const foodGroups = {
  fruits: { fill: "#EF4444", dark: "#F87171", light: "#B91C1C" },
  vegetables: { fill: "#22C55E", dark: "#4ADE80", light: "#15803D" },
  grains: { fill: "#F59E0B", dark: "#FB923C", light: "#C2410C" },
  protein: { fill: "#8B5CF6", dark: "#A78BFA", light: "#7E22CE" },
  dairy: { fill: "#3B82F6", dark: "#60A5FA", light: "#1D4ED8" }
};

// Macros borrow the plate: protein = protein purple, carbs = grains orange,
// fat = a golden yellow (MyPlate has no fat group), calories = brand green.
export const macroColors = {
  calories: { fill: "#22C55E", dark: "#22C55E", light: "#15803D" },
  protein: foodGroups.protein,
  carbs: foodGroups.grains,
  fat: { fill: "#EAB308", dark: "#FACC15", light: "#A16207" }
};

// ---- Spacing (4pt grid) ---------------------------------------------------
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20, // current screen padding
  xxl: 24,
  xxxl: 32,
  huge: 48
};

// ---- Radii ----------------------------------------------------------------
export const radii = {
  sm: 6,
  md: 10, // current buttons / inputs / rows
  lg: 16, // current summary card
  xl: 24,
  pill: 999
};

// ---- Typography -----------------------------------------------------------
// System font on both platforms (San Francisco / Roboto) — no font loading.
// Pick a variant by name: <Text variant="h2">. Numeric variants use tabular
// figures so totals don't jiggle as digits change.
const tabular = ["tabular-nums"];
export const typography = {
  display: { fontSize: 36, lineHeight: 42, fontWeight: "800", letterSpacing: -0.5, fontVariant: tabular },
  h1: { fontSize: 28, lineHeight: 34, fontWeight: "700", letterSpacing: -0.3 },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: "700", letterSpacing: -0.2 },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: "600" },
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: "600" },
  small: { fontSize: 14, lineHeight: 20, fontWeight: "400" },
  smallStrong: { fontSize: 14, lineHeight: 20, fontWeight: "600" },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "500", letterSpacing: 0.2 },
  overline: { fontSize: 12, lineHeight: 16, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
  number: { fontSize: 15, lineHeight: 20, fontWeight: "700", fontVariant: tabular },
  button: { fontSize: 16, lineHeight: 20, fontWeight: "700" }
};

// ---- Elevation ------------------------------------------------------------
// Light mode uses soft shadows. Dark mode barely shows shadows, so cards are
// lifted by a lighter surface + hairline border instead (see themes.js).
export const shadows = {
  none: {},
  sm: { shadowColor: "#0F172A", shadowOpacity: 0.06, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  md: { shadowColor: "#0F172A", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  lg: { shadowColor: "#0F172A", shadowOpacity: 0.16, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 8 }
};

// ---- Layout & motion ------------------------------------------------------
export const layout = {
  minTouchTarget: 44, // iOS HIG; Android guideline is 48 — buttons use 48
  buttonHeight: 48,
  inputHeight: 52,
  tabBarHeight: 60,
  screenPadding: spacing.xl
};

export const motion = {
  fast: 120,
  base: 220,
  slow: 450,
  ring: 800 // macro ring fill-in
};
