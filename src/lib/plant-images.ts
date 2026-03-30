const cache = new Map<string, string | null>();

export async function fetchPlantImage(plantName: string): Promise<string | null> {
  const key = plantName.trim().toLowerCase();
  if (cache.has(key)) return cache.get(key)!;

  const title = encodeURIComponent(plantName.trim().replace(/\s+/g, '_'));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      cache.set(key, null);
      return null;
    }
    const data = await res.json();
    const imageUrl: string | null = data.thumbnail?.source ?? data.originalimage?.source ?? null;
    cache.set(key, imageUrl);
    return imageUrl;
  } catch {
    cache.set(key, null);
    return null;
  }
}
