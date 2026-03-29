import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { Plant } from '@/lib/types';

export function usePlants() {
  const { user } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlants = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('user_id', user.id)
      .order('name');

    if (!error && data) setPlants(data);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchPlants(); }, [fetchPlants]);

  async function createPlant(plant: Partial<Plant>) {
    if (!user) return { error: 'Not authenticated' };
    const { data, error } = await supabase
      .from('plants')
      .insert({ ...plant, user_id: user.id })
      .select()
      .single();

    if (!error && data) setPlants(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    return { data, error: error?.message ?? null };
  }

  async function updatePlant(id: string, updates: Partial<Plant>) {
    const { data, error } = await supabase
      .from('plants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setPlants(prev => prev.map(p => p.id === id ? data : p));
    }
    return { data, error: error?.message ?? null };
  }

  async function deletePlant(id: string) {
    const { error } = await supabase.from('plants').delete().eq('id', id);
    if (!error) setPlants(prev => prev.filter(p => p.id !== id));
    return { error: error?.message ?? null };
  }

  return { plants, loading, fetchPlants, createPlant, updatePlant, deletePlant };
}

export function usePlant(id: string | undefined) {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('plants')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setPlant(data);
        setLoading(false);
      });
  }, [id]);

  async function updatePlant(updates: Partial<Plant>) {
    if (!id) return { error: 'No plant ID' };
    const { data, error } = await supabase
      .from('plants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) setPlant(data);
    return { data, error: error?.message ?? null };
  }

  return { plant, loading, updatePlant, refetch: () => {
    if (!id) return;
    supabase.from('plants').select('*').eq('id', id).single()
      .then(({ data }) => { if (data) setPlant(data); });
  }};
}
