import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://itqbijdwsyxeairbynes.supabase.co';
const supabaseAnonKey = 'sb_publishable_zkR9eREVcOGK0sGSAc3g0A_x_Iyai_a';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
