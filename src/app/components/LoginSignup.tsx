import { useState } from 'react';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center px-6">
      <div
        className="w-full max-w-md rounded-[20px] p-10 backdrop-blur-[30px] border border-white/30 shadow-[0_8px_32px_rgba(79,70,229,0.12)]"
        style={{ background: 'rgba(255, 255, 255, 0.75)' }}
      >
        <h2 className="text-center mb-8" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '30px', fontWeight: 700, color: '#111827' }}>
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>

        {error && (
          <div className="mb-6 p-3 rounded-[12px] text-center" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <div className="space-y-6">
          {isSignup && (
            <div>
              <label className="block mb-2 text-[#111827]" style={{ fontSize: '14px', fontWeight: 500 }}>Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-[12px] border-none outline-none transition-all duration-200"
                  style={{ background: focusedField === 'name' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', boxShadow: focusedField === 'name' ? 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.9), 0 0 0 3px rgba(79,70,229,0.1)' : 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.9)' }}
                  placeholder="Enter your name" onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} />
              </div>
            </div>
          )}

          <div>
            <label className="block mb-2 text-[#111827]" style={{ fontSize: '14px', fontWeight: 500 }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-[12px] border-none outline-none transition-all duration-200"
                style={{ background: focusedField === 'email' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', boxShadow: focusedField === 'email' ? 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.9), 0 0 0 3px rgba(79,70,229,0.1)' : 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.9)' }}
                placeholder="Enter your email" onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-[#111827]" style={{ fontSize: '14px', fontWeight: 500 }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-[12px] border-none outline-none transition-all duration-200"
                style={{ background: focusedField === 'password' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', boxShadow: focusedField === 'password' ? 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.9), 0 0 0 3px rgba(79,70,229,0.1)' : 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.9)' }}
                placeholder="Enter your password" onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 rounded-[16px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(79,70,229,0.3)] disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', color: 'white', fontSize: '16px', fontWeight: 600, boxShadow: '0 8px 24px rgba(79, 70, 229, 0.25)' }}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (isSignup ? 'Sign Up' : 'Log In')}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => { setIsSignup(!isSignup); setError(''); }}
            className="text-[#4F46E5] transition-colors duration-200 hover:text-[#6366F1]"
            style={{ fontSize: '14px', fontWeight: 500 }}>
            {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
