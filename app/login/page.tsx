'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { loginThunk } from '@/store/authSlice';
import { showToast, ToastContainer } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { DEMO_USERS, getDashboardForRoles } from '@/lib/demoAuth';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  mfaCode: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, mfaRequired } = useAppSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(loginThunk(data));
    if (loginThunk.fulfilled.match(result)) {
      if (result.payload.mfaRequired) {
        const token = result.payload.mfaSessionToken || '';
        router.push(`/verify?token=${encodeURIComponent(token)}`);
      } else {
        showToast('Welcome back!', 'success');
        const roles: string[] = result.payload.roles || [];
        router.push(getDashboardForRoles(roles));
      }
    }
  };

  const fillDemo = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-container-low relative overflow-hidden items-center justify-center p-16 flex-col justify-between">
        {/* Homepage Redirect Button */}
        <Link 
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-all group z-20"
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Home
        </Link>

        <div className="relative z-10 w-full">
          <div className="text-2xl font-headline italic text-primary mb-12 tracking-tight">ArogyaNexa</div>
          <h1 className="font-headline text-6xl lg:text-7xl text-on-surface leading-[1.1] max-w-xl">
            Precise care, <span className="text-primary italic">tailored</span> for your lifestyle.
          </h1>
          <p className="mt-8 text-on-surface-variant text-lg max-w-md leading-relaxed">
            Access your curated pharmacy experience. Secure, HIPAA-compliant, and designed for clinical excellence.
          </p>
        </div>
        <div className="relative z-10 mt-auto w-full">
          <div className="flex items-center gap-4 py-6 border-t border-outline-variant/15">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-xs font-bold text-primary">P1</div>
              <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-xs font-bold text-primary">P2</div>
            </div>
            <span className="text-sm font-label uppercase tracking-widest text-on-surface-variant">Trusted by 50k+ patients</span>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-20 bottom-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-tertiary/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Right panel */}
      <main className="flex-1 flex flex-col justify-center items-center px-8 py-16 md:px-12 lg:px-24 bg-surface-container-lowest relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden text-2xl font-headline italic text-primary mb-12 text-center">ArogyaNexa</div>
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-headline text-on-surface mb-2">Welcome Back</h2>
            <p className="text-on-surface-variant font-body">Sign in to your clinical dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[0.7rem] font-label uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
              <input
                {...register('email')}
                id="email"
                type="email"
                placeholder="name@example.com"
                className={cn('w-full px-4 py-4 bg-surface-container-low border-none rounded-md focus:ring-2 focus:ring-primary/10 focus:bg-surface-container-lowest transition-all duration-300 text-on-surface placeholder:text-outline/50 outline-none', errors.email && 'ring-2 ring-error')}
              />
              {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[0.7rem] font-label uppercase tracking-widest text-on-surface-variant" htmlFor="password">Password</label>
                <Link href="/forgot-password" className="text-[0.7rem] font-label uppercase tracking-widest text-primary hover:text-primary-container transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={cn('w-full px-4 py-4 bg-surface-container-low border-none rounded-md focus:ring-2 focus:ring-primary/10 focus:bg-surface-container-lowest transition-all duration-300 text-on-surface placeholder:text-outline/50 outline-none pr-12', errors.password && 'ring-2 ring-error')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
            </div>

            {mfaRequired && (
              <div className="space-y-2">
                <label className="text-[0.7rem] font-label uppercase tracking-widest text-on-surface-variant ml-1">MFA Code</label>
                <input
                  {...register('mfaCode')}
                  type="text"
                  placeholder="6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-4 bg-surface-container-low border-none rounded-md focus:ring-2 focus:ring-primary/10 focus:bg-surface-container-lowest transition-all duration-300 text-on-surface tracking-widest text-center text-lg outline-none"
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-error-container/30 rounded-lg border border-error/20">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-body font-semibold rounded-md shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-10 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-outline-variant/30" />
            <span className="text-[0.65rem] font-label uppercase tracking-[0.2em] text-outline">Or continue with</span>
            <div className="flex-1 h-[1px] bg-outline-variant/30" />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 px-4 border border-outline-variant/30 rounded-md hover:bg-surface-container-low transition-colors duration-200 group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.90 3.16-1.82 4.08-1.16 1.16-2.92 2.4-5.96 2.4-4.82 0-8.68-3.92-8.68-8.74s3.86-8.74 8.68-8.74c2.6 0 4.5 1.02 5.9 2.34l2.3-2.3c-2.1-1.92-4.96-3.12-8.2-3.12-6.72 0-12.24 5.52-12.24 12.24s5.52 12.24 12.24 12.24c3.62 0 6.36-1.2 8.52-3.48 2.22-2.22 2.92-5.36 2.92-7.84 0-.52-.04-1.04-.12-1.52H12.48z" fill="currentColor" />
              </svg>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-3 px-4 border border-outline-variant/30 rounded-md hover:bg-surface-container-low transition-colors duration-200 group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.96.95-2.21 1.72-3.72 1.72-1.47 0-2.32-.89-3.62-.89-1.3 0-2.24.86-3.6.86-1.51 0-2.95-.91-4.04-2.11-2.01-2.24-2.28-5.92-.81-8.22.75-1.16 1.94-1.89 3.24-1.89 1.12 0 1.92.57 2.76.57.81 0 1.4-.55 2.75-.55.51 0 1.17.11 1.76.38-2.61 2.3-1.96 6.33 1.1 7.73-.59 1.62-1.28 2.4-1.82 3.4zm-1.91-14.19c-.04 1.64-1.39 2.94-2.92 2.94-.03-1.55 1.4-2.99 2.92-2.94z" fill="currentColor" />
              </svg>
              <span className="text-sm font-medium">Apple</span>
            </button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-on-surface-variant">
              New to ArogyaNexa?{' '}
              <Link href="/register" className="text-primary font-semibold ml-1 hover:underline underline-offset-4">Create an account</Link>
            </p>
          </div>

          {/* Demo credentials panel */}
          <div className="mt-8 border border-outline-variant/40 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowDemo(!showDemo)}
              className="w-full flex items-center justify-between px-4 py-3 bg-surface-container-low hover:bg-surface-container transition-colors text-sm"
            >
              <span className="font-medium text-on-surface-variant">Demo credentials</span>
              {showDemo ? <ChevronUp size={16} className="text-outline" /> : <ChevronDown size={16} className="text-outline" />}
            </button>
            {showDemo && (
              <div className="divide-y divide-outline-variant/20">
                {DEMO_USERS.map((u) => (
                  <div key={u.role} className="flex items-center justify-between px-4 py-3 hover:bg-surface-container-low/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-on-surface">{u.label}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">{u.email}</p>
                      <p className="text-[10px] text-outline mt-0.5 truncate">{u.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fillDemo(u.email, u.password)}
                      className="ml-3 flex-shrink-0 text-[11px] font-bold text-primary border border-primary/30 px-2.5 py-1 rounded-md hover:bg-primary/5 transition-colors"
                    >
                      Use
                    </button>
                  </div>
                ))}
                <p className="px-4 py-2 text-[10px] text-outline bg-surface-container-low/30">
                  Password for all: <span className="font-mono font-bold">Demo@1234</span>
                </p>
              </div>
            )}
          </div>

          {/* Footer links */}
          <footer className="mt-10 flex justify-center space-x-6">
            <Link href="/privacy" className="text-[0.6rem] font-label uppercase tracking-widest text-outline hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[0.6rem] font-label uppercase tracking-widest text-outline hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/verified" className="text-[0.6rem] font-label uppercase tracking-widest text-outline hover:text-primary transition-colors">HIPAA Standards</Link>
          </footer>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
