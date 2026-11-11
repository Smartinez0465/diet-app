import { ActivityIndicator, Pressable, View } from "react-native";
import { useTheme } from "../../theme";
import Text from "./Text";

/**
 * <Button title="Log it" onPress={...} />
 * variant: primary (filled green) | secondary (surface) | ghost (text only) | danger
 * size: md (48px, default) | sm (36px, for inline/header use)
 * Props: loading, disabled, fullWidth (default true), icon (node, shown left of title)
 * Spec: min 48px tall, 10px radius, pressed = darker fill, disabled = 40% opacity,
 * loading replaces the label with a spinner but keeps the button's size.
 */
export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = true,
  icon,
  style,
  accessibilityLabel
}) {
  const { colors, radii, layout, spacing } = useTheme();
  const inactive = disabled || loading;

  const palette = {
    primary: { bg: colors.primary, bgPressed: colors.primaryPressed, fg: colors.onPrimary, border: "transparent" },
    secondary: { bg: colors.surface, bgPressed: colors.surfaceRaised, fg: colors.text, border: colors.border },
    ghost: { bg: "transparent", bgPressed: colors.surfaceRaised, fg: colors.primaryText, border: "transparent" },
    danger: { bg: colors.danger, bgPressed: colors.danger, fg: colors.onDanger, border: "transparent" }
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      hitSlop={size === "sm" ? 6 : 0}
      style={({ pressed }) => [
        {
          minHeight: size === "sm" ? 36 : layout.buttonHeight,
          paddingHorizontal: size === "sm" ? spacing.md : spacing.lg,
          borderRadius: radii.md,
          borderWidth: variant === "secondary" ? 1 : 0,
          borderColor: palette.border,
          backgroundColor: pressed ? palette.bgPressed : palette.bg,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: fullWidth ? "stretch" : "flex-start",
          opacity: disabled ? 0.4 : 1
        },
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <>
          {icon ? <View style={{ marginRight: spacing.sm }}>{icon}</View> : null}
          <Text variant={size === "sm" ? "smallStrong" : "button"} style={{ color: palette.fg }}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
