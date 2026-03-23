'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema } from '@/lib/validators';
import useAuth from '@/hooks/useAuth';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

const GOLD = '#b8976a';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.push(callbackUrl);
  }, [isAuthenticated, callbackUrl, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) router.push(callbackUrl);
  };

  return (
    <div className="min-h-[100dvh] bg-[#080808] flex">
      {/* Left Cinematic Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#050505] border-r border-white/5 relative items-center justify-center overflow-hidden">
        {/* Subtle glowing accent */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ background: GOLD }} />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ background: 'white' }} />
        
        <div className="relative z-10 p-20 flex flex-col h-full justify-between w-full max-w-2xl">
          <Link href="/" className="inline-flex items-center gap-3 w-fit transition-transform hover:opacity-80">
            <Sparkles style={{ width: '28px', height: '28px', color: GOLD }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 600, color: 'white', letterSpacing: '0.04em' }}>Aspar.</span>
          </Link>

          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '4.5rem', color: 'white', lineHeight: 1.1, marginBottom: '2rem', fontWeight: 300 }}>
              The pursuit of <br/><span style={{ color: GOLD, fontStyle: 'italic' }}>excellence.</span>
            </h1>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, maxWidth: '400px', letterSpacing: '0.05em' }}>
              Sign in to access your curated collection, track bespoke orders, and manage your exclusive privileges.
            </p>
          </div>

          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            © {new Date().getFullYear()} Aspar Electronics
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles style={{ width: '20px', height: '20px', color: GOLD }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 600, color: 'white' }}>Aspar</span>
          </Link>
        </div>

        <div className="w-full max-w-[420px] space-y-12 animate-fade-in-up">
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', color: 'white', letterSpacing: '-0.02em', lineHeight: 1 }}>Sign In</h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '1rem', letterSpacing: '0.05em' }}>
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="email" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@domain.com"
                {...register('email')}
                className="rounded-none border-x-0 border-t-0 border-b focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors px-0 bg-transparent placeholder:text-white/20"
                style={{ height: '40px', borderColor: errors.email ? '#ef4444' : 'rgba(255,255,255,0.1)', color: 'white', fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem' }}
              />
              {errors.email && <p className="text-xs text-red-500 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Password</Label>
                <Link href="/forgot-password" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.65rem', color: GOLD, textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'opacity 0.3s' }} className="hover:opacity-70">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className="rounded-none border-x-0 border-t-0 border-b focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors px-0 bg-transparent placeholder:text-white/20"
                  style={{ height: '40px', borderColor: errors.password ? '#ef4444' : 'rgba(255,255,255,0.1)', color: 'white', fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', letterSpacing: showPassword ? 'normal' : '0.2em' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>{errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-none transition-all duration-300 hover:bg-white flex items-center justify-between px-6" 
              disabled={loading}
              style={{ background: GOLD, color: '#000', height: '56px' }}
            >
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </span>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="text-center pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
              First time here?{' '}
              <Link href="/register" style={{ color: 'white', fontWeight: 500, borderBottom: `1px solid ${GOLD}`, paddingBottom: '2px', transition: 'opacity 0.3s' }} className="hover:opacity-70">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
