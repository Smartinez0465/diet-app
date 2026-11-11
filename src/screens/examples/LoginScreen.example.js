// EXAMPLE CONVERSION — not wired into the navigator. src/screens/LoginScreen.js on the toolkit.
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../theme";
import { Button, Screen, Text, TextField } from "../../components/ui";

export default function LoginScreenExample() {
  const { spacing } = useTheme();
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
    <Screen style={{ justifyContent: "center" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Text variant="h1" style={{ textAlign: "center", marginBottom: spacing.xxxl }}>
          {isSignUp ? "Create account" : "Welcome back"}
        </Text>
        <TextField label="Email" autoCapitalize="none" keyboardType="email-address"
          autoComplete="email" value={email} onChangeText={setEmail} />
        <TextField label="Password" secureTextEntry autoComplete="password"
          value={password} onChangeText={setPassword} />
        <Button title={isSignUp ? "Sign up" : "Log in"} onPress={handleSubmit} loading={loading}
          style={{ marginTop: spacing.sm }} />
        <Button variant="ghost" title={isSignUp ? "Already have an account? Log in" : "No account? Sign up"}
          onPress={() => setIsSignUp(!isSignUp)} style={{ marginTop: spacing.lg }} />
      </KeyboardAvoidingView>
    </Screen>
  );
}
