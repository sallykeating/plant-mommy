import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { HealthIssue, EnvironmentNote } from '@/lib/types';

export function useHealthIssues(plantId: string | undefined) {
  const [issues, setIssues] = useState<HealthIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!plantId) return;
    setLoading(true);
    supabase
      .from('health_issues')
      .select('*')
      .eq('plant_id', plantId)
      .order('started_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setIssues(data);
        setLoading(false);
      });
  }, [plantId]);

  async function addIssue(issue: Partial<HealthIssue>) {
    const { data, error } = await supabase
      .from('health_issues')
      .insert(issue)
      .select()
      .single();

    if (!error && data) setIssues(prev => [data, ...prev]);
    return { data, error: error?.message ?? null };
  }

  async function updateIssue(id: string, updates: Partial<HealthIssue>) {
    const { data, error } = await supabase
      .from('health_issues')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) setIssues(prev => prev.map(i => i.id === id ? data : i));
    return { data, error: error?.message ?? null };
  }

  async function resolveIssue(id: string) {
    return updateIssue(id, { resolved: true, resolved_at: new Date().toISOString().split('T')[0] });
  }

  return { issues, loading, addIssue, updateIssue, resolveIssue };
}

export function useEnvironmentNotes(plantId: string | undefined) {
  const [notes, setNotes] = useState<EnvironmentNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!plantId) return;
    setLoading(true);
    supabase
      .from('environment_notes')
      .select('*')
      .eq('plant_id', plantId)
      .order('recorded_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setNotes(data);
        setLoading(false);
      });
  }, [plantId]);

  async function addNote(note: Partial<EnvironmentNote>) {
    const { data, error } = await supabase
      .from('environment_notes')
      .insert(note)
      .select()
      .single();

    if (!error && data) setNotes(prev => [data, ...prev]);
    return { data, error: error?.message ?? null };
  }

  return { notes, loading, addNote };
}
