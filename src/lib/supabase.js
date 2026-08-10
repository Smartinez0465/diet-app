import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Fill these in from your Supabase project settings (Project Settings > API)
const SUPABASE_URL = "https://cfbzkozmynwpajlosuqb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmYnprb3pteW53cGFqbG9zdXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzYzODYsImV4cCI6MjEwMTk1MjM4Nn0.qey1rccZAB2jVmukHe9cKSrF-GqSLidgh-mKXgYGsGY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});
