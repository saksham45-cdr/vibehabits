"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Calendar from "@/components/Calendar";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import AiInsightCard from "@/components/AiInsightCard";
import AuthPage from "@/components/AuthPage";
import DoodhKaHisaab from "@/components/DoodhKaHisaab";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { store } from "@/lib/store";
import { computeStreak, computeCompletionRate } from "@/lib/streaks";
import { addDays } from "@/lib/date-utils";
import type { Task, DailyLog, Frequency, StreakResult } from "@/types/api";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDoodh, setShowDoodh] = useState(false);

  // Current month for calendar
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  );
  const today = now.toISOString().split("T")[0];

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      const tasksData = await store.getTasks(user.id);
      setTasks(tasksData || []);
    } catch (e) {
      console.error("Failed to fetch tasks:", e);
    }
  }, [user]);

  // Fetch logs for the current month
  const fetchLogs = useCallback(async () => {
    if (!user) return;
    try {
      const logsData = await store.getLogsForAllTasks(user.id, currentMonth);
      setLogs(logsData || []);
    } catch (e) {
      console.error("Failed to fetch logs:", e);
    }
  }, [user, currentMonth]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchTasks(), fetchLogs()]).then(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading, fetchTasks, fetchLogs]);

  // Toggle log
  const handleToggleLog = async (taskId: string, date: string) => {
    if (!user) return;
    try {
      await store.toggleLog(taskId, date);
      await fetchLogs();
    } catch (e) {
      console.error("Failed to toggle log:", e);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    try {
      await store.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      if (selectedTaskId === taskId) setSelectedTaskId(null);
    } catch (e) {
      console.error("Failed to delete task:", e);
      alert("Failed to delete habit. Please try again.");
    }
  };

  // Habit slider navigation
  const handlePrevHabit = () => {
    if (tasks.length === 0) return;
    const idx = tasks.findIndex(t => t.id === selectedTaskId);
    const prevIdx = idx <= 0 ? tasks.length - 1 : idx - 1;
    setSelectedTaskId(tasks[prevIdx].id);
  };

  const handleNextHabit = () => {
    if (tasks.length === 0) return;
    const idx = tasks.findIndex(t => t.id === selectedTaskId);
    const nextIdx = idx === -1 || idx === tasks.length - 1 ? 0 : idx + 1;
    setSelectedTaskId(tasks[nextIdx].id);
  };

  // Create task
  const handleCreateTask = async (data: { name: string; frequency: Frequency; color: string }) => {
    if (!user) return;
    setSaving(true);
    try {
      console.log("Creating task for user:", user.id, data);
      const newTask = await store.createTask(user.id, data);

      // Optimistic Update: Add the new task to state immediately
      setTasks(prev => [...prev, newTask]);
      setShowForm(false);

      // Background refresh to ensure everything is in sync
      fetchTasks();
    } catch (e) {
      console.error("Failed to create task:", e);
      alert("Failed to create habit. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Compute streaks for all tasks
  const streaks = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach((task) => {
      const taskLogs = logs.filter((l) => l.taskId === task.id);
      const result = computeStreak(taskLogs, task.frequency, today);
      map.set(task.id, result.currentStreak);
    });
    return map;
  }, [tasks, logs, today]);

  if (authLoading || (user && loading)) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading VibeCalendar...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Selected task analytics
  const selectedTask = tasks.find((t) => t.id === selectedTaskId);
  const selectedTaskLogs = selectedTaskId
    ? logs.filter((l) => l.taskId === selectedTaskId)
    : [];

  let selectedStreak: StreakResult | null = null;
  let selectedCompletionRate = 0;

  if (selectedTask) {
    selectedStreak = computeStreak(selectedTaskLogs, selectedTask.frequency, today);
    selectedCompletionRate = computeCompletionRate(
      selectedTaskLogs,
      selectedTask.frequency,
      { start: addDays(today, -29), end: today }
    );
  }

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
          onToggleToday={(taskId) => handleToggleLog(taskId, today)}
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

        <button className="logout-btn" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Logout
        </button>
      </aside>

      {/* Main content */}
      <div className="main-content">
        <Calendar
          tasks={tasks}
          logs={selectedTaskId ? logs.filter(l => l.taskId === selectedTaskId) : logs}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onToggleLog={handleToggleLog}
          selectedTaskId={selectedTaskId}
          selectedTaskName={selectedTask?.name}
          selectedTaskColor={selectedTask?.color}
          onPrevHabit={handlePrevHabit}
          onNextHabit={handleNextHabit}
          habitIndex={tasks.findIndex(t => t.id === selectedTaskId)}
          habitCount={tasks.length}
        />

        {/* Analytics panel */}
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

      {/* Task creation modal */}
      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => !saving && setShowForm(false)}
          isLoading={saving}
        />
      )}

      {/* Doodh ka Hisaab overlay */}
      {showDoodh && (
        <div className="fixed inset-0 z-40 bg-[#FAFBFF] overflow-y-auto">
          <DoodhKaHisaab onClose={() => setShowDoodh(false)} />
        </div>
      )}
    </main>
  );
}
