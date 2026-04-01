"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Calendar from "@/components/Calendar";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import AiInsightCard from "@/components/AiInsightCard";
import AuthPage from "@/components/AuthPage";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { store } from "@/lib/store";
import { computeStreak, computeCompletionRate } from "@/lib/streaks";
import { addDays } from "@/lib/date-utils";
import type { Task, DailyLog, Frequency } from "@/types/api";

// Lazy-load the milk tracker — only fetched when user opens it
const DoodhKaHisaab = dynamic(() => import("@/components/DoodhKaHisaab"), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDoodh, setShowDoodh] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Stable refs — let callbacks read latest values without being recreated
  const logsRef = useRef(logs);
  logsRef.current = logs;
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;
  const selectedTaskIdRef = useRef(selectedTaskId);
  selectedTaskIdRef.current = selectedTaskId;

  // today is session-constant — initialize once
  const [today] = useState(() => new Date().toISOString().split("T")[0]);

  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  );

  // Auto-open Doodh ka Hisaab when landing page CTA sends user here via ?open=doodh.
  // Works for both new logins (URL persists through AuthPage) and already-authed users.
  useEffect(() => {
    if (!user) return;
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('open') === 'doodh') {
      setShowDoodh(true);
      // Clean up the param so a hard-refresh does not reopen the modal.
      router.replace('/dashboard', { scroll: false });
    }
  }, [user, router]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const tasksData = await store.getTasks(user.id);
      setTasks(tasksData || []);
      const taskIds = (tasksData || []).map((t) => t.id);
      const logsData = await store.getLogsForTaskIds(taskIds, currentMonth);
      setLogs(logsData || []);
    } catch (e) {
      console.error("Failed to fetch data:", e);
    }
  }, [user, currentMonth]);

  const fetchLogs = useCallback(async (taskIds: string[]) => {
    if (!user) return;
    try {
      const logsData = await store.getLogsForTaskIds(taskIds, currentMonth);
      setLogs(logsData || []);
    } catch (e) {
      console.error("Failed to fetch logs:", e);
    }
  }, [user, currentMonth]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchData().then(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading, fetchData]);

  // Stable toggle — reads latest logs via ref, not closure capture
  const handleToggleLog = useCallback(async (taskId: string, date: string) => {
    if (!user) return;

    const existingLog = logsRef.current.find((l) => l.taskId === taskId && l.logDate === date);

    if (existingLog) {
      setLogs((prev) => prev.filter((l) => l.id !== existingLog.id));
    } else {
      const tempLog: DailyLog = {
        id: `temp-${taskId}-${date}`,
        taskId,
        logDate: date,
        createdAt: new Date().toISOString(),
      };
      setLogs((prev) => [...prev, tempLog]);
    }

    try {
      const result = await store.toggleLog(taskId, date);
      if (result.created && result.log) {
        setLogs((prev) =>
          prev.map((l) =>
            l.id === `temp-${taskId}-${date}` ? result.log! : l
          )
        );
      }
    } catch (e) {
      console.error("Failed to toggle log:", e);
      fetchLogs(tasksRef.current.map((t) => t.id));
    }
  }, [user, fetchLogs]);

  // Stable today-toggle — avoids inline arrow in JSX that breaks TaskList memo
  const handleToggleToday = useCallback((taskId: string) => {
    handleToggleLog(taskId, today);
  }, [handleToggleLog, today]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      await store.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      if (selectedTaskIdRef.current === taskId) setSelectedTaskId(null);
    } catch (e) {
      console.error("Failed to delete task:", e);
      alert("Failed to delete habit. Please try again.");
    }
  }, []);

  // Stable nav handlers — read latest tasks/selectedTaskId via refs
  const handlePrevHabit = useCallback(() => {
    const ts = tasksRef.current;
    if (ts.length === 0) return;
    const idx = ts.findIndex(t => t.id === selectedTaskIdRef.current);
    setSelectedTaskId(ts[idx <= 0 ? ts.length - 1 : idx - 1].id);
  }, []);

  const handleNextHabit = useCallback(() => {
    const ts = tasksRef.current;
    if (ts.length === 0) return;
    const idx = ts.findIndex(t => t.id === selectedTaskIdRef.current);
    setSelectedTaskId(ts[idx === -1 || idx === ts.length - 1 ? 0 : idx + 1].id);
  }, []);

  const handleCreateTask = useCallback(async (data: { name: string; frequency: Frequency; color: string }) => {
    if (!user) return;
    setSaving(true);
    try {
      const newTask = await store.createTask(user.id, data);
      setTasks(prev => [...prev, newTask]);
      setShowForm(false);
      fetchData();
    } catch (e) {
      console.error("Failed to create task:", e);
      alert("Failed to create habit. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [user, fetchData]);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    // No reset needed — auth state change unmounts this component.
  }, []);

  // ── Derived state — all memoized to avoid recalculation on every render ──

  const streaks = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach((task) => {
      const taskLogs = logs.filter((l) => l.taskId === task.id);
      map.set(task.id, computeStreak(taskLogs, task.frequency, today).currentStreak);
    });
    return map;
  }, [tasks, logs, today]);

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  const selectedTaskLogs = useMemo(
    () => (selectedTaskId ? logs.filter((l) => l.taskId === selectedTaskId) : []),
    [logs, selectedTaskId]
  );

  const selectedStreak = useMemo(
    () => (selectedTask ? computeStreak(selectedTaskLogs, selectedTask.frequency, today) : null),
    [selectedTask, selectedTaskLogs, today]
  );

  const selectedCompletionRate = useMemo(
    () =>
      selectedTask
        ? computeCompletionRate(selectedTaskLogs, selectedTask.frequency, {
            start: addDays(today, -29),
            end: today,
          })
        : 0,
    [selectedTask, selectedTaskLogs, today]
  );

  // Stable filtered logs for Calendar — avoids new array ref on every unrelated re-render
  const calendarLogs = useMemo(
    () => (selectedTaskId ? logs.filter(l => l.taskId === selectedTaskId) : logs),
    [logs, selectedTaskId]
  );

  const habitIndex = useMemo(
    () => tasks.findIndex(t => t.id === selectedTaskId),
    [tasks, selectedTaskId]
  );

  // ── Auth check only (very fast — just reads local session) ──
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // ── App renders immediately with empty state; data populates async ──
  return (
    <main className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand">
            <span className="brand-icon">📅</span>
            <h1 className="brand-name">VibeCalendar</h1>
          </div>
          <button
            className="add-task-btn"
            onClick={() => setShowForm(true)}
            aria-label="Add new habit"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Habit
          </button>
        </div>

        <TaskList
          tasks={tasks}
          logs={logs}
          selectedTaskId={selectedTaskId}
          onSelectTask={setSelectedTaskId}
          onToggleToday={handleToggleToday}
          onDeleteTask={handleDeleteTask}
          streaks={streaks}
          today={today}
        />

        <div className="sidebar-doodh-wrapper">
          <button
            onClick={() => setShowDoodh(true)}
            className="doodh-sidebar-btn"
          >
            <span className="doodh-btn-icon">🥛</span>
            <span className="doodh-btn-text">
              <span className="doodh-btn-title">Doodh ka Hisaab</span>
              <span className="doodh-btn-sub">Track daily milk &amp; bills</span>
            </span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="doodh-btn-arrow">
              <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/*
         * Logout button — concurrent opacity swap (no AnimatePresence mode="wait").
         *
         * mode="wait" was blocking the enter animation until the exit finished.
         * When signOut() resolved mid-exit, AuthContext unmounted the component
         * during that window, causing the UI glitch. Replaced with two
         * position:absolute spans that cross-fade simultaneously — no blocking,
         * no exit gate, safe to unmount at any point.
         */}
        <motion.button
          className="logout-btn"
          onClick={handleLogout}
          disabled={loggingOut}
          whileHover={!loggingOut ? { scale: 1.02 } : undefined}
          whileTap={!loggingOut ? { scale: 0.97 } : undefined}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: "hidden", justifyContent: "center", position: "relative" }}
        >
          {/* Label — fades out when logging out */}
          <motion.span
            animate={{ opacity: loggingOut ? 0 : 1 }}
            transition={{ duration: 0.15 }}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Logout
          </motion.span>

          {/* Spinner — fades in when logging out; absolute so it doesn't shift layout */}
          <motion.span
            animate={{ opacity: loggingOut ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position:   "absolute",
              display:    "flex",
              alignItems: "center",
              gap:        "8px",
              pointerEvents: "none",
            }}
          >
            <motion.svg
              width="14" height="14" viewBox="0 0 16 16" fill="none"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="8" cy="8" r="6" stroke="var(--error)" strokeWidth="2" strokeOpacity="0.3" />
              <path d="M14 8A6 6 0 0 0 8 2" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" />
            </motion.svg>
            Signing out...
          </motion.span>
        </motion.button>
      </aside>

      {/* Main content */}
      <div className="main-content">
        <Calendar
          tasks={tasks}
          logs={calendarLogs}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onToggleLog={handleToggleLog}
          selectedTaskId={selectedTaskId}
          selectedTaskName={selectedTask?.name}
          selectedTaskColor={selectedTask?.color}
          onPrevHabit={handlePrevHabit}
          onNextHabit={handleNextHabit}
          habitIndex={habitIndex}
          habitCount={tasks.length}
        />

        {selectedTask && selectedStreak && (
          <div className="analytics-panel">
            <AnalyticsDashboard
              taskName={selectedTask.name}
              taskColor={selectedTask.color}
              streak={selectedStreak}
              completionRate={selectedCompletionRate}
              totalLogs={selectedTaskLogs.length}
            />
            <AiInsightCard streak={selectedStreak} />
          </div>
        )}

        {!selectedTask && (
          <div className="no-selection-hint">
            <p>👈 Select a habit to view its analytics and streaks</p>
          </div>
        )}
      </div>

      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => !saving && setShowForm(false)}
          isLoading={saving}
        />
      )}

      {showDoodh && (
        <div className="fixed inset-0 z-40 bg-[#FAFBFF] overflow-y-auto">
          <DoodhKaHisaab onClose={() => setShowDoodh(false)} />
        </div>
      )}
    </main>
  );
}
