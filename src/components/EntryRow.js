import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, radius, spacing, type } from "../theme/brand";

// One list row: title (+ optional meta line) on the left, one number with its
// unit on the right. Pass onPress to make the whole row tappable.
export default function EntryRow({ title, meta, value, valueColor, onPress }) {
  const content = (
    <>
      <View style={styles.main}>
        <Text style={styles.title}>{title}</Text>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      </View>
      <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${value}`}
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }
  return <View style={styles.row}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.row
  },
  pressed: { opacity: 0.85 },
  main: { flex: 1 },
  title: { ...type.bodyStrong, color: colors.ink },
  meta: { ...type.caption, color: colors.inkMuted, marginTop: 2 },
  value: { ...type.number, color: colors.ink, marginLeft: spacing.md }
});
