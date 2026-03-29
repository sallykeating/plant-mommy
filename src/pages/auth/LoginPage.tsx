import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Loader2, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: authError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (authError) {
      setError(authError);
      return;
    }
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="min-h-dvh bg-sage font-body text-bark safe-top safe-bottom lg:flex lg:items-center lg:justify-center">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-12 pb-16 lg:min-h-0">
        <header className="mb-10 text-center">
          <div
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-cream shadow-lg shadow-forest/20"
            aria-hidden
          >
            <Leaf className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <p className="mb-2 font-display text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-forest/70">
            Welcome back
          </p>
          <h1 className="font-display text-[1.75rem] font-bold leading-tight tracking-tight text-forest">
            Plant Mommy
          </h1>
          <p className="mx-auto mt-3 max-w-[280px] text-sm leading-relaxed text-bark-light">
            Sign in to tend your jungle and never miss a watering day.
          </p>
        </header>

        <div className="card mt-auto p-8 sm:mt-0">
          <h2 className="page-title">Sign in</h2>
          <p className="page-subtitle !mb-6">Use the email and password for your account.</p>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {error ? (
              <div
                className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <div>
              <label className="label" htmlFor="login-email">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-bark-light/50"
                  aria-hidden
                />
                <input
                  id="login-email"
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
              <label className="label" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-bark-light/50"
                  aria-hidden
                />
                <input
                  id="login-password"
                  className="input-field pl-11"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="flex justify-end pt-0.5">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-forest hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-primary mt-1 flex w-full items-center justify-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="divider !my-8" />

          <p className="text-center text-sm text-bark-light">
            New here?{' '}
            <Link to="/register" className="font-semibold text-forest hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
