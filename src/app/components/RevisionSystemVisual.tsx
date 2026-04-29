import { BookOpen, Calendar, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getRevisionStages } from '../api';

export function RevisionSystemVisual() {
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStages(); }, []);

  const loadStages = async () => {
    try {
      const data = await getRevisionStages();
      const iconMap: Record<string, any> = { Learn: BookOpen, 'Day 1': Calendar, 'Day 3': Calendar, 'Day 7': Calendar };
      setStages((data.stages || []).map((s: any) => ({ ...s, icon: iconMap[s.label] || Calendar })));
    } catch {
      setStages([
        { id: 1, label: 'Learn', icon: BookOpen, status: 'completed', color: '#4F46E5', day: 'Today', description: 'Initial learning session to understand concepts' },
        { id: 2, label: 'Day 1', icon: Calendar, status: 'completed', color: '#06B6D4', day: 'Tomorrow', description: 'First revision to reinforce memory' },
        { id: 3, label: 'Day 3', icon: Calendar, status: 'in-progress', color: '#8B5CF6', day: 'In 3 days', description: 'Second revision to strengthen recall' },
        { id: 4, label: 'Day 7', icon: Calendar, status: 'upcoming', color: '#10B981', day: 'In 7 days', description: 'Final revision for long-term retention' }
      ]);
    } finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#4F46E5]" /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-6xl rounded-[20px] p-12 backdrop-blur-[30px] border border-white/30 shadow-[0_8px_32px_rgba(79,70,229,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.7)' }}>
        <div className="text-center mb-16">
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '36px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Spaced Repetition System</h2>
          <p className="text-[#6B7280]" style={{ fontSize: '18px' }}>Science-backed learning schedule for optimal retention</p>
        </div>

        <div className="relative">
          <div className="absolute top-20 left-0 right-0 h-1 hidden lg:block" style={{ background: 'linear-gradient(90deg, #4F46E5 0%, #06B6D4 33%, #8B5CF6 66%, #10B981 100%)', opacity: 0.2 }} />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4 relative">
            {stages.map((stage, idx) => {
              const isCompleted = stage.status === 'completed';
              const isInProgress = stage.status === 'in-progress';
              const Icon = stage.icon || Calendar;

              return (
                <div key={stage.id} className="relative flex flex-col items-center">
                  {idx < stages.length - 1 && <div className="hidden lg:block absolute top-20 -right-8 z-10"><ArrowRight className="w-6 h-6" style={{ color: stage.color, opacity: 0.5 }} /></div>}
                  <div className="w-full rounded-[20px] p-8 transition-all duration-300 hover:-translate-y-2"
                    style={{ background: isInProgress ? `linear-gradient(135deg, ${stage.color}30 0%, ${stage.color}15 100%)` : isCompleted ? `linear-gradient(135deg, ${stage.color}25 0%, ${stage.color}12 100%)` : `linear-gradient(135deg, ${stage.color}15 0%, ${stage.color}08 100%)`, border: isInProgress ? `3px solid ${stage.color}` : `2px solid ${stage.color}30`, boxShadow: isInProgress ? `0 12px 36px ${stage.color}30` : `0 8px 24px ${stage.color}20` }}>
                    <div className="relative mx-auto w-32 h-32 mb-6">
                      <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${stage.color} 0%, ${stage.color}dd 100%)`, boxShadow: `0 8px 32px ${stage.color}50` }}>
                        <Icon className="w-14 h-14 text-white" />
                      </div>
                      {isCompleted && <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.5)' }}><CheckCircle2 className="w-7 h-7 text-white" /></div>}
                      {isInProgress && <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full animate-pulse" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', boxShadow: '0 4px 16px rgba(245, 158, 11, 0.6)' }} />}
                    </div>
                    <h3 className="text-center mb-2" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '24px', fontWeight: 700, color: stage.color }}>{stage.label}</h3>
                    <p className="text-center" style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>{stage.day}</p>
                    <div className="mt-4 flex justify-center">
                      <div className="px-4 py-2 rounded-full" style={{ background: `${stage.color}20`, border: `1px solid ${stage.color}40` }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: stage.color }}>{isCompleted ? 'Completed ✓' : isInProgress ? 'Active →' : 'Upcoming'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center max-w-xs"><p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>{stage.description}</p></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 rounded-[18px] p-8 backdrop-blur-[20px] border border-white/30" style={{ background: 'rgba(255, 255, 255, 0.8)' }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', boxShadow: '0 4px 16px rgba(79, 70, 229, 0.3)' }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>How It Works</h4>
              <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.7' }}>Our AI-powered spaced repetition system schedules reviews at scientifically proven intervals. Studies show this method improves long-term retention by up to <span style={{ fontWeight: 600, color: '#4F46E5' }}>200%</span> compared to traditional study methods.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
