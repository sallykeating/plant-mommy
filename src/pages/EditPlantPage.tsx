import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePlant, usePlants } from '@/hooks/usePlants';
import { PhotoUpload } from '@/components/shared/PhotoUpload';
import { SpeciesSearchInput } from '@/components/shared/SpeciesSearchInput';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { supabase } from '@/lib/supabase';
import {
  HUMIDITY_LABELS,
  SUNLIGHT_LABELS,
  type HumidityLevel,
  type SunlightLevel,
} from '@/lib/types';
import { getSpeciesDetails, type TrefleSpeciesListItem } from '@/lib/trefle';

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

export default function EditPlantPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plant, loading, updatePlant } = usePlant(id);
  const { deletePlant } = usePlants();

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [photoCleared, setPhotoCleared] = useState(false);
  const [apiImageUrl, setApiImageUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [autoFilled, setAutoFilled] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => {
    if (!plant) return;
    setName(plant.name);
    setSpecies(plant.species ?? '');
    setCultivar(plant.cultivar ?? '');
    setAcquisitionDate(plant.acquisition_date ?? '');
    setLocation(plant.location ?? '');
    setPotSize(plant.pot_size ?? '');
    setPotType(plant.pot_type ?? '');
    setSunlightPreference(plant.sunlight_preference ?? '');
    setCurrentLight(plant.current_light_exposure ?? '');
    setWateringDays(plant.watering_frequency_days?.toString() ?? '');
    setFertilizingDays(plant.fertilizing_frequency_days?.toString() ?? '');
    setHumidity(plant.humidity_preference ?? '');
    setNotes(plant.notes ?? '');
    setPendingFile(null);
    setPhotoCleared(false);
  }, [plant]);

  function lightToSunlightLevel(light: number): SunlightLevel {
    if (light <= 2) return 'low_light';
    if (light <= 4) return 'partial_sun';
    if (light <= 7) return 'bright_indirect';
    return 'full_sun';
  }

  function humidityToLevel(h: number): HumidityLevel {
    if (h <= 3) return 'low';
    if (h <= 6) return 'medium';
    return 'high';
  }

  async function handleSpeciesSelect(item: TrefleSpeciesListItem) {
    setSpecies(item.common_name ?? item.scientific_name);
    if (item.image_url && !pendingFile && !plant?.photo_url) {
      setApiImageUrl(item.image_url);
    }

    const detail = await getSpeciesDetails(item.slug);
    if (!detail) return;

    const g = detail.growth;

    if (!sunlightPreference && g?.light != null) {
      const level = lightToSunlightLevel(g.light);
      setSunlightPreference(level);
      if (!currentLight) setCurrentLight(level);
    }

    if (!wateringDays && g?.soil_humidity != null) {
      const days = g.soil_humidity <= 3 ? '14' : g.soil_humidity <= 6 ? '7' : '3';
      setWateringDays(days);
    }

    if (!humidity && g?.atmospheric_humidity != null) {
      setHumidity(humidityToLevel(g.atmospheric_humidity));
    }

    if (!fertilizingDays) {
      const growthRate = detail.specifications?.growth_rate?.toLowerCase();
      if (growthRate) {
        const fertMap: Record<string, string> = { slow: '60', moderate: '30', rapid: '14' };
        if (fertMap[growthRate]) setFertilizingDays(fertMap[growthRate]);
      }
    }

    setAutoFilled(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    if (!id || !plant) return;
    if (!name.trim()) {
      setErrorMsg('Name is required.');
      return;
    }
    if (!user) {
      setErrorMsg('You must be signed in.');
      return;
    }

    setSubmitting(true);

    let photo_url: string | null = plant.photo_url;
    if (pendingFile) {
      const url = await uploadPlantPhoto(user.id, id, pendingFile);
      if (url) photo_url = url;
    } else if (photoCleared) {
      photo_url = null;
    } else if (apiImageUrl && !plant.photo_url) {
      photo_url = apiImageUrl;
    }

    const { error } = await updatePlant({
      name: name.trim(),
      species: species.trim() || null,
      cultivar: cultivar.trim() || null,
      photo_url,
      acquisition_date: acquisitionDate || null,
      location: location.trim() || null,
      pot_size: potSize.trim() || null,
      pot_type: potType.trim() || null,
      sunlight_preference: sunlightPreference || null,
      current_light_exposure: currentLight || null,
      watering_frequency_days: wateringDays === '' ? null : Number(wateringDays),
      fertilizing_frequency_days: fertilizingDays === '' ? null : Number(fertilizingDays),
      humidity_preference: humidity || null,
      notes: notes.trim() || null,
    });

    setSubmitting(false);
    if (error) {
      setErrorMsg(error);
      return;
    }
    navigate(`/plants/${id}`);
  }

  async function handleDelete() {
    if (!id) return;
    setDeleting(true);
    const { error } = await deletePlant(id);
    setDeleting(false);
    if (!error) navigate('/plants', { replace: true });
  }

  useEffect(() => {
    if (!id) navigate('/plants', { replace: true });
  }, [id, navigate]);

  if (!id) return null;

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="page-container">
        <p className="text-sage text-center py-12">Plant not found.</p>
      </div>
    );
  }

  const displayPhotoUrl = photoCleared ? null : plant.photo_url;

  return (
    <div className="page-container pb-32">
      <h1 className="page-title">Edit plant</h1>
      <p className="page-subtitle">Update {plant.name}&apos;s profile.</p>

      <form onSubmit={handleSubmit} className="space-y-8 lg:max-w-3xl">
        <section className="card space-y-4">
          <h2 className="section-title">Photo</h2>
          <PhotoUpload
            key={`${plant.id}-${displayPhotoUrl ?? 'none'}`}
            currentUrl={displayPhotoUrl}
            onFileSelect={(f) => {
              setPendingFile(f);
              setPhotoCleared(false);
            }}
            onClear={() => {
              setPendingFile(null);
              setPhotoCleared(true);
            }}
          />
        </section>

        <section className="card space-y-4">
          <h2 className="section-title">Basic info</h2>
          <div>
            <label className="label" htmlFor="edit-plant-name">
              Name <span className="text-danger">*</span>
            </label>
            <input
              id="edit-plant-name"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="edit-species">
              Species
            </label>
            <SpeciesSearchInput
              id="edit-species"
              value={species}
              onChange={setSpecies}
              onSpeciesSelect={handleSpeciesSelect}
            />
          </div>
          <div>
            <label className="label" htmlFor="edit-cultivar">
              Cultivar
            </label>
            <input
              id="edit-cultivar"
              className="input-field"
              value={cultivar}
              onChange={(e) => setCultivar(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="edit-acquired">
              Acquisition date
            </label>
            <input
              id="edit-acquired"
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
            <label className="label" htmlFor="edit-location">
              Location
            </label>
            <input
              id="edit-location"
              className="input-field"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="edit-pot-size">
              Pot size
            </label>
            <input
              id="edit-pot-size"
              className="input-field"
              value={potSize}
              onChange={(e) => setPotSize(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="edit-pot-type">
              Pot type
            </label>
            <input
              id="edit-pot-type"
              className="input-field"
              value={potType}
              onChange={(e) => setPotType(e.target.value)}
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
            <label className="label" htmlFor="edit-sun-pref">
              Sunlight preference
            </label>
            <select
              id="edit-sun-pref"
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
            <label className="label" htmlFor="edit-sun-current">
              Current light exposure
            </label>
            <select
              id="edit-sun-current"
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
            <label className="label" htmlFor="edit-water-days">
              Watering frequency (days)
            </label>
            <input
              id="edit-water-days"
              type="number"
              min={1}
              className="input-field"
              value={wateringDays}
              onChange={(e) => setWateringDays(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="edit-fert-days">
              Fertilizing frequency (days)
            </label>
            <input
              id="edit-fert-days"
              type="number"
              min={1}
              className="input-field"
              value={fertilizingDays}
              onChange={(e) => setFertilizingDays(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="edit-humidity">
              Humidity preference
            </label>
            <select
              id="edit-humidity"
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
          <textarea
            className="input-field min-h-[120px] resize-y"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>

        <section className="card border-terracotta/30 bg-terracotta-light/10">
          <h2 className="section-title text-terracotta-dark">Danger zone</h2>
          <p className="text-sm text-bark-light mb-4">
            Permanently delete this plant and its associated data from Plant Mommy.
          </p>
          <button
            type="button"
            className="btn-danger w-full sm:w-auto"
            onClick={() => setDeleteOpen(true)}
          >
            Delete plant
          </button>
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
            onClick={() => navigate(`/plants/${id}`)}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary order-1 sm:order-2" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>

      {deleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-bark/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-delete-title"
        >
          <div className="card w-full max-w-sm shadow-xl">
            <h2 id="edit-delete-title" className="font-display text-lg font-semibold text-bark mb-2">
              Delete plant?
            </h2>
            <p className="text-sm text-sage mb-6">
              This removes “{plant.name}” and cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-secondary flex-1 py-2.5 text-sm"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger flex-1 py-2.5 text-sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
