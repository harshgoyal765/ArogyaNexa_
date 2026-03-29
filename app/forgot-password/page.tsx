'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api/auth';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const schema = z.object({ email: z.string().email('Enter a valid email') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setSent(true);
    } catch {
      showToast('Failed to send reset email. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-surface flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-headline italic text-primary">ArogyaNexa</Link>
        <div className="flex items-center gap-6">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">lock</span>
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">help_outline</span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Editorial Content */}
          <div className="hidden lg:block space-y-8 pr-12">
            <div className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-[0.7rem] font-bold tracking-[0.1em] uppercase rounded-sm">
              Security Protocol
            </div>
            <h2 className="font-headline text-5xl text-primary leading-tight">
              Your data integrity is <br /><span className="italic">our clinical priority.</span>
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
              Restoring access to your clinical dashboard requires a verified secure link. Please provide the email associated with your account.
            </p>
            <div className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">verified_user</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">Verification Systems Active</p>
                <p className="text-xs text-on-surface-variant">HIPAA Compliant Session</p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_-12px_rgba(0,65,130,0.06)] p-8 md:p-12 relative overflow-hidden border border-outline-variant/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative space-y-8">
                {sent ? (
                  <div className="text-center space-y-4 py-4">
                    <div className="w-16 h-16 rounded-full bg-tertiary-fixed/30 flex items-center justify-center mx-auto">
                      <span className="material-symbols-outlined text-tertiary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <h2 className="font-headline text-2xl text-primary">Check your email</h2>
                    <p className="text-on-surface-variant text-sm">We&apos;ve sent a password reset link to your email address.</p>
                    <Link href="/login" className="btn-primary inline-flex mt-4">Back to Sign In</Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <h1 className="font-headline text-3xl text-on-surface tracking-tight">Reset Your Password</h1>
                      <p className="text-on-surface-variant text-sm leading-relaxed">
                        Please enter your registered email address below. We will transmit a secure authentication link to your inbox.
                      </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="block text-[0.7rem] font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="email">
                          Email Address
                        </label>
                        <div className="relative group">
                          <input
                            {...register('email')}
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className={cn('w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary text-on-surface transition-all placeholder:text-outline-variant/50 outline-none', errors.email && 'border-error')}
                          />
                          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-focus-within:w-full transition-all duration-300" />
                        </div>
                        {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
                      </div>
                      <div className="pt-4 space-y-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-medium rounded-md shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>Send Reset Link</span>
                              <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </>
                          )}
                        </button>
                        <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors py-2 group">
                          <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">keyboard_backspace</span>
                          <span>Back to Login</span>
                        </Link>
                      </div>
                    </form>
                    <div className="pt-8 mt-8 border-t border-surface-container-low flex items-start gap-3">
                      <span className="material-symbols-outlined text-tertiary-container text-lg">verified_user</span>
                      <p className="text-[0.65rem] leading-tight text-on-surface-variant italic">
                        For security reasons, if an account with this email exists, a reset link will be dispatched shortly. If you do not receive an email, please contact support.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant/15 mt-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <span className="text-sm font-bold text-primary">AROGYANEXA</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="font-sans text-xs tracking-wider uppercase text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100">Privacy Policy</Link>
            <Link href="/terms" className="font-sans text-xs tracking-wider uppercase text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100">Terms of Service</Link>
            <Link href="/verified" className="font-sans text-xs tracking-wider uppercase text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100">Security Standards</Link>
          </div>
        </div>
        <p className="font-sans text-xs tracking-wider uppercase text-on-surface-variant opacity-80">
          © 2024 ArogyaNexa. HIPAA Compliant &amp; Secure.
        </p>
      </footer>
      <ToastContainer />
    </div>
  );
}
