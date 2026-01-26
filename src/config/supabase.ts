import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yhowylubaurpcgewonwe.supabase.co';
const supabaseAnonKey = 'sb_publishable_f5OK93r34x3SrC6cZaTK6Q_OboP-xOY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
