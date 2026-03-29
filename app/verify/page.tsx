'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setAuth } from '@/store/authSlice';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function VerifyPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <VerifyContent />
    </Suspense>
  );
}

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(114); // 1:54
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const mfaSessionToken = searchParams.get('token') || '';

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleInput = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { showToast('Please enter all 6 digits', 'warning' as Parameters<typeof showToast>[1]); return; }
    setLoading(true);
    try {
      const { data } = await authApi.mfaVerify(mfaSessionToken, code);
      dispatch(setAuth(data.data));
      showToast('Verification successful!', 'success');
      router.push('/');
    } catch {
      showToast('Invalid code. Please try again.', 'error');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="font-headline italic text-2xl text-primary">ArogyaNexa</Link>
        <div className="flex items-center gap-6">
          <span className="material-symbols-outlined text-on-surface-variant">lock</span>
          <span className="material-symbols-outlined text-on-surface-variant">help_outline</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-primary-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-low text-primary">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary tracking-tight">Secure Verification</h1>
                <p className="text-on-surface-variant max-w-sm mx-auto leading-relaxed text-sm">
                  A 6-digit verification code has been sent to your registered contact method. Please enter it below to continue.
                </p>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-8 mt-4">
                <div className="flex justify-between gap-2 md:gap-3" onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleInput(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-semibold border-none bg-surface-container-high rounded-lg text-primary focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
                      aria-label={`Digit ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={loading || otp.join('').length !== 6}
                    className="btn-primary w-full justify-center py-4 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : 'VERIFY & CONTINUE'}
                  </button>

                  <div className="flex flex-col items-center gap-2">
                    <p className="section-label text-[10px]">
                      Resend code in <span className="text-primary font-bold">{formatTime(countdown)}</span>
                    </p>
                    <button
                      type="button"
                      disabled={countdown > 0}
                      onClick={() => setCountdown(114)}
                      className="text-sm font-medium text-primary hover:underline underline-offset-4 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      I didn&apos;t receive a code
                    </button>
                  </div>
                </div>
              </form>

              {/* Trust badges */}
              <div className="pt-6 w-full border-t border-outline-variant/15 flex items-center justify-center gap-8">
                <div className="flex items-center gap-2 opacity-60">
                  <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
                  <span className="section-label text-[10px]">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2 opacity-60">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>encrypted</span>
                  <span className="section-label text-[10px]">AES-256 Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low w-full py-8 px-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant/10">
        <div className="font-headline italic text-sm font-bold text-primary">ArogyaNexa</div>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { label: 'Privacy Policy', href: '/' },
            { label: 'Terms of Service', href: '/' },
            { label: 'Security Standards', href: '/' },
            { label: 'Contact Support', href: '/ai-assistant' },
          ].map(link => (
            <a key={link.label} href={link.href} className="section-label text-[10px] hover:text-primary transition-colors opacity-80 hover:opacity-100">{link.label}</a>
          ))}
        </div>
        <div className="section-label text-[10px] opacity-60">© 2024 ArogyaNexa. HIPAA Compliant &amp; Secure.</div>
      </footer>

      <ToastContainer />
    </div>
  );
}
