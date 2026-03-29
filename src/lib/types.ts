export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Plant {
  id: string;
  user_id: string;
  name: string;
  species: string | null;
  cultivar: string | null;
  photo_url: string | null;
  acquisition_date: string | null;
  location: string | null;
  pot_size: string | null;
  pot_type: string | null;
  last_repotted: string | null;
  sunlight_preference: SunlightLevel | null;
  current_light_exposure: SunlightLevel | null;
  watering_frequency_days: number | null;
  fertilizing_frequency_days: number | null;
  humidity_preference: HumidityLevel | null;
  health_status: HealthStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CareReminder {
  id: string;
  plant_id: string;
  care_type: CareType;
  frequency_days: number;
  next_due: string;
  last_completed: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
}

export interface CareEvent {
  id: string;
  plant_id: string;
  care_type: CareType;
  performed_at: string;
  amount: string | null;
  notes: string | null;
  created_at: string;
}

export interface GrowthMeasurement {
  id: string;
  plant_id: string;
  measured_at: string;
  height_cm: number | null;
  width_cm: number | null;
  leaf_count: number | null;
  is_flowering: boolean;
  new_growth_count: number | null;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface PlantPhoto {
  id: string;
  plant_id: string;
  url: string;
  caption: string | null;
  taken_at: string;
  created_at: string;
}

export interface HealthIssue {
  id: string;
  plant_id: string;
  issue_type: IssueType;
  severity: Severity;
  description: string;
  treatment: string | null;
  resolved: boolean;
  started_at: string;
  resolved_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface EnvironmentNote {
  id: string;
  plant_id: string;
  room: string | null;
  light_direction: string | null;
  temperature_f: number | null;
  humidity_percent: number | null;
  season: string | null;
  notes: string | null;
  recorded_at: string;
  created_at: string;
}

export type CareType =
  | 'watering'
  | 'fertilizing'
  | 'misting'
  | 'repotting'
  | 'pruning'
  | 'rotating'
  | 'cleaning'
  | 'other';

export type SunlightLevel =
  | 'full_sun'
  | 'partial_sun'
  | 'bright_indirect'
  | 'medium_indirect'
  | 'low_light'
  | 'shade';

export type HumidityLevel = 'low' | 'medium' | 'high' | 'very_high';

export type HealthStatus = 'thriving' | 'healthy' | 'fair' | 'struggling' | 'critical';

export type IssueType =
  | 'pest'
  | 'disease'
  | 'overwatering'
  | 'underwatering'
  | 'sunburn'
  | 'nutrient_deficiency'
  | 'root_rot'
  | 'drooping'
  | 'yellowing'
  | 'leaf_drop'
  | 'spots'
  | 'other';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export const CARE_TYPE_LABELS: Record<CareType, string> = {
  watering: 'Watering',
  fertilizing: 'Fertilizing',
  misting: 'Misting',
  repotting: 'Repotting',
  pruning: 'Pruning',
  rotating: 'Rotating',
  cleaning: 'Cleaning',
  other: 'Other',
};

export const SUNLIGHT_LABELS: Record<SunlightLevel, string> = {
  full_sun: 'Full Sun',
  partial_sun: 'Partial Sun',
  bright_indirect: 'Bright Indirect',
  medium_indirect: 'Medium Indirect',
  low_light: 'Low Light',
  shade: 'Shade',
};

export const HUMIDITY_LABELS: Record<HumidityLevel, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  very_high: 'Very High',
};

export const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  thriving: 'Thriving',
  healthy: 'Healthy',
  fair: 'Fair',
  struggling: 'Struggling',
  critical: 'Critical',
};

export const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
  pest: 'Pest',
  disease: 'Disease',
  overwatering: 'Overwatering',
  underwatering: 'Underwatering',
  sunburn: 'Sunburn',
  nutrient_deficiency: 'Nutrient Deficiency',
  root_rot: 'Root Rot',
  drooping: 'Drooping',
  yellowing: 'Yellowing',
  leaf_drop: 'Leaf Drop',
  spots: 'Spots',
  other: 'Other',
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};
