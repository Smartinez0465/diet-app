import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import AddFoodScreen from "../screens/AddFoodScreen";
import HistoryScreen from "../screens/HistoryScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function LogoutButton() {
  return (
    <Pressable onPress={() => supabase.auth.signOut()} style={{ marginRight: 16 }}>
      <Text style={{ color: "#22C55E", fontWeight: "600" }}>Log out</Text>
    </Pressable>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#0F172A" },
        headerTintColor: "#F8FAFC",
        tabBarStyle: { backgroundColor: "#0F172A" },
        tabBarActiveTintColor: "#22C55E",
        tabBarInactiveTintColor: "#64748B",
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F172A" }}>
        <ActivityIndicator color="#22C55E" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#0F172A" }, headerTintColor: "#F8FAFC" }}>
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
