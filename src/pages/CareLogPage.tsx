import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  CalendarClock,
  Check,
  ClipboardList,
  Clock,
  Plus,
  Trash2,
} from 'lucide-react';
import { usePlant } from '@/hooks/usePlants';
import { useCareReminders, useCareEvents } from '@/hooks/useCare';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import type { CareReminder, CareType } from '@/lib/types';
import { CARE_TYPE_LABELS } from '@/lib/types';
import {
  careTypeIcon,
  formatDate,
  formatRelativeDate,
  isOverdue,
  todayISO,
} from '@/lib/helpers';

type Tab = 'reminders' | 'log';

const CARE_TYPES = Object.keys(CARE_TYPE_LABELS) as CareType[];

export default function CareLogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plant, loading: plantLoading } = usePlant(id);
  const {
    reminders,
    loading: remindersLoading,
    createReminder,
    completeReminder,
    snoozeReminder,
    deleteReminder,
  } = useCareReminders(id);
  const { events, loading: eventsLoading, logCareEvent, refetch: refetchEvents } =
    useCareEvents(id);

  const [tab, setTab] = useState<Tab>('reminders');
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [reminderCareType, setReminderCareType] = useState<CareType>('watering');
  const [frequencyDays, setFrequencyDays] = useState(7);
  const [reminderNotes, setReminderNotes] = useState('');
  const [reminderSubmitting, setReminderSubmitting] = useState(false);

  const [logCareType, setLogCareType] = useState<CareType>('watering');
  const [logAmount, setLogAmount] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [logPerformedDate, setLogPerformedDate] = useState(todayISO());
  const [logSubmitting, setLogSubmitting] = useState(false);

  useEffect(() => {
    if (!id) navigate('/plants', { replace: true });
  }, [id, navigate]);

  async function handleAddReminder(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setReminderSubmitting(true);
    await createReminder({
      plant_id: id,
      care_type: reminderCareType,
      frequency_days: frequencyDays,
      next_due: todayISO(),
      is_active: true,
      notes: reminderNotes.trim() || null,
    });
    setReminderSubmitting(false);
    setReminderNotes('');
    setShowAddReminder(false);
  }

  async function handleComplete(r: CareReminder) {
    await completeReminder(r);
    refetchEvents();
  }

  async function handleQuickLog(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setLogSubmitting(true);
    const d = new Date(logPerformedDate + 'T12:00:00');
    const { error } = await logCareEvent({
      plant_id: id,
      care_type: logCareType,
      amount: logAmount.trim() || null,
      notes: logNotes.trim() || null,
      performed_at: d.toISOString(),
    });
    setLogSubmitting(false);
    if (!error) {
      setLogAmount('');
      setLogNotes('');
      setLogPerformedDate(todayISO());
    }
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
        <h1 className="page-title text-gradient-forest">Care log</h1>
        <p className="page-subtitle">{plant.name}</p>
      </header>

      <div
        className="card mb-6 flex gap-1 p-1.5"
        role="tablist"
        aria-label="Care sections"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'reminders'}
          onClick={() => setTab('reminders')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-semibold transition-colors ${
            tab === 'reminders'
              ? 'bg-forest text-white shadow-sm'
              : 'text-bark-light hover:bg-parchment'
          }`}
        >
          <Bell className="h-4 w-4" />
          Reminders
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'log'}
          onClick={() => setTab('log')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-semibold transition-colors ${
            tab === 'log'
              ? 'bg-forest text-white shadow-sm'
              : 'text-bark-light hover:bg-parchment'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          Care log
        </button>
      </div>

      {tab === 'reminders' && (
        <section aria-labelledby="reminders-heading">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="reminders-heading" className="section-title mb-0">
              Reminders
            </h2>
            <button
              type="button"
              onClick={() => setShowAddReminder((v) => !v)}
              className="btn-secondary flex items-center gap-1.5 py-2 px-4 text-sm"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          {showAddReminder && (
            <form onSubmit={handleAddReminder} className="card mb-5 space-y-4 border-forest/15">
              <p className="font-display text-base font-semibold text-bark">New reminder</p>
              <div>
                <label htmlFor="reminder-type" className="label">
                  Care type
                </label>
                <select
                  id="reminder-type"
                  className="select-field"
                  value={reminderCareType}
                  onChange={(e) => setReminderCareType(e.target.value as CareType)}
                >
                  {CARE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {CARE_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="frequency" className="label">
                  Every (days)
                </label>
                <input
                  id="frequency"
                  type="number"
                  min={1}
                  max={365}
                  className="input-field"
                  value={frequencyDays}
                  onChange={(e) => setFrequencyDays(Number(e.target.value) || 1)}
                />
              </div>
              <div>
                <label htmlFor="reminder-notes" className="label">
                  Notes
                </label>
                <textarea
                  id="reminder-notes"
                  className="input-field min-h-[88px] resize-y"
                  placeholder="Optional"
                  value={reminderNotes}
                  onChange={(e) => setReminderNotes(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={reminderSubmitting} className="btn-primary flex-1 text-sm py-2.5">
                  Save
                </button>
                <button
                  type="button"
                  className="btn-ghost text-sm"
                  onClick={() => setShowAddReminder(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {remindersLoading ? (
            <LoadingSpinner />
          ) : reminders.length === 0 ? (
            <EmptyState
              icon="🔔"
              title="No active reminders"
              description="Add a reminder to stay on top of watering, feeding, and more."
              action={{
                label: 'Add reminder',
                onClick: () => setShowAddReminder(true),
              }}
            />
          ) : (
            <ul className="space-y-3">
              {reminders.map((r) => {
                const overdue = isOverdue(r.next_due);
                return (
                  <li key={r.id} className="card border-l-4 border-l-moss">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl" aria-hidden>
                        {careTypeIcon(r.care_type)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display font-semibold text-bark">
                          {CARE_TYPE_LABELS[r.care_type]}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-sage">
                          <span className="inline-flex items-center gap-1">
                            <CalendarClock className="h-3.5 w-3.5" />
                            Next: {formatDate(r.next_due)}
                          </span>
                          <span className="text-bark-light">·</span>
                          <span>{formatRelativeDate(r.next_due)}</span>
                        </p>
                        {overdue && (
                          <span className="badge-red mt-2">Overdue</span>
                        )}
                        {r.notes && (
                          <p className="mt-2 text-sm text-bark-light">{r.notes}</p>
                        )}
                        <p className="mt-1 text-xs text-sage">
                          Every {r.frequency_days} day{r.frequency_days !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="divider" />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn-primary flex items-center gap-1 py-2 px-3 text-xs"
                        onClick={() => handleComplete(r)}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Complete
                      </button>
                      <button
                        type="button"
                        className="btn-secondary py-2 px-3 text-xs"
                        onClick={() => snoozeReminder(r.id, 1)}
                      >
                        Snooze 1d
                      </button>
                      <button
                        type="button"
                        className="btn-secondary py-2 px-3 text-xs"
                        onClick={() => snoozeReminder(r.id, 3)}
                      >
                        3d
                      </button>
                      <button
                        type="button"
                        className="btn-secondary py-2 px-3 text-xs"
                        onClick={() => snoozeReminder(r.id, 7)}
                      >
                        7d
                      </button>
                      <button
                        type="button"
                        className="btn-ghost ml-auto text-danger py-2 px-2"
                        aria-label="Delete reminder"
                        onClick={() => deleteReminder(r.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {tab === 'log' && (
        <section aria-labelledby="log-heading">
          <h2 id="log-heading" className="section-title">
            Quick log
          </h2>
          <form onSubmit={handleQuickLog} className="card mb-8 space-y-4">
            <div>
              <label htmlFor="log-type" className="label">
                Care type
              </label>
              <select
                id="log-type"
                className="select-field"
                value={logCareType}
                onChange={(e) => setLogCareType(e.target.value as CareType)}
              >
                {CARE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {CARE_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="log-amount" className="label">
                Amount
              </label>
              <input
                id="log-amount"
                className="input-field"
                placeholder="e.g. 1 cup, half strength"
                value={logAmount}
                onChange={(e) => setLogAmount(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="log-notes" className="label">
                Notes
              </label>
              <textarea
                id="log-notes"
                className="input-field min-h-[88px] resize-y"
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="log-date" className="label">
                Performed on
              </label>
              <input
                id="log-date"
                type="date"
                className="input-field"
                value={logPerformedDate}
                onChange={(e) => setLogPerformedDate(e.target.value)}
              />
            </div>
            <button type="submit" disabled={logSubmitting} className="btn-primary w-full">
              Log care
            </button>
          </form>

          <h3 className="section-title">History</h3>
          {eventsLoading ? (
            <LoadingSpinner />
          ) : events.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No care events yet"
              description="Log watering, fertilizer, or complete a reminder to build your timeline."
            />
          ) : (
            <div className="relative pl-8">
              <div
                className="absolute left-3 top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b from-sage via-moss to-terracotta/40"
                aria-hidden
              />
              <ul className="space-y-6">
                {events.map((ev) => (
                  <li key={ev.id} className="relative">
                    <div
                      className="absolute -left-[1.35rem] top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-parchment text-sm shadow-sm"
                      aria-hidden
                    >
                      {careTypeIcon(ev.care_type)}
                    </div>
                    <div className="card py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-semibold text-bark">
                          {CARE_TYPE_LABELS[ev.care_type]}
                        </span>
                        <span className="badge-sage inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(ev.performed_at)}
                        </span>
                      </div>
                      {ev.amount && (
                        <p className="mt-2 text-sm text-moss">Amount: {ev.amount}</p>
                      )}
                      {ev.notes && (
                        <p className="mt-2 text-sm text-bark-light leading-relaxed">{ev.notes}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
