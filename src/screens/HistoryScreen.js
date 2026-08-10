import { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function HistoryScreen() {
  const { session } = useAuth();
  const [days, setDays] = useState([]);

  const loadHistory = useCallback(async () => {
    const { data, error } = await supabase
      .from("food_logs")
      .select("*")
      .eq("user_id", session.user.id)
      .order("logged_at", { ascending: false })
      .limit(200);

    if (error || !data) return;

    const grouped = {};
    for (const entry of data) {
      const day = entry.logged_at.slice(0, 10);
      if (!grouped[day]) grouped[day] = 0;
      grouped[day] += entry.calories;
    }

    setDays(
      Object.entries(grouped)
        .map(([date, total]) => ({ date, total }))
        .sort((a, b) => (a.date < b.date ? 1 : -1))
    );
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={days}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.total}>{item.total} kcal</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No history yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", padding: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E293B",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8
  },
  date: { color: "#F8FAFC", fontSize: 15, fontWeight: "600" },
  total: { color: "#22C55E", fontSize: 15, fontWeight: "700" },
  emptyText: { color: "#64748B", textAlign: "center", marginTop: 20 }
});
