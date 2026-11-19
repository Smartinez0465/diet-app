import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, radius, spacing, type, MIN_TOUCH } from "../theme/brand";

// Shows a visible label when `label` is given. `error` is a plain sentence that
// says what to do ("Enter grams as a number, like 150."), shown under the field.
export default function TextField({ label, error, style, ...inputProps }) {
  return (
    <View style={style}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        accessibilityLabel={label || inputProps.placeholder}
        placeholderTextColor={colors.inkMuted}
        style={[styles.input, error && styles.inputError]}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...type.label, color: colors.inkMuted, marginBottom: spacing.sm },
  input: {
    ...type.body,
    minHeight: MIN_TOUCH,
    backgroundColor: colors.surface,
    color: colors.ink,
    borderRadius: radius.sm,
    padding: spacing.row
  },
  inputError: { borderWidth: 2, borderColor: colors.danger },
  error: { ...type.caption, color: colors.danger, marginTop: spacing.sm }
});
