const API_BASE = 'https://trefle.io/api/v1';

function getToken(): string {
  return import.meta.env.VITE_TREFLE_TOKEN ?? '';
}

export interface TrefleSpeciesListItem {
  id: number;
  common_name: string | null;
  scientific_name: string;
  slug: string;
  family: string | null;
  family_common_name: string | null;
  image_url: string | null;
  genus: string;
  links: {
    self: string;
    plant: string;
    genus: string;
  };
}

export interface TrefleSpeciesDetail {
  id: number;
  common_name: string | null;
  scientific_name: string;
  slug: string;
  family: string | null;
  family_common_name: string | null;
  image_url: string | null;
  duration: string[] | null;
  edible: boolean;
  observations: string | null;
  images: Record<string, { id: number; image_url: string; copyright: string }[]>;
  flower: { color: string[] | null; conspicuous: boolean | null } | null;
  foliage: { texture: string | null; color: string[] | null; leaf_retention: boolean | null } | null;
  specifications: {
    ligneous_type: string | null;
    growth_form: string | null;
    growth_habit: string | null;
    growth_rate: string | null;
    average_height: { cm: number | null } | null;
    maximum_height: { cm: number | null } | null;
    toxicity: string | null;
  } | null;
  growth: {
    description: string | null;
    sowing: string | null;
    light: number | null;
    atmospheric_humidity: number | null;
    soil_humidity: number | null;
    soil_nutriments: number | null;
    soil_texture: number | null;
    minimum_precipitation: { mm: number | null } | null;
    maximum_precipitation: { mm: number | null } | null;
    minimum_temperature: { deg_c: number | null } | null;
    maximum_temperature: { deg_c: number | null } | null;
    bloom_months: string[] | null;
    growth_months: string[] | null;
    fruit_months: string[] | null;
    days_to_harvest: number | null;
    ph_minimum: number | null;
    ph_maximum: number | null;
  } | null;
}

interface TrefleSearchResponse {
  data: TrefleSpeciesListItem[];
  links: { self: string; first: string; last: string; next?: string };
  meta: { total: number };
}

const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 1000 * 60 * 60;

let rateLimitedUntil = 0;

async function cachedFetch<T>(url: string): Promise<T | null> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data as T;

  if (Date.now() < rateLimitedUntil) return null;

  try {
    const res = await fetch(url);
    if (res.status === 429) {
      rateLimitedUntil = Date.now() + 1000 * 60;
      console.warn('Trefle API rate limit reached — pausing requests for 1 minute');
      return null;
    }
    if (!res.ok) return null;

    const data = await res.json();
    cache.set(url, { data, ts: Date.now() });
    return data as T;
  } catch {
    return null;
  }
}

export async function searchSpecies(query: string): Promise<TrefleSpeciesListItem[]> {
  const token = getToken();
  if (!token || !query.trim()) return [];

  const url = `${API_BASE}/plants/search?token=${token}&q=${encodeURIComponent(query.trim())}`;
  const res = await cachedFetch<TrefleSearchResponse>(url);
  return res?.data ?? [];
}

export async function getSpeciesDetails(slug: string): Promise<TrefleSpeciesDetail | null> {
  const token = getToken();
  if (!token) return null;

  const url = `${API_BASE}/species/${encodeURIComponent(slug)}?token=${token}`;
  const wrapper = await cachedFetch<{ data: TrefleSpeciesDetail }>(url);
  return wrapper?.data ?? null;
}

export function extractCareTips(detail: TrefleSpeciesDetail): CareTip[] {
  const tips: CareTip[] = [];
  const g = detail.growth;
  const s = detail.specifications;

  if (g?.light != null) {
    const labels = ['Very low', 'Low', 'Low–Medium', 'Medium', 'Medium', 'Medium–Bright', 'Bright indirect', 'Bright', 'High', 'Full sun', 'Full sun'];
    tips.push({
      category: 'Sunlight',
      icon: '☀️',
      value: labels[g.light] ?? `Level ${g.light}`,
      detail: `Light level: ${g.light}/10`,
    });
  }

  if (g?.atmospheric_humidity != null) {
    const label = g.atmospheric_humidity <= 3 ? 'Low' : g.atmospheric_humidity <= 6 ? 'Medium' : 'High';
    tips.push({
      category: 'Humidity',
      icon: '💨',
      value: label,
      detail: `Atmospheric humidity: ${g.atmospheric_humidity}/10`,
    });
  }

  if (g?.soil_humidity != null) {
    const label = g.soil_humidity <= 3 ? 'Infrequent (drought-tolerant)' : g.soil_humidity <= 6 ? 'Regular' : 'Frequent (moisture-loving)';
    tips.push({
      category: 'Watering',
      icon: '💧',
      value: label,
      detail: `Soil moisture: ${g.soil_humidity}/10`,
    });
  }

  if (s?.growth_rate) {
    tips.push({
      category: 'Growth Rate',
      icon: '📈',
      value: s.growth_rate.charAt(0).toUpperCase() + s.growth_rate.slice(1),
    });
  }

  if (s?.toxicity && s.toxicity !== 'none') {
    tips.push({
      category: 'Toxicity',
      icon: '⚠️',
      value: s.toxicity.charAt(0).toUpperCase() + s.toxicity.slice(1),
    });
  }

  if (detail.duration?.length) {
    tips.push({
      category: 'Duration',
      icon: '🌱',
      value: detail.duration.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', '),
    });
  }

  if (g?.minimum_temperature?.deg_c != null) {
    tips.push({
      category: 'Min Temperature',
      icon: '🌡️',
      value: `${g.minimum_temperature.deg_c}°C / ${Math.round(g.minimum_temperature.deg_c * 9 / 5 + 32)}°F`,
    });
  }

  if (g?.bloom_months?.length) {
    tips.push({
      category: 'Blooming',
      icon: '🌸',
      value: g.bloom_months.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', '),
    });
  }

  if (s?.average_height?.cm != null) {
    const cm = s.average_height.cm;
    tips.push({
      category: 'Avg Height',
      icon: '📏',
      value: cm >= 100 ? `${(cm / 100).toFixed(1)}m` : `${cm}cm`,
    });
  }

  if (detail.flower?.color?.length) {
    tips.push({
      category: 'Flower Color',
      icon: '🌺',
      value: detail.flower.color.join(', '),
    });
  }

  if (g?.ph_minimum != null && g?.ph_maximum != null) {
    tips.push({
      category: 'Soil pH',
      icon: '🪨',
      value: `${g.ph_minimum} – ${g.ph_maximum}`,
    });
  }

  if (g?.sowing) {
    tips.push({
      category: 'Sowing',
      icon: '🌾',
      value: g.sowing.length > 80 ? g.sowing.slice(0, 80).trim() + '…' : g.sowing,
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
