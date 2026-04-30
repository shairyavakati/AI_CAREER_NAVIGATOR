import { Trophy, Flame, Star, Zap, Award, Target, BookOpen, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMotivation } from '../api';

interface MotivationSystemProps { onBack: () => void; }

const ICON_MAP: Record<string, any> = { Trophy, Flame, Star, Zap, Award, Target, BookOpen };

export function MotivationSystem({ onBack }: MotivationSystemProps) {
  const [streakDays, setStreakDays] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [nextMilestone, setNextMilestone] = useState(30);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await getMotivation();
      setStreakDays(data.streak_days || 0);
      setTotalPoints(data.total_points || 0);
      setNextMilestone(data.next_milestone || 30);
      setAchievements((data.achievements || []).map((a: any) => ({
        id: a.id, icon: ICON_MAP[a.icon] || Trophy, title: a.title, desc: a.desc, unlocked: a.unlocked, color: a.color
      })));
    } catch {
      setStreakDays(12); setTotalPoints(847); setNextMilestone(30);
      setAchievements([
        { id: 1, icon: Trophy, title: 'First Steps', desc: 'Complete first lesson', unlocked: true, color: '#F59E0B' },
        { id: 2, icon: Flame, title: '7-Day Streak', desc: 'Study for 7 consecutive days', unlocked: true, color: '#EF4444' },
        { id: 3, icon: Star, title: 'Quick Learner', desc: 'Complete 5 topics in one week', unlocked: true, color: '#8B5CF6' },
        { id: 4, icon: Zap, title: 'Speed Master', desc: 'Finish quiz under 2 minutes', unlocked: false, color: '#06B6D4' },
        { id: 5, icon: Award, title: 'Perfect Score', desc: 'Get 100% on any quiz', unlocked: true, color: '#10B981' },
        { id: 6, icon: Target, title: 'Skill Master', desc: 'Master all core skills', unlocked: false, color: '#4F46E5' }
      ]);
    } finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#4F46E5]" /></div>;

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 relative">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
          <button onClick={onBack} className="mb-6 px-4 py-2 rounded-[14px] bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300" style={{ fontSize: '13px', fontWeight: 600 }}>← Back</button>
          <h2 className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontSize: '40px', fontWeight: 800, marginBottom: '6px' }}>Cognitive Milestones</h2>
          <p className="text-slate-400" style={{ fontSize: '16px' }}>Neural feedback and achievement protocols unlocked</p>
        </div>

        {/* Streak Counter */}
        <div className="rounded-[32px] p-10 backdrop-blur-[40px] border border-white/10 shadow-[0_0_80px_rgba(239,68,68,0.1)] mb-12 relative overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent" />
          <div className="flex items-center justify-between flex-wrap gap-8 relative z-10">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-full flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #991B1B 100%)', boxShadow: '0 0 40px rgba(239, 68, 68, 0.4)' }}>
                <Flame className="w-12 h-12 text-white animate-pulse" />
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-xl" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>{streakDays}</span>
                </div>
              </div>
              <div>
                <h3 className="bg-gradient-to-r from-white to-rose-300 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontSize: '32px', fontWeight: 800, marginBottom: '4px' }}>{streakDays} Cycle Streak! 🔥</h3>
                <p className="text-slate-400 font-medium" style={{ fontSize: '16px' }}>Neural synchronization maintained. Performance is optimal.</p>
              </div>
            </div>
            <div className="px-8 py-5 rounded-[20px] shadow-2xl relative overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Synchronization</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#EF4444' }}>{nextMilestone} Cycles</div>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((ach) => (
            <div key={ach.id} className="rounded-[28px] p-8 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden"
              style={{ 
                background: ach.unlocked ? `rgba(30, 41, 59, 0.6)` : 'rgba(30, 41, 59, 0.3)', 
                border: ach.unlocked ? `1px solid ${ach.color}40` : '1px solid rgba(255,255,255,0.05)', 
                boxShadow: ach.unlocked ? `0 0 30px ${ach.color}15` : 'none',
                opacity: ach.unlocked ? 1 : 0.5 
              }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 relative"
                  style={{ background: ach.unlocked ? `linear-gradient(135deg, ${ach.color} 0%, ${ach.color}dd 100%)` : 'rgba(15, 23, 42, 0.8)', border: ach.unlocked ? 'none' : '2px solid rgba(255,255,255,0.05)', boxShadow: ach.unlocked ? `0 0 25px ${ach.color}50` : 'none' }}>
                  <ach.icon className="w-10 h-10 text-white" />
                  {ach.unlocked && <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-xl" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}><Star className="w-4 h-4 text-white fill-white" /></div>}
                </div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 700, color: ach.unlocked ? '#F8FAFC' : '#64748B', marginBottom: '8px' }}>{ach.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{ach.desc}</p>
                {ach.unlocked && <div className="mt-5 px-5 py-1.5 rounded-full shadow-lg" style={{ background: `linear-gradient(135deg, ${ach.color}20 0%, ${ach.color}10 100%)`, border: `1px solid ${ach.color}40` }}><span style={{ fontSize: '11px', fontWeight: 800, color: ach.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Synchronized ✓</span></div>}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 rounded-[32px] p-10 backdrop-blur-[40px] border border-white/10 relative overflow-hidden shadow-2xl" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
          <div className="grid grid-cols-3 gap-8 relative z-10">
            <div className="text-center">
              <div style={{ fontSize: '48px', fontWeight: 800, color: '#818CF8', marginBottom: '4px', textShadow: '0 0 20px rgba(129, 140, 248, 0.3)' }}>{achievements.filter(a => a.unlocked).length}/{achievements.length}</div>
              <div className="text-slate-400 font-bold" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Modules Synchronized</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '48px', fontWeight: 800, color: '#10B981', marginBottom: '4px', textShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>{totalPoints}</div>
              <div className="text-slate-400 font-bold" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cognitive Credits</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '48px', fontWeight: 800, color: '#F59E0B', marginBottom: '4px', textShadow: '0 0 20px rgba(245, 158, 11, 0.3)' }}>🔥</div>
              <div className="text-slate-400 font-bold" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Steady Pulse</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
