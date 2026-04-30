import { useState } from 'react';
import { Mail, Lock, User, Loader2, Zap } from 'lucide-react';
import { signup, login } from '../api';

interface LoginSignupProps {
  onLogin: (userData: any) => void;
}

export function LoginSignup({ onLogin }: LoginSignupProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      let data;
      if (isSignup) {
        data = await signup(name, email, password);
      } else {
        data = await login(email, password);
      }
      onLogin(data.user);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-transparent relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />

      <div
        className="w-full max-w-lg rounded-[32px] p-10 backdrop-blur-[40px] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative z-10"
        style={{ background: 'rgba(15, 23, 42, 0.65)' }}
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_#6366f1]" />
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5" />
            Secure AI Authentication
          </div>
          <h2 className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontSize: '36px', fontWeight: 800 }}>
            {isSignup ? 'Create Identity' : 'Welcome Back'}
          </h2>
          <p className="text-slate-400 mt-2 text-sm">Access your personalized AI career roadmap</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-[16px] text-center bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm animate-shake">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {isSignup && (
            <div className="group">
              <label className="block mb-2 text-slate-300 ml-1" style={{ fontSize: '13px', fontWeight: 600 }}>FULL NAME</label>
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'name' ? 'text-indigo-400' : 'text-slate-500'}`} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-[16px] border border-white/5 outline-none transition-all duration-300 bg-slate-900/50 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
                  placeholder="Enter your name" onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} />
              </div>
            </div>
          )}

          <div className="group">
            <label className="block mb-2 text-slate-300 ml-1" style={{ fontSize: '13px', fontWeight: 600 }}>EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-indigo-400' : 'text-slate-500'}`} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-[16px] border border-white/5 outline-none transition-all duration-300 bg-slate-900/50 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
                placeholder="Enter your email" onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
            </div>
          </div>

          <div className="group">
            <label className="block mb-2 text-slate-300 ml-1" style={{ fontSize: '13px', fontWeight: 600 }}>SECURITY PASSWORD</label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-indigo-400' : 'text-slate-500'}`} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-[16px] border border-white/5 outline-none transition-all duration-300 bg-slate-900/50 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
                placeholder="Enter your password" onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4.5 mt-4 rounded-[18px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(129,140,248,0.4)] disabled:opacity-70 flex items-center justify-center gap-2 group"
            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)', color: 'white', fontSize: '16px', fontWeight: 700 }}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignup ? 'Generate Identity' : 'Authorize Access')}
            {!loading && <Zap className="w-4 h-4 group-hover:animate-pulse" />}
          </button>
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => { setIsSignup(!isSignup); setError(''); }}
            className="text-indigo-400 transition-all duration-200 hover:text-indigo-300 hover:underline decoration-indigo-500/30 underline-offset-4"
            style={{ fontSize: '14px', fontWeight: 600 }}>
            {isSignup ? 'Already registered? Log in here' : "New explorer? Create your identity"}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}} />
    </div>
  );
}
