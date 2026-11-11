import { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";

// Tweens toward `target` and returns the current number — lets SVG props animate
// without reanimated. Re-renders per frame; fine for the 1–3 small graphics we draw.
export default function useAnimatedNumber(target, duration = 800) {
  const value = useRef(new Animated.Value(0)).current;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = value.addListener(({ value: v }) => setCurrent(v));
    return () => value.removeListener(id);
  }, [value]);

  useEffect(() => {
    Animated.timing(value, {
      toValue: target,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    }).start();
  }, [target, duration, value]);

  return current;
}
