// VibeCalendar — Supabase Data Store
// Framework §1: Stability of the data model and API contracts is a first-order constraint.
// Framework §3: "A streak is always computed from raw DailyLog entries ordered by date"

import { supabase } from "./supabase";
import type { Task, DailyLog, User, Frequency } from "@/types/api";

// Tables
const USERS_TAB = "users";
const TASKS_TAB = "tasks";
const LOGS_TAB = "daily_logs";

export const store = {
    getUser: async (id: string): Promise<User | null> => {
        const { data, error } = await supabase
            .from(USERS_TAB)
            .select("*")
            .eq("id", id)
            .single();

        if (error || !data) return null;
        return {
            id: data.id,
            email: data.email,
            timezone: data.timezone,
            createdAt: data.created_at,
        } as User;
    },

    getTasks: async (userId: string): Promise<Task[]> => {
        console.time("⏱️ Supabase: Get Tasks");
        const { data, error } = await supabase
            .from(TASKS_TAB)
            .select("*")
            .eq("user_id", userId)
            .eq("archived", false);

        if (error) {
            console.error("Error fetching tasks:", error);
            return [];
        }

        console.timeEnd("⏱️ Supabase: Get Tasks");
        return (data || []).map((d) => ({
            id: d.id,
            userId: d.user_id,
            name: d.name,
            frequency: d.frequency,
            color: d.color,
            archived: d.archived,
            createdAt: d.created_at,
        })) as Task[];
    },

    getTask: async (id: string): Promise<Task | null> => {
        const { data, error } = await supabase
            .from(TASKS_TAB)
            .select("*")
            .eq("id", id)
            .single();

        if (error || !data) return null;
        return {
            id: data.id,
            userId: data.user_id,
            name: data.name,
            frequency: data.frequency,
            color: data.color,
            archived: data.archived,
            createdAt: data.created_at,
        } as Task;
    },

    createTask: async (userId: string, data: { name: string; frequency: Frequency; color: string }): Promise<Task> => {
        console.time("⏱️ Supabase: Create Task");
        const { data: insertedData, error } = await supabase
            .from(TASKS_TAB)
            .insert({
                user_id: userId,
                name: data.name,
                frequency: data.frequency,
                color: data.color,
                archived: false,
            })
            .select()
            .single();

        if (error) throw error;
        console.timeEnd("⏱️ Supabase: Create Task");

        return {
            id: insertedData.id,
            userId: insertedData.user_id,
            name: insertedData.name,
            frequency: insertedData.frequency,
            color: insertedData.color,
            archived: insertedData.archived,
            createdAt: insertedData.created_at,
        } as Task;
    },

    updateTask: async (
        id: string,
        data: Partial<Pick<Task, "name" | "frequency" | "color" | "archived">>
    ): Promise<Task | null> => {
        const { error } = await supabase
            .from(TASKS_TAB)
            .update(data)
            .eq("id", id);

        if (error) throw error;
        return store.getTask(id);
    },

    deleteTask: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from(TASKS_TAB)
            .delete()
            .eq("id", id);

        if (error) throw error;
    },

    getLogs: async (taskId: string, month?: string): Promise<DailyLog[]> => {
        let query = supabase
            .from(LOGS_TAB)
            .select("*")
            .eq("task_id", taskId)
            .order("log_date", { ascending: true });

        if (month) {
            // month is YYYY-MM
            query = query
                .gte("log_date", `${month}-01`)
                .lte("log_date", `${month}-31`);
        }

        const { data, error } = await query;
        if (error) {
            console.error("Error fetching logs:", error);
            return [];
        }

        return (data || []).map((d) => ({
            id: d.id,
            taskId: d.task_id,
            logDate: d.log_date,
            createdAt: d.created_at,
        })) as DailyLog[];
    },

    getLogsForAllTasks: async (userId: string, month?: string): Promise<DailyLog[]> => {
        const tasks = await store.getTasks(userId);
        const taskIds = tasks.map((t) => t.id);

        if (taskIds.length === 0) return [];

        let query = supabase
            .from(LOGS_TAB)
            .select("*")
            .in("task_id", taskIds)
            .order("log_date", { ascending: true });

        if (month) {
            query = query
                .gte("log_date", `${month}-01`)
                .lte("log_date", `${month}-31`);
        }

        const { data, error } = await query;
        if (error) {
            console.error("Error fetching all logs:", error);
            return [];
        }

        return (data || []).map((d) => ({
            id: d.id,
            taskId: d.task_id,
            logDate: d.log_date,
            createdAt: d.created_at,
        })) as DailyLog[];
    },

    toggleLog: async (taskId: string, logDate: string): Promise<{ created: boolean; log?: DailyLog }> => {
        const { data: existing, error: fetchError } = await supabase
            .from(LOGS_TAB)
            .select("*")
            .eq("task_id", taskId)
            .eq("log_date", logDate)
            .maybeSingle();

        if (fetchError) throw fetchError;

        if (existing) {
            const { error: deleteError } = await supabase
                .from(LOGS_TAB)
                .delete()
                .eq("id", existing.id);

            if (deleteError) throw deleteError;
            return { created: false };
        }

        const { data: inserted, error: insertError } = await supabase
            .from(LOGS_TAB)
            .insert({
                task_id: taskId,
                log_date: logDate,
            })
            .select()
            .single();

        if (insertError) throw insertError;

        return {
            created: true,
            log: {
                id: inserted.id,
                taskId: inserted.task_id,
                logDate: inserted.log_date,
                createdAt: inserted.created_at,
            } as DailyLog,
        };
    },
};
