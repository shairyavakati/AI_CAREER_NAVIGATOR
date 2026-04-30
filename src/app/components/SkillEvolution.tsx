import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSkillEvolution } from '../api';

export function SkillEvolution() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [skillNames, setSkillNames] = useState<string[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [growth, setGrowth] = useState(0);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#4F46E5', '#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await getSkillEvolution();
      setChartData(data.chart_data || []);
      setSkillNames(data.skill_names || []);
      setGrowth(data.overall_growth || 0);
      setMilestones(data.milestones || []);
    } catch {
      setChartData([
        { month: 'Jan', React: 45, TypeScript: 30, 'State Mgmt': 25, Testing: 15, Performance: 20 },
        { month: 'Feb', React: 52, TypeScript: 42, 'State Mgmt': 35, Testing: 28, Performance: 30 },
        { month: 'Mar', React: 65, TypeScript: 55, 'State Mgmt': 48, Testing: 38, Performance: 42 },
        { month: 'Apr', React: 75, TypeScript: 68, 'State Mgmt': 58, Testing: 52, Performance: 55 },
        { month: 'May', React: 82, TypeScript: 75, 'State Mgmt': 70, Testing: 62, Performance: 68 },
        { month: 'Jun', React: 90, TypeScript: 85, 'State Mgmt': 82, Testing: 75, Performance: 78 }
      ]);
      setSkillNames(['React', 'TypeScript', 'State Mgmt', 'Testing', 'Performance']);
      setGrowth(100);
      setMilestones([
        { month: 'Feb', skill: 'React', achievement: 'Completed Fundamentals', icon: '🎯' },
        { month: 'Mar', skill: 'TypeScript', achievement: 'Mastered Basic Types', icon: '✨' },
        { month: 'May', skill: 'State Mgmt', achievement: 'Built Redux App', icon: '🚀' },
        { month: 'Jun', skill: 'Testing', achievement: 'Achieved 80% Coverage', icon: '🏆' }
      ]);
    } finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#4F46E5]" /></div>;

  return (
    <div className="min-h-screen px-6 py-12 bg-transparent overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="w-24 h-24 rounded-[32px] mx-auto mb-8 flex items-center justify-center relative z-10" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)', boxShadow: '0 0 50px rgba(129, 140, 248, 0.4)', transform: 'rotate(10deg)' }}>
            <TrendingUp className="w-12 h-12 text-white" />
          </div>
          <h2 className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontSize: '48px', fontWeight: 800, marginBottom: '8px' }}>Neural Evolution Timeline</h2>
          <p className="text-slate-400 font-medium" style={{ fontSize: '18px' }}>Quantifying your cognitive transformation through the digital landscape</p>
        </div>

        {/* Growth Card */}
        <div className="mb-12 rounded-[32px] p-10 backdrop-blur-[40px] border border-white/10 shadow-[0_0_80px_rgba(16,185,129,0.1)] relative overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
          <div className="flex items-center justify-between flex-wrap gap-8 relative z-10">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-full flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, #10B981 0%, #065F46 100%)', boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}>
                <Award className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="text-slate-400 font-bold uppercase tracking-widest mb-1" style={{ fontSize: '12px' }}>Total Cognitive Expansion</div>
                <div style={{ fontSize: '42px', fontWeight: 800, color: '#10B981', textShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>+{growth}%</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 font-medium mb-1" style={{ fontSize: '15px' }}>Neural plasticity increased by {growth}%</div>
              <div className="text-white font-bold" style={{ fontSize: '20px' }}>Trajectory: Optimal</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-[32px] p-10 backdrop-blur-[40px] border border-white/10 shadow-2xl mb-12 relative overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
          <h3 className="mb-10 text-white" style={{ fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: 800 }}>Proficiency Telemetry</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" style={{ fontSize: '13px', fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#64748B" style={{ fontSize: '13px', fontWeight: 600 }} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', backdropFilter: 'blur(15px)' }}
                itemStyle={{ fontWeight: 700, fontSize: '14px' }}
                labelStyle={{ color: '#94A3B8', marginBottom: '8px', fontWeight: 600 }}
              />
              {skillNames.map((name, i) => (
                <Line key={name} type="monotone" dataKey={name} stroke={COLORS[i % COLORS.length]} strokeWidth={4} dot={{ fill: COLORS[i % COLORS.length], r: 5, strokeWidth: 0 }} activeDot={{ r: 8, strokeWidth: 0 }} name={name} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-8 mt-10 justify-center">
            {skillNames.map((name, i) => (
              <div key={name} className="flex items-center gap-3 group cursor-default">
                <div className="w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]" style={{ background: COLORS[i % COLORS.length], color: COLORS[i % COLORS.length] }} />
                <span className="text-slate-400 group-hover:text-white transition-colors" style={{ fontSize: '14px', fontWeight: 600 }}>{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        {milestones.length > 0 && (
          <div className="rounded-[32px] p-10 backdrop-blur-[40px] border border-white/10 shadow-2xl relative overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
            <h3 className="mb-10 text-white" style={{ fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: 800 }}>Neural Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {milestones.slice(0, 4).map((m, idx) => {
                const color = COLORS[idx % COLORS.length];
                return (
                  <div key={idx} className="rounded-[24px] p-8 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden" style={{ background: 'rgba(15, 23, 42, 0.4)', border: `1px solid rgba(255,255,255,0.05)` }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-center relative z-10">
                      <div className="text-5xl mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{m.icon}</div>
                      <div className="px-4 py-1.5 rounded-full inline-block mb-4" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.month}</span>
                      </div>
                      <h4 className="text-white font-bold mb-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px' }}>{m.skill}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed font-medium">{m.achievement}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
