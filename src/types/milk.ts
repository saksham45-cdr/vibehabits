export type MilkEntry = {
  id: string;
  user_id: string;
  entry_date: string; // 'YYYY-MM-DD'
  status: 'taken' | 'skipped';
  litres: number | null;
  created_at: string;
};
