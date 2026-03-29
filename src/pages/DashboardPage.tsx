import { Link } from 'react-router-dom';
import { ChevronRight, Plus, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAllReminders } from '@/hooks/useCare';
import { usePlants } from '@/hooks/usePlants';
import {
  careTypeIcon,
  formatRelativeDate,
  isDueSoon,
  isDueToday,
  isOverdue,
} from '@/lib/helpers';
import type { CareReminder, Plant } from '@/lib/types';
import { CARE_TYPE_LABELS } from '@/lib/types';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

type ReminderRow = CareReminder & { plant_name?: string };

function CollageItem({ plant, className }: { plant: Plant; className?: string }) {
  return (
    <Link
      to={`/plants/${plant.id}`}
      className={`group relative block overflow-hidden ${className ?? ''}`}
    >
      {plant.photo_url ? (
        <img
          src={plant.photo_url}
          alt={plant.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sage-light to-sage-muted">
          <span className="text-4xl">🌿</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="truncate font-display text-sm font-bold text-white drop-shadow-sm">{plant.name}</p>
        <p className="truncate text-[11px] text-white/75">{plant.species ?? 'Plant'}</p>
      </div>
    </Link>
  );
}

function ReminderCard({
  reminder,
  tone,
}: {
  reminder: ReminderRow;
  tone: 'urgent' | 'today' | 'soon';
}) {
  const toneClass =
    tone === 'urgent'
      ? 'bg-danger/8'
      : tone === 'today'
        ? 'bg-sun/10'
        : 'bg-white';

  return (
    <Link
      to={`/plants/${reminder.plant_id}`}
      className={`card-interactive block no-underline ${toneClass}`}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sage/20 text-xl"
          aria-hidden
        >
          {careTypeIcon(reminder.care_type)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold text-forest">
            {CARE_TYPE_LABELS[reminder.care_type]}
          </p>
          <p className="truncate text-xs text-bark-light">
            {reminder.plant_name ?? 'Plant'}
          </p>
          <p
            className={`mt-0.5 text-xs font-medium ${
              tone === 'urgent'
                ? 'text-danger'
                : tone === 'today'
                  ? 'text-terracotta-dark'
                  : 'text-bark-light'
            }`}
          >
            {formatRelativeDate(reminder.next_due)}
          </p>
        </div>
        <ChevronRight
          className="h-4 w-4 shrink-0 text-bark-light/50"
          strokeWidth={2}
          aria-hidden
        />
      </div>
    </Link>
  );
}

function ReminderSection({
  title,
  reminders,
  tone,
  badgeClass,
}: {
  title: string;
  reminders: ReminderRow[];
  tone: 'urgent' | 'today' | 'soon';
  badgeClass?: string;
}) {
  if (reminders.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="section-title mb-0">{title}</h2>
        {badgeClass && (
          <span className={badgeClass}>{reminders.length}</span>
        )}
      </div>
      <ul className="space-y-2.5">
        {reminders.map((r) => (
          <li key={r.id}>
            <ReminderCard reminder={r} tone={tone} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { reminders, loading: remindersLoading } = useAllReminders();
  const { plants, loading: plantsLoading } = usePlants();

  const loading = remindersLoading || plantsLoading;

  const displayName =
    typeof user?.user_metadata?.display_name === 'string' &&
    user.user_metadata.display_name.trim()
      ? user.user_metadata.display_name.trim()
      : 'Plant Parent';

  const overdue = reminders
    .filter((r) => isOverdue(r.next_due))
    .sort((a, b) => new Date(a.next_due).getTime() - new Date(b.next_due).getTime());

  const dueToday = reminders
    .filter((r) => isDueToday(r.next_due))
    .sort((a, b) => new Date(a.next_due).getTime() - new Date(b.next_due).getTime());

  const comingUp = reminders
    .filter((r) => !isOverdue(r.next_due) && !isDueToday(r.next_due) && isDueSoon(r.next_due, 7))
    .sort((a, b) => new Date(a.next_due).getTime() - new Date(b.next_due).getTime());

  const hasScheduledSections = overdue.length > 0 || dueToday.length > 0 || comingUp.length > 0;

  const collage = plants.slice(0, 7);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-container font-body">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest/60">Plant Mommy</p>
        <h1 className="page-title mt-1">
          Welcome back, {displayName} <span className="inline-block">👋</span>
        </h1>
        <p className="page-subtitle mb-0">
          Here's what your green family needs today.
        </p>
      </header>

      <div className="lg:grid lg:grid-cols-[1fr_20rem] lg:gap-8">
        {/* Left column: jungle + empty states */}
        <div>
          {plants.length > 0 && (
            <section className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="section-title mb-0">My Jungle</h2>
                <Link
                  to="/plants"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
                >
                  See all
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div className="overflow-hidden rounded-2xl">
                {collage.length === 1 && (
                  <CollageItem plant={collage[0]} className="aspect-[4/3]" />
                )}
                {collage.length === 2 && (
                  <div className="grid grid-cols-2 gap-px">
                    <CollageItem plant={collage[0]} className="aspect-[3/4]" />
                    <CollageItem plant={collage[1]} className="aspect-[3/4]" />
                  </div>
                )}
                {collage.length === 3 && (
                  <div className="grid grid-cols-2 gap-px">
                    <CollageItem plant={collage[0]} className="row-span-2 aspect-auto h-full" />
                    <CollageItem plant={collage[1]} className="aspect-square" />
                    <CollageItem plant={collage[2]} className="aspect-square" />
                  </div>
                )}
                {collage.length === 4 && (
                  <div className="grid grid-cols-2 gap-px">
                    {collage.map(p => (
                      <CollageItem key={p.id} plant={p} className="aspect-square" />
                    ))}
                  </div>
                )}
                {collage.length >= 5 && (
                  <div className="grid grid-cols-3 gap-px" style={{ gridTemplateRows: '1.4fr 1fr' }}>
                    <CollageItem plant={collage[0]} className="col-span-2" />
                    <CollageItem plant={collage[1]} className="col-span-1" />
                    {collage.slice(2, 5).map(p => (
                      <CollageItem key={p.id} plant={p} className="col-span-1" />
                    ))}
                  </div>
                )}
              </div>

              {plants.length > 7 && (
                <Link
                  to="/plants"
                  className="mt-3 block text-center text-xs font-semibold text-forest hover:underline"
                >
                  +{plants.length - 7} more plants
                </Link>
              )}
            </section>
          )}

          {plants.length === 0 && (
            <section className="mb-8">
              <div className="card text-center py-10">
                <span className="text-5xl mb-4 block">🌱</span>
                <p className="font-display text-lg font-semibold text-forest mb-2">Start your jungle</p>
                <p className="text-sm text-bark-light mb-5">Add your first plant to get started.</p>
                <Link
                  to="/plants/new"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  Add a plant
                </Link>
              </div>
            </section>
          )}
        </div>

        {/* Right column (on desktop): reminders */}
        <div>
          {reminders.length === 0 ? (
            <EmptyState
              icon="🌿"
              title="No care reminders yet"
              description="Add plants and set watering or care schedules to see tasks here."
            />
          ) : (
            <>
              {!hasScheduledSections && (
                <div className="card mb-6">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-forest text-cream">
                      <Sparkles size={18} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-forest">
                        All caught up!
                      </p>
                      <p className="mt-1 text-sm text-bark-light">
                        Nothing due in the next seven days.
                      </p>
                      <Link
                        to="/calendar"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
                      >
                        Open calendar
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <ReminderSection
                title="Needs Attention"
                reminders={overdue}
                tone="urgent"
                badgeClass="badge-red"
              />

              <ReminderSection
                title="Due Today"
                reminders={dueToday}
                tone="today"
                badgeClass="badge-yellow"
              />

              <ReminderSection
                title="Coming Up"
                reminders={comingUp}
                tone="soon"
                badgeClass="badge-sage"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
