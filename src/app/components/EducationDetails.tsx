import { useState } from 'react';
import { GraduationCap, Book, School, Award, ChevronRight, Loader2, Zap } from 'lucide-react';

interface EducationDetailsProps {
  onComplete: (details: any) => void;
}

export function EducationDetails({ onComplete }: EducationDetailsProps) {
  const [level, setLevel] = useState('');
  const [major, setMajor] = useState('');
  const [institution, setInstitution] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);

  const educationLevels = [
    { id: 'high-school', label: 'Primary Node', icon: School },
    { id: 'undergraduate', label: 'Core Degree', icon: Book },
    { id: 'graduate', label: 'Advanced Core', icon: GraduationCap },
    { id: 'phd', label: 'Neural Research', icon: Award }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!level || !major || !institution || !year) return;

    setLoading(true);
    const details = { level, major, institution, year };
    
    try {
      await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ education_details: details })
      });
      onComplete(details);
    } catch (err) {
      console.error('Failed to save education details:', err);
      onComplete(details);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-transparent">
      <div className="w-full max-w-4xl rounded-[40px] p-12 backdrop-blur-[40px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.6)] relative overflow-hidden" style={{ background: 'rgba(15, 23, 42, 0.65)' }}>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-4">
             <Zap className="w-3 h-3" />
             Cognitive Origin
          </div>
          <h2 className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
            Academic Foundation
          </h2>
          <p className="text-slate-400 font-medium" style={{ fontSize: '16px' }}>
            Synchronize your academic history to optimize the AI curriculum generation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-full">
              <label className="block mb-4 text-slate-300 font-bold uppercase tracking-wider" style={{ fontSize: '11px' }}>Cognitive Hierarchy</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {educationLevels.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLevel(item.id)}
                    className={`p-5 rounded-[24px] flex flex-col items-center gap-4 transition-all duration-300 border relative overflow-hidden group ${
                      level === item.id 
                        ? 'border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_30px_rgba(129,140,248,0.2)]' 
                        : 'border-white/5 bg-slate-900/40 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center relative z-10 transition-transform group-hover:scale-110 ${level === item.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className={`relative z-10 text-xs font-bold transition-colors ${level === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-slate-400 font-bold uppercase tracking-wider" style={{ fontSize: '11px' }}>Domain of Intelligence</label>
              <input
                type="text"
                placeholder="e.g. Cognitive Computing"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-6 py-4.5 rounded-[20px] bg-slate-900/50 border border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-slate-400 font-bold uppercase tracking-wider" style={{ fontSize: '11px' }}>Academic Hub</label>
              <input
                type="text"
                placeholder="e.g. Neural Institute"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-6 py-4.5 rounded-[20px] bg-slate-900/50 border border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-slate-400 font-bold uppercase tracking-wider" style={{ fontSize: '11px' }}>Synchronization Cycle</label>
              <input
                type="number"
                placeholder="e.g. 2026"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-6 py-4.5 rounded-[20px] bg-slate-900/50 border border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !level || !major || !institution || !year}
            className="w-full py-5 rounded-[24px] flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-2xl group"
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 800,
            }}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Continue to Neural Assessment <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
