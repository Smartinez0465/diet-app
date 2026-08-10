import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  Modal
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { searchFoods, getFoodByBarcode } from "../lib/foodApi";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

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
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{selected.name}</Text>
        {selected.brand ? <Text style={styles.brand}>{selected.brand}</Text> : null}

        <Text style={styles.label}>Amount (grams)</Text>
        <TextInput
          style={styles.input}
          value={grams}
          onChangeText={setGrams}
          keyboardType="numeric"
        />

        <View style={styles.macroRow}>
          <Text style={styles.macro}>
            {Math.round(selected.caloriesPer100g * (parseFloat(grams) || 0) / 100)} kcal
          </Text>
        </View>

        <Pressable style={styles.primaryButton} onPress={logFood}>
          <Text style={styles.primaryButtonText}>Log it</Text>
        </Pressable>
        <Pressable onPress={() => setSelected(null)}>
          <Text style={styles.cancelText}>Back to search</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search food (e.g. chicken breast)"
        placeholderTextColor="#64748B"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />

      <View style={styles.actionRow}>
        <Pressable style={styles.secondaryButton} onPress={handleSearch}>
          <Text style={styles.secondaryButtonText}>{loading ? "Searching..." : "Search"}</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={openScanner}>
          <Text style={styles.secondaryButtonText}>Scan barcode</Text>
        </Pressable>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable style={styles.resultRow} onPress={() => setSelected(item)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.entryName}>{item.name}</Text>
              {item.brand ? <Text style={styles.entryMeta}>{item.brand}</Text> : null}
            </View>
            <Text style={styles.entryCalories}>{item.caloriesPer100g} kcal/100g</Text>
          </Pressable>
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
        <Pressable style={styles.closeScanner} onPress={() => setScannerOpen(false)}>
          <Text style={styles.primaryButtonText}>Cancel</Text>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", padding: 20 },
  title: { color: "#F8FAFC", fontSize: 24, fontWeight: "700" },
  brand: { color: "#94A3B8", fontSize: 14, marginTop: 4, marginBottom: 20 },
  label: { color: "#94A3B8", fontSize: 14, marginTop: 20, marginBottom: 8 },
  input: {
    backgroundColor: "#1E293B",
    color: "#F8FAFC",
    borderRadius: 10,
    padding: 14,
    fontSize: 16
  },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 12, marginBottom: 16 },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#1E293B",
    borderRadius: 10,
    padding: 14
  },
  secondaryButtonText: { textAlign: "center", color: "#F8FAFC", fontWeight: "600" },
  resultRow: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    alignItems: "center"
  },
  entryName: { color: "#F8FAFC", fontSize: 15, fontWeight: "600" },
  entryMeta: { color: "#94A3B8", fontSize: 13, marginTop: 2 },
  entryCalories: { color: "#F8FAFC", fontSize: 13, fontWeight: "700" },
  macroRow: { marginTop: 16, marginBottom: 8 },
  macro: { color: "#22C55E", fontSize: 20, fontWeight: "700" },
  primaryButton: { backgroundColor: "#22C55E", borderRadius: 10, padding: 16, marginTop: 20 },
  primaryButtonText: { textAlign: "center", color: "#0F172A", fontWeight: "700", fontSize: 16 },
  cancelText: { textAlign: "center", color: "#94A3B8", marginTop: 16 },
  closeScanner: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "#22C55E",
    borderRadius: 10,
    padding: 16
  }
});