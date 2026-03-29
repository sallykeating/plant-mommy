import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Leaf, Loader2, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    const { error: authError } = await resetPassword(email.trim());
    setSubmitting(false);
    if (authError) {
      setError(authError);
      return;
    }
    setSuccess(true);
  }

  return (
    <div className="min-h-dvh bg-sage font-body text-bark safe-top safe-bottom lg:flex lg:items-center lg:justify-center">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-12 pb-16 lg:min-h-0">
        <Link
          to="/login"
          className="btn-ghost -ml-2 mb-8 inline-flex w-fit items-center gap-2 px-2 text-sm text-moss hover:text-forest"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back to sign in
        </Link>

        <header className="mb-10 text-center">
          <div
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-cream shadow-lg shadow-forest/20"
            aria-hidden
          >
            <Leaf className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <p className="mb-2 font-display text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-forest/70">
            Gentle reset
          </p>
          <h1 className="font-display text-[1.75rem] font-bold leading-tight tracking-tight text-forest">
            Plant Mommy
          </h1>
          <p className="mx-auto mt-3 max-w-[280px] text-sm leading-relaxed text-bark-light">
            We will email you a link to choose a new password and get back to your plants.
          </p>
        </header>

        <div className="card mt-auto p-8 sm:mt-0">
          <h2 className="page-title">Forgot password</h2>
          <p className="page-subtitle !mb-6">Enter the email tied to your account.</p>

          {success ? (
            <div
              className="rounded-xl bg-sage/20 px-4 py-5 text-sm text-bark"
              role="status"
            >
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sage" aria-hidden />
                <div>
                  <p className="font-display font-semibold text-forest">Check your inbox</p>
                  <p className="mt-1.5 leading-relaxed text-bark-light">
                    If an account exists for <span className="font-medium text-bark">{email}</span>, you will receive
                    reset instructions shortly.
                  </p>
                </div>
              </div>
            </div>
          ) : (
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
                <label className="label" htmlFor="forgot-email">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-bark-light/50"
                    aria-hidden
                  />
                  <input
                    id="forgot-email"
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

              <button
                type="submit"
                className="btn-primary mt-1 flex w-full items-center justify-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    Sending link…
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>
          )}

          <div className="divider !my-8" />

          <p className="text-center text-sm text-bark-light">
            Remembered it?{' '}
            <Link to="/login" className="font-semibold text-forest hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
