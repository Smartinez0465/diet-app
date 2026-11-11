import { Pressable } from "react-native";
import { useTheme } from "../../theme";
import Text from "./Text";

/**
 * Pill for filters / meal types / food-group tags.
 * <Chip label="Breakfast" selected onPress=... />   (selectable)
 * <Chip label="Protein" color={theme.foodGroups.protein} />  (static tag with MyPlate color)
 * Selected = soft green fill + green text + green border. Min 36px tall (44px with hitSlop).
 */
export default function Chip({ label, selected = false, onPress, color, style }) {
  const { colors, radii, spacing } = useTheme();
  const accent = color ? color.text : colors.primaryText;
  const tint = color ? color.fill + "29" : colors.primarySoft; // 29 ≈ 16% alpha
  const content = (
    <Text variant="smallStrong" style={{ color: selected || color ? accent : colors.textMuted }}>
      {label}
    </Text>
  );
  const base = {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    backgroundColor: selected || color ? tint : "transparent",
    borderColor: selected ? accent : color ? "transparent" : colors.border
  };
  if (!onPress) return <Pressable disabled style={[base, style]}>{content}</Pressable>;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[base, style]}
    >
      {content}
    </Pressable>
  );
}
