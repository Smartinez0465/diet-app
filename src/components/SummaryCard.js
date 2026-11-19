import { View, Text, StyleSheet } from "react-native";
import { colors, radius, spacing, type } from "../theme/brand";

// tone: "ok" (green) while under goal, "over" (amber) once past it.
// `sub` must say the status in words: "780 kcal remaining" / "120 kcal over".
export default function SummaryCard({ label, value, unit = "kcal", sub, tone = "ok" }) {
  return (
    <View style={styles.card} accessible accessibilityLabel={`${label}: ${value} ${unit}. ${sub || ""}`}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {value} {unit}
      </Text>
      {sub ? <Text style={[styles.sub, tone === "over" ? styles.over : styles.ok]}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl },
  label: { ...type.label, color: colors.inkMuted },
  value: { ...type.display, color: colors.ink, marginTop: spacing.xs },
  sub: { ...type.label, marginTop: spacing.xs },
  ok: { color: colors.brand },
  over: { color: colors.warning }
});
