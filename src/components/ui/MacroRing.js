import { View } from "react-native";
import Svg, { Circle } from "react-native-svg"; // npx expo install react-native-svg
import { useTheme } from "../../theme";
import Text from "./Text";
import useAnimatedNumber from "./useAnimatedNumber";

/**
 * Circular progress ring with centered content.
 * <MacroRing macro="calories" value={1480} goal={2200} centerValue="1,480" centerLabel="kcal" />
 * Defaults to children-free layout: big number + small label. Pass `children` to override center.
 * Spec: 12px stroke, round caps, starts at 12 o'clock, fills clockwise in 800ms,
 * track = theme.colors.track. Over goal → ring stays full in warning color.
 */
export default function MacroRing({
  macro = "calories",
  value = 0,
  goal = 0,
  size = 160,
  strokeWidth = 12,
  centerValue,
  centerLabel,
  children
}) {
  const { macros, colors, motion } = useTheme();
  const pct = goal > 0 ? Math.min(value / goal, 1) : 0;
  const progress = useAnimatedNumber(pct, motion.ring);
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const over = goal > 0 && value > goal;
  const stroke = over ? colors.warning : macros[macro].fill;

  return (
    <View
      style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}
      accessible
      accessibilityLabel={`${macro}: ${value} of ${goal}`}
    >
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.track} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - progress)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children || (
        <View style={{ alignItems: "center" }}>
          <Text variant="display" style={{ fontSize: size * 0.22, lineHeight: size * 0.26 }}>
            {centerValue ?? value}
          </Text>
          {centerLabel ? <Text variant="caption" tone="muted">{centerLabel}</Text> : null}
        </View>
      )}
    </View>
  );
}
