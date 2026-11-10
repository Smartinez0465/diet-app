import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { useTheme } from "../../theme";
import Text from "./Text";

/**
 * Horizontal progress bar for one macro. Pure Views — no extra dependencies.
 * <MacroBar macro="protein" label="Protein" value={82} goal={140} unit="g" />
 * macro: calories | protein | carbs | fat  (picks the MyPlate-derived color)
 * Over goal: bar stays full and the number turns warning-colored (not red — going
 * over on protein is fine, so we don't scold).
 */
export default function MacroBar({ macro = "calories", label, value = 0, goal = 0, unit = "g", style }) {
  const { macros, colors, radii, spacing, motion, mode } = useTheme();
  const pct = goal > 0 ? Math.min(value / goal, 1) : 0;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: motion.slow, useNativeDriver: false }).start();
  }, [pct, anim, motion.slow]);

  const over = goal > 0 && value > goal;
  return (
    <View
      style={style}
      accessible
      accessibilityLabel={`${label || macro}: ${value} of ${goal} ${unit}`}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs }}>
        <Text variant="smallStrong">{label || macro}</Text>
        <Text variant="small" tone={over ? "warning" : "muted"}>
          {value}
          {goal ? ` / ${goal}` : ""} {unit}
        </Text>
      </View>
      <View style={{ height: 8, borderRadius: radii.pill, backgroundColor: colors.track, overflow: "hidden" }}>
        <Animated.View
          style={{
            height: 8,
            borderRadius: radii.pill,
            backgroundColor: macros[macro].fill,
            width: anim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] })
          }}
        />
      </View>
    </View>
  );
}
