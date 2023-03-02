import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://sbleengioveytcenbewk.supabase.co";
export const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNibGVlbmdpb3ZleXRjZW5iZXdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3NzMyMzc2NSwiZXhwIjoxOTkyODk5NzY1fQ.RP-mONp7_oTdDtJKodmOjX0cEjABxGuOBu-vsLBF3TY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
