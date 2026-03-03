-- VibeCalendar — Core Schema (Layer 1)
-- Authority: framework.md §3 — Deterministic Invariants

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  timezone    TEXT NOT NULL DEFAULT 'UTC',  -- IANA timezone
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  frequency   TEXT NOT NULL CHECK (frequency IN ('daily', 'weekday', 'weekly')),
  color       TEXT NOT NULL DEFAULT '#6366f1',
  archived    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- Daily Logs table
-- Framework §3: unique constraint on (task_id, log_date) is absolute
CREATE TABLE IF NOT EXISTS daily_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  log_date    DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_task_log_date UNIQUE (task_id, log_date)
);

CREATE INDEX idx_daily_logs_task_date ON daily_logs(task_id, log_date);

-- Row-Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
