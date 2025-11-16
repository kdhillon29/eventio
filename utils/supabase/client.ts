import { createBrowserClient } from "@supabase/ssr";

export function createClient(supabaseUrl: string, supabaseKey: string) {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(supabaseUrl, supabaseKey);
}
