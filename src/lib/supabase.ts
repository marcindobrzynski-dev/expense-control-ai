import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types.ts';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
