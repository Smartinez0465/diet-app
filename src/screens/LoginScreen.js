import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { colors, spacing, type } from "../theme/brand";
import Button from "../components/Button";
import TextField from "../components/TextField";

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
      <Text accessibilityRole="header" style={styles.title}>
        {isSignUp ? "Create account" : "Welcome back"}
      </Text>

      <TextField
        label="Email"
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.field}
      />
      <TextField
        label="Password"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.field}
      />

      <Button
        title={loading ? (isSignUp ? "Signing up…" : "Logging in…") : isSignUp ? "Sign up" : "Log in"}
        onPress={handleSubmit}
        disabled={loading}
        style={styles.submit}
      />

      <Button
        variant="text"
        title={isSignUp ? "Already have an account? Log in" : "No account? Sign up"}
        onPress={() => setIsSignUp(!isSignUp)}
        style={styles.switch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: spacing.xxl, backgroundColor: colors.bg },
  title: {
    ...type.title,
    color: colors.ink,
    marginBottom: spacing.xxxl,
    textAlign: "center"
  },
  field: { marginBottom: spacing.md },
  submit: { marginTop: spacing.sm },
  switch: { marginTop: spacing.lg }
});
