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
        <div className="mb-10">
          <button onClick={onBack} className="mb-6 px-4 py-2 rounded-[12px] text-[#6B7280] hover:text-[#4F46E5] transition-colors duration-200" style={{ fontSize: '14px', fontWeight: 500 }}>← Back</button>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '36px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>Achievements & Motivation</h2>
          <p className="text-[#6B7280]" style={{ fontSize: '16px' }}>Track your milestones and celebrate progress</p>
        </div>

        {/* Streak Counter */}
        <div className="rounded-[20px] p-10 backdrop-blur-[30px] border border-white/30 shadow-[0_8px_32px_rgba(239,68,68,0.12)] mb-10" style={{ background: 'rgba(255, 255, 255, 0.75)' }}>
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)' }}>
                <Flame className="w-12 h-12 text-white" />
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', boxShadow: '0 4px 16px rgba(245, 158, 11, 0.5)' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>{streakDays}</span>
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{streakDays} Day Streak! 🔥</h3>
                <p className="text-[#6B7280]" style={{ fontSize: '16px' }}>You're on fire! Keep up the amazing work</p>
              </div>
            </div>
            <div className="px-8 py-4 rounded-[16px]" style={{ background: 'linear-gradient(135deg, #EF444415 0%, #EF444408 100%)', border: '2px solid #EF444430' }}>
              <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>Next Milestone</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444' }}>{nextMilestone} Days</div>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div key={ach.id} className="rounded-[20px] p-8 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              style={{ background: ach.unlocked ? `linear-gradient(135deg, ${ach.color}20 0%, ${ach.color}10 100%)` : 'linear-gradient(135deg, #6B728015 0%, #6B728008 100%)', border: ach.unlocked ? `2px solid ${ach.color}40` : '2px solid #6B728020', boxShadow: ach.unlocked ? `0 8px 24px ${ach.color}20` : '0 4px 12px rgba(0,0,0,0.05)', opacity: ach.unlocked ? 1 : 0.6 }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 relative"
                  style={{ background: ach.unlocked ? `linear-gradient(135deg, ${ach.color} 0%, ${ach.color}dd 100%)` : 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)', boxShadow: ach.unlocked ? `0 8px 24px ${ach.color}50` : '0 4px 12px rgba(0,0,0,0.2)' }}>
                  <ach.icon className="w-10 h-10 text-white" />
                  {ach.unlocked && <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.5)' }}><Star className="w-4 h-4 text-white fill-white" /></div>}
                </div>
                <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', fontWeight: 600, color: ach.unlocked ? '#111827' : '#6B7280', marginBottom: '6px' }}>{ach.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>{ach.desc}</p>
                {ach.unlocked && <div className="mt-4 px-4 py-1.5 rounded-full" style={{ background: `linear-gradient(135deg, ${ach.color}25 0%, ${ach.color}15 100%)`, border: `1px solid ${ach.color}40` }}><span style={{ fontSize: '12px', fontWeight: 600, color: ach.color }}>Unlocked ✓</span></div>}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-10 rounded-[20px] p-8 backdrop-blur-[30px] border border-white/30" style={{ background: 'rgba(255, 255, 255, 0.75)' }}>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center"><div style={{ fontSize: '40px', fontWeight: 700, color: '#4F46E5', marginBottom: '4px' }}>{achievements.filter(a => a.unlocked).length}/{achievements.length}</div><div className="text-[#6B7280]" style={{ fontSize: '14px' }}>Achievements Unlocked</div></div>
            <div className="text-center"><div style={{ fontSize: '40px', fontWeight: 700, color: '#10B981', marginBottom: '4px' }}>{totalPoints}</div><div className="text-[#6B7280]" style={{ fontSize: '14px' }}>Total Points Earned</div></div>
            <div className="text-center"><div style={{ fontSize: '40px', fontWeight: 700, color: '#F59E0B', marginBottom: '4px' }}>🔥</div><div className="text-[#6B7280]" style={{ fontSize: '14px' }}>{streakDays} Day Streak</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
