import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Leaf,
  MapPin,
  ThermometerSun,
} from 'lucide-react';
import { usePlant } from '@/hooks/usePlants';
import { useHealthIssues, useEnvironmentNotes } from '@/hooks/useHealth';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import type { IssueType, Severity } from '@/lib/types';
import {
  ISSUE_TYPE_LABELS,
  SEVERITY_LABELS,
} from '@/lib/types';
import { formatDate, todayISO } from '@/lib/helpers';

const ISSUE_TYPES = Object.keys(ISSUE_TYPE_LABELS) as IssueType[];
const SEVERITIES = Object.keys(SEVERITY_LABELS) as Severity[];

const SEASONS = [
  { value: '', label: 'Season (optional)' },
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall' },
  { value: 'winter', label: 'Winter' },
];

function severityBadgeClass(severity: Severity, resolved: boolean): string {
  if (resolved) return 'badge-green';
  switch (severity) {
    case 'low':
      return 'badge-sage';
    case 'medium':
      return 'badge-yellow';
    case 'high':
      return 'badge-red';
    case 'critical':
      return 'badge-red ring-2 ring-danger/25';
    default:
      return 'badge-sage';
  }
}

export default function HealthPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plant, loading: plantLoading } = usePlant(id);
  const { issues, loading: issuesLoading, addIssue, resolveIssue } =
    useHealthIssues(id);
  const { notes, loading: notesLoading, addNote } = useEnvironmentNotes(id);

  const [issueType, setIssueType] = useState<IssueType>('pest');
  const [severity, setSeverity] = useState<Severity>('low');
  const [description, setDescription] = useState('');
  const [treatment, setTreatment] = useState('');
  const [issueNotes, setIssueNotes] = useState('');
  const [issueSubmitting, setIssueSubmitting] = useState(false);

  const [room, setRoom] = useState('');
  const [lightDirection, setLightDirection] = useState('');
  const [temperatureF, setTemperatureF] = useState('');
  const [humidityPercent, setHumidityPercent] = useState('');
  const [season, setSeason] = useState('');
  const [envNotes, setEnvNotes] = useState('');
  const [envSubmitting, setEnvSubmitting] = useState(false);

  useEffect(() => {
    if (!id) navigate('/plants', { replace: true });
  }, [id, navigate]);

  async function handleAddIssue(e: FormEvent) {
    e.preventDefault();
    if (!id || !description.trim()) return;
    setIssueSubmitting(true);
    await addIssue({
      plant_id: id,
      issue_type: issueType,
      severity,
      description: description.trim(),
      treatment: treatment.trim() || null,
      notes: issueNotes.trim() || null,
      resolved: false,
      started_at: todayISO(),
    });
    setIssueSubmitting(false);
    setDescription('');
    setTreatment('');
    setIssueNotes('');
  }

  async function handleAddEnvNote(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setEnvSubmitting(true);
    await addNote({
      plant_id: id,
      room: room.trim() || null,
      light_direction: lightDirection.trim() || null,
      temperature_f: temperatureF === '' ? null : Number(temperatureF),
      humidity_percent: humidityPercent === '' ? null : Number(humidityPercent),
      season: season || null,
      notes: envNotes.trim() || null,
      recorded_at: new Date().toISOString(),
    });
    setEnvSubmitting(false);
    setRoom('');
    setLightDirection('');
    setTemperatureF('');
    setHumidityPercent('');
    setSeason('');
    setEnvNotes('');
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

  const activeIssues = issues.filter((i) => !i.resolved);
  const resolvedIssues = issues.filter((i) => i.resolved);

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
        <h1 className="page-title text-gradient-forest">Health &amp; environment</h1>
        <p className="page-subtitle">{plant.name}</p>
      </header>

      <section className="mb-10" aria-labelledby="issues-heading">
        <h2 id="issues-heading" className="section-title flex items-center gap-2">
          <Leaf className="h-5 w-5 text-moss" />
          Health issues
        </h2>

        <form onSubmit={handleAddIssue} className="card mb-6 space-y-4 border-forest/10">
          <p className="font-display text-base font-semibold text-bark">Log an issue</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="issue-type" className="label">
                Issue type
              </label>
              <select
                id="issue-type"
                className="select-field"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as IssueType)}
              >
                {ISSUE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {ISSUE_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="severity" className="label">
                Severity
              </label>
              <select
                id="severity"
                className="select-field"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
              >
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {SEVERITY_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              required
              className="input-field min-h-[88px] resize-y"
              placeholder="What are you seeing?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="treatment" className="label">
              Treatment
            </label>
            <input
              id="treatment"
              className="input-field"
              placeholder="Optional"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="issue-notes" className="label">
              Notes
            </label>
            <textarea
              id="issue-notes"
              className="input-field min-h-[72px] resize-y"
              value={issueNotes}
              onChange={(e) => setIssueNotes(e.target.value)}
            />
          </div>
          <button type="submit" disabled={issueSubmitting} className="btn-primary w-full">
            Add issue
          </button>
        </form>

        {issuesLoading ? (
          <LoadingSpinner />
        ) : issues.length === 0 ? (
          <EmptyState
            icon="💚"
            title="No issues logged"
            description="Track pests, watering stress, or leaf problems to act early."
          />
        ) : (
          <div className="space-y-8">
            {activeIssues.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-danger">
                  Active
                </h3>
                <ul className="space-y-3">
                  {activeIssues.map((issue) => (
                    <li
                      key={issue.id}
                      className="card border-l-4 border-l-danger/70 bg-danger-light/5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-display font-semibold text-bark">
                            {ISSUE_TYPE_LABELS[issue.issue_type]}
                          </p>
                          <p className="mt-1 text-xs text-sage">
                            Started {formatDate(issue.started_at)}
                          </p>
                        </div>
                        <span
                          className={severityBadgeClass(issue.severity, false)}
                        >
                          {SEVERITY_LABELS[issue.severity]}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-bark leading-relaxed">
                        {issue.description}
                      </p>
                      {issue.treatment && (
                        <p className="mt-2 text-sm text-moss">
                          <span className="font-medium">Treatment:</span> {issue.treatment}
                        </p>
                      )}
                      {issue.notes && (
                        <p className="mt-2 text-sm text-bark-light">{issue.notes}</p>
                      )}
                      <div className="divider" />
                      <button
                        type="button"
                        className="btn-secondary flex w-full items-center justify-center gap-2 py-2.5 text-sm"
                        onClick={() => resolveIssue(issue.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 text-forest" />
                        Mark resolved
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resolvedIssues.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-forest">
                  Resolved
                </h3>
                <ul className="space-y-3">
                  {resolvedIssues.map((issue) => (
                    <li
                      key={issue.id}
                      className="card border-l-4 border-l-forest/40 bg-forest/5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-display font-semibold text-bark">
                            {ISSUE_TYPE_LABELS[issue.issue_type]}
                          </p>
                          <p className="mt-1 text-xs text-sage">
                            {formatDate(issue.started_at)}
                            {issue.resolved_at && (
                              <> · Resolved {formatDate(issue.resolved_at)}</>
                            )}
                          </p>
                        </div>
                        <span className={severityBadgeClass(issue.severity, true)}>
                          Resolved · {SEVERITY_LABELS[issue.severity]}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-bark-light leading-relaxed">
                        {issue.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      <section aria-labelledby="env-heading">
        <h2 id="env-heading" className="section-title flex items-center gap-2">
          <ThermometerSun className="h-5 w-5 text-sun" />
          Environment
        </h2>

        <form onSubmit={handleAddEnvNote} className="card mb-6 space-y-4">
          <p className="font-display text-base font-semibold text-bark">Add environment note</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="room" className="label">
                Room
              </label>
              <input
                id="room"
                className="input-field"
                placeholder="e.g. Living room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="light" className="label">
                Light direction
              </label>
              <input
                id="light"
                className="input-field"
                placeholder="e.g. East window"
                value={lightDirection}
                onChange={(e) => setLightDirection(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="temp" className="label">
                Temperature (°F)
              </label>
              <input
                id="temp"
                type="number"
                className="input-field"
                placeholder="—"
                value={temperatureF}
                onChange={(e) => setTemperatureF(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="humidity" className="label">
                Humidity (%)
              </label>
              <input
                id="humidity"
                type="number"
                min={0}
                max={100}
                className="input-field"
                placeholder="—"
                value={humidityPercent}
                onChange={(e) => setHumidityPercent(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="season" className="label">
              Season
            </label>
            <select
              id="season"
              className="select-field"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
            >
              {SEASONS.map((s) => (
                <option key={s.value || 'none'} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="env-notes" className="label">
              Notes
            </label>
            <textarea
              id="env-notes"
              className="input-field min-h-[88px] resize-y"
              placeholder="Drafts, humidifier, grow lights…"
              value={envNotes}
              onChange={(e) => setEnvNotes(e.target.value)}
            />
          </div>
          <button type="submit" disabled={envSubmitting} className="btn-primary w-full">
            Save note
          </button>
        </form>

        {notesLoading ? (
          <LoadingSpinner />
        ) : notes.length === 0 ? (
          <EmptyState
            icon="🌤️"
            title="No environment notes"
            description="Record room, light, and comfort metrics to spot patterns."
          />
        ) : (
          <ul className="space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="card border-l-4 border-l-sun/50">
                <div className="flex flex-wrap items-center gap-2 text-sm text-bark">
                  <span className="font-display font-semibold text-bark">
                    {formatDate(n.recorded_at)}
                  </span>
                  {n.season && (
                    <span className="badge-yellow capitalize">{n.season}</span>
                  )}
                </div>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  {n.room && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden />
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-sage">Room</dt>
                        <dd className="text-bark">{n.room}</dd>
                      </div>
                    </div>
                  )}
                  {n.light_direction && (
                    <div className="flex items-start gap-2">
                      <ThermometerSun className="mt-0.5 h-4 w-4 shrink-0 text-sun" aria-hidden />
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-sage">Light</dt>
                        <dd className="text-bark">{n.light_direction}</dd>
                      </div>
                    </div>
                  )}
                  {n.temperature_f != null && (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-sage">Temp</dt>
                      <dd className="text-bark font-medium">{n.temperature_f}°F</dd>
                    </div>
                  )}
                  {n.humidity_percent != null && (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-sage">Humidity</dt>
                      <dd className="text-bark font-medium">{n.humidity_percent}%</dd>
                    </div>
                  )}
                </dl>
                {n.notes && (
                  <p className="mt-3 border-t border-parchment pt-3 text-sm text-bark-light leading-relaxed">
                    {n.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
