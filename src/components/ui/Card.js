import { Pressable, View } from "react-native";
import { useTheme } from "../../theme";

/**
 * Surface container. tone: default | raised | primary (soft green highlight).
 * Pass onPress to make the whole card tappable.
 * Spec: 16px radius, 20px padding, light mode = soft shadow, dark mode = 1px border.
 */
export default function Card({ children, tone = "default", onPress, padded = true, style }) {
  const t = useTheme();
  const bg = { default: t.colors.surface, raised: t.colors.surfaceRaised, primary: t.colors.primarySoft }[tone];
  const base = [
    {
      backgroundColor: bg,
      borderRadius: t.radii.lg,
      borderWidth: t.cardBorderWidth,
      borderColor: t.colors.border
    },
    t.mode === "light" ? t.shadows.sm : null,
    padded && { padding: t.spacing.xl },
    style
  ];
  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [base, pressed && { opacity: 0.85 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={base}>{children}</View>;
}
