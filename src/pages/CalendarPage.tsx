import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { useAllReminders } from '@/hooks/useCare';
import { careTypeIcon, isOverdue, todayISO } from '@/lib/helpers';
import { CARE_TYPE_LABELS } from '@/lib/types';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { CareReminder } from '@/lib/types';

function toDateOnly(iso: string): string {
  return iso.slice(0, 10);
}

function toISODateLocal(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

/** Local calendar date from YYYY-MM-DD (avoids UTC parse shift). */
function formatISODateLocal(yyyyMmDd: string): string {
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return new Date(y!, m! - 1, d!).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getCalendarCells(year: number, monthIndex: number): (number | null)[] {
  const first = new Date(year, monthIndex, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function dayIndicatorClass(dayIso: string): string {
  const t = todayISO();
  if (dayIso < t) return 'bg-danger';
  if (dayIso === t) return 'bg-forest';
  return 'bg-sage';
}

type ReminderRow = CareReminder & { plant_name?: string };

export default function CalendarPage() {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(() => todayISO());

  const { reminders, loading, refetch } = useAllReminders();

  const remindersByDate = useMemo(() => {
    const map = new Map<string, ReminderRow[]>();
    for (const r of reminders) {
      const key = toDateOnly(r.next_due);
      const list = map.get(key) ?? [];
      list.push(r);
      map.set(key, list);
    }
    return map;
  }, [reminders]);

  const cells = useMemo(
    () => getCalendarCells(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(
    'en-US',
    { month: 'long', year: 'numeric' },
  );

  function goPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const selectedReminders = remindersByDate.get(selectedDate) ?? [];
  const sortedSelected = [...selectedReminders].sort((a, b) => {
    const pa = a.plant_name ?? '';
    const pb = b.plant_name ?? '';
    if (pa !== pb) return pa.localeCompare(pb);
    return a.care_type.localeCompare(b.care_type);
  });

  const weekStart = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const sel = new Date(y!, m! - 1, d!);
    const dow = sel.getDay();
    const start = new Date(sel);
    start.setDate(sel.getDate() - dow);
    return start;
  }, [selectedDate]);

  const weekReminders = useMemo(() => {
    const out: { date: string; items: ReminderRow[] }[] = [];
    for (let i = 0; i < 7; i++) {
      const dt = new Date(weekStart);
      dt.setDate(weekStart.getDate() + i);
      const iso = toISODateLocal(
        dt.getFullYear(),
        dt.getMonth(),
        dt.getDate(),
      );
      const items = remindersByDate.get(iso) ?? [];
      if (items.length) out.push({ date: iso, items });
    }
    return out;
  }, [weekStart, remindersByDate]);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-container font-body">
      <header className="mb-4">
        <h1 className="page-title">Care calendar</h1>
        <p className="page-subtitle">
          Tap a day to see tasks. Dots: overdue (red), today (green), upcoming
          (sage).
        </p>
      </header>

      <div className="lg:grid lg:grid-cols-[1fr_22rem] lg:gap-8 lg:items-start">
        {/* Calendar grid */}
        <div className="card mb-5 lg:mb-0">
          <div className="flex items-center justify-between gap-2 mb-4">
            <button
              type="button"
              onClick={goPrevMonth}
              className="btn-ghost p-2 rounded-xl shrink-0"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-6 h-6 text-forest" />
            </button>
            <h2 className="font-display text-lg font-semibold text-bark text-center flex-1">
              {monthLabel}
            </h2>
            <button
              type="button"
              onClick={goNextMonth}
              className="btn-ghost p-2 rounded-xl shrink-0"
              aria-label="Next month"
            >
              <ChevronRight className="w-6 h-6 text-forest" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold text-sage uppercase tracking-wide mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {cells.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[2.75rem] sm:min-h-14 rounded-xl bg-parchment/40"
                  />
                );
              }
              const dayIso = toISODateLocal(viewYear, viewMonth, day);
              const dayList = remindersByDate.get(dayIso) ?? [];
              const isSelected = selectedDate === dayIso;
              const dotClass = dayIndicatorClass(dayIso);

              return (
                <button
                  key={dayIso}
                  type="button"
                  onClick={() => setSelectedDate(dayIso)}
                  className={`
                    min-h-[2.75rem] sm:min-h-14 rounded-xl flex flex-col items-center justify-center gap-0.5
                    text-sm font-semibold transition-all active:scale-[0.97]
                    ${isSelected
                      ? 'bg-forest/15 ring-2 ring-forest text-forest-dark'
                      : 'bg-parchment/60 text-bark hover:bg-sage-muted/50'}
                  `}
                >
                  <span>{day}</span>
                  {dayList.length > 0 && (
                    <div className="flex items-center justify-center gap-0.5 flex-wrap max-w-full px-0.5">
                      {dayList.slice(0, 3).map((r) => (
                        <span
                          key={r.id}
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`}
                          title={`${r.plant_name ?? 'Plant'} — ${CARE_TYPE_LABELS[r.care_type]}`}
                        />
                      ))}
                      {dayList.length > 3 && (
                        <span className="text-[9px] text-sage leading-none">
                          +{dayList.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar: selected day + week */}
        <div>
      <section className="mb-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="section-title mb-0">
            {formatISODateLocal(selectedDate)}
          </h3>
          <button
            type="button"
            className="btn-ghost text-xs py-1.5 px-3"
            onClick={() => {
              setSelectedDate(todayISO());
              setViewYear(new Date().getFullYear());
              setViewMonth(new Date().getMonth());
            }}
          >
            Today
          </button>
        </div>

        {sortedSelected.length === 0 ? (
          <div className="card border-dashed border-2 border-sage-muted bg-cream/80 text-center py-8">
            <Leaf className="w-10 h-10 text-sage mx-auto mb-2 opacity-80" />
            <p className="text-bark-light text-sm">
              No care tasks due this day.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {sortedSelected.map((r) => {
              const overdue = isOverdue(r.next_due);
              const label = CARE_TYPE_LABELS[r.care_type];
              return (
                <li key={r.id}>
                  <div className="card-interactive flex items-start gap-3 p-4">
                    <span
                      className="text-2xl leading-none mt-0.5"
                      aria-hidden
                    >
                      {careTypeIcon(r.care_type)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-semibold text-bark truncate">
                        {r.plant_name ?? 'Plant'}
                      </p>
                      <p className="text-sm text-bark-light">{label}</p>
                      {overdue && (
                        <span className="badge-red mt-2">Overdue</span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="divider" />

      <section>
        <h3 className="section-title">This week</h3>
        <p className="text-sm text-sage mb-3">
          Week of{' '}
          {weekStart.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </p>
        {weekReminders.length === 0 ? (
          <p className="text-sm text-bark-light">Nothing due this week.</p>
        ) : (
          <ul className="space-y-3">
            {weekReminders.map(({ date, items }) => (
              <li key={date}>
                <button
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className="w-full text-left"
                >
                  <p className="label mb-1">{formatISODateLocal(date)}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((r) => (
                      <span
                        key={r.id}
                        className="badge-sage text-[11px] inline-flex items-center gap-1"
                      >
                        <span aria-hidden>{careTypeIcon(r.care_type)}</span>
                        {r.plant_name ?? 'Plant'}
                      </span>
                    ))}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        type="button"
        className="btn-secondary w-full mt-6 text-sm py-2.5"
        onClick={() => void refetch()}
      >
        Refresh reminders
      </button>
        </div>
      </div>
    </div>
  );
}
