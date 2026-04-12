'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { registerThunk } from '@/store/authSlice';
import { showToast, ToastContainer } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const schema = z.object({
  firstName: z.string().min(2, 'Min 2 characters').max(100).regex(/^[a-zA-Z\s]+$/, 'Letters only'),
  lastName: z.string().min(2, 'Min 2 characters').max(100).regex(/^[a-zA-Z\s]+$/, 'Letters only'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Format: +91XXXXXXXXXX').optional().or(z.literal('')),
  password: z
    .string()
    .min(8, 'Min 8 characters')
    .regex(/[A-Z]/, 'Must have uppercase')
    .regex(/[a-z]/, 'Must have lowercase')
    .regex(/[0-9]/, 'Must have a digit')
    .regex(/[^A-Za-z0-9]/, 'Must have a special character'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

const inputCls = 'w-full bg-surface-container-high border-none rounded-md px-4 py-3.5 text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all outline-none';
const labelCls = 'text-[11px] font-label uppercase tracking-wider text-on-surface-variant mb-1.5 block px-1';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch('password', '');
  const passwordChecks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Special character', ok: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = async (data: FormData) => {
    const { confirmPassword, ...payload } = data;
    void confirmPassword;
    const result = await dispatch(registerThunk({ ...payload, phone: payload.phone || undefined }));
    if (registerThunk.fulfilled.match(result)) {
      setSuccess(true);
      showToast('Account created! Please verify your email.', 'success');
      setTimeout(() => router.push('/login'), 3000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="text-center max-w-md space-y-4">
          <div className="w-20 h-20 rounded-full bg-tertiary-fixed/30 flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-tertiary" />
          </div>
          <h2 className="font-headline text-3xl text-primary">Account Created!</h2>
          <p className="text-on-surface-variant">Please check your email to verify your account. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row items-stretch overflow-hidden">
      {/* Left panel */}
      <section className="hidden md:flex md:w-5/12 lg:w-4/12 bg-primary relative p-12 flex-col justify-between text-on-primary">
        {/* Homepage Redirect Button */}
        <Link 
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 text-sm font-medium text-on-primary/80 hover:text-on-primary hover:bg-on-primary/10 rounded-lg transition-all group z-20"
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Home
        </Link>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <span className="text-3xl font-headline italic tracking-tight">ArogyaNexa</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-headline font-light leading-tight mb-8">
            Elevating the <br /><span className="italic">Modern Apothecary</span>
          </h1>
          <div className="space-y-10 mt-12">
            {[
              { icon: 'verified_user', title: 'Secure Prescriptions', desc: 'Encrypted data handling ensuring your clinical history remains strictly private and HIPAA compliant.' },
              { icon: 'medication', title: 'Pharmacist Access', desc: 'Direct concierge communication with certified clinical experts for medication counseling.' },
              { icon: 'cardiology', title: 'Wellness Rewards', desc: 'A curative loyalty program designed to incentivize long-term preventative health habits.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-6">
                <div className="flex-none w-10 h-10 rounded-full bg-on-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline text-xl mb-1">{item.title}</h3>
                  <p className="text-on-primary/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-container blur-3xl" />
        </div>
        <div className="relative z-10 pt-12 border-t border-on-primary/10">
          <p className="text-xs uppercase tracking-[0.2em] font-label text-on-primary/50">Trusted by 10,000+ Care Seekers</p>
        </div>
      </section>

      {/* Right panel */}
      <section className="flex-1 bg-surface-container-low flex items-center justify-center p-6 md:p-12 lg:p-24 overflow-y-auto relative">
        <div className="w-full max-w-lg">
          {/* Mobile Branding */}
          <div className="md:hidden mb-8 text-center">
            <span className="text-2xl font-headline italic text-primary">ArogyaNexa</span>
          </div>

          <div className="bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-sm">
            <header className="mb-10 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] font-label text-secondary font-semibold mb-2 block">New Patient Registration</span>
              <h2 className="text-3xl font-headline text-on-surface">Create your profile</h2>
              <p className="text-on-surface-variant text-sm mt-2">Join ArogyaNexa to manage your wellness journey.</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Full Name row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <label className={labelCls} htmlFor="firstName">First Name</label>
                    <input {...register('firstName')} id="firstName" placeholder="John" className={cn(inputCls, errors.firstName && 'ring-2 ring-error')} />
                    {errors.firstName && <p className="text-xs text-error mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div className="relative group">
                    <label className={labelCls} htmlFor="lastName">Last Name</label>
                    <input {...register('lastName')} id="lastName" placeholder="Doe" className={cn(inputCls, errors.lastName && 'ring-2 ring-error')} />
                    {errors.lastName && <p className="text-xs text-error mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="relative group">
                  <label className={labelCls} htmlFor="email">Email Address</label>
                  <input {...register('email')} id="email" type="email" placeholder="you@example.com" className={cn(inputCls, errors.email && 'ring-2 ring-error')} />
                  {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
                </div>

                <div className="relative group">
                  <label className={labelCls} htmlFor="phone">Phone Number <span className="text-outline normal-case">(optional)</span></label>
                  <input {...register('phone')} id="phone" placeholder="+91XXXXXXXXXX" className={cn(inputCls, errors.phone && 'ring-2 ring-error')} />
                  {errors.phone && <p className="text-xs text-error mt-1">{errors.phone.message}</p>}
                </div>

                <div className="relative group">
                  <label className={labelCls} htmlFor="password">Password</label>
                  <div className="relative">
                    <input {...register('password')} id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className={cn(inputCls, 'pr-12', errors.password && 'ring-2 ring-error')} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {passwordChecks.map((c) => (
                        <div key={c.label} className={cn('flex items-center gap-1.5 text-xs', c.ok ? 'text-tertiary' : 'text-outline')}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', c.ok ? 'bg-tertiary' : 'bg-outline-variant')} />
                          {c.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <label className={labelCls} htmlFor="confirmPassword">Confirm Password</label>
                  <input {...register('confirmPassword')} id="confirmPassword" type="password" placeholder="••••••••" className={cn(inputCls, errors.confirmPassword && 'ring-2 ring-error')} />
                  {errors.confirmPassword && <p className="text-xs text-error mt-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              {/* Legal Agreement */}
              <div className="flex items-start gap-3 pt-2">
                <div className="flex items-center h-5">
                  <input type="checkbox" id="terms" required className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary" />
                </div>
                <div className="text-xs text-on-surface-variant leading-relaxed">
                  <label className="select-none cursor-pointer" htmlFor="terms">
                    I agree to the <Link href="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link> &amp; <Link href="/privacy" className="text-primary hover:underline font-medium">HIPAA Privacy Policy</Link>. I understand my data will be handled with clinical-grade security.
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-error-container/30 rounded-lg border border-error/20">
                  <p className="text-sm text-error">{error}</p>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-medium py-4 px-6 rounded-md shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <footer className="mt-8 pt-8 border-t border-surface-container text-center">
              <p className="text-sm text-on-surface-variant">
                Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Log in</Link>
              </p>
            </footer>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-label text-outline uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              AES-256 Encrypted
            </div>
            <div className="flex items-center gap-2 text-[10px] font-label text-outline uppercase tracking-widest">
              <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              HIPAA Compliant
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </main>
  );
}
