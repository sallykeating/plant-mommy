import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Loader2, Lock, Mail, UserRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldError(null);

    if (password.length < 6) {
      setFieldError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setFieldError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const { error: authError } = await signUp(email.trim(), password, displayName.trim());
    setSubmitting(false);
    if (authError) {
      setError(authError);
      return;
    }
    navigate('/dashboard', { replace: true });
  }

  const inlineMessage = fieldError ?? error;

  return (
    <div className="min-h-dvh bg-sage font-body text-bark safe-top safe-bottom">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-12 pb-16">
        <header className="mb-10 text-center">
          <div
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-cream shadow-lg shadow-forest/20"
            aria-hidden
          >
            <Leaf className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <p className="mb-2 font-display text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-forest/70">
            Join the greenhouse
          </p>
          <h1 className="font-display text-[1.75rem] font-bold leading-tight tracking-tight text-forest">
            Plant Mommy
          </h1>
          <p className="mx-auto mt-3 max-w-[280px] text-sm leading-relaxed text-bark-light">
            Create your profile and start tracking every leaf with love.
          </p>
        </header>

        <div className="card mt-auto p-8 sm:mt-0">
          <h2 className="page-title">Create account</h2>
          <p className="page-subtitle !mb-6">A few details and you are ready to grow.</p>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {inlineMessage ? (
              <div
                className={`rounded-xl px-4 py-3 text-sm ${
                  fieldError
                    ? 'bg-terracotta/15 text-bark'
                    : 'bg-danger/10 text-danger'
                }`}
                role="alert"
              >
                {inlineMessage}
              </div>
            ) : null}

            <div>
              <label className="label" htmlFor="register-name">
                Display name
              </label>
              <div className="relative">
                <UserRound
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-bark-light/50"
                  aria-hidden
                />
                <input
                  id="register-name"
                  className="input-field pl-11"
                  type="text"
                  autoComplete="name"
                  placeholder="Plant parent name"
                  value={displayName}
                  onChange={(ev) => setDisplayName(ev.target.value)}
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="register-email">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-bark-light/50"
                  aria-hidden
                />
                <input
                  id="register-email"
                  className="input-field pl-11"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="register-password">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-bark-light/50"
                  aria-hidden
                />
                <input
                  id="register-password"
                  className="input-field pl-11"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  required
                  disabled={submitting}
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="register-confirm">
                Confirm password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-bark-light/50"
                  aria-hidden
                />
                <input
                  id="register-confirm"
                  className="input-field pl-11"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(ev) => setConfirmPassword(ev.target.value)}
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary mt-1 flex w-full items-center justify-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="divider !my-8" />

          <p className="text-center text-sm text-bark-light">
            Already growing with us?{' '}
            <Link to="/login" className="font-semibold text-forest hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
