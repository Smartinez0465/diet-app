import { useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, Modal } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { searchFoods, getFoodByBarcode } from "../lib/foodApi";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { formatNumber } from "../lib/format";
import { colors, spacing, type } from "../theme/brand";
import Button from "../components/Button";
import TextField from "../components/TextField";
import EntryRow from "../components/EntryRow";

export default function AddFoodScreen({ navigation }) {
  const { session } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [grams, setGrams] = useState("100");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const items = await searchFoods(query);
      setResults(items);
    } catch (e) {
      Alert.alert("Search failed", e.message);
    }
    setLoading(false);
  }

  async function openScanner() {
    let currentPermission = permission;
    if (!currentPermission || !currentPermission.granted) {
      currentPermission = await requestPermission();
    }
    if (currentPermission.granted) setScannerOpen(true);
    else Alert.alert("Camera permission needed", "Enable camera access to scan barcodes.");
  }

  async function handleBarcodeScanned({ data }) {
    setScannerOpen(false);
    setLoading(true);
    const product = await getFoodByBarcode(data);
    setLoading(false);
    if (product) setSelected(product);
    else Alert.alert("Not found", "That barcode wasn't in the database.");
  }

  async function logFood() {
    if (!selected) return;
    const gramsNum = parseFloat(grams) || 0;
    const factor = gramsNum / 100;

    const { error } = await supabase.from("food_logs").insert({
      user_id: session.user.id,
      food_name: selected.name,
      grams: gramsNum,
      calories: Math.round(selected.caloriesPer100g * factor),
      protein: Math.round(selected.proteinPer100g * factor),
      carbs: Math.round(selected.carbsPer100g * factor),
      fat: Math.round(selected.fatPer100g * factor),
      logged_at: new Date().toISOString()
    });

    if (error) Alert.alert("Error", error.message);
    else navigation.goBack();
  }

  if (selected) {
    const previewKcal = Math.round((selected.caloriesPer100g * (parseFloat(grams) || 0)) / 100);
    return (
      <View style={styles.container}>
        <Text accessibilityRole="header" style={styles.title}>
          {selected.name}
        </Text>
        {selected.brand ? <Text style={styles.brand}>{selected.brand}</Text> : null}

        <TextField
          label="Amount (grams)"
          value={grams}
          onChangeText={setGrams}
          keyboardType="numeric"
          style={styles.amount}
        />

        <Text style={styles.macro}>{formatNumber(previewKcal)} kcal</Text>

        <Button title="Log it" onPress={logFood} style={styles.primary} />
        <Button variant="text" title="Back to search" onPress={() => setSelected(null)} style={styles.back} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextField
        placeholder="Search food (e.g. chicken breast)"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />

      <View style={styles.actionRow}>
        <Button
          variant="secondary"
          title={loading ? "Searching…" : "Search"}
          onPress={handleSearch}
          style={styles.flex}
        />
        <Button variant="secondary" title="Scan barcode" onPress={openScanner} style={styles.flex} />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => (
          <EntryRow
            title={item.name}
            meta={item.brand || undefined}
            value={`${formatNumber(item.caloriesPer100g)} kcal/100g`}
            onPress={() => setSelected(item)}
          />
        )}
      />

      <Modal visible={scannerOpen} animationType="slide">
        <CameraView
          onBarcodeScanned={scannerOpen ? handleBarcodeScanned : undefined}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128"]
          }}
          style={StyleSheet.absoluteFillObject}
        />
        <Button title="Cancel" onPress={() => setScannerOpen(false)} style={styles.closeScanner} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.xl },
  title: { ...type.heading, color: colors.ink },
  brand: { ...type.label, color: colors.inkMuted, marginTop: spacing.xs },
  amount: { marginTop: spacing.xl },
  actionRow: { flexDirection: "row", gap: spacing.gap, marginTop: spacing.md, marginBottom: spacing.lg },
  flex: { flex: 1 },
  macro: { ...type.heading, color: colors.brand, marginTop: spacing.lg, fontVariant: ["tabular-nums"] },
  primary: { marginTop: spacing.xl },
  back: { marginTop: spacing.md },
  closeScanner: { position: "absolute", bottom: 40, left: spacing.xl, right: spacing.xl }
});
