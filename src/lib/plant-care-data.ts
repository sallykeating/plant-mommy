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
  'elephant ear philodendron': { light: 'bright_indirect', humidity: 'high', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Fast', description: 'Large dramatic leaves. Needs warmth, humidity, and consistent moisture.' },

  // Swiss cheese plant alias
  'swiss cheese plant': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, toxicToHumans: true, growthRate: 'Moderate' },

  // Areca Palm
  'chrysalidocarpus lutescens': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Moderate', description: 'Graceful feathery fronds. Excellent air humidifier. Prefers bright filtered light.' },
  'dypsis lutescens': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Moderate' },
  'areca palm': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Moderate' },

  // String of Pearls
  'senecio rowleyanus': { light: 'bright_indirect', humidity: 'low', wateringDays: 14, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate', description: 'Trailing succulent with bead-like leaves. Needs well-draining soil and careful watering.' },
  'curio rowleyanus': { light: 'bright_indirect', humidity: 'low', wateringDays: 14, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate' },
  'string of pearls': { light: 'bright_indirect', humidity: 'low', wateringDays: 14, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate' },

  // Money Tree
  'pachira aquatica': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, growthRate: 'Moderate', description: 'Often sold with braided trunk. Tolerates lower light. Let top inch of soil dry between waterings.' },
  'money tree': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, growthRate: 'Moderate' },

  // Parlor Palm
  'chamaedorea elegans': { light: 'partial_sun', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Slow', description: 'Compact palm perfect for low-light spaces. Keep soil evenly moist but not soggy.' },
  'parlor palm': { light: 'partial_sun', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Slow' },

  // Cast Iron Plant
  'aspidistra elatior': { light: 'low_light', humidity: 'low', wateringDays: 14, fertilizingDays: 60, growthRate: 'Slow', description: 'Nearly indestructible. Thrives in deep shade and neglect. Avoid direct sunlight.' },
  'cast iron plant': { light: 'low_light', humidity: 'low', wateringDays: 14, fertilizingDays: 60, growthRate: 'Slow' },

  // Maidenhair Fern
  'adiantum raddianum': { light: 'partial_sun', humidity: 'high', wateringDays: 3, fertilizingDays: 30, growthRate: 'Moderate', description: 'Delicate fronds need constant humidity and moisture. Never let soil dry out completely.' },
  'maidenhair fern': { light: 'partial_sun', humidity: 'high', wateringDays: 3, fertilizingDays: 30, growthRate: 'Moderate' },

  // Anthurium
  'anthurium andraeanum': { light: 'bright_indirect', humidity: 'high', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate', description: 'Waxy, heart-shaped flower spathes. Needs high humidity and well-draining soil.' },
  'anthurium': { light: 'bright_indirect', humidity: 'high', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate' },
  'flamingo flower': { light: 'bright_indirect', humidity: 'high', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate' },

  // Hoya varieties
  'hoya': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, growthRate: 'Slow' },

  // Lucky Bamboo
  'dracaena sanderiana': { light: 'partial_sun', humidity: 'medium', wateringDays: 7, fertilizingDays: 60, toxicToPets: true, growthRate: 'Slow', description: 'Can grow in water or soil. Avoid direct sunlight. Change water every 1–2 weeks if water-grown.' },
  'lucky bamboo': { light: 'partial_sun', humidity: 'medium', wateringDays: 7, fertilizingDays: 60, toxicToPets: true, growthRate: 'Slow' },

  // Kentia Palm
  'howea forsteriana': { light: 'partial_sun', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, growthRate: 'Slow', description: 'Elegant slow-growing palm. Tolerates low light and some neglect. Keep out of direct sun.' },
  'kentia palm': { light: 'partial_sun', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, growthRate: 'Slow' },

  // String of Hearts
  'ceropegia woodii': { light: 'bright_indirect', humidity: 'low', wateringDays: 14, fertilizingDays: 30, growthRate: 'Moderate', description: 'Trailing succulent vine with heart-shaped leaves. Let dry thoroughly between waterings.' },
  'string of hearts': { light: 'bright_indirect', humidity: 'low', wateringDays: 14, fertilizingDays: 30, growthRate: 'Moderate' },

  // Alocasia varieties
  'alocasia': { light: 'bright_indirect', humidity: 'high', wateringDays: 5, fertilizingDays: 14, toxicToPets: true, growthRate: 'Moderate' },
  'alocasia zebrina': { light: 'bright_indirect', humidity: 'high', wateringDays: 5, fertilizingDays: 14, toxicToPets: true, growthRate: 'Moderate', description: 'Striking zebra-patterned stems. Needs warmth, humidity, and well-draining soil.' },

  // Yucca
  'yucca elephantipes': { light: 'full_sun', humidity: 'low', wateringDays: 14, fertilizingDays: 60, growthRate: 'Slow', description: 'Drought-tolerant. Needs bright light. Water sparingly — overwatering causes root rot.' },
  'yucca': { light: 'full_sun', humidity: 'low', wateringDays: 14, fertilizingDays: 60, growthRate: 'Slow' },

  // Majesty Palm
  'ravenea rivularis': { light: 'bright_indirect', humidity: 'high', wateringDays: 5, fertilizingDays: 30, growthRate: 'Moderate', description: 'Tropical palm that needs consistent moisture and humidity. Challenging indoors — mist often.' },
  'majesty palm': { light: 'bright_indirect', humidity: 'high', wateringDays: 5, fertilizingDays: 30, growthRate: 'Moderate' },

  // Orchid
  'phalaenopsis': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Slow', description: 'Most popular orchid. Water when roots turn silvery. Bright indirect light triggers reblooming.' },
  'orchid': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Slow' },
  'moth orchid': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Slow' },

  // Tillandsia (Air Plants)
  'tillandsia': { light: 'bright_indirect', humidity: 'medium', wateringDays: 4, fertilizingDays: 30, growthRate: 'Slow', description: 'Epiphyte — no soil needed. Soak in water 20–30 min weekly. Needs good air circulation.' },
  'air plant': { light: 'bright_indirect', humidity: 'medium', wateringDays: 4, fertilizingDays: 30, growthRate: 'Slow' },

  // Oxalis
  'oxalis triangularis': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Moderate', description: 'Purple shamrock. Leaves open and close with light. Goes dormant periodically — reduce watering then.' },
  'oxalis': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Moderate' },

  // Papyrus
  'cyperus papyrus': { light: 'full_sun', humidity: 'high', wateringDays: 2, fertilizingDays: 30, growthRate: 'Fast', description: 'Semi-aquatic. Keep soil constantly wet or stand pot in water. Loves bright light and humidity.' },
  'papyrus plant': { light: 'full_sun', humidity: 'high', wateringDays: 2, fertilizingDays: 30, growthRate: 'Fast' },

  // Christmas Cactus
  'schlumbergera': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, growthRate: 'Moderate', description: 'Blooms in winter with shorter days. Needs cool temps and long nights to trigger flowering.' },
  'christmas cactus': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, growthRate: 'Moderate' },

  // Bunny Ears Cactus
  'opuntia microdasys': { light: 'full_sun', humidity: 'low', wateringDays: 21, fertilizingDays: 60, growthRate: 'Slow', description: 'Desert cactus with pad-shaped segments. Needs full sun and very infrequent watering.' },
  'bunny ears cactus': { light: 'full_sun', humidity: 'low', wateringDays: 21, fertilizingDays: 60, growthRate: 'Slow' },

  // Donkey Tail
  'sedum morganianum': { light: 'full_sun', humidity: 'low', wateringDays: 14, fertilizingDays: 60, growthRate: 'Slow', description: 'Trailing succulent with plump bead-like leaves. Handle gently — leaves detach easily.' },
  'donkey tail plant': { light: 'full_sun', humidity: 'low', wateringDays: 14, fertilizingDays: 60, growthRate: 'Slow' },
  "burro's tail": { light: 'full_sun', humidity: 'low', wateringDays: 14, fertilizingDays: 60, growthRate: 'Slow' },

  // Asparagus Fern
  'asparagus setaceus': { light: 'bright_indirect', humidity: 'medium', wateringDays: 5, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate', description: 'Not a true fern. Feathery foliage. Keep soil moist. Small thorns on mature stems.' },
  'asparagus fern': { light: 'bright_indirect', humidity: 'medium', wateringDays: 5, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate' },

  // Pineapple Plant
  'ananas comosus': { light: 'full_sun', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Slow', description: 'Needs full sun to fruit. Water into the central cup. Can take 2–3 years to produce a pineapple indoors.' },
  'pineapple plant': { light: 'full_sun', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, growthRate: 'Slow' },

  // Hawaiian Umbrella Tree / Schefflera
  'hawaiian umbrella tree': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate' },

  // Portulacaria afra (Elephant Bush)
  'portulacaria afra': { light: 'full_sun', humidity: 'low', wateringDays: 14, fertilizingDays: 60, growthRate: 'Moderate', description: 'Succulent shrub. Thrives in bright light with minimal water. Great for bonsai.' },
  'elephant bush': { light: 'full_sun', humidity: 'low', wateringDays: 14, fertilizingDays: 60, growthRate: 'Moderate' },

  // Calathea Orbifolia
  'calathea orbifolia': { light: 'partial_sun', humidity: 'high', wateringDays: 5, fertilizingDays: 30, growthRate: 'Moderate', description: 'Large round leaves with silvery stripes. Very sensitive to dry air and hard water.' },
  'goeppertia orbifolia': { light: 'partial_sun', humidity: 'high', wateringDays: 5, fertilizingDays: 30, growthRate: 'Moderate' },

  // Calathea Rattlesnake
  'calathea lancifolia': { light: 'partial_sun', humidity: 'high', wateringDays: 5, fertilizingDays: 30, growthRate: 'Moderate', description: 'Long wavy leaves with dark spots. Needs humidity and filtered water like all calatheas.' },
  'rattlesnake plant': { light: 'partial_sun', humidity: 'high', wateringDays: 5, fertilizingDays: 30, growthRate: 'Moderate' },

  // Basil
  'ocimum basilicum': { light: 'full_sun', humidity: 'medium', wateringDays: 3, fertilizingDays: 14, growthRate: 'Fast', description: 'Needs 6+ hours of direct light. Pinch flowers to promote leaf growth. Keep soil consistently moist.' },
  'basil': { light: 'full_sun', humidity: 'medium', wateringDays: 3, fertilizingDays: 14, growthRate: 'Fast' },

  // Baby Necklace / Dischidia
  'dischidia nummularia': { light: 'bright_indirect', humidity: 'high', wateringDays: 7, fertilizingDays: 30, growthRate: 'Moderate', description: 'Epiphytic trailing plant. Needs high humidity and airy growing medium. Mist regularly.' },
  'dischidia': { light: 'bright_indirect', humidity: 'high', wateringDays: 7, fertilizingDays: 30, growthRate: 'Moderate' },
  'baby necklace': { light: 'bright_indirect', humidity: 'high', wateringDays: 7, fertilizingDays: 30, growthRate: 'Moderate' },

  // Peperomia Watermelon
  'peperomia argyreia': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, growthRate: 'Slow', description: 'Stunning watermelon-patterned leaves. Compact grower. Let soil dry between waterings.' },
  'watermelon peperomia': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, growthRate: 'Slow' },
  'peperomia': { light: 'bright_indirect', humidity: 'medium', wateringDays: 10, fertilizingDays: 30, growthRate: 'Slow' },

  // Philodendron generic
  'philodendron': { light: 'bright_indirect', humidity: 'medium', wateringDays: 7, fertilizingDays: 30, toxicToPets: true, growthRate: 'Moderate' },

  // Dracaena generic
  'dracaena': { light: 'bright_indirect', humidity: 'low', wateringDays: 10, fertilizingDays: 30, toxicToPets: true, growthRate: 'Slow' },
};

export function lookupCareProfile(name: string): PlantCareProfile | null {
  const key = name.trim().toLowerCase();
  return data[key] ?? null;
}

export interface LocalPlantResult {
  name: string;
  profile: PlantCareProfile;
}

export function searchLocalPlants(query: string): LocalPlantResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const seen = new Set<string>();
  const results: LocalPlantResult[] = [];

  for (const [key, profile] of Object.entries(data)) {
    if (!key.includes(q)) continue;
    const dedupKey = `${profile.light}-${profile.wateringDays}-${profile.humidity}-${profile.growthRate}`;
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);
    const displayName = key.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    results.push({ name: displayName, profile });
  }

  return results.slice(0, 6);
}
