import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserRound, Info, CheckCircle2, Database, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { seedDemoData, clearDemoData } from '@/lib/seed';

const APP_VERSION = '0.1.0';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const email = user?.email ?? '';

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    const metaName =
      typeof user.user_metadata?.display_name === 'string'
        ? user.user_metadata.display_name
        : '';

    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) return;
      const fromProfile =
        typeof data?.display_name === 'string' ? data.display_name : '';
      setDisplayName(fromProfile || metaName || '');
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const trimmed = displayName.trim();
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ display_name: trimmed || null })
      .eq('id', user.id);

    if (profileError) {
      setSaving(false);
      setError(profileError.message);
      return;
    }

    const { error: authError } = await supabase.auth.updateUser({
      data: { display_name: trimmed || null },
    });

    if (authError) {
      setSaving(false);
      setError(authError.message);
      return;
    }

    setSaving(false);
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 4000);
  }

  async function handleSignOut() {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="page-container font-body pb-32 lg:max-w-2xl">
      <header className="mb-6">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Your profile and Plant Mommy preferences.
        </p>
      </header>

      {success && (
        <div
          className="mb-5 flex items-center gap-2 rounded-2xl bg-forest/10 border border-forest/20 px-4 py-3 text-forest text-sm font-medium"
          role="status"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden />
          Profile updated successfully.
        </div>
      )}

      <section className="card mb-5">
        <div className="flex items-center gap-2 mb-4">
          <UserRound className="w-5 h-5 text-forest" aria-hidden />
          <h2 className="section-title mb-0">Profile</h2>
        </div>

        <form onSubmit={(e) => void handleProfileSubmit(e)} className="space-y-4">
          <div>
            <label htmlFor="display-name" className="label">
              Display name
            </label>
            <input
              id="display-name"
              type="text"
              className="input-field"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Plant parent name"
              autoComplete="nickname"
            />
          </div>

          <div>
            <span className="label">Email</span>
            <p className="input-field bg-parchment/80 text-bark-light cursor-not-allowed">
              {email || '—'}
            </p>
            <p className="text-xs text-sage mt-1.5">
              Email is managed by your account and cannot be changed here.
            </p>
          </div>

          {error && (
            <p className="text-sm text-danger font-medium" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </form>
      </section>

      <section className="card mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-moss" aria-hidden />
          <h2 className="section-title mb-0">App</h2>
        </div>
        <p className="text-sm text-bark-light leading-relaxed">
          <span className="font-semibold text-bark">Plant Mommy</span>
          {' — '}care for your jungle, one reminder at a time.
        </p>
        <div className="divider my-3" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-sage">Version</span>
          <span className="badge-sage font-mono tabular-nums">{APP_VERSION}</span>
        </div>
      </section>

      <SeedSection userId={user?.id} />

      <button
        type="button"
        className="btn-danger w-full flex items-center justify-center gap-2"
        onClick={() => void handleSignOut()}
      >
        <LogOut className="w-5 h-5" aria-hidden />
        Sign out
      </button>
    </div>
  );
}

function SeedSection({ userId }: { userId: string | undefined }) {
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function handleSeed() {
    if (!userId) return;
    setSeeding(true);
    setResult(null);
    const { error, counts } = await seedDemoData(userId);
    setSeeding(false);
    if (error) {
      setResult({ type: 'error', message: error });
    } else {
      const summary = Object.entries(counts)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${v} ${k.replace(/_/g, ' ')}`)
        .join(', ');
      setResult({ type: 'success', message: `Seeded ${summary}` });
    }
  }

  async function handleClear() {
    if (!userId || !window.confirm('Delete ALL your plants and related data? This cannot be undone.')) return;
    setClearing(true);
    setResult(null);
    const { error } = await clearDemoData(userId);
    setClearing(false);
    if (error) {
      setResult({ type: 'error', message: error });
    } else {
      setResult({ type: 'success', message: 'All plant data cleared.' });
    }
  }

  return (
    <section className="card mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Database className="w-5 h-5 text-moss" aria-hidden />
        <h2 className="section-title mb-0">Demo Data</h2>
      </div>
      <p className="text-sm text-bark-light leading-relaxed mb-4">
        Populate your account with 10 realistic plants and a full year of care history, growth measurements, health issues, and environment notes.
      </p>

      {result && (
        <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-medium ${
          result.type === 'success'
            ? 'bg-forest/10 border border-forest/20 text-forest'
            : 'bg-danger/10 border border-danger/20 text-danger'
        }`} role="status">
          {result.message}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
          onClick={() => void handleSeed()}
          disabled={seeding || clearing}
        >
          <Database className="w-4 h-4" aria-hidden />
          {seeding ? 'Seeding…' : 'Seed Demo Data'}
        </button>
        <button
          type="button"
          className="btn-danger flex-1 flex items-center justify-center gap-2 text-sm"
          onClick={() => void handleClear()}
          disabled={seeding || clearing}
        >
          <Trash2 className="w-4 h-4" aria-hidden />
          {clearing ? 'Clearing…' : 'Clear All Data'}
        </button>
      </div>
    </section>
  );
}
