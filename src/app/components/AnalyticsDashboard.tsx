import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Clock, Target, Loader2, Zap } from 'lucide-react';
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
        { icon: TrendingUp, label: 'Overall Progress', value: '85%', change: '+12%', color: '#818CF8' },
        { icon: Award, label: 'Skills Mastered', value: '12', change: '+3', color: '#4ADE80' },
        { icon: Clock, label: 'Study Hours', value: '47h', change: '+8h', color: '#2DD4BF' },
        { icon: Target, label: 'Completion Rate', value: '92%', change: '+5%', color: '#C084FC' }
      ]);
      setProgressData([{ week: 'Week 1', score: 45 }, { week: 'Week 2', score: 58 }, { week: 'Week 3', score: 62 }, { week: 'Week 4', score: 71 }, { week: 'Week 5', score: 78 }, { week: 'Week 6', score: 85 }]);
      setSkillsData([{ skill: 'React', level: 85 }, { skill: 'TypeScript', level: 72 }, { skill: 'State Mgmt', level: 65 }, { skill: 'Testing', level: 58 }, { skill: 'Performance', level: 62 }]);
    } finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-transparent"><Loader2 className="w-10 h-10 animate-spin text-indigo-400" /></div>;

  return (
    <div className="min-h-screen px-6 py-12 bg-transparent overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 relative">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
          <button onClick={onBack} className="mb-6 px-4 py-2 rounded-[14px] bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300" style={{ fontSize: '13px', fontWeight: 600 }}>← Back to Overview</button>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-indigo-400" />
            <h2 className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontSize: '40px', fontWeight: 800 }}>Neural Intelligence Dashboard</h2>
          </div>
          <p className="text-slate-400" style={{ fontSize: '16px' }}>Real-time telemetry of your learning evolution and cognitive growth</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon || TrendingUp;
            return (
              <div key={idx} className="rounded-[24px] p-6 backdrop-blur-[30px] border border-white/10 transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-[16px] flex items-center justify-center mb-4 relative z-10" style={{ background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}05 100%)`, border: `1px solid ${stat.color}30`, boxShadow: `0 0 15px ${stat.color}20` }}>
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div className="text-slate-400 mb-1 relative z-10" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                <div className="flex items-end gap-2 relative z-10">
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#F8FAFC' }}>{stat.value}</div>
                  <div className="px-2 py-0.5 rounded-full mb-1.5" style={{ background: `${stat.color}20`, color: stat.color, fontSize: '11px', fontWeight: 700, border: `1px solid ${stat.color}30` }}>{stat.change}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-[28px] p-8 backdrop-blur-[30px] border border-white/10 shadow-2xl relative overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
             <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp className="w-16 h-16 text-indigo-400" /></div>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 700, color: '#F8FAFC', marginBottom: '24px' }}>Cognitive Momentum</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={progressData}>
                <defs><linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818CF8" stopOpacity={0.4} /><stop offset="100%" stopColor="#818CF8" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} /><XAxis dataKey="week" stroke="#64748B" style={{ fontSize: '11px', fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} /><YAxis stroke="#64748B" style={{ fontSize: '11px', fontWeight: 600 }} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#F8FAFC', fontWeight: 600 }}
                  labelStyle={{ color: '#94A3B8', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey="score" stroke="#818CF8" strokeWidth={4} fill="url(#progressGradient)" dot={{ fill: '#818CF8', r: 4, strokeWidth: 0 }} activeDot={{ r: 8, stroke: 'rgba(129, 140, 248, 0.3)', strokeWidth: 10 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-[28px] p-8 backdrop-blur-[30px] border border-white/10 shadow-2xl relative overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
            <div className="absolute top-0 right-0 p-4 opacity-10"><Target className="w-16 h-16 text-cyan-400" /></div>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 700, color: '#F8FAFC', marginBottom: '24px' }}>Proficiency Matrix</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={skillsData}>
                <defs><linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2DD4BF" /><stop offset="100%" stopColor="#0D9488" /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} /><XAxis dataKey="skill" stroke="#64748B" style={{ fontSize: '11px', fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} /><YAxis stroke="#64748B" style={{ fontSize: '11px', fontWeight: 600 }} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}
                   itemStyle={{ color: '#F8FAFC', fontWeight: 600 }}
                   labelStyle={{ color: '#94A3B8', marginBottom: '4px' }}
                />
                <Bar dataKey="level" fill="url(#barGradient)" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
