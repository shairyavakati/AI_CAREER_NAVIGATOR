import { useState } from 'react';
import { GraduationCap, Book, School, Award, ChevronRight, Loader2 } from 'lucide-react';
import { apiFetch } from '../api';

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
    { id: 'high-school', label: 'High School', icon: School },
    { id: 'undergraduate', label: 'Undergraduate', icon: Book },
    { id: 'graduate', label: 'Graduate', icon: GraduationCap },
    { id: 'phd', label: 'PhD / Research', icon: Award }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!level || !major || !institution || !year) return;

    setLoading(true);
    const details = { level, major, institution, year };
    
    try {
      // We'll update the profile with education details
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
      // Fallback: just continue
      onComplete(details);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-4xl rounded-[24px] p-12 backdrop-blur-[30px] border border-white/30 shadow-[0_8px_32px_rgba(79,70,229,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.75)' }}>
        <div className="text-center mb-10">
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
            Educational Background
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7280' }}>
            Tell us about your education to help us personalize your learning path
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Level Selection */}
            <div className="col-span-full">
              <label className="block mb-4" style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Highest Level of Education</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {educationLevels.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLevel(item.id)}
                    className={`p-4 rounded-[16px] flex flex-col items-center gap-3 transition-all duration-200 border-2 ${
                      level === item.id 
                        ? 'border-[#4F46E5] bg-[#4F46E5]/10 shadow-[0_4px_12px_rgba(79,70,229,0.1)]' 
                        : 'border-transparent bg-white/50 hover:bg-white/80'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${level === item.id ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: level === item.id ? '#4F46E5' : '#4B5563' }}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Major/Field */}
            <div className="space-y-2">
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Major / Field of Study</label>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-5 py-4 rounded-[16px] bg-white/60 border border-white/40 focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 outline-none transition-all duration-200"
                required
              />
            </div>

            {/* Institution */}
            <div className="space-y-2">
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Institution Name</label>
              <input
                type="text"
                placeholder="e.g. Stanford University"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-5 py-4 rounded-[16px] bg-white/60 border border-white/40 focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 outline-none transition-all duration-200"
                required
              />
            </div>

            {/* Year */}
            <div className="space-y-2">
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Year of Graduation (Expected/Actual)</label>
              <input
                type="number"
                placeholder="e.g. 2025"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-5 py-4 rounded-[16px] bg-white/60 border border-white/40 focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !level || !major || !institution || !year}
            className="w-full py-5 rounded-[20px] flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 700,
              boxShadow: '0 12px 24px rgba(79, 70, 229, 0.25)'
            }}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Continue to Skill Assessment <ChevronRight className="w-5 h-5" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
