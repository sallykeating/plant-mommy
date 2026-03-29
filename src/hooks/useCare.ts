import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { CareReminder, CareEvent } from '@/lib/types';
import { addDays, todayISO } from '@/lib/helpers';

export function useCareReminders(plantId?: string) {
  const [reminders, setReminders] = useState<CareReminder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('care_reminders').select('*').eq('is_active', true);
    if (plantId) query = query.eq('plant_id', plantId);
    query = query.order('next_due');

    const { data, error } = await query;
    if (!error && data) setReminders(data);
    setLoading(false);
  }, [plantId]);

  useEffect(() => { fetch(); }, [fetch]);

  async function createReminder(reminder: Partial<CareReminder>) {
    const { data, error } = await supabase
      .from('care_reminders')
      .insert(reminder)
      .select()
      .single();

    if (!error && data) setReminders(prev => [...prev, data]);
    return { data, error: error?.message ?? null };
  }

  async function completeReminder(reminder: CareReminder) {
    const now = new Date().toISOString();
    const nextDue = addDays(todayISO(), reminder.frequency_days);

    const { error: reminderError } = await supabase
      .from('care_reminders')
      .update({ last_completed: now, next_due: nextDue })
      .eq('id', reminder.id);

    const { error: eventError } = await supabase
      .from('care_events')
      .insert({
        plant_id: reminder.plant_id,
        care_type: reminder.care_type,
        performed_at: now,
      });

    if (!reminderError && !eventError) {
      setReminders(prev =>
        prev.map(r => r.id === reminder.id
          ? { ...r, last_completed: now, next_due: nextDue }
          : r
        )
      );
    }
    return { error: reminderError?.message ?? eventError?.message ?? null };
  }

  async function snoozeReminder(id: string, days: number) {
    const nextDue = addDays(todayISO(), days);
    const { error } = await supabase
      .from('care_reminders')
      .update({ next_due: nextDue })
      .eq('id', id);

    if (!error) {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, next_due: nextDue } : r));
    }
    return { error: error?.message ?? null };
  }

  async function deleteReminder(id: string) {
    const { error } = await supabase.from('care_reminders').delete().eq('id', id);
    if (!error) setReminders(prev => prev.filter(r => r.id !== id));
    return { error: error?.message ?? null };
  }

  return { reminders, loading, fetch, createReminder, completeReminder, snoozeReminder, deleteReminder };
}

export function useAllReminders() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<(CareReminder & { plant_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: plants } = await supabase
      .from('plants')
      .select('id, name')
      .eq('user_id', user.id);

    if (!plants) { setLoading(false); return; }

    const plantIds = plants.map(p => p.id);
    const plantMap = new Map(plants.map(p => [p.id, p.name]));

    const { data, error } = await supabase
      .from('care_reminders')
      .select('*')
      .in('plant_id', plantIds)
      .eq('is_active', true)
      .order('next_due');

    if (!error && data) {
      setReminders(data.map(r => ({ ...r, plant_name: plantMap.get(r.plant_id) })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  return { reminders, loading, refetch: fetch };
}

export function useCareEvents(plantId: string | undefined) {
  const [events, setEvents] = useState<CareEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!plantId) return;
    setLoading(true);
    supabase
      .from('care_events')
      .select('*')
      .eq('plant_id', plantId)
      .order('performed_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!error && data) setEvents(data);
        setLoading(false);
      });
  }, [plantId]);

  useEffect(() => {
    load();
  }, [load]);

  async function logCareEvent(event: Partial<CareEvent>) {
    const { data, error } = await supabase
      .from('care_events')
      .insert(event)
      .select()
      .single();

    if (!error && data) setEvents(prev => [data, ...prev]);
    return { data, error: error?.message ?? null };
  }

  return { events, loading, logCareEvent, refetch: load };
}
