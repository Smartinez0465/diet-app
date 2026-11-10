import { Pressable, Text, StyleSheet } from "react-native";
import { colors, radius, spacing, type, MIN_TOUCH } from "../theme/brand";

// variant: "primary" (one per screen) | "secondary" | "text"
export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
  accessibilityLabel
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style
      ]}
    >
      <Text style={[styles.label, labelStyles[variant]]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH,
    borderRadius: radius.md,
    padding: spacing.row,
    alignItems: "center",
    justifyContent: "center"
  },
  primary: { backgroundColor: colors.brand },
  secondary: { backgroundColor: colors.surface },
  text: { backgroundColor: "transparent", padding: spacing.sm },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: { ...type.button, textAlign: "center" }
});

const labelStyles = StyleSheet.create({
  primary: { color: colors.onBrand },
  secondary: { color: colors.ink, fontWeight: "600" },
  text: { color: colors.inkMuted, fontSize: 14, fontWeight: "400" }
});
