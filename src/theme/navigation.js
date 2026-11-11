import { DarkTheme, DefaultTheme } from "@react-navigation/native";

// React Navigation theme so headers, cards and transitions use our colors
// (also removes the white flash between screens in dark mode).
export function makeNavigationTheme(theme) {
  const base = theme.mode === "dark" ? DarkTheme : DefaultTheme;
  const c = theme.colors;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: c.primary,
      background: c.background,
      card: c.background,
      text: c.text,
      border: c.border,
      notification: c.danger
    }
  };
}

// Spread into <Tab.Navigator screenOptions={...}> — replaces the hardcoded
// colors in AppNavigator.js's Tabs(). Add `tabBarIcon` per screen for icons.
export function makeTabScreenOptions(theme) {
  const c = theme.colors;
  const t = theme.typography;
  return {
    headerStyle: { backgroundColor: c.background, shadowColor: "transparent", elevation: 0 },
    headerTintColor: c.text,
    headerTitleStyle: { ...t.h3 },
    tabBarStyle: {
      backgroundColor: c.surface,
      borderTopColor: c.border,
      borderTopWidth: 1,
      height: theme.layout.tabBarHeight,
      paddingTop: 6,
      paddingBottom: 8
    },
    tabBarActiveTintColor: c.tabActive,
    tabBarInactiveTintColor: c.tabInactive,
    tabBarLabelStyle: { fontSize: 12, fontWeight: "600" }
  };
}

// Same idea for the root stack.
export function makeStackScreenOptions(theme) {
  return {
    headerStyle: { backgroundColor: theme.colors.background },
    headerTintColor: theme.colors.text,
    headerTitleStyle: { ...theme.typography.h3 },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: theme.colors.background }
  };
}
