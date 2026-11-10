// EXAMPLE CONVERSION — not wired into the navigator. Shows src/screens/HomeScreen.js
// rewritten on top of the UI toolkit. Behavior and Supabase queries are identical;
// only presentation changed. To adopt: copy over HomeScreen.js after finishing the
// "Wire up" steps in docs/ui-toolkit/README.md.
import { useCallback, useState } from "react";
import { FlatList, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme";
import { Button, Card, ListRow, MacroBar, Screen, Text, EmptyState, ErrorState } from "../../components/ui";
import MacroRing from "../../components/ui/MacroRing";

const GOALS = { calories: 2200, protein: 140, carbs: 250, fat: 70 }; // move to per-user settings later

export default function HomeScreenExample({ navigation }) {
  const { session } = useAuth();
  const { spacing } = useTheme();
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);

  const loadEntries = useCallback(async () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const { data, error: err } = await supabase
      .from("food_logs")
      .select("*")
      .eq("user_id", session.user.id)
      .gte("logged_at", start.toISOString())
      .lte("logged_at", end.toISOString())
      .order("logged_at", { ascending: false });
    setError(err ? err.message : null);
    if (!err) setEntries(data || []);
  }, [session]);

  useFocusEffect(useCallback(() => { loadEntries(); }, [loadEntries]));

  const sum = (key) => entries.reduce((s, e) => s + (e[key] || 0), 0);
  const totals = { calories: sum("calories"), protein: sum("protein"), carbs: sum("carbs"), fat: sum("fat") };
  const remaining = GOALS.calories - totals.calories;

  return (
    <Screen>
      <Card style={{ marginBottom: spacing.lg }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MacroRing macro="calories" value={totals.calories} goal={GOALS.calories} size={132}
            centerValue={totals.calories} centerLabel="kcal" />
          <View style={{ flex: 1, marginLeft: spacing.xl, gap: spacing.md }}>
            <Text variant="overline" tone="muted">Today</Text>
            <Text variant="h3" tone={remaining >= 0 ? "primary" : "warning"}>
              {remaining >= 0 ? `${remaining} kcal left` : `${Math.abs(remaining)} kcal over`}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
          <MacroBar macro="protein" label="Protein" value={totals.protein} goal={GOALS.protein} />
          <MacroBar macro="carbs" label="Carbs" value={totals.carbs} goal={GOALS.carbs} />
          <MacroBar macro="fat" label="Fat" value={totals.fat} goal={GOALS.fat} />
        </View>
      </Card>

      <Button title="+ Log food" onPress={() => navigation.navigate("AddFood")} style={{ marginBottom: spacing.xl }} />

      <Text variant="h3" style={{ marginBottom: spacing.md }}>Today's entries</Text>
      {error ? (
        <ErrorState message="We couldn't load today's entries." onRetry={loadEntries} />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ListRow title={item.food_name} subtitle={`${item.grams}g`} value={item.calories} unit="kcal" />
          )}
          ListEmptyComponent={
            <EmptyState
              title="Nothing logged yet"
              message="Search a food or scan a barcode to start today."
              actionLabel="Log food"
              onAction={() => navigation.navigate("AddFood")}
            />
          }
        />
      )}
    </Screen>
  );
}
