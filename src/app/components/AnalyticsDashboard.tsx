import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Clock, Target, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getDashboard } from '../api';

interface AnalyticsDashboardProps { onBack: () => void; }

export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const iconMap: Record<string, any> = { 'Overall Progress': TrendingUp, 'Skills Mastered': Award, 'Study Hours': Clock, 'Completion Rate': Target };

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboard();
      setStats((data.stats || []).map((s: any) => ({ ...s, icon: iconMap[s.label] || TrendingUp })));
      setProgressData(data.weekly_progress || []);
      setSkillsData(data.skill_levels || []);
    } catch {
      setStats([
        { icon: TrendingUp, label: 'Overall Progress', value: '85%', change: '+12%', color: '#4F46E5' },
        { icon: Award, label: 'Skills Mastered', value: '12', change: '+3', color: '#10B981' },
        { icon: Clock, label: 'Study Hours', value: '47h', change: '+8h', color: '#06B6D4' },
        { icon: Target, label: 'Completion Rate', value: '92%', change: '+5%', color: '#8B5CF6' }
      ]);
      setProgressData([{ week: 'Week 1', score: 45 }, { week: 'Week 2', score: 58 }, { week: 'Week 3', score: 62 }, { week: 'Week 4', score: 71 }, { week: 'Week 5', score: 78 }, { week: 'Week 6', score: 85 }]);
      setSkillsData([{ skill: 'React', level: 85 }, { skill: 'TypeScript', level: 72 }, { skill: 'State Mgmt', level: 65 }, { skill: 'Testing', level: 58 }, { skill: 'Performance', level: 62 }]);
    } finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#4F46E5]" /></div>;

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <button onClick={onBack} className="mb-6 px-4 py-2 rounded-[12px] text-[#6B7280] hover:text-[#4F46E5] transition-colors duration-200" style={{ fontSize: '14px', fontWeight: 500 }}>← Back</button>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '36px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>Analytics Dashboard</h2>
          <p className="text-[#6B7280]" style={{ fontSize: '16px' }}>Track your learning progress and achievements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon || TrendingUp;
            return (
              <div key={idx} className="rounded-[18px] p-6 backdrop-blur-[25px] border border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(79,70,229,0.15)]" style={{ background: 'rgba(255, 255, 255, 0.75)' }}>
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`, boxShadow: `0 4px 12px ${stat.color}40` }}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-[#6B7280] mb-1" style={{ fontSize: '13px', fontWeight: 500 }}>{stat.label}</div>
                <div className="flex items-end gap-2">
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827' }}>{stat.value}</div>
                  <div className="px-2 py-0.5 rounded-md mb-1" style={{ background: `${stat.color}15`, color: stat.color, fontSize: '12px', fontWeight: 600 }}>{stat.change}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[18px] p-8 backdrop-blur-[25px] border border-white/30" style={{ background: 'rgba(255, 255, 255, 0.75)' }}>
            <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Progress Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={progressData}>
                <defs><linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3} /><stop offset="100%" stopColor="#4F46E5" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" /><XAxis dataKey="week" stroke="#6B7280" style={{ fontSize: '12px' }} /><YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} fill="url(#progressGradient)" dot={{ fill: '#4F46E5', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-[18px] p-8 backdrop-blur-[25px] border border-white/30" style={{ background: 'rgba(255, 255, 255, 0.75)' }}>
            <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Skill Levels</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={skillsData}>
                <defs><linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06B6D4" /><stop offset="100%" stopColor="#0891B2" /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" /><XAxis dataKey="skill" stroke="#6B7280" style={{ fontSize: '12px' }} /><YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="level" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
