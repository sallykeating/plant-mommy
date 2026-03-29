import type { SunlightLevel, HumidityLevel } from '@/lib/types';

export interface PlantCareProfile {
  light: SunlightLevel;
  humidity: HumidityLevel;
  wateringDays: number;
  fertilizingDays: number;
  toxicToHumans?: boolean;
  toxicToPets?: boolean;
  growthRate?: string;
  minTempC?: number;
  duration?: string;
  description?: string;
}

const data: Record<string, PlantCareProfile> = {
  'monstera deliciosa': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, toxicToHumans: true, growthRate: 'Moderate', description: 'Thrives in bright, indirect light. Let soil dry between waterings. Loves humidity.' },
  'fruit-salad-plant': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, toxicToHumans: true, growthRate: 'Moderate' },
  'monstera adansonii': { light: 'bright_indirect', humidity: 'high', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Fast' },
  'tarovine': { light: 'bright_indirect', humidity: 'high', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Fast' },
  'zamioculcas zamiifolia': { light: 'low_light', humidity: 'low', wateringDays: 14, fertilizingDays: 60, toxicToPets: true, growthRate: 'Slow', description: 'Very low maintenance. Tolerates low light and infrequent watering.' },
  'zz plant': { light: 'low_light', humidity: 'low', wateringDays: 14, fertilizingDays: 60, toxicToPets: true, growthRate: 'Slow' },
  'epipremnum aureum': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Fast', description: 'Versatile trailing vine. Tolerates lower light but grows faster in bright indirect.' },
  'golden pothos': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Fast' },
  'pothos': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Fast' },
  'sansevieria trifasciata': { light: 'low_light', humidity: 'low', wateringDays: 14, fertilizingDays: 60, toxicToPets: true, growthRate: 'Slow', description: 'Extremely hardy. Thrives on neglect. Let soil dry completely between waterings.' },
  'snake plant': { light: 'low_light', humidity: 'low', wateringDays: 14, fertilizingDays: 60, toxicToPets: true, growthRate: 'Slow' },
  'dracaena trifasciata': { light: 'low_light', humidity: 'low', wateringDays: 14, fertilizingDays: 60, toxicToPets: true, growthRate: 'Slow' },
  'ficus lyrata': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate', description: 'Needs consistent bright indirect light. Sensitive to overwatering and drafts.' },
  'fiddle-leaf fig': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate' },
  'ficus elastica': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate', description: 'Tolerates moderate light. Wipe leaves to keep them glossy and efficient.' },
  'rubber plant': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate' },
  'spathiphyllum wallisii': { light: 'low_light', humidity: 'high', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate', description: 'One of few plants that blooms in low light. Droops dramatically when thirsty.' },
  'peace lily': { light: 'low_light', humidity: 'high', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate' },
  'chlorophytum comosum': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Fast', description: 'Produces baby spiderettes on runners. Great air purifier. Very forgiving.' },
  'spider plant': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Fast' },
  'aloe vera': { light: 'full_sun', humidity: 'low', wateringDays: 14, fertilizingDays: 60, growthRate: 'Slow', description: 'Succulent that loves bright light. Water deeply but infrequently. Gel has medicinal uses.' },
  'hedera helix': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Fast', description: 'Vigorous trailing vine. Prefers cooler temperatures and good humidity.' },
  'english ivy': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Fast' },
  'philodendron hederaceum': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Fast', description: 'Easy trailing philodendron. Tolerates lower light. Heart-shaped leaves.' },
  'heartleaf philodendron': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Fast' },
  'calathea ornata': { light: 'partial_sun', humidity: 'high', wateringDays: 5, fertilizingDays: 30, growthRate: 'Moderate', description: 'Loves humidity and indirect light. Sensitive to tap water — use filtered or distilled.' },
  'calathea': { light: 'partial_sun', humidity: 'high', wateringDays: 5, fertilizingDays: 30, growthRate: 'Moderate' },
  'pilea peperomioides': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Moderate', description: 'Chinese money plant. Produces offsets (pups) easily. Rotate for even growth.' },
  'chinese money plant': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Moderate' },
  'dracaena marginata': { light: 'bright_indirect', humidity: 'low', wateringDays: 10, fertilizingDays: 30, toxicToPets: true, growthRate: 'Slow', description: 'Tolerant of low light and dry conditions. Sensitive to fluoride in tap water.' },
  'dragon tree': { light: 'bright_indirect', humidity: 'low', wateringDays: 10, fertilizingDays: 30, toxicToPets: true, growthRate: 'Slow' },
  'tradescantia zebrina': { light: 'bright_indirect', humidity: 'medium', wateringDays: 5, fertilizingDays: 14, growthRate: 'Fast', description: 'Fast-growing trailing plant with striking purple and silver striped leaves.' },
  'wandering dude': { light: 'bright_indirect', humidity: 'medium', wateringDays: 5, fertilizingDays: 14, growthRate: 'Fast' },
  'hoya carnosa': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, growthRate: 'Slow', description: 'Waxy trailing plant. Let dry between waterings. Produces fragrant flower clusters when mature.' },
  'wax plant': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, growthRate: 'Slow' },
  'alocasia amazonica': { light: 'bright_indirect', humidity: 'high', wateringDays: 5, fertilizingDays: 14, toxicToPets: true, growthRate: 'Moderate', description: 'Dramatic arrowhead leaves. Needs high humidity and consistent moisture.' },
  'african mask plant': { light: 'bright_indirect', humidity: 'high', wateringDays: 5, fertilizingDays: 14, toxicToPets: true, growthRate: 'Moderate' },
  'crassula ovata': { light: 'full_sun', humidity: 'low', wateringDays: 14, fertilizingDays: 60, growthRate: 'Slow', description: 'Succulent that thrives in bright light. Water sparingly. Easy to propagate from leaves.' },
  'jade plant': { light: 'full_sun', humidity: 'low', wateringDays: 14, fertilizingDays: 60, growthRate: 'Slow' },
  'maranta leuconeura': { light: 'partial_sun', humidity: 'high', wateringDays: 5, fertilizingDays: 30, growthRate: 'Moderate', description: 'Prayer plant — leaves fold up at night. Needs humidity and filtered water.' },
  'prayer plant': { light: 'partial_sun', humidity: 'high', wateringDays: 5, fertilizingDays: 30, growthRate: 'Moderate' },
  'peperomia obtusifolia': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, growthRate: 'Slow', description: 'Compact, low-maintenance plant with thick waxy leaves. Tolerates lower light.' },
  'baby rubber plant': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, growthRate: 'Slow' },
  'strelitzia nicolai': { light: 'full_sun', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Moderate', description: 'Large dramatic leaves. Needs bright light to thrive indoors.' },
  'bird of paradise': { light: 'full_sun', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Moderate' },
  'asplenium nidus': { light: 'partial_sun', humidity: 'high', wateringDays: 5, fertilizingDays: 30, growthRate: 'Slow', description: 'Tropical fern that loves humidity and indirect light. Avoid getting water in the central rosette.' },
  "bird's nest fern": { light: 'partial_sun', humidity: 'high', wateringDays: 5, fertilizingDays: 30, growthRate: 'Slow' },
  'nephrolepis exaltata': { light: 'bright_indirect', humidity: 'high', wateringDays: 3, fertilizingDays: 30, growthRate: 'Moderate', description: 'Classic fern. Needs consistently moist soil and high humidity.' },
  'boston fern': { light: 'bright_indirect', humidity: 'high', wateringDays: 3, fertilizingDays: 30, growthRate: 'Moderate' },
  'dieffenbachia seguine': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, toxicToHumans: true, growthRate: 'Moderate', description: 'Easy-care with large variegated leaves. Sap is irritating — handle with care.' },
  'dumb cane': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, toxicToHumans: true, growthRate: 'Moderate' },
  'schefflera arboricola': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate', description: 'Umbrella-shaped leaf clusters. Tolerates various light conditions.' },
  'umbrella plant': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate' },
  'aglaonema commutatum': { light: 'low_light', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, toxicToPets: true, growthRate: 'Slow', description: 'Excellent low-light plant. Many colorful varieties. Very forgiving.' },
  'chinese evergreen': { light: 'low_light', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, toxicToPets: true, growthRate: 'Slow' },
  'croton': { light: 'full_sun', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate', description: 'Colorful foliage needs bright light to maintain vibrant colors. Dislikes being moved.' },
  'codiaeum variegatum': { light: 'full_sun', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate' },
  'syngonium podophyllum': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Fast', description: 'Arrowhead vine. Can climb or trail. Leaves change shape as plant matures.' },
  'arrowhead plant': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Fast' },
};

export function lookupCareProfile(name: string): PlantCareProfile | null {
  const key = name.trim().toLowerCase();
  return data[key] ?? null;
}
