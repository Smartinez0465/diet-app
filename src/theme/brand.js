// Brand tokens from the Diet App Brand Kit. Screens and components import from
// here instead of hardcoding hex values, sizes or radii.
//
// Slate/green values are the colors the app already used, so adopting the
// tokens does not change the existing dark look. The extras (focus, warning,
// danger, protein, carbs, fat) are new in the kit.

export const colors = {
  bg: "#0F172A", // every screen, header, tab bar
  surface: "#1E293B", // cards, rows, inputs, secondary buttons (always on bg)
  ink: "#F8FAFC", // primary text
  inkMuted: "#94A3B8", // secondary text, labels, placeholders (5.7:1 on surface)
  brand: "#22C55E", // primary action, active tab, on-track status
  onBrand: "#0F172A", // text on brand fills (7.8:1)
  focus: "#86EFAC", // focus ring
  warning: "#FBBF24", // over goal, always with the word "over"
  danger: "#F87171", // error text, always with a plain message
  protein: "#38BDF8",
  carbs: "#FB923C",
  fat: "#F9A8D4"
};
// Deliberately absent: the old #64748B "subtle" gray. It is 3.1:1 on surface,
// below the 4.5:1 text minimum. Use inkMuted for placeholders and empty states.

export const spacing = {
  xs: 4,
  sm: 8,
  gap: 10,
  md: 12,
  row: 14, // padding inside buttons, inputs, rows
  lg: 16,
  xl: 20, // screen and card padding
  xxl: 24,
  xxxl: 32
};

export const radius = {
  sm: 10, // inputs, rows
  md: 12, // buttons
  lg: 16 // cards
};

export const type = {
  display: { fontSize: 36, fontWeight: "800", fontVariant: ["tabular-nums"] },
  title: { fontSize: 28, fontWeight: "700" },
  heading: { fontSize: 24, fontWeight: "700" },
  section: { fontSize: 16, fontWeight: "600" },
  body: { fontSize: 16, fontWeight: "400" },
  bodyStrong: { fontSize: 15, fontWeight: "600" },
  label: { fontSize: 14, fontWeight: "400" },
  caption: { fontSize: 13, fontWeight: "400" },
  button: { fontSize: 16, fontWeight: "700" },
  number: { fontSize: 15, fontWeight: "700", fontVariant: ["tabular-nums"] }
};

export const MIN_TOUCH = 44;
