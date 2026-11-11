import { forwardRef, useState } from "react";
import { TextInput, View } from "react-native";
import { useTheme } from "../../theme";
import Text from "./Text";

/**
 * <TextField label="Amount (grams)" value=... onChangeText=... error="Required" hint="..." />
 * Spec: 52px tall, 10px radius, 1px border that turns green on focus and red on error.
 * Label sits above (never placeholder-as-label). Error text replaces hint.
 * `right` renders a node inside the field's right edge (e.g. a scan button or unit "g").
 */
const TextField = forwardRef(function TextField(
  { label, hint, error, right, style, inputStyle, ...inputProps },
  ref
) {
  const { colors, radii, layout, spacing, typography } = useTheme();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  return (
    <View style={[{ marginBottom: spacing.md }, style]}>
      {label ? (
        <Text variant="smallStrong" tone="muted" style={{ marginBottom: spacing.xs }}>
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          minHeight: layout.inputHeight,
          backgroundColor: colors.surface,
          borderRadius: radii.md,
          borderWidth: 1.5,
          borderColor,
          paddingHorizontal: spacing.lg
        }}
      >
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.primary}
          accessibilityLabel={label}
          {...inputProps}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
          style={[typography.body, { flex: 1, color: colors.text, paddingVertical: spacing.md }, inputStyle]}
        />
        {right}
      </View>
      {error || hint ? (
        <Text variant="caption" tone={error ? "danger" : "muted"} style={{ marginTop: spacing.xs }}>
          {error || hint}
        </Text>
      ) : null}
    </View>
  );
});

export default TextField;
