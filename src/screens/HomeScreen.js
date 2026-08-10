import { useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const DAILY_GOAL = 2200;

export default function HomeScreen({ navigation }) {
  const { session } = useAuth();
  const [entries, setEntries] = useState([]);

  const todayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { start: start.toISOString(), end: end.toISOString() };
  };

  const loadEntries = useCallback(async () => {
    const { start, end } = todayRange();
    const { data, error } = await supabase
      .from("food_logs")
      .select("*")
      .eq("user_id", session.user.id)
      .gte("logged_at", start)
      .lte("logged_at", end)
      .order("logged_at", { ascending: false });

    if (!error) setEntries(data || []);
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);
  const remaining = DAILY_GOAL - totalCalories;

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Today</Text>
        <Text style={styles.summaryCalories}>{totalCalories} kcal</Text>
        <Text style={styles.summarySub}>
          {remaining >= 0 ? `${remaining} kcal remaining` : `${Math.abs(remaining)} kcal over`}
        </Text>
      </View>

      <Pressable style={styles.addButton} onPress={() => navigation.navigate("AddFood")}>
        <Text style={styles.addButtonText}>+ Log food</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Today's entries</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.entryRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.entryName}>{item.food_name}</Text>
              <Text style={styles.entryMeta}>{item.grams}g</Text>
            </View>
            <Text style={styles.entryCalories}>{item.calories} kcal</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No food logged yet today.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", padding: 20 },
  summaryCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16
  },
  summaryLabel: { color: "#94A3B8", fontSize: 14 },
  summaryCalories: { color: "#F8FAFC", fontSize: 36, fontWeight: "800", marginTop: 4 },
  summarySub: { color: "#22C55E", fontSize: 14, marginTop: 4 },
  addButton: {
    backgroundColor: "#22C55E",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20
  },
  addButtonText: { textAlign: "center", color: "#0F172A", fontWeight: "700", fontSize: 16 },
  sectionTitle: { color: "#F8FAFC", fontSize: 16, fontWeight: "600", marginBottom: 10 },
  entryRow: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    alignItems: "center"
  },
  entryName: { color: "#F8FAFC", fontSize: 15, fontWeight: "600" },
  entryMeta: { color: "#94A3B8", fontSize: 13, marginTop: 2 },
  entryCalories: { color: "#F8FAFC", fontSize: 15, fontWeight: "700" },
  emptyText: { color: "#64748B", textAlign: "center", marginTop: 20 }
});
