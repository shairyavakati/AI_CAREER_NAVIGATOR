import { Clock, Loader2, Zap } from 'lucide-react';
import { useState } from 'react';
import { updateTimeCommitment } from '../api';

interface TimeSelectionProps {
  onTimeSelect: (time: string) => void;
}

export function TimeSelection({ onTimeSelect }: TimeSelectionProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const timeOptions = [
    { value: '30min', label: 'Tactical Sync', desc: '30m - Rapid daily alignment', minutes: 30 },
    { value: '1hour', label: 'Core Sequence', desc: '1h - Balanced cognitive growth', minutes: 60 },
    { value: '2hours', label: 'Deep Immersion', desc: '2h - Intensive neural rewiring', minutes: 120 }
  ];

  const handleSelect = async (option: typeof timeOptions[0]) => {
    setSelectedTime(option.value);
    setLoading(true);
    try {
      await updateTimeCommitment(option.minutes);
      setTimeout(() => onTimeSelect(option.value), 300);
    } catch (err) {
      console.error('Failed to set time:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-transparent">
      <div className="w-full max-w-3xl rounded-[40px] p-12 backdrop-blur-[40px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.6)] relative overflow-hidden" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center mb-12 relative z-10">
           <div className="w-20 h-20 rounded-[24px] mx-auto mb-8 flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', boxShadow: '0 0 40px rgba(6, 182, 212, 0.4)' }}>
            {loading ? <Loader2 className="w-10 h-10 text-white animate-spin" /> : <Clock className="w-10 h-10 text-white" />}
          </div>
          <h2 className="bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>Synchronization Cycle</h2>
          <p className="text-slate-400 font-medium" style={{ fontSize: '18px' }}>Define your daily temporal commitment for neural optimization.</p>
        </div>

        <div className="space-y-5 mt-10 relative z-10">
          {timeOptions.map((option) => {
            const isSelected = selectedTime === option.value;
            return (
              <div key={option.value} onClick={() => !loading && handleSelect(option)}
                className="rounded-[24px] p-7 cursor-pointer transition-all duration-300 group relative overflow-hidden"
                style={{
                  background: isSelected ? 'rgba(6, 182, 212, 0.1)' : 'rgba(30, 41, 59, 0.4)',
                  border: isSelected ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: isSelected ? '0 0 30px rgba(6, 182, 212, 0.1)' : 'none',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                }}>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-colors ${isSelected ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}`}>
                       <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '22px', fontWeight: 700, color: isSelected ? '#F8FAFC' : '#CBD5E1' }}>{option.label}</h3>
                      <p className="text-slate-500 font-medium group-hover:text-slate-400 transition-colors" style={{ fontSize: '14px' }}>{option.desc}</p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                    style={{ borderColor: isSelected ? '#06B6D4' : 'rgba(255,255,255,0.1)', background: isSelected ? '#06B6D4' : 'transparent' }}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_#fff]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
