import { supabase } from './supabase';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const PLANTS = [
  {
    name: 'Monty',
    species: 'Monstera deliciosa',
    cultivar: null,
    location: 'Living room, east window',
    pot_size: '12 inch',
    pot_type: 'Ceramic',
    sunlight_preference: 'bright_indirect',
    current_light_exposure: 'bright_indirect',
    watering_frequency_days: 7,
    fertilizing_frequency_days: 30,
    humidity_preference: 'high',
    health_status: 'thriving',
    acquisition_date: daysAgo(400),
    last_repotted: daysAgo(90),
    notes: 'Has a moss pole. Unfurls a new leaf roughly every 3 weeks in spring/summer.',
  },
  {
    name: 'Sunny',
    species: 'Ficus lyrata',
    cultivar: 'Fiddle Leaf Fig',
    location: 'Living room, south window',
    pot_size: '14 inch',
    pot_type: 'Terracotta',
    sunlight_preference: 'bright_indirect',
    current_light_exposure: 'partial_sun',
    watering_frequency_days: 10,
    fertilizing_frequency_days: 45,
    humidity_preference: 'medium',
    health_status: 'healthy',
    acquisition_date: daysAgo(380),
    last_repotted: daysAgo(200),
    notes: 'Sensitive to drafts. Rotate weekly for even growth.',
  },
  {
    name: 'Jade',
    species: 'Crassula ovata',
    cultivar: null,
    location: 'Kitchen windowsill',
    pot_size: '6 inch',
    pot_type: 'Terracotta',
    sunlight_preference: 'full_sun',
    current_light_exposure: 'partial_sun',
    watering_frequency_days: 14,
    fertilizing_frequency_days: 60,
    humidity_preference: 'low',
    health_status: 'thriving',
    acquisition_date: daysAgo(500),
    last_repotted: daysAgo(300),
    notes: 'Propagated from my grandmother\'s plant. Sentimental favorite.',
  },
  {
    name: 'Fern Gully',
    species: 'Nephrolepis exaltata',
    cultivar: 'Boston Fern',
    location: 'Bathroom shelf',
    pot_size: '8 inch',
    pot_type: 'Hanging basket',
    sunlight_preference: 'medium_indirect',
    current_light_exposure: 'low_light',
    watering_frequency_days: 3,
    fertilizing_frequency_days: 30,
    humidity_preference: 'very_high',
    health_status: 'fair',
    acquisition_date: daysAgo(350),
    last_repotted: daysAgo(180),
    notes: 'Loves the bathroom humidity. Mist daily in winter.',
  },
  {
    name: 'Spike',
    species: 'Sansevieria trifasciata',
    cultivar: 'Laurentii',
    location: 'Bedroom, north wall',
    pot_size: '8 inch',
    pot_type: 'Ceramic',
    sunlight_preference: 'low_light',
    current_light_exposure: 'low_light',
    watering_frequency_days: 21,
    fertilizing_frequency_days: 90,
    humidity_preference: 'low',
    health_status: 'thriving',
    acquisition_date: daysAgo(420),
    last_repotted: daysAgo(365),
    notes: 'Practically indestructible. Perfect bedroom plant for air quality.',
  },
  {
    name: 'Pearl',
    species: 'Senecio rowleyanus',
    cultivar: 'String of Pearls',
    location: 'Office, hanging by window',
    pot_size: '5 inch',
    pot_type: 'Hanging ceramic',
    sunlight_preference: 'bright_indirect',
    current_light_exposure: 'bright_indirect',
    watering_frequency_days: 10,
    fertilizing_frequency_days: 45,
    humidity_preference: 'low',
    health_status: 'struggling',
    acquisition_date: daysAgo(280),
    last_repotted: daysAgo(280),
    notes: 'Overwatered in winter. Trying to recover with less frequent watering.',
  },
  {
    name: 'Hoya Darling',
    species: 'Hoya carnosa',
    cultivar: 'Krimson Queen',
    location: 'Bedroom, east window',
    pot_size: '6 inch',
    pot_type: 'Plastic nursery pot in decorative cover',
    sunlight_preference: 'bright_indirect',
    current_light_exposure: 'bright_indirect',
    watering_frequency_days: 10,
    fertilizing_frequency_days: 30,
    humidity_preference: 'medium',
    health_status: 'healthy',
    acquisition_date: daysAgo(320),
    last_repotted: daysAgo(150),
    notes: 'Training on a small trellis. Starting to get peduncles!',
  },
  {
    name: 'Aloe Vera',
    species: 'Aloe barbadensis miller',
    cultivar: null,
    location: 'Kitchen counter',
    pot_size: '6 inch',
    pot_type: 'Terracotta',
    sunlight_preference: 'partial_sun',
    current_light_exposure: 'partial_sun',
    watering_frequency_days: 14,
    fertilizing_frequency_days: 90,
    humidity_preference: 'low',
    health_status: 'healthy',
    acquisition_date: daysAgo(450),
    last_repotted: daysAgo(250),
    notes: 'Has produced 3 pups. Used gel for minor burns.',
  },
  {
    name: 'Callie',
    species: 'Calathea orbifolia',
    cultivar: null,
    location: 'Living room, away from window',
    pot_size: '8 inch',
    pot_type: 'Ceramic with drainage',
    sunlight_preference: 'medium_indirect',
    current_light_exposure: 'medium_indirect',
    watering_frequency_days: 5,
    fertilizing_frequency_days: 30,
    humidity_preference: 'high',
    health_status: 'fair',
    acquisition_date: daysAgo(260),
    last_repotted: daysAgo(260),
    notes: 'Dramatic queen. Leaves curl when thirsty. Uses filtered water only.',
  },
  {
    name: 'Phil',
    species: 'Philodendron hederaceum',
    cultivar: 'Brasil',
    location: 'Office desk, trailing off shelf',
    pot_size: '6 inch',
    pot_type: 'Plastic',
    sunlight_preference: 'medium_indirect',
    current_light_exposure: 'bright_indirect',
    watering_frequency_days: 7,
    fertilizing_frequency_days: 30,
    humidity_preference: 'medium',
    health_status: 'thriving',
    acquisition_date: daysAgo(340),
    last_repotted: daysAgo(120),
    notes: 'Fast grower. Took several cuttings to propagate. Trails about 4 feet.',
  },
];

