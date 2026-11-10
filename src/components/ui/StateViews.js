import { ActivityIndicator, View } from "react-native";
import { useTheme } from "../../theme";
import Text from "./Text";
import Button from "./Button";

// Shared layout for the three non-content states. Copy guidance: say what
// happened, then what to do; no exclamation marks, no blame.
function Centered({ children }) {
  const { spacing } = useTheme();
  return (
    <View style={{ alignItems: "center", justifyContent: "center", padding: spacing.xxxl }}>{children}</View>
  );
}

/** <EmptyState title="Nothing logged yet" message="..." actionLabel="Log food" onAction=... /> */
export function EmptyState({ title, message, actionLabel, onAction, art }) {
  const { spacing } = useTheme();
  return (
    <Centered>
      {art}
      <Text variant="h3" style={{ textAlign: "center", marginTop: art ? spacing.lg : 0 }}>
        {title}
      </Text>
      {message ? (
        <Text variant="small" tone="muted" style={{ textAlign: "center", marginTop: spacing.xs }}>
          {message}
        </Text>
      ) : null}
      {actionLabel ? (
        <Button title={actionLabel} onPress={onAction} fullWidth={false} size="sm" style={{ marginTop: spacing.lg }} />
      ) : null}
    </Centered>
  );
}

/** <LoadingState label="Searching foods…" />  — use for first load; use Button `loading` for actions. */
export function LoadingState({ label }) {
  const { colors, spacing } = useTheme();
  return (
    <Centered>
      <ActivityIndicator color={colors.primary} size="large" />
      {label ? (
        <Text variant="small" tone="muted" style={{ marginTop: spacing.md }} accessibilityLiveRegion="polite">
          {label}
        </Text>
      ) : null}
    </Centered>
  );
}

/** <ErrorState message="Couldn't reach the food database." onRetry=... /> */
export function ErrorState({ title = "Something went wrong", message, onRetry, retryLabel = "Try again" }) {
  const { colors, spacing, radii } = useTheme();
  return (
    <Centered>
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: radii.pill,
          backgroundColor: colors.dangerSoft,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.md
        }}
      >
        <Text variant="h2" tone="danger" accessibilityElementsHidden>!</Text>
      </View>
      <Text variant="h3" style={{ textAlign: "center" }}>{title}</Text>
      {message ? (
        <Text variant="small" tone="muted" style={{ textAlign: "center", marginTop: spacing.xs }}>
          {message}
        </Text>
      ) : null}
      {onRetry ? (
        <Button title={retryLabel} onPress={onRetry} variant="secondary" fullWidth={false} size="sm" style={{ marginTop: spacing.lg }} />
      ) : null}
    </Centered>
  );
}
