import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://uzwmahoggodnsovlyvwd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6d21haG9nZ29kbnNvdmx5dndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTUyODgsImV4cCI6MjA2NzI5MTI4OH0.6k9fV0aC2KFZbn3v8XRJBlYUeBYKqH4LfpS9-Nnss5A";
export const supabase = createClient(supabaseUrl, supabaseKey);
