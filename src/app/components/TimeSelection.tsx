import { Clock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { updateTimeCommitment } from '../api';

interface TimeSelectionProps {
  onTimeSelect: (time: string) => void;
}

export function TimeSelection({ onTimeSelect }: TimeSelectionProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const timeOptions = [
    { value: '30min', label: '30 Minutes', desc: 'Quick daily practice', minutes: 30 },
    { value: '1hour', label: '1 Hour', desc: 'Balanced learning', minutes: 60 },
    { value: '2hours', label: '2 Hours', desc: 'Deep dive sessions', minutes: 120 }
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
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-3xl rounded-[20px] p-12 backdrop-blur-[30px] border border-white/30 shadow-[0_8px_32px_rgba(79,70,229,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.7)' }}>
        <div className="text-center mb-4">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)' }}>
            {loading ? <Loader2 className="w-10 h-10 text-white animate-spin" /> : <Clock className="w-10 h-10 text-white" />}
          </div>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Daily Study Time</h2>
          <p className="text-[#6B7280]" style={{ fontSize: '16px' }}>How much time can you dedicate each day?</p>
        </div>

        <div className="space-y-4 mt-12">
          {timeOptions.map((option) => {
            const isSelected = selectedTime === option.value;
            return (
              <div key={option.value} onClick={() => !loading && handleSelect(option)}
                className="rounded-[16px] p-6 cursor-pointer transition-all duration-300"
                style={{
                  background: isSelected ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                  boxShadow: isSelected ? 'inset 3px 3px 8px rgba(0,0,0,0.08), inset -3px -3px 8px rgba(255,255,255,1), 0 0 0 3px rgba(79,70,229,0.3)' : 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.9)',
                  border: isSelected ? '2px solid #4F46E5' : '2px solid transparent'
                }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{option.label}</h3>
                    <p style={{ fontSize: '14px', color: '#6B7280' }}>{option.desc}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                    style={{ borderColor: isSelected ? '#4F46E5' : '#D1D5DB', background: isSelected ? '#4F46E5' : 'transparent' }}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-white" />}
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
