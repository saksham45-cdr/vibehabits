import { supabase } from '@/lib/supabase';
import type { MilkEntry } from '@/types/milk';

export async function getMilkEntriesForMonth(month: string): Promise<MilkEntry[]> {
  const start = `${month}-01`;
  // Get last day of month
  const [year, mon] = month.split('-').map(Number);
  const end = new Date(year, mon, 0).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('milk_entries')
    .select('*')
    .gte('entry_date', start)
    .lte('entry_date', end)
    .order('entry_date', { ascending: true });

  if (error) {
    console.error('getMilkEntriesForMonth error:', error);
    return [];
  }
  return (data as MilkEntry[]) ?? [];
}

export async function upsertMilkEntry(entry: {
  entry_date: string;
  status: 'taken' | 'skipped';
  litres: number | null;
}): Promise<MilkEntry> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('milk_entries')
    .upsert(
      { user_id: user.id, ...entry },
      { onConflict: 'user_id,entry_date' }
    )
    .select()
    .single();

  if (error) throw error;
  return data as MilkEntry;
}
