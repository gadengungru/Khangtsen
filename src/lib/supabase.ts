import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://axnongwefdafwflekysk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_pFwy1o_CK9ps98dK-yDyTQ_zXaCU2_y";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
