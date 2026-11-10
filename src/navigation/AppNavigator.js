import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { colors, spacing, type, MIN_TOUCH } from "../theme/brand";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import AddFoodScreen from "../screens/AddFoodScreen";
import HistoryScreen from "../screens/HistoryScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function LogoutButton() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Log out"
      onPress={() => supabase.auth.signOut()}
      style={{
        minHeight: MIN_TOUCH,
        minWidth: MIN_TOUCH,
        justifyContent: "center",
        alignItems: "center",
        marginRight: spacing.sm,
        paddingHorizontal: spacing.sm
      }}
    >
      <Text style={{ ...type.bodyStrong, color: colors.brand }}>Log out</Text>
    </Pressable>
  );
}

const headerOptions = {
  headerStyle: { backgroundColor: colors.bg },
  headerTintColor: colors.ink,
  headerShadowVisible: false
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        ...headerOptions,
        tabBarStyle: { backgroundColor: colors.bg, borderTopWidth: 0 },
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.inkMuted,
        headerRight: () => <LogoutButton />
      }}
    >
      <Tab.Screen name="Today" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.brand} size="large" accessibilityLabel="Loading" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={headerOptions}>
        {!session ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="AddFood" component={AddFoodScreen} options={{ title: "Log food" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
