import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lensqtsqihmkwaekimft.supabase.co";

const supabasePublishableKey = "sb_publishable_a-CcBvHIMcV7h0MG60i-yg_0wSDFBcH";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