const CARE_TYPES = ['watering', 'fertilizing', 'misting', 'pruning', 'rotating', 'cleaning'] as const;

const HEALTH_ISSUES_TEMPLATES = [
  { issue_type: 'pest', severity: 'medium', description: 'Found small white flies around soil surface when watering.', treatment: 'Applied neem oil spray, let soil dry out. Set yellow sticky traps.', resolved: true, duration: 21 },
  { issue_type: 'yellowing', severity: 'low', description: 'Two lower leaves turning yellow. Likely natural aging.', treatment: 'Removed affected leaves. Monitored for spread.', resolved: true, duration: 7 },
  { issue_type: 'overwatering', severity: 'high', description: 'Soil staying wet for over a week. Leaves becoming soft and mushy.', treatment: 'Removed from pot, trimmed rotting roots, repotted in fresh well-draining soil.', resolved: true, duration: 30 },
  { issue_type: 'sunburn', severity: 'low', description: 'Brown crispy patches on leaves facing the window after moving to sunnier spot.', treatment: 'Moved back from window. Affected leaves trimmed.', resolved: true, duration: 14 },
  { issue_type: 'drooping', severity: 'medium', description: 'All leaves drooping despite moist soil. Possible root issues.', treatment: 'Checked roots — looked healthy. Increased humidity with pebble tray.', resolved: true, duration: 10 },
  { issue_type: 'leaf_drop', severity: 'high', description: 'Dropping 2-3 leaves per week after moving to a new room.', treatment: 'Moved back to original location. Stabilized watering schedule.', resolved: true, duration: 28 },
  { issue_type: 'spots', severity: 'low', description: 'Small brown spots appearing on a few leaves.', treatment: 'Possibly mineral deposits from tap water. Switched to filtered water.', resolved: true, duration: 14 },
  { issue_type: 'nutrient_deficiency', severity: 'medium', description: 'New leaves coming in pale and smaller than usual.', treatment: 'Started regular fertilizing schedule with balanced liquid fertilizer.', resolved: true, duration: 45 },
  { issue_type: 'pest', severity: 'high', description: 'Spider mites found on undersides of leaves. Fine webbing visible.', treatment: 'Isolated plant. Wiped leaves with rubbing alcohol. Sprayed with insecticidal soap weekly for 3 weeks.', resolved: false, duration: 0 },
  { issue_type: 'root_rot', severity: 'critical', description: 'Foul smell from soil. Plant wobbles in pot. Leaves yellowing rapidly.', treatment: 'Emergency repot. Removed all affected roots. Applied fungicide. Reduced watering.', resolved: false, duration: 0 },
];

