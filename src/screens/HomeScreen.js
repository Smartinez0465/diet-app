import { useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { DAILY_GOAL } from "../lib/goals";
import { formatNumber } from "../lib/format";
import { colors, spacing, type } from "../theme/brand";
import Button from "../components/Button";
import SummaryCard from "../components/SummaryCard";
import MacroBar from "../components/MacroBar";
import EntryRow from "../components/EntryRow";

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

  const sum = (key) => entries.reduce((total, e) => total + (e[key] || 0), 0);
  const totalCalories = entries.reduce((total, e) => total + e.calories, 0);
  const remaining = DAILY_GOAL - totalCalories;
  const over = remaining < 0;

  const header = (
    <View>
      <SummaryCard
        label="Today"
        value={formatNumber(totalCalories)}
        tone={over ? "over" : "ok"}
        sub={
          over
            ? `${formatNumber(Math.abs(remaining))} kcal over`
            : `${formatNumber(remaining)} kcal remaining`
        }
      />
      <View style={styles.macros}>
        <MacroBar protein={sum("protein")} carbs={sum("carbs")} fat={sum("fat")} />
      </View>
      <Button title="+ Log food" onPress={() => navigation.navigate("AddFood")} />
      <Text style={styles.sectionTitle}>Today's entries</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={header}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => (
          <EntryRow
            title={item.food_name}
            meta={`${item.grams} g`}
            value={`${formatNumber(item.calories)} kcal`}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No food logged yet today.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.xl },
  macros: { marginVertical: spacing.lg },
  sectionTitle: {
    ...type.section,
    color: colors.ink,
    marginTop: spacing.xl,
    marginBottom: spacing.gap
  },
  emptyText: { ...type.body, color: colors.inkMuted, textAlign: "center", marginTop: spacing.xl }
});
