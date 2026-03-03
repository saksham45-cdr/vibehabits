-- VibeCalendar — Seed Data / Analytics Integrity Validation Fixtures
-- Framework §5: five known-outcome scenarios

-- Test user
INSERT INTO users (id, email, timezone) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'test@vibecalendar.dev', 'America/New_York');

-- =================================================================
-- Scenario 1: ZERO STREAK — task with no logs
-- =================================================================
INSERT INTO tasks (id, user_id, name, frequency, color) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
   'Zero Streak Task', 'daily', '#ef4444');
-- No daily_logs entries → current streak = 0, longest streak = 0

-- =================================================================
-- Scenario 2: ACTIVE STREAK — 5 consecutive daily logs ending today
-- =================================================================
INSERT INTO tasks (id, user_id, name, frequency, color) VALUES
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001',
   'Active Streak Task', 'daily', '#22c55e');
-- Assume "today" = 2026-03-02 for fixture purposes
INSERT INTO daily_logs (task_id, log_date) VALUES
  ('b0000000-0000-0000-0000-000000000002', '2026-02-26'),
  ('b0000000-0000-0000-0000-000000000002', '2026-02-27'),
  ('b0000000-0000-0000-0000-000000000002', '2026-02-28'),
  ('b0000000-0000-0000-0000-000000000002', '2026-03-01'),
  ('b0000000-0000-0000-0000-000000000002', '2026-03-02');
-- Expected: current streak = 5, longest streak = 5

-- =================================================================
-- Scenario 3: BROKEN STREAK — gap in the middle
-- =================================================================
INSERT INTO tasks (id, user_id, name, frequency, color) VALUES
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001',
   'Broken Streak Task', 'daily', '#f59e0b');
INSERT INTO daily_logs (task_id, log_date) VALUES
  ('b0000000-0000-0000-0000-000000000003', '2026-02-25'),
  ('b0000000-0000-0000-0000-000000000003', '2026-02-26'),
  ('b0000000-0000-0000-0000-000000000003', '2026-02-27'),
  -- gap on 2026-02-28
  ('b0000000-0000-0000-0000-000000000003', '2026-03-01'),
  ('b0000000-0000-0000-0000-000000000003', '2026-03-02');
-- Expected: current streak = 2, longest streak = 3

-- =================================================================
-- Scenario 4: WEEKDAY-FREQUENCY TASK — only weekdays count
-- =================================================================
INSERT INTO tasks (id, user_id, name, frequency, color) VALUES
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001',
   'Weekday Task', 'weekday', '#3b82f6');
-- Mon 2/23 through Fri 2/27 (all weekdays)
INSERT INTO daily_logs (task_id, log_date) VALUES
  ('b0000000-0000-0000-0000-000000000004', '2026-02-23'),
  ('b0000000-0000-0000-0000-000000000004', '2026-02-24'),
  ('b0000000-0000-0000-0000-000000000004', '2026-02-25'),
  ('b0000000-0000-0000-0000-000000000004', '2026-02-26'),
  ('b0000000-0000-0000-0000-000000000004', '2026-02-27');
-- Sat 2/28 and Sun 3/1 are skipped (weekends don't count)
-- Mon 3/2 logged:
INSERT INTO daily_logs (task_id, log_date) VALUES
  ('b0000000-0000-0000-0000-000000000004', '2026-03-02');
-- Expected: current streak = 6 (weekends are non-applicable, not breaks)

-- =================================================================
-- Scenario 5: DST BOUNDARY — log around spring-forward
-- =================================================================
INSERT INTO tasks (id, user_id, name, frequency, color) VALUES
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001',
   'DST Boundary Task', 'daily', '#8b5cf6');
-- US Spring Forward: 2026-03-08 (America/New_York)
INSERT INTO daily_logs (task_id, log_date) VALUES
  ('b0000000-0000-0000-0000-000000000005', '2026-03-07'),
  ('b0000000-0000-0000-0000-000000000005', '2026-03-08'),
  ('b0000000-0000-0000-0000-000000000005', '2026-03-09');
-- Expected: current streak = 3 (DST does not break date continuity)
