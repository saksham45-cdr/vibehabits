-- Migration 001: Initial Schema
-- Up + Down as required by framework.md §3: "All schema migrations are reversible"

-- ============================================================
-- UP
-- ============================================================

-- UP: users (mirrors auth.users for profile data)
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT UNIQUE NOT NULL,
  timezone    TEXT NOT NULL DEFAULT 'UTC',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- UP: trigger to auto-insert profile row when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- UP: tasks
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  frequency   TEXT NOT NULL CHECK (frequency IN ('daily', 'weekday', 'weekly')),
  color       TEXT NOT NULL DEFAULT '#6366f1',
  archived    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- UP: daily_logs
CREATE TABLE IF NOT EXISTS daily_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  log_date    DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_task_log_date UNIQUE (task_id, log_date)
);
CREATE INDEX IF NOT EXISTS idx_daily_logs_task_date ON daily_logs(task_id, log_date);

-- UP: RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- UP: RLS policies
-- users: each user can only see and update their own profile row
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- tasks: full CRUD on own tasks only
CREATE POLICY "tasks_all_own" ON tasks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- daily_logs: full CRUD on logs belonging to own tasks only
CREATE POLICY "daily_logs_all_own" ON daily_logs
  FOR ALL
  USING (
    auth.uid() = (SELECT user_id FROM tasks WHERE id = task_id)
  )
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM tasks WHERE id = task_id)
  );

-- ============================================================
-- DOWN
-- ============================================================

-- DOWN: reverse order
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user();
-- DROP TABLE IF EXISTS daily_logs;
-- DROP TABLE IF EXISTS tasks;
-- DROP TABLE IF EXISTS users;
