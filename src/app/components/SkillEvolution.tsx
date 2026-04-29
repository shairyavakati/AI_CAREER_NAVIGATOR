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
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', boxShadow: '0 12px 40px rgba(79, 70, 229, 0.4)' }}>
            <TrendingUp className="w-12 h-12 text-white" />
          </div>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '40px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Skill Evolution Timeline</h2>
          <p className="text-[#6B7280]" style={{ fontSize: '18px' }}>Track your journey from beginner to expert</p>
        </div>

        {/* Growth Card */}
        <div className="mb-10 rounded-[20px] p-8 backdrop-blur-[30px] border border-white/30 shadow-[0_8px_32px_rgba(79,70,229,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.75)' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)' }}>
                <Award className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="text-[#6B7280] mb-1" style={{ fontSize: '14px', fontWeight: 500 }}>Overall Skill Growth</div>
                <div style={{ fontSize: '36px', fontWeight: 700, color: '#10B981' }}>+{growth}%</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[#6B7280] mb-1" style={{ fontSize: '14px', fontWeight: 500 }}>🔥 You improved {growth}% overall!</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>Keep it up!</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-[20px] p-10 backdrop-blur-[30px] border border-white/30 shadow-[0_8px_32px_rgba(79,70,229,0.12)] mb-10" style={{ background: 'rgba(255, 255, 255, 0.75)' }}>
          <h3 className="mb-8" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '24px', fontWeight: 600, color: '#111827' }}>Multi-Skill Progress</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '14px', fontWeight: 500 }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '14px', fontWeight: 500 }} />
              <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '12px' }} />
              {skillNames.map((name, i) => (
                <Line key={name} type="monotone" dataKey={name} stroke={COLORS[i % COLORS.length]} strokeWidth={3} dot={{ fill: COLORS[i % COLORS.length], r: 6 }} name={name} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-6 mt-8 justify-center">
            {skillNames.map((name, i) => (
              <div key={name} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#6B7280' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        {milestones.length > 0 && (
          <div className="rounded-[20px] p-10 backdrop-blur-[30px] border border-white/30 shadow-[0_8px_32px_rgba(79,70,229,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.75)' }}>
            <h3 className="mb-8" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '24px', fontWeight: 600, color: '#111827' }}>Achievement Milestones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.slice(0, 4).map((m, idx) => {
                const color = COLORS[idx % COLORS.length];
                return (
                  <div key={idx} className="rounded-[18px] p-6 transition-all duration-300 hover:-translate-y-2" style={{ background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`, border: `2px solid ${color}30` }}>
                    <div className="text-center">
                      <div className="text-4xl mb-3">{m.icon}</div>
                      <div className="px-3 py-1 rounded-full inline-block mb-3" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color }}>{m.month}</span>
                      </div>
                      <h4 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{m.skill}</h4>
                      <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.4' }}>{m.achievement}</p>
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
