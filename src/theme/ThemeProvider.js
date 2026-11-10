import { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "./themes";
import { spacing, radii, typography, layout, motion } from "./tokens";

const ThemeContext = createContext(null);

/**
 * Wrap the app once (in App.js, outside the navigator):
 *   <ThemeProvider><AuthProvider>...</AuthProvider></ThemeProvider>
 *
 * `preference` is "system" (default), "light" or "dark". Expose setPreference
 * in a future Settings screen; persist it with AsyncStorage (already installed).
 * NOTE: for "system" to react to the OS, app.json needs
 * "userInterfaceStyle": "automatic" (it is currently "light").
 */
export function ThemeProvider({ children, initialPreference = "system" }) {
  const system = useColorScheme();
  const [preference, setPreference] = useState(initialPreference);

  const value = useMemo(() => {
    const mode = preference === "system" ? (system === "light" ? "light" : "dark") : preference;
    // Default to dark when the OS gives no answer: it is what the app looks like today.
    const base = mode === "light" ? lightTheme : darkTheme;
    return { ...base, spacing, radii, typography, layout, motion, preference, setPreference };
  }, [preference, system]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
