import { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { DAILY_GOAL } from "../lib/goals";
import { formatNumber } from "../lib/format";
import { colors, spacing, type } from "../theme/brand";
import EntryRow from "../components/EntryRow";

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
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => {
          const over = item.total > DAILY_GOAL;
          return (
            <EntryRow
              title={item.date}
              meta={over ? `${formatNumber(item.total - DAILY_GOAL)} kcal over goal` : undefined}
              value={`${formatNumber(item.total)} kcal`}
              valueColor={over ? colors.warning : colors.brand}
            />
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>No history yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.xl },
  emptyText: { ...type.body, color: colors.inkMuted, textAlign: "center", marginTop: spacing.xl }
});
