const API_BASE = 'https://perenual.com/api';

function getApiKey(): string {
  return import.meta.env.VITE_PERENUAL_API_KEY ?? '';
}

export interface PerenualSpeciesListItem {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name: string[] | null;
  cycle: string;
  watering: string;
  sunlight: string[];
  default_image: {
    original_url: string;
    regular_url: string;
    medium_url: string;
    small_url: string;
    thumbnail: string;
  } | null;
}

export interface PerenualSpeciesDetail {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name: string[] | null;
  family: string | null;
  origin: string[] | null;
  type: string | null;
  description: string | null;
  cycle: string;
  watering: string;
  watering_general_benchmark: { value: string; unit: string } | null;
  sunlight: string[];
  pruning_month: string[] | null;
  growth_rate: string | null;
  maintenance: string | null;
  care_level: string | null;
  soil: string[] | null;
  pest_susceptibility: string[] | null;
  flowers: boolean;
  flowering_season: string | null;
  indoor: boolean;
  tropical: boolean;
  drought_tolerant: boolean;
  poisonous_to_humans: boolean;
  poisonous_to_pets: boolean;
  default_image: {
    original_url: string;
    regular_url: string;
    medium_url: string;
    small_url: string;
    thumbnail: string;
  } | null;
}

interface SpeciesListResponse {
  data: PerenualSpeciesListItem[];
  total: number;
  current_page: number;
  last_page: number;
}

const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

let rateLimitedUntil = 0;

async function cachedFetch<T>(url: string): Promise<T | null> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data as T;

  if (Date.now() < rateLimitedUntil) return null;

  const res = await fetch(url);
  if (res.status === 429) {
    rateLimitedUntil = Date.now() + 1000 * 60 * 60;
    console.warn('Perenual API rate limit reached — pausing requests for 1 hour');
    return null;
  }
  if (!res.ok) return null;

  const data = await res.json();
  cache.set(url, { data, ts: Date.now() });
  return data as T;
}

export async function searchSpecies(query: string): Promise<PerenualSpeciesListItem[]> {
  const key = getApiKey();
  if (!key || !query.trim()) return [];

  const url = `${API_BASE}/v2/species-list?key=${key}&q=${encodeURIComponent(query.trim())}&indoor=1`;
  const res = await cachedFetch<SpeciesListResponse>(url);
  return res?.data ?? [];
}

export async function getSpeciesDetails(speciesId: number): Promise<PerenualSpeciesDetail | null> {
  const key = getApiKey();
  if (!key) return null;

  const url = `${API_BASE}/v2/species/details/${speciesId}?key=${key}`;
  return cachedFetch<PerenualSpeciesDetail>(url);
}

export function extractCareTips(detail: PerenualSpeciesDetail): CareTip[] {
  const tips: CareTip[] = [];

  if (detail.watering) {
    const benchmark = detail.watering_general_benchmark;
    tips.push({
      category: 'Watering',
      icon: '💧',
      value: detail.watering,
      detail: benchmark ? `Every ${benchmark.value} ${benchmark.unit}` : undefined,
    });
  }

  if (detail.sunlight?.length) {
    tips.push({
      category: 'Sunlight',
      icon: '☀️',
      value: detail.sunlight.join(', '),
    });
  }

  if (detail.care_level) {
    tips.push({
      category: 'Care Level',
      icon: '🌱',
      value: detail.care_level,
    });
  }

  if (detail.growth_rate) {
    tips.push({
      category: 'Growth Rate',
      icon: '📈',
      value: detail.growth_rate,
    });
  }

  if (detail.maintenance) {
    tips.push({
      category: 'Maintenance',
      icon: '🔧',
      value: detail.maintenance,
    });
  }

  if (detail.soil?.length) {
    tips.push({
      category: 'Soil',
      icon: '🪨',
      value: detail.soil.join(', '),
    });
  }

  if (detail.pruning_month?.length) {
    tips.push({
      category: 'Pruning',
      icon: '✂️',
      value: `Best months: ${detail.pruning_month.join(', ')}`,
    });
  }

  if (detail.pest_susceptibility?.length) {
    tips.push({
      category: 'Watch For',
      icon: '🐛',
      value: detail.pest_susceptibility.join(', '),
    });
  }

  if (detail.flowering_season) {
    tips.push({
      category: 'Flowering',
      icon: '🌸',
      value: detail.flowering_season,
    });
  }

  const warnings: string[] = [];
  if (detail.poisonous_to_humans) warnings.push('humans');
  if (detail.poisonous_to_pets) warnings.push('pets');
  if (warnings.length) {
    tips.push({
      category: 'Toxicity',
      icon: '⚠️',
      value: `Poisonous to ${warnings.join(' and ')}`,
    });
  }

  return tips;
}

export interface CareTip {
  category: string;
  icon: string;
  value: string;
  detail?: string;
}
