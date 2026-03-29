import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { GrowthMeasurement, PlantPhoto } from '@/lib/types';

export function useGrowthMeasurements(plantId: string | undefined) {
  const [measurements, setMeasurements] = useState<GrowthMeasurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!plantId) return;
    setLoading(true);
    supabase
      .from('growth_measurements')
      .select('*')
      .eq('plant_id', plantId)
      .order('measured_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setMeasurements(data);
        setLoading(false);
      });
  }, [plantId]);

  async function addMeasurement(m: Partial<GrowthMeasurement>) {
    const { data, error } = await supabase
      .from('growth_measurements')
      .insert(m)
      .select()
      .single();

    if (!error && data) setMeasurements(prev => [data, ...prev]);
    return { data, error: error?.message ?? null };
  }

  return { measurements, loading, addMeasurement };
}

export function usePlantPhotos(plantId: string | undefined) {
  const [photos, setPhotos] = useState<PlantPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!plantId) return;
    setLoading(true);
    supabase
      .from('plant_photos')
      .select('*')
      .eq('plant_id', plantId)
      .order('taken_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setPhotos(data);
        setLoading(false);
      });
  }, [plantId]);

  async function uploadPhoto(plantId: string, file: File, caption?: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${plantId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('plant-photos')
      .upload(fileName, file);

    if (uploadError) return { error: uploadError.message };

    const { data: urlData } = supabase.storage
      .from('plant-photos')
      .getPublicUrl(fileName);

    const { data, error } = await supabase
      .from('plant_photos')
      .insert({ plant_id: plantId, url: urlData.publicUrl, caption })
      .select()
      .single();

    if (!error && data) setPhotos(prev => [data, ...prev]);
    return { data, error: error?.message ?? null };
  }

  return { photos, loading, uploadPhoto };
}
