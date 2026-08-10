import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { supabase } from "../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert("Error", error.message);
    else if (isSignUp) Alert.alert("Check your email", "Confirm your account, then log in.");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Create account" : "Welcome back"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "..." : isSignUp ? "Sign up" : "Log in"}</Text>
      </Pressable>

      <Pressable onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.switchText}>
          {isSignUp ? "Already have an account? Log in" : "No account? Sign up"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#0F172A" },
  title: { fontSize: 28, fontWeight: "700", color: "#F8FAFC", marginBottom: 32, textAlign: "center" },
  input: {
    backgroundColor: "#1E293B",
    color: "#F8FAFC",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16
  },
  button: { backgroundColor: "#22C55E", borderRadius: 10, padding: 16, marginTop: 8 },
  buttonText: { textAlign: "center", color: "#0F172A", fontWeight: "700", fontSize: 16 },
  switchText: { textAlign: "center", color: "#94A3B8", marginTop: 20 }
});
