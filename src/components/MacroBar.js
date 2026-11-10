import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, type } from "../theme/brand";

// Stacked bar of protein / carbs / fat in grams. The legend always names each
// macro in words, so the three colors are never the only signal.
export default function MacroBar({ protein = 0, carbs = 0, fat = 0 }) {
  const items = [
    { key: "protein", label: "Protein", grams: protein, color: colors.protein },
    { key: "carbs", label: "Carbs", grams: carbs, color: colors.carbs },
    { key: "fat", label: "Fat", grams: fat, color: colors.fat }
  ];
  const total = items.reduce((sum, i) => sum + i.grams, 0);
  const summary = items.map((i) => `${i.label} ${i.grams} grams`).join(", ");

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={summary}>
      <View style={styles.track}>
        {total > 0 &&
          items
            .filter((i) => i.grams > 0)
            .map((i) => (
              <View key={i.key} style={[styles.segment, { flexGrow: i.grams, backgroundColor: i.color }]} />
            ))}
      </View>
      <View style={styles.legend}>
        {items.map((i) => (
          <View key={i.key} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: i.color }]} />
            <Text style={styles.legendText}>
              {i.label} {i.grams}g
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    gap: 2,
    backgroundColor: colors.surface
  },
  segment: { minWidth: 4, flexShrink: 0, flexBasis: 0 },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, marginTop: spacing.sm },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { ...type.caption, color: colors.inkMuted }
});