const ENV_TEMPLATES = [
  { room: 'Living room', light_direction: 'East-facing window', season: 'spring' },
  { room: 'Living room', light_direction: 'East-facing window', season: 'summer' },
  { room: 'Bedroom', light_direction: 'North wall', season: 'fall' },
  { room: 'Bathroom', light_direction: 'Frosted window', season: 'winter' },
  { room: 'Kitchen', light_direction: 'South-facing window', season: 'spring' },
  { room: 'Office', light_direction: 'West-facing window', season: 'summer' },
];

export async function seedDemoData(userId: string): Promise<{ error: string | null; counts: Record<string, number> }> {
  const counts: Record<string, number> = {
    plants: 0,
    reminders: 0,
    care_events: 0,
    growth_measurements: 0,
    health_issues: 0,
    environment_notes: 0,
  };

  try {
    const plantRecords = PLANTS.map(p => ({ ...p, user_id: userId }));
    const { data: plants, error: plantsErr } = await supabase
      .from('plants')
      .insert(plantRecords)
      .select('id, name, watering_frequency_days, fertilizing_frequency_days');

    if (plantsErr || !plants) return { error: plantsErr?.message ?? 'Failed to insert plants', counts };
    counts.plants = plants.length;

    const reminders: Record<string, unknown>[] = [];
    for (const plant of plants) {
      if (plant.watering_frequency_days) {
        reminders.push({
          plant_id: plant.id,
          care_type: 'watering',
          frequency_days: plant.watering_frequency_days,
          next_due: daysAgo(-randomBetween(0, plant.watering_frequency_days)),
          last_completed: daysAgo(randomBetween(1, plant.watering_frequency_days)),
          is_active: true,
        });
      }
      if (plant.fertilizing_frequency_days) {
        reminders.push({
          plant_id: plant.id,
          care_type: 'fertilizing',
          frequency_days: plant.fertilizing_frequency_days,
          next_due: daysAgo(-randomBetween(0, plant.fertilizing_frequency_days)),
          last_completed: daysAgo(randomBetween(1, 30)),
          is_active: true,
        });
      }
      reminders.push({
        plant_id: plant.id,
        care_type: pickRandom(['misting', 'rotating', 'cleaning']),
        frequency_days: randomBetween(7, 30),
        next_due: daysAgo(-randomBetween(0, 14)),
        is_active: true,
      });
    }

    const { error: remErr } = await supabase.from('care_reminders').insert(reminders);
    if (remErr) return { error: remErr.message, counts };
    counts.reminders = reminders.length;

    const careEvents: Record<string, unknown>[] = [];
    for (const plant of plants) {
      const freq = plant.watering_frequency_days ?? 7;
      for (let dayOffset = 365; dayOffset > 0; dayOffset -= freq + randomBetween(-1, 2)) {
        careEvents.push({
          plant_id: plant.id,
          care_type: 'watering',
          performed_at: new Date(new Date().getTime() - dayOffset * 86400000).toISOString(),
          amount: pickRandom(['1 cup', '2 cups', '500ml', 'thorough soak', 'light watering', null]),
          notes: dayOffset % 30 < freq ? pickRandom([
            'Soil was very dry',
            'Checked moisture — still damp, watered lightly',
            'Bottom watered for 30 minutes',
            null, null,
          ]) : null,
        });
      }

      const fertFreq = plant.fertilizing_frequency_days ?? 45;
      for (let dayOffset = 350; dayOffset > 0; dayOffset -= fertFreq + randomBetween(-5, 10)) {
        careEvents.push({
          plant_id: plant.id,
          care_type: 'fertilizing',
          performed_at: new Date(new Date().getTime() - dayOffset * 86400000).toISOString(),
          amount: pickRandom(['half strength', 'full strength', '1/4 tsp per gallon']),
          notes: pickRandom([
            'Used balanced 10-10-10',
            'Worm castings top dressing',
            'Fish emulsion — smelly but effective',
            'Slow release granules',
            null, null,
          ]),
        });
      }

      for (let dayOffset = 360; dayOffset > 0; dayOffset -= randomBetween(25, 50)) {
        careEvents.push({
          plant_id: plant.id,
          care_type: pickRandom(['pruning', 'rotating', 'cleaning', 'misting']),
          performed_at: new Date(new Date().getTime() - dayOffset * 86400000).toISOString(),
          notes: pickRandom([
            'Wiped leaves with damp cloth',
            'Rotated 90 degrees',
            'Trimmed dead lower leaves',
            'Misted heavily — dry winter air',
            'Cleaned dust off leaves',
            'Pruned leggy growth',
            null,
          ]),
        });
      }
    }

    const BATCH_SIZE = 500;
    for (let i = 0; i < careEvents.length; i += BATCH_SIZE) {
      const batch = careEvents.slice(i, i + BATCH_SIZE);
      const { error: evErr } = await supabase.from('care_events').insert(batch);
      if (evErr) return { error: `Care events batch ${i}: ${evErr.message}`, counts };
    }
    counts.care_events = careEvents.length;

    const measurements: Record<string, unknown>[] = [];
    for (const plant of plants) {
      let height = randomBetween(15, 40);
      let width = randomBetween(10, 30);
      let leafCount = randomBetween(5, 15);

      for (let monthsAgo = 12; monthsAgo >= 0; monthsAgo--) {
        const growthRate = monthsAgo >= 4 && monthsAgo <= 9 ? 1.5 : 0.7;
        height += randomBetween(1, 4) * growthRate;
        width += randomBetween(0, 3) * growthRate;
        leafCount += randomBetween(0, 3);
        const newGrowth = randomBetween(0, 4);
        const isFlowering = monthsAgo >= 3 && monthsAgo <= 6 && Math.random() > 0.7;

        measurements.push({
          plant_id: plant.id,
          measured_at: daysAgo(monthsAgo * 30 + randomBetween(-3, 3)),
          height_cm: Math.round(height * 10) / 10,
          width_cm: Math.round(width * 10) / 10,
          leaf_count: leafCount,
          is_flowering: isFlowering,
          new_growth_count: newGrowth > 0 ? newGrowth : null,
          notes: pickRandom([
            'Growing well',
            'New leaf unfurling',
            'Growth slowed — winter dormancy',
            'Impressive growth spurt this month',
            'Looks bushier after pruning',
            null, null, null,
          ]),
        });
      }
    }

    const { error: measErr } = await supabase.from('growth_measurements').insert(measurements);
    if (measErr) return { error: measErr.message, counts };
    counts.growth_measurements = measurements.length;

    const healthIssues: Record<string, unknown>[] = [];
    const shuffledPlants = [...plants].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(HEALTH_ISSUES_TEMPLATES.length, shuffledPlants.length); i++) {
      const template = HEALTH_ISSUES_TEMPLATES[i];
      const plant = shuffledPlants[i];
      const startedDaysAgo = template.resolved ? randomBetween(30, 300) : randomBetween(3, 20);

      healthIssues.push({
        plant_id: plant.id,
        issue_type: template.issue_type,
        severity: template.severity,
        description: template.description,
        treatment: template.treatment,
        resolved: template.resolved,
        started_at: daysAgo(startedDaysAgo),
        resolved_at: template.resolved ? daysAgo(startedDaysAgo - template.duration) : null,
        notes: template.resolved
          ? pickRandom(['Seems fully recovered now', 'Will monitor for recurrence', 'Much better after treatment', null])
          : pickRandom(['Monitoring closely', 'Treatment in progress', null]),
      });
    }

    const { error: healthErr } = await supabase.from('health_issues').insert(healthIssues);
    if (healthErr) return { error: healthErr.message, counts };
    counts.health_issues = healthIssues.length;

    const envNotes: Record<string, unknown>[] = [];
    for (const plant of plants.slice(0, 6)) {
      for (const template of ENV_TEMPLATES.slice(0, randomBetween(2, 4))) {
        const seasonMonthMap: Record<string, number> = { spring: 3, summer: 6, fall: 9, winter: 0 };
        const monthOffset = seasonMonthMap[template.season] ?? 0;
        const dAgo = Math.max(1, (12 - monthOffset) * 30 + randomBetween(-15, 15));

        envNotes.push({
          plant_id: plant.id,
          room: template.room,
          light_direction: template.light_direction,
          temperature_f: randomBetween(65, 78),
          humidity_percent: randomBetween(30, 65),
          season: template.season,
          notes: pickRandom([
            'Heater running — air is very dry',
            'Opened windows for cross breeze',
            'Added humidifier to this room',
            'Grow lights on 12hr timer',
            'AC keeps room around 72°F',
            null,
          ]),
          recorded_at: daysAgo(dAgo),
        });
      }
    }

    const { error: envErr } = await supabase.from('environment_notes').insert(envNotes);
    if (envErr) return { error: envErr.message, counts };
    counts.environment_notes = envNotes.length;

    return { error: null, counts };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error', counts };
  }
}

export async function clearDemoData(userId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('plants').delete().eq('user_id', userId);
  return { error: error?.message ?? null };
}
