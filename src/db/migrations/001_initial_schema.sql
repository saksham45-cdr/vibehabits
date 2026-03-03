-- Migration 001: Initial Schema
-- Up + Down as required by framework.md §3: "All schema migrations are reversible"

-- ============================================================
-- UP
-- ============================================================

-- UP: users
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  timezone    TEXT NOT NULL DEFAULT 'UTC',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- UP: tasks
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- ============================================================
-- DOWN
-- ============================================================

-- DOWN: reverse order
-- DROP TABLE IF EXISTS daily_logs;
-- DROP TABLE IF EXISTS tasks;
-- DROP TABLE IF EXISTS users;
