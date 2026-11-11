import { View } from "react-native";
import { useTheme } from "../../theme";

// Standard screen wrapper: themed background + consistent padding.
// Use padded={false} for screens that manage their own list insets.
export default function Screen({ children, padded = true, style }) {
  const { colors, layout } = useTheme();
  return (
    <View
      style={[
        { flex: 1, backgroundColor: colors.background },
        padded && { padding: layout.screenPadding },
        style
      ]}
    >
      {children}
    </View>
  );
}
