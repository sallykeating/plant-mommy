import { useCallback, useEffect, useRef, useState } from 'react';
import {
  searchSpecies,
  getSpeciesDetails,
  extractCareTips,
  type PerenualSpeciesListItem,
  type PerenualSpeciesDetail,
  type CareTip,
} from '@/lib/perenual';

export function useSpeciesSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PerenualSpeciesListItem[]>([]);
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
        const data = await searchSpecies(q);
        setResults(data.slice(0, 8));
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 400);
  }, []);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  return { query, search, results, loading, clearResults: () => setResults([]) };
}

export function useSpeciesDetails(speciesName: string | null | undefined) {
  const [detail, setDetail] = useState<PerenualSpeciesDetail | null>(null);
  const [careTips, setCareTips] = useState<CareTip[]>([]);
  const [loading, setLoading] = useState(false);
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
          setLoading(false);
          return;
        }

        const best = searchResults.find(
          r => r.scientific_name.some(s => s.toLowerCase() === speciesName.toLowerCase())
            || r.common_name.toLowerCase() === speciesName.toLowerCase()
        ) ?? searchResults[0];

        const details = await getSpeciesDetails(best.id);
        if (cancelled) return;

        if (details) {
          setDetail(details);
          setCareTips(extractCareTips(details));
        }
      } catch {
        // API unavailable or rate limited
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [speciesName]);

  return { detail, careTips, loading };
}
