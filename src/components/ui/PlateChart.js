import Svg, { Circle, G, Path } from "react-native-svg"; // npx expo install react-native-svg
import { View } from "react-native";
import { useTheme } from "../../theme";
import useAnimatedNumber from "./useAnimatedNumber";

/**
 * MyPlate-style daily food-group progress: a plate split into four quadrants
 * (fruits, vegetables, grains, protein) plus a small dairy "cup" beside it.
 * Each quadrant is a faint track; the colored fill grows from the plate's center
 * outward as progress (0..1) rises, so a full quadrant = group goal met.
 *
 * <PlateChart progress={{ fruits: 0.5, vegetables: 0.8, grains: 1, protein: 0.3, dairy: 0.6 }} />
 *
 * Quadrant layout mirrors the USDA icon: vegetables top-left, fruits top-right,
 * grains bottom-left, protein bottom-right.
 */
const QUADRANTS = [
  { key: "vegetables", start: 180, end: 270 },
  { key: "fruits", start: 270, end: 360 },
  { key: "grains", start: 90, end: 180 },
  { key: "protein", start: 0, end: 90 }
];

function polar(cx, cy, r, deg) {
  const a = ((deg - 90) * Math.PI) / 180; // 0° = 12 o'clock
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
function wedge(cx, cy, r, start, end) {
  const [x1, y1] = polar(cx, cy, r, start);
  const [x2, y2] = polar(cx, cy, r, end);
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
}

export default function PlateChart({ progress = {}, size = 200 }) {
  const { foodGroups, colors, motion } = useTheme();
  const t = useAnimatedNumber(1, motion.ring); // shared 0→1 entrance
  const plateR = size * 0.4;
  const cx = size * 0.44;
  const cy = size / 2;
  const gap = 3; // visual gap between quadrants

  return (
    <View accessible accessibilityLabel={`Food groups: ${Object.entries(progress).map(([k, v]) => `${k} ${Math.round(v * 100)}%`).join(", ")}`}>
      <Svg width={size} height={size}>
        {QUADRANTS.map(({ key, start, end }) => {
          const p = Math.max(0, Math.min(progress[key] ?? 0, 1)) * t;
          return (
            <G key={key}>
              <Path d={wedge(cx, cy, plateR, start + gap / 2, end - gap / 2)} fill={foodGroups[key].fill} opacity={0.16} />
              {p > 0 ? (
                <Path d={wedge(cx, cy, plateR * Math.sqrt(p), start + gap / 2, end - gap / 2)} fill={foodGroups[key].fill} />
              ) : null}
            </G>
          );
        })}
        {/* dairy: small circle beside the plate, fills from bottom via radius */}
        <Circle cx={size * 0.9} cy={size * 0.3} r={size * 0.08} fill={foodGroups.dairy.fill} opacity={0.16} />
        <Circle
          cx={size * 0.9}
          cy={size * 0.3}
          r={size * 0.08 * Math.sqrt(Math.max(0, Math.min(progress.dairy ?? 0, 1)) * t)}
          fill={foodGroups.dairy.fill}
        />
        <Circle cx={cx} cy={cy} r={plateR + 4} stroke={colors.border} strokeWidth={1.5} fill="none" />
      </Svg>
    </View>
  );
}
