import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  Flower2,
  Ruler,
  Sprout,
  Upload,
} from 'lucide-react';
import { usePlant } from '@/hooks/usePlants';
import { useGrowthMeasurements, usePlantPhotos } from '@/hooks/useGrowth';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate, todayISO } from '@/lib/helpers';

export default function GrowthPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plant, loading: plantLoading } = usePlant(id);
  const { measurements, loading: measurementsLoading, addMeasurement } =
    useGrowthMeasurements(id);
  const { photos, loading: photosLoading, uploadPhoto } = usePlantPhotos(id);

  const [measuredAt, setMeasuredAt] = useState(todayISO());
  const [heightCm, setHeightCm] = useState('');
  const [widthCm, setWidthCm] = useState('');
  const [leafCount, setLeafCount] = useState('');
  const [isFlowering, setIsFlowering] = useState(false);
  const [newGrowthCount, setNewGrowthCount] = useState('');
  const [measureNotes, setMeasureNotes] = useState('');
  const [measureSubmitting, setMeasureSubmitting] = useState(false);

  const [caption, setCaption] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoSubmitting, setPhotoSubmitting] = useState(false);

  useEffect(() => {
    if (!id) navigate('/plants', { replace: true });
  }, [id, navigate]);

  const chartData = useMemo(() => {
    const withHeight = measurements
      .filter((m) => m.height_cm != null && m.height_cm > 0)
      .slice()
      .sort(
        (a, b) =>
          new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime(),
      );
    if (withHeight.length === 0) return { bars: [] as { h: number; label: string; cm: number }[], max: 0 };
    const max = Math.max(...withHeight.map((m) => m.height_cm!));
    const bars = withHeight.map((m) => ({
      h: max > 0 ? Math.round((m.height_cm! / max) * 100) : 0,
      label: formatDate(m.measured_at),
      cm: m.height_cm!,
    }));
    return { bars, max };
  }, [measurements]);

  async function handleMeasurement(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setMeasureSubmitting(true);
    await addMeasurement({
      plant_id: id,
      measured_at: measuredAt,
      height_cm: heightCm === '' ? null : Number(heightCm),
      width_cm: widthCm === '' ? null : Number(widthCm),
      leaf_count: leafCount === '' ? null : Number(leafCount),
      is_flowering: isFlowering,
      new_growth_count: newGrowthCount === '' ? null : Number(newGrowthCount),
      notes: measureNotes.trim() || null,
    });
    setMeasureSubmitting(false);
    setHeightCm('');
    setWidthCm('');
    setLeafCount('');
    setNewGrowthCount('');
    setMeasureNotes('');
    setIsFlowering(false);
    setMeasuredAt(todayISO());
  }

  async function handlePhotoUpload(e: FormEvent) {
    e.preventDefault();
    if (!id || !photoFile) return;
    setPhotoSubmitting(true);
    await uploadPhoto(id, photoFile, caption.trim() || undefined);
    setPhotoSubmitting(false);
    setPhotoFile(null);
    setCaption('');
  }

  if (!id) return null;

  if (plantLoading) {
    return (
      <div className="page-container font-body">
        <LoadingSpinner />
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="page-container font-body">
        <EmptyState
          icon="🪴"
          title="Plant not found"
          description="This plant may have been removed."
          action={{ label: 'Back to plants', onClick: () => navigate('/plants') }}
        />
      </div>
    );
  }

  return (
    <div className="page-container font-body min-h-dvh bg-gradient-to-b from-cream via-parchment/40 to-sage-muted/20">
      <header className="mb-6">
        <button
          type="button"
          onClick={() => navigate(`/plants/${id}`)}
          className="btn-ghost -ml-2 mb-3 flex items-center gap-1.5 text-forest"
          aria-label="Back to plant"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          <span className="text-sm font-medium">Plant</span>
        </button>
        <h1 className="page-title text-gradient-forest">Growth</h1>
        <p className="page-subtitle">{plant.name}</p>
      </header>

      <section className="mb-8" aria-labelledby="measure-heading">
        <h2 id="measure-heading" className="section-title">
          Add measurement
        </h2>
        <form onSubmit={handleMeasurement} className="card space-y-4">
          <div>
            <label htmlFor="measured-at" className="label">
              Date
            </label>
            <input
              id="measured-at"
              type="date"
              className="input-field"
              value={measuredAt}
              onChange={(e) => setMeasuredAt(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="height" className="label">
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                min={0}
                step={0.1}
                className="input-field"
                placeholder="—"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="width" className="label">
                Width (cm)
              </label>
              <input
                id="width"
                type="number"
                min={0}
                step={0.1}
                className="input-field"
                placeholder="—"
                value={widthCm}
                onChange={(e) => setWidthCm(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="leaves" className="label">
                Leaf count
              </label>
              <input
                id="leaves"
                type="number"
                min={0}
                className="input-field"
                placeholder="—"
                value={leafCount}
                onChange={(e) => setLeafCount(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="new-growth" className="label">
                New growth
              </label>
              <input
                id="new-growth"
                type="number"
                min={0}
                className="input-field"
                placeholder="—"
                value={newGrowthCount}
                onChange={(e) => setNewGrowthCount(e.target.value)}
              />
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-sage-muted bg-parchment/50 px-4 py-3">
            <input
              type="checkbox"
              checked={isFlowering}
              onChange={(e) => setIsFlowering(e.target.checked)}
              className="h-4 w-4 rounded border-sage-muted text-forest focus:ring-forest/30"
            />
            <span className="flex items-center gap-2 text-sm font-medium text-bark">
              <Flower2 className="h-4 w-4 text-bloom" />
              Flowering
            </span>
          </label>
          <div>
            <label htmlFor="measure-notes" className="label">
              Notes
            </label>
            <textarea
              id="measure-notes"
              className="input-field min-h-[88px] resize-y"
              value={measureNotes}
              onChange={(e) => setMeasureNotes(e.target.value)}
            />
          </div>
          <button type="submit" disabled={measureSubmitting} className="btn-primary w-full">
            Save measurement
          </button>
        </form>
      </section>

      <section className="mb-8" aria-labelledby="chart-heading">
        <h2 id="chart-heading" className="section-title flex items-center gap-2">
          <Ruler className="h-5 w-5 text-moss" />
          Height over time
        </h2>
        {measurementsLoading ? (
          <LoadingSpinner />
        ) : chartData.bars.length === 0 ? (
          <div className="card text-center text-sm text-sage py-10">
            Add measurements with height (cm) to see a simple bar chart.
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <p className="text-xs text-sage mb-4">
              Tallest recorded: <span className="font-semibold text-forest">{chartData.max} cm</span>
            </p>
            <div
              className="flex justify-between gap-2 pt-2"
              role="img"
              aria-label="Height measurements bar chart"
            >
              {chartData.bars.map((b, i) => {
                const barPx = Math.max(Math.round((b.h / 100) * 140), 10);
                return (
                  <div
                    key={i}
                    className="flex min-w-[2.25rem] flex-1 flex-col items-center"
                  >
                    <span className="text-[10px] font-semibold text-forest tabular-nums">
                      {b.cm} cm
                    </span>
                    <div className="mt-1 flex h-[150px] w-full max-w-[2.75rem] flex-col justify-end">
                      <div
                        className="w-full rounded-t-xl bg-gradient-to-t from-forest-dark via-forest to-sage shadow-sm"
                        style={{ height: barPx }}
                      />
                    </div>
                    <span className="mt-2 max-w-full text-center text-[9px] leading-tight text-bark-light line-clamp-2">
                      {b.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className="mb-8" aria-labelledby="history-heading">
        <h2 id="history-heading" className="section-title flex items-center gap-2">
          <Sprout className="h-5 w-5 text-moss" />
          Growth history
        </h2>
        {measurementsLoading ? (
          <LoadingSpinner />
        ) : measurements.length === 0 ? (
          <EmptyState
            icon="📏"
            title="No measurements yet"
            description="Track height, leaves, and flowering to watch your plant thrive."
          />
        ) : (
          <ul className="space-y-3">
            {measurements.map((m) => (
              <li key={m.id} className="card border-l-4 border-l-terracotta/60">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display font-semibold text-bark">
                    {formatDate(m.measured_at)}
                  </span>
                  {m.is_flowering && (
                    <span className="badge-yellow inline-flex items-center gap-1">
                      <Flower2 className="h-3 w-3" />
                      Flowering
                    </span>
                  )}
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  {m.height_cm != null && (
                    <>
                      <dt className="text-sage">Height</dt>
                      <dd className="text-bark font-medium">{m.height_cm} cm</dd>
                    </>
                  )}
                  {m.width_cm != null && (
                    <>
                      <dt className="text-sage">Width</dt>
                      <dd className="text-bark font-medium">{m.width_cm} cm</dd>
                    </>
                  )}
                  {m.leaf_count != null && (
                    <>
                      <dt className="text-sage">Leaves</dt>
                      <dd className="text-bark font-medium">{m.leaf_count}</dd>
                    </>
                  )}
                  {m.new_growth_count != null && (
                    <>
                      <dt className="text-sage">New growth</dt>
                      <dd className="text-bark font-medium">{m.new_growth_count}</dd>
                    </>
                  )}
                </dl>
                {m.notes && (
                  <p className="mt-3 text-sm text-bark-light leading-relaxed border-t border-parchment pt-3">
                    {m.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="photos-heading">
        <h2 id="photos-heading" className="section-title flex items-center gap-2">
          <Camera className="h-5 w-5 text-moss" />
          Photo gallery
        </h2>

        <form onSubmit={handlePhotoUpload} className="card mb-6 space-y-4">
          <div>
            <label htmlFor="photo-file" className="label">
              Upload photo
            </label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sage-muted bg-parchment/30 py-10 transition-colors hover:border-forest/40">
              <Upload className="h-8 w-8 text-sage" />
              <span className="text-sm font-medium text-forest">
                {photoFile ? photoFile.name : 'Choose image'}
              </span>
              <input
                id="photo-file"
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <div>
            <label htmlFor="caption" className="label">
              Caption
            </label>
            <input
              id="caption"
              className="input-field"
              placeholder="Optional"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={!photoFile || photoSubmitting}
            className="btn-primary w-full"
          >
            Upload
          </button>
        </form>

        {photosLoading ? (
          <LoadingSpinner />
        ) : photos.length === 0 ? (
          <EmptyState
            icon="📷"
            title="No photos yet"
            description="Capture your plant’s journey with dated snapshots."
          />
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {photos.map((p) => (
              <li key={p.id} className="card-interactive overflow-hidden p-0">
                <div className="aspect-square overflow-hidden bg-parchment">
                  <img
                    src={p.url}
                    alt={p.caption || 'Plant photo'}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-sage">{formatDate(p.taken_at)}</p>
                  {p.caption && (
                    <p className="mt-1 text-sm text-bark leading-snug">{p.caption}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
