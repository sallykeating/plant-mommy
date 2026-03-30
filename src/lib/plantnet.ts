const API_BASE = import.meta.env.DEV
  ? '/api/plantnet'
  : 'https://my-api.plantnet.org';

function getApiKey(): string {
  return import.meta.env.VITE_PLANTNET_API_KEY ?? '';
}

export interface PlantNetResult {
  score: number;
  species: {
    scientificNameWithoutAuthor: string;
    scientificNameAuthorship: string;
    genus: { scientificNameWithoutAuthor: string };
    family: { scientificNameWithoutAuthor: string };
    commonNames: string[];
  };
}

export interface PlantNetResponse {
  results: PlantNetResult[];
  remainingIdentificationRequests: number;
}

export async function identifyPlant(
  imageFile: File,
  organ: 'auto' | 'leaf' | 'flower' | 'fruit' | 'bark' = 'auto',
): Promise<PlantNetResponse> {
  const key = getApiKey();
  if (!key) throw new Error('PlantNet API key is not configured');

  const form = new FormData();
  form.append('organs', organ);
  form.append('images', imageFile);

  const url = `${API_BASE}/v2/identify/all?api-key=${key}&include-related-images=true&nb-results=5&lang=en`;

  const res = await fetch(url, { method: 'POST', body: form });

  if (!res.ok) {
    if (res.status === 404) throw new Error('Could not identify this plant. Try a clearer photo.');
    if (res.status === 429) throw new Error('Daily identification limit reached. Try again tomorrow.');
    throw new Error(`Identification failed (${res.status})`);
  }

  return res.json();
}
