import { Pressable, View } from "react-native";
import { useTheme } from "../../theme";
import Text from "./Text";

/**
 * One row in a list: title + optional subtitle on the left, value on the right.
 * <ListRow title="Chicken breast" subtitle="150g" value="248" unit="kcal" onPress=... />
 * `leading` = node (icon / food-group dot) before the title; `trailing` replaces the value.
 * Spec: min 56px tall, 10px radius, 8px gap between rows (use ItemSeparator or marginBottom),
 * pressed = surfaceRaised.
 */
export default function ListRow({ title, subtitle, value, unit, leading, trailing, onPress, style }) {
  const { colors, radii, spacing } = useTheme();
  const content = (pressed) => (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          minHeight: 56,
          backgroundColor: pressed ? colors.surfaceRaised : colors.surface,
          borderRadius: radii.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.sm
        },
        style
      ]}
    >
      {leading ? <View style={{ marginRight: spacing.md }}>{leading}</View> : null}
      <View style={{ flex: 1, marginRight: spacing.md }}>
        <Text variant="bodyStrong" numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="small" tone="muted" numberOfLines={1} style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing ||
        (value !== undefined ? (
          <Text variant="number">
            {value}
            {unit ? <Text variant="caption" tone="muted">{` ${unit}`}</Text> : null}
          </Text>
        ) : null)}
    </View>
  );
  if (!onPress) return content(false);
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ pressed }) => content(pressed)}
    </Pressable>
  );
}
