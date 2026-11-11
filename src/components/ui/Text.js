import { Text as RNText } from "react-native";
import { useTheme } from "../../theme";

// <Text variant="h2" tone="muted">  — variants come from theme.typography.
// tones: default | muted | subtle | primary | danger | warning | info | inverse
const TONES = {
  default: "text",
  muted: "textMuted",
  subtle: "textSubtle",
  primary: "primaryText",
  danger: "danger",
  warning: "warning",
  info: "info",
  inverse: "textInverse"
};

export default function Text({ variant = "body", tone = "default", style, children, ...rest }) {
  const { typography, colors } = useTheme();
  return (
    <RNText
      {...rest}
      style={[typography[variant], { color: colors[TONES[tone]] }, style]}
    >
      {children}
    </RNText>
  );
}
