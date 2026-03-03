import { createClient } from "@supabase/supabase-js";
import { config } from "./config";

if (!config.supabase.url || !config.supabase.anonKey) {
    console.error("Supabase: Missing environment variables!");
}

export const supabase = createClient(
    config.supabase.url,
    config.supabase.anonKey
);
