import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ClipboardList,
  Droplets,
  HeartPulse,
  Pencil,
  Ruler,
  Trash2,
} from 'lucide-react';
import { usePlant, usePlants } from '@/hooks/usePlants';
import { useCareReminders } from '@/hooks/useCare';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { CareTipsPanel } from '@/components/plants/CareTipsPanel';
import {
  CARE_TYPE_LABELS,
  HEALTH_STATUS_LABELS,
  HUMIDITY_LABELS,
  SUNLIGHT_LABELS,
} from '@/lib/types';
import {
  careTypeIcon,
  formatDate,
  formatRelativeDate,
  healthStatusColor,
  isOverdue,
} from '@/lib/helpers';

export default function PlantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plant, loading } = usePlant(id);
  const { deletePlant } = usePlants();
  const { reminders, loading: remindersLoading, completeReminder } = useCareReminders(id);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
        <button type="button" onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2 inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="card text-center text-sage py-12">Plant not found.</div>
      </div>
    );
  }

  const upcoming = [...reminders].sort(
    (a, b) => new Date(a.next_due).getTime() - new Date(b.next_due).getTime()
  );

  const pid = plant.id;

  return (
    <div className="page-container pb-32">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="btn-ghost mb-4 -ml-2 inline-flex items-center gap-2 text-forest"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="lg:grid lg:grid-cols-[1fr_22rem] lg:gap-8">
        {/* Left column */}
        <div>
          <section className="relative -mx-1 mb-6 overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="aspect-[4/3] w-full sm:aspect-[16/9]">
              {plant.photo_url ? (
                <img src={plant.photo_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center bg-gradient-to-br from-forest/20 via-sage-muted to-terracotta-light/40"
                  aria-hidden
                >
                  <span className="text-7xl">🪴</span>
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-semibold text-forest">{plant.name}</h1>
                  <p className="text-bark-light mt-1">
                    {[plant.species, plant.cultivar].filter(Boolean).join(' · ') || 'No species set'}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${healthStatusColor(plant.health_status)}`}
                >
                  {HEALTH_STATUS_LABELS[plant.health_status]}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Link
                  to={`/plants/${pid}/care?focus=water`}
                  className="card flex flex-col items-center gap-1 py-4 text-center transition-shadow hover:shadow-md"
                >
                  <Droplets className="text-forest" size={22} />
                  <span className="text-xs font-semibold text-forest">Water</span>
                </Link>
                <Link
                  to={`/plants/${pid}/care`}
                  className="card flex flex-col items-center gap-1 py-4 text-center transition-shadow hover:shadow-md"
                >
                  <ClipboardList className="text-forest" size={22} />
                  <span className="text-xs font-semibold text-forest">Care Log</span>
                </Link>
                <Link
                  to={`/plants/${pid}/growth`}
                  className="card flex flex-col items-center gap-1 py-4 text-center transition-shadow hover:shadow-md"
                >
                  <Ruler className="text-forest" size={22} />
                  <span className="text-xs font-semibold text-forest">Growth</span>
                </Link>
                <Link
                  to={`/plants/${pid}/health`}
                  className="card flex flex-col items-center gap-1 py-4 text-center transition-shadow hover:shadow-md"
                >
                  <HeartPulse className="text-forest" size={22} />
                  <span className="text-xs font-semibold text-forest">Health</span>
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/plants/${pid}/edit`} className="btn-secondary inline-flex flex-1 min-w-[8rem] items-center justify-center gap-2 py-2.5 text-sm">
                  <Pencil size={16} />
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  className="btn-danger inline-flex flex-1 min-w-[8rem] items-center justify-center gap-2 py-2.5 text-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </section>

          <h2 className="section-title">Care tips</h2>
          <CareTipsPanel speciesName={plant.species} />
        </div>

        {/* Right column */}
        <div>
          <h2 className="section-title">Plant details</h2>
          <div className="card mb-4 space-y-3 text-sm">
            <DetailRow label="Location" value={plant.location} />
            <div className="divider my-3" />
            <DetailRow
              label="Sunlight preference"
              value={plant.sunlight_preference ? SUNLIGHT_LABELS[plant.sunlight_preference] : null}
            />
            <DetailRow
              label="Current light"
              value={plant.current_light_exposure ? SUNLIGHT_LABELS[plant.current_light_exposure] : null}
            />
            <div className="divider my-3" />
            <DetailRow
              label="Watering schedule"
              value={
                plant.watering_frequency_days != null
                  ? `Every ${plant.watering_frequency_days} day${plant.watering_frequency_days === 1 ? '' : 's'}`
                  : null
              }
            />
            <DetailRow
              label="Fertilizing schedule"
              value={
                plant.fertilizing_frequency_days != null
                  ? `Every ${plant.fertilizing_frequency_days} day${plant.fertilizing_frequency_days === 1 ? '' : 's'}`
                  : null
              }
            />
            <DetailRow
              label="Humidity"
              value={plant.humidity_preference ? HUMIDITY_LABELS[plant.humidity_preference] : null}
            />
            <div className="divider my-3" />
            <DetailRow label="Pot size" value={plant.pot_size} />
            <DetailRow label="Pot type" value={plant.pot_type} />
            <DetailRow
              label="Last repotted"
              value={plant.last_repotted ? formatDate(plant.last_repotted) : null}
            />
            <DetailRow
              label="Acquired"
              value={plant.acquisition_date ? formatDate(plant.acquisition_date) : null}
            />
            {plant.notes && (
              <>
                <div className="divider my-3" />
                <p className="label">Notes</p>
                <p className="text-bark-light whitespace-pre-wrap leading-relaxed">{plant.notes}</p>
              </>
            )}
          </div>

          <h2 className="section-title mt-6">Upcoming reminders</h2>
      <div className="card">
        {remindersLoading ? (
          <LoadingSpinner size="sm" />
        ) : upcoming.length === 0 ? (
          <p className="text-center text-sm text-sage py-6">No active reminders for this plant.</p>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((r) => {
              const overdue = isOverdue(r.next_due);
              return (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-sage/15 px-3 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0" aria-hidden>
                      {careTypeIcon(r.care_type)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-forest text-sm">
                        {CARE_TYPE_LABELS[r.care_type]}
                      </p>
                      <p
                        className={`text-xs ${overdue ? 'text-danger font-semibold' : 'text-sage'}`}
                      >
                        {formatRelativeDate(r.next_due)}
                        {overdue ? ' · Overdue' : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => completeReminder(r)}
                    className="btn-primary shrink-0 py-2 px-3 text-xs"
                  >
                    Done
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
        </div>
      </div>

      {deleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-bark/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-plant-title"
        >
          <div className="card w-full max-w-sm shadow-xl">
            <h2 id="delete-plant-title" className="font-display text-lg font-semibold text-forest mb-2">
              Delete plant?
            </h2>
            <p className="text-sm text-bark-light mb-6">
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

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="text-sage text-xs font-medium uppercase tracking-wide">{label}</span>
      <span className="text-bark font-medium sm:text-right">{value ?? '—'}</span>
    </div>
  );
}
