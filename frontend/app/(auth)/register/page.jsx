'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema } from '@/lib/validators';
import useAuth from '@/hooks/useAuth';

const GOLD = '#b8976a';

export default function RegisterPage() {
  const { register: registerUser, loading } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const password = watch('password', '');
  const checks = [
    { label: '8+ Characters', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
  ];

  const onSubmit = async (data) => {
    const { confirmPassword, ...registerData } = data;
    const result = await registerUser(registerData);
    if (result.success) router.push('/login');
  };

  return (
    <div className="min-h-[100dvh] bg-[#080808] flex flex-row-reverse">
      {/* Right Cinematic Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#050505] border-l border-white/5 relative items-center justify-center overflow-hidden">
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] opacity-10 pointer-events-none" style={{ background: GOLD }} />
        
        <div className="relative z-10 p-20 flex flex-col h-full justify-between w-full max-w-2xl text-right items-end">
          <Link href="/" className="inline-flex items-center gap-3 w-fit transition-transform hover:opacity-80">
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 600, color: 'white', letterSpacing: '0.04em' }}>Aspar.</span>
            <Sparkles style={{ width: '28px', height: '28px', color: GOLD }} />
          </Link>

          <div className="text-right">
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '4.5rem', color: 'white', lineHeight: 1.1, marginBottom: '2rem', fontWeight: 300 }}>
              Join the <br/><span style={{ color: GOLD, fontStyle: 'italic' }}>collection.</span>
            </h1>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, maxWidth: '400px', letterSpacing: '0.05em', marginLeft: 'auto' }}>
              Create an exclusive account to save preferences, access priority support, and track bespoke orders.
            </p>
          </div>

          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Elevating Living Standards
          </div>
        </div>
      </div>

      {/* Left Register Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute top-8 right-8 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2">
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 600, color: 'white' }}>Aspar</span>
            <Sparkles style={{ width: '20px', height: '20px', color: GOLD }} />
          </Link>
        </div>

        <div className="w-full max-w-[420px] space-y-10 animate-fade-in-up">
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', color: 'white', letterSpacing: '-0.02em', lineHeight: 1 }}>Sign Up</h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '1rem', letterSpacing: '0.05em' }}>
              Create your exclusive profile
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register('name')}
                className="rounded-none border-x-0 border-t-0 border-b focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors px-0 bg-transparent placeholder:text-white/20"
                style={{ height: '40px', borderColor: errors.name ? '#ef4444' : 'rgba(255,255,255,0.1)', color: 'white', fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem' }}
              />
              {errors.name && <p className="text-xs text-red-500 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>{errors.name.message}</p>}
            </div>

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
              <Label htmlFor="password" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Security Key</Label>
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
              {password && (
                <div className="flex flex-wrap gap-4 mt-3">
                  {checks.map((c) => (
                    <span key={c.label} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }} className={`flex items-center gap-1.5 transition-colors duration-300 ${c.pass ? 'text-[#b8976a]' : 'text-white/20'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${c.pass ? 'bg-[#b8976a]' : 'bg-white/10'}`} />
                      {c.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Confirm Key</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className="rounded-none border-x-0 border-t-0 border-b focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors px-0 bg-transparent placeholder:text-white/20"
                style={{ height: '40px', borderColor: errors.confirmPassword ? '#ef4444' : 'rgba(255,255,255,0.1)', color: 'white', fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', letterSpacing: '0.2em' }}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>{errors.confirmPassword.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-none transition-all duration-300 hover:bg-white flex items-center justify-between px-6 mt-4" 
              disabled={loading}
              style={{ background: GOLD, color: '#000', height: '56px' }}
            >
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                {loading ? 'Processing...' : 'Request Access'}
              </span>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="text-center pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
              Already a member?{' '}
              <Link href="/login" style={{ color: 'white', fontWeight: 500, borderBottom: `1px solid ${GOLD}`, paddingBottom: '2px', transition: 'opacity 0.3s' }} className="hover:opacity-70">
                Sign in securely
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
