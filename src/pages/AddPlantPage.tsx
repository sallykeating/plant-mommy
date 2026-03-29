import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePlants } from '@/hooks/usePlants';
import { PhotoUpload } from '@/components/shared/PhotoUpload';
import { SpeciesSearchInput } from '@/components/shared/SpeciesSearchInput';
import { supabase } from '@/lib/supabase';
import { addDays, todayISO } from '@/lib/helpers';
import {
  HUMIDITY_LABELS,
  SUNLIGHT_LABELS,
  type HumidityLevel,
  type SunlightLevel,
} from '@/lib/types';
import { getSpeciesDetails, type TrefleSpeciesListItem } from '@/lib/trefle';
import { lookupCareProfile } from '@/lib/plant-care-data';

const SUNLIGHT_OPTIONS = Object.entries(SUNLIGHT_LABELS) as [SunlightLevel, string][];
const HUMIDITY_OPTIONS = Object.entries(HUMIDITY_LABELS) as [HumidityLevel, string][];

async function uploadPlantPhoto(userId: string, plantId: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${userId}/${plantId}.${ext}`;
  const { error } = await supabase.storage.from('plant-photos').upload(path, file, { upsert: true });
  if (error) return null;
  const { data } = supabase.storage.from('plant-photos').getPublicUrl(path);
  return data.publicUrl;
}

export default function AddPlantPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPlant, updatePlant } = usePlants();

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [apiImageUrl, setApiImageUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [autoFilled, setAutoFilled] = useState(false);

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [cultivar, setCultivar] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [location, setLocation] = useState('');
  const [potSize, setPotSize] = useState('');
  const [potType, setPotType] = useState('');
  const [sunlightPreference, setSunlightPreference] = useState<SunlightLevel | ''>('');
  const [currentLight, setCurrentLight] = useState<SunlightLevel | ''>('');
  const [wateringDays, setWateringDays] = useState('');
  const [fertilizingDays, setFertilizingDays] = useState('');
  const [humidity, setHumidity] = useState<HumidityLevel | ''>('');
  const [notes, setNotes] = useState('');

  function lightToSunlightLevel(light: number): SunlightLevel {
    if (light <= 2) return 'low_light';
    if (light <= 4) return 'partial_sun';
    if (light <= 7) return 'bright_indirect';
    return 'full_sun';
  }

  function humidityToLevel(humidity: number): HumidityLevel {
    if (humidity <= 3) return 'low';
    if (humidity <= 6) return 'medium';
    return 'high';
  }

  async function handleSpeciesSelect(item: TrefleSpeciesListItem) {
    const displayName = item.common_name ?? item.scientific_name;
    setSpecies(displayName);
    if (item.image_url && !pendingFile) {
      setApiImageUrl(item.image_url);
    }

    const detail = await getSpeciesDetails(item.slug);
    const g = detail?.growth;
    let filled = false;

    if (g?.light != null) {
      setSunlightPreference(lightToSunlightLevel(g.light));
      setCurrentLight(lightToSunlightLevel(g.light));
      filled = true;
    }
    if (g?.soil_humidity != null) {
      setWateringDays(g.soil_humidity <= 3 ? '14' : g.soil_humidity <= 6 ? '7' : '3');
      filled = true;
    }
    if (g?.atmospheric_humidity != null) {
      setHumidity(humidityToLevel(g.atmospheric_humidity));
      filled = true;
    }
    const growthRate = detail?.specifications?.growth_rate?.toLowerCase();
    if (growthRate) {
      const fertMap: Record<string, string> = { slow: '60', moderate: '30', rapid: '14' };
      if (fertMap[growthRate]) { setFertilizingDays(fertMap[growthRate]); filled = true; }
    }

    if (!filled) {
      const profile = lookupCareProfile(displayName) ?? lookupCareProfile(item.scientific_name);
      if (profile) {
        setSunlightPreference(profile.light);
        setCurrentLight(profile.light);
        setWateringDays(String(profile.wateringDays));
        setFertilizingDays(String(profile.fertilizingDays));
        setHumidity(profile.humidity);
        filled = true;
      }
    }

    if (filled) setAutoFilled(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    if (!name.trim()) {
      setErrorMsg('Name is required.');
      return;
    }
    if (!user) {
      setErrorMsg('You must be signed in.');
      return;
    }

    setSubmitting(true);
    const payload = {
      name: name.trim(),
      species: species.trim() || null,
      cultivar: cultivar.trim() || null,
      photo_url: null as string | null,
      acquisition_date: acquisitionDate || null,
      location: location.trim() || null,
      pot_size: potSize.trim() || null,
      pot_type: potType.trim() || null,
      sunlight_preference: sunlightPreference || null,
      current_light_exposure: currentLight || null,
      watering_frequency_days: wateringDays === '' ? null : Number(wateringDays),
      fertilizing_frequency_days: fertilizingDays === '' ? null : Number(fertilizingDays),
      humidity_preference: humidity || null,
      health_status: 'healthy' as const,
      notes: notes.trim() || null,
    };

    const { data, error } = await createPlant(payload);
    if (error || !data) {
      setSubmitting(false);
      setErrorMsg(error ?? 'Could not create plant.');
      return;
    }

    let photoUrl: string | null = apiImageUrl;
    if (pendingFile) {
      const uploaded = await uploadPlantPhoto(user.id, data.id, pendingFile);
      if (uploaded) photoUrl = uploaded;
    }
    if (photoUrl) {
      await updatePlant(data.id, { photo_url: photoUrl });
    }

    const waterFreq = payload.watering_frequency_days;
    if (waterFreq != null && waterFreq > 0) {
      await supabase.from('care_reminders').insert({
        plant_id: data.id,
        care_type: 'watering',
        frequency_days: waterFreq,
        next_due: addDays(todayISO(), waterFreq),
        is_active: true,
        notes: null,
      });
    }

    setSubmitting(false);
    navigate(`/plants/${data.id}`, { replace: true });
  }

  return (
    <div className="page-container pb-32">
      <h1 className="page-title">New plant</h1>
      <p className="page-subtitle">Add a friend to your jungle.</p>

      <form onSubmit={handleSubmit} className="space-y-8 lg:max-w-3xl">
        <section className="card space-y-4">
          <h2 className="section-title">Photo</h2>
          <PhotoUpload
            currentUrl={pendingFile ? null : apiImageUrl}
            onFileSelect={(f) => { setPendingFile(f); setApiImageUrl(null); }}
            onClear={() => { setPendingFile(null); setApiImageUrl(null); }}
          />
          {apiImageUrl && !pendingFile && (
            <p className="text-xs text-sage mt-1">Auto-filled from species search</p>
          )}
        </section>

        <section className="card space-y-4">
          <h2 className="section-title">Basic info</h2>
          <div>
            <label className="label" htmlFor="plant-name">
              Name <span className="text-danger">*</span>
            </label>
            <input
              id="plant-name"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="off"
              placeholder="e.g. Fernicio"
            />
          </div>
          <div>
            <label className="label" htmlFor="species">
              Species
            </label>
            <SpeciesSearchInput
              id="species"
              value={species}
              onChange={setSpecies}
              onSpeciesSelect={handleSpeciesSelect}
            />
          </div>
          <div>
            <label className="label" htmlFor="cultivar">
              Cultivar
            </label>
            <input
              id="cultivar"
              className="input-field"
              value={cultivar}
              onChange={(e) => setCultivar(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="acquired">
              Acquisition date
            </label>
            <input
              id="acquired"
              type="date"
              className="input-field"
              value={acquisitionDate}
              onChange={(e) => setAcquisitionDate(e.target.value)}
            />
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="section-title">Location & pot</h2>
          <div>
            <label className="label" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              className="input-field"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. East window sill"
            />
          </div>
          <div>
            <label className="label" htmlFor="pot-size">
              Pot size
            </label>
            <input
              id="pot-size"
              className="input-field"
              value={potSize}
              onChange={(e) => setPotSize(e.target.value)}
              placeholder="e.g. 6 inch"
            />
          </div>
          <div>
            <label className="label" htmlFor="pot-type">
              Pot type
            </label>
            <input
              id="pot-type"
              className="input-field"
              value={potType}
              onChange={(e) => setPotType(e.target.value)}
              placeholder="e.g. Terracotta"
            />
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="section-title">Light & water</h2>
          {autoFilled && (
            <div className="flex items-center gap-2 rounded-xl bg-sage-muted/20 border border-sage-muted/40 px-3 py-2">
              <span className="text-sm" aria-hidden>✨</span>
              <p className="text-xs text-forest font-medium">
                Auto-filled from species data — feel free to adjust
              </p>
            </div>
          )}
          <div>
            <label className="label" htmlFor="sun-pref">
              Sunlight preference
            </label>
            <select
              id="sun-pref"
              className="select-field"
              value={sunlightPreference}
              onChange={(e) => setSunlightPreference((e.target.value as SunlightLevel) || '')}
            >
              <option value="">Select…</option>
              {SUNLIGHT_OPTIONS.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="sun-current">
              Current light exposure
            </label>
            <select
              id="sun-current"
              className="select-field"
              value={currentLight}
              onChange={(e) => setCurrentLight((e.target.value as SunlightLevel) || '')}
            >
              <option value="">Select…</option>
              {SUNLIGHT_OPTIONS.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="water-days">
              Watering frequency (days)
            </label>
            <input
              id="water-days"
              type="number"
              min={1}
              className="input-field"
              value={wateringDays}
              onChange={(e) => setWateringDays(e.target.value)}
              placeholder="e.g. 7"
            />
          </div>
          <div>
            <label className="label" htmlFor="fert-days">
              Fertilizing frequency (days)
            </label>
            <input
              id="fert-days"
              type="number"
              min={1}
              className="input-field"
              value={fertilizingDays}
              onChange={(e) => setFertilizingDays(e.target.value)}
              placeholder="e.g. 30"
            />
          </div>
          <div>
            <label className="label" htmlFor="humidity">
              Humidity preference
            </label>
            <select
              id="humidity"
              className="select-field"
              value={humidity}
              onChange={(e) => setHumidity((e.target.value as HumidityLevel) || '')}
            >
              <option value="">Select…</option>
              {HUMIDITY_OPTIONS.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="section-title">Notes</h2>
          <div>
            <label className="label" htmlFor="notes">
              Care notes
            </label>
            <textarea
              id="notes"
              className="input-field min-h-[120px] resize-y"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Soil mix, quirks, wishlist…"
            />
          </div>
        </section>

        {errorMsg && (
          <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
            {errorMsg}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn-secondary order-2 sm:order-1"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary order-1 sm:order-2" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save plant'}
          </button>
        </div>
      </form>
    </div>
  );
}
