import { useCallback, useEffect, useRef, useState } from 'react';
import {
  searchSpecies,
  getSpeciesDetails,
  extractCareTips,
  type TrefleSpeciesListItem,
  type TrefleSpeciesDetail,
  type CareTip,
} from '@/lib/trefle';
import { lookupCareProfile, searchLocalPlants } from '@/lib/plant-care-data';
import { fetchPlantImage } from '@/lib/plant-images';
import { SUNLIGHT_LABELS, HUMIDITY_LABELS } from '@/lib/types';

function localToTrefleItem(name: string): TrefleSpeciesListItem {
  return {
    id: -Math.abs(hashCode(name)),
    common_name: name,
    scientific_name: name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    family: null,
    family_common_name: null,
    image_url: null,
    genus: '',
    links: { self: '', plant: '', genus: '' },
  };
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h;
}

export function useSpeciesSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TrefleSpeciesListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const search = useCallback((q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!q.trim() || q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const apiData = await searchSpecies(q);
        if (apiData.length > 0) {
          setResults(apiData.slice(0, 8));
        } else {
          await setLocalResults(q);
        }
      } catch {
        await setLocalResults(q);
      }
      setLoading(false);
    }, 400);

    async function setLocalResults(query: string) {
      const localHits = searchLocalPlants(query);
      const items = localHits.map(h => localToTrefleItem(h.name));
      setResults(items);

      const withImages = await Promise.all(
        items.map(async (item) => {
          const url = await fetchPlantImage(item.common_name ?? item.scientific_name);
          return url ? { ...item, image_url: url } : item;
        }),
      );
      setResults(withImages);
    }
  }, []);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  return { query, search, results, loading, clearResults: () => setResults([]) };
}

function careTipsFromProfile(name: string): CareTip[] {
  const profile = lookupCareProfile(name);
  if (!profile) return [];

  const tips: CareTip[] = [];
  tips.push({ category: 'Sunlight', icon: '☀️', value: SUNLIGHT_LABELS[profile.light] });
  tips.push({ category: 'Watering', icon: '💧', value: `Every ${profile.wateringDays} days` });
  tips.push({ category: 'Humidity', icon: '💨', value: HUMIDITY_LABELS[profile.humidity] });
  tips.push({ category: 'Fertilizing', icon: '🌱', value: `Every ${profile.fertilizingDays} days` });
  if (profile.growthRate) tips.push({ category: 'Growth Rate', icon: '📈', value: profile.growthRate });
  if (profile.toxicToPets || profile.toxicToHumans) {
    const targets = [profile.toxicToHumans && 'humans', profile.toxicToPets && 'pets'].filter(Boolean);
    tips.push({ category: 'Toxicity', icon: '⚠️', value: `Toxic to ${targets.join(' & ')}` });
  }
  return tips;
}

export function useSpeciesDetails(speciesName: string | null | undefined) {
  const [detail, setDetail] = useState<TrefleSpeciesDetail | null>(null);
  const [careTips, setCareTips] = useState<CareTip[]>([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState<string | null>(null);
  const fetchedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!speciesName || speciesName === fetchedRef.current) return;
    fetchedRef.current = speciesName;

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const searchResults = await searchSpecies(speciesName);
        if (cancelled || !searchResults.length) {
          const fallbackTips = careTipsFromProfile(speciesName);
          if (fallbackTips.length) {
            setCareTips(fallbackTips);
            const profile = lookupCareProfile(speciesName);
            if (profile?.description) setDescription(profile.description);
          }
          setLoading(false);
          return;
        }

        const best = searchResults.find(
          r => r.scientific_name.toLowerCase() === speciesName.toLowerCase()
            || (r.common_name?.toLowerCase() === speciesName.toLowerCase())
        ) ?? searchResults[0];

        const details = await getSpeciesDetails(best.slug);
        if (cancelled) return;

        if (details) {
          setDetail(details);
          const apiTips = extractCareTips(details);
          if (apiTips.length > 0) {
            setCareTips(apiTips);
          } else {
            const fallback = careTipsFromProfile(speciesName)
              || careTipsFromProfile(best.common_name ?? '')
              || careTipsFromProfile(best.scientific_name);
            setCareTips(fallback);
            const profile = lookupCareProfile(speciesName)
              ?? lookupCareProfile(best.common_name ?? '')
              ?? lookupCareProfile(best.scientific_name);
            if (profile?.description) setDescription(profile.description);
          }
        }
      } catch {
        const fallbackTips = careTipsFromProfile(speciesName);
        if (fallbackTips.length) setCareTips(fallbackTips);
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [speciesName]);

  return { detail, careTips, loading, description };
}
