import { palette, macroColors, foodGroups, shadows } from "./tokens";

// Semantic colors. Components read these names, never raw hex, so a screen
// written once works in both modes. The dark theme intentionally equals the
// app's current hardcoded colors.
export const darkTheme = {
  mode: "dark",
  colors: {
    background: palette.slate900,
    surface: palette.slate800,
    surfaceRaised: palette.slate750, // modals, pressed rows
    border: palette.slate700,
    overlay: "rgba(2, 6, 23, 0.7)",

    text: palette.slate50,
    textMuted: palette.slate400,
    textSubtle: palette.slate500, // placeholders & disabled only (3:1) — never body copy
    textInverse: palette.slate900,

    primary: palette.green500,
    primaryPressed: palette.green600,
    onPrimary: palette.slate900,
    primaryText: palette.green500, // brand green used as text/icon on surfaces
    primarySoft: "rgba(34, 197, 94, 0.16)", // chip / badge fills

    danger: palette.red400,
    onDanger: palette.slate900,
    dangerSoft: "rgba(248, 113, 113, 0.16)",
    warning: palette.amber400,
    warningSoft: "rgba(251, 191, 36, 0.16)",
    info: palette.blue400,
    infoSoft: "rgba(96, 165, 250, 0.16)",

    track: palette.slate700, // empty part of bars / rings
    tabActive: palette.green500,
    tabInactive: palette.slate500
  },
  macros: {
    calories: { fill: macroColors.calories.fill, text: macroColors.calories.dark },
    protein: { fill: macroColors.protein.fill, text: macroColors.protein.dark },
    carbs: { fill: macroColors.carbs.fill, text: macroColors.carbs.dark },
    fat: { fill: macroColors.fat.fill, text: macroColors.fat.dark }
  },
  foodGroups: Object.fromEntries(
    Object.entries(foodGroups).map(([k, v]) => [k, { fill: v.fill, text: v.dark }])
  ),
  shadows: { none: shadows.none, sm: {}, md: {}, lg: shadows.lg }, // dark: rely on surface + border
  cardBorderWidth: 1
};

export const lightTheme = {
  mode: "light",
  colors: {
    background: palette.slate50,
    surface: palette.white,
    surfaceRaised: palette.slate100,
    border: palette.slate200,
    overlay: "rgba(15, 23, 42, 0.45)",

    text: palette.slate900,
    textMuted: palette.slate600,
    textSubtle: palette.slate500,
    textInverse: palette.white,

    primary: palette.green700, // white-on-green-700 = 5.0:1 (green-500 would be 2.3:1)
    primaryPressed: palette.green900,
    onPrimary: palette.white,
    primaryText: palette.green700,
    primarySoft: palette.green100,

    danger: palette.red700,
    onDanger: palette.white,
    dangerSoft: palette.red100,
    warning: palette.amber700,
    warningSoft: palette.amber100,
    info: palette.blue700,
    infoSoft: palette.blue100,

    track: palette.slate200,
    tabActive: palette.green700,
    tabInactive: palette.slate500
  },
  macros: {
    calories: { fill: macroColors.calories.fill, text: macroColors.calories.light },
    protein: { fill: macroColors.protein.fill, text: macroColors.protein.light },
    carbs: { fill: macroColors.carbs.fill, text: macroColors.carbs.light },
    fat: { fill: macroColors.fat.fill, text: macroColors.fat.light }
  },
  foodGroups: Object.fromEntries(
    Object.entries(foodGroups).map(([k, v]) => [k, { fill: v.fill, text: v.light }])
  ),
  shadows,
  cardBorderWidth: 0
};
