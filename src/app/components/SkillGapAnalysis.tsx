import { TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getLearningPath } from '../api';

interface SkillGapAnalysisProps {
  onContinue: () => void;
}

export function SkillGapAnalysis({ onContinue }: SkillGapAnalysisProps) {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGaps();
  }, []);

  const loadGaps = async () => {
    try {
      const data = await getLearningPath();
      const colors = ['#4F46E5', '#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6'];
      const mapped = (data.skill_gaps || []).map((g: any, i: number) => ({
        name: g.skill_name, current: g.current_level, target: g.target_level, color: colors[i % colors.length]
      }));
      setSkills(mapped.length > 0 ? mapped : [
        { name: 'React Fundamentals', current: 85, target: 95, color: '#4F46E5' },
        { name: 'TypeScript', current: 60, target: 90, color: '#06B6D4' },
        { name: 'State Management', current: 45, target: 85, color: '#8B5CF6' },
        { name: 'Testing', current: 30, target: 80, color: '#10B981' },
        { name: 'Performance', current: 40, target: 85, color: '#F59E0B' }
      ]);
    } catch (err) {
      console.error('Failed to load skill gaps:', err);
      setSkills([
        { name: 'React Fundamentals', current: 85, target: 95, color: '#4F46E5' },
        { name: 'TypeScript', current: 60, target: 90, color: '#06B6D4' },
        { name: 'State Management', current: 45, target: 85, color: '#8B5CF6' },
        { name: 'Testing', current: 30, target: 80, color: '#10B981' },
        { name: 'Performance', current: 40, target: 85, color: '#F59E0B' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#4F46E5]" /></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-transparent">
      <div className="w-full max-w-4xl rounded-[32px] p-12 backdrop-blur-[40px] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)]" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
        <div className="text-center mb-12 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px]" />
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center relative z-10" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)', boxShadow: '0 0 30px rgba(129, 140, 248, 0.4)' }}>
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h2 className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>Skill Gap Analysis</h2>
          <p className="text-slate-400" style={{ fontSize: '16px' }}>Neural mapping of your current capabilities against target requirements</p>
        </div>

        <div className="space-y-6 mb-10">
          {skills.map((skill, idx) => {
            const gap = skill.target - skill.current;
            const hasGap = gap > 15;
            return (
              <div key={idx} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '16px', fontWeight: 600, color: '#F8FAFC' }}>{skill.name}</span>
                    {hasGap && (
                      <div className="px-3 py-1 rounded-full flex items-center gap-1" style={{ background: `linear-gradient(135deg, ${skill.color}20 0%, ${skill.color}10 100%)`, border: `1px solid ${skill.color}30` }}>
                        <AlertCircle className="w-3 h-3" style={{ color: skill.color }} />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: skill.color }}>Focus Area</span>
                      </div>
                    )}
                  </div>
                  <span className="text-slate-400" style={{ fontSize: '14px' }}>{skill.current}% → {skill.target}%</span>
                </div>
                <div className="relative h-10 rounded-[14px] overflow-hidden border border-white/5 shadow-inner" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                  <div className="absolute h-full rounded-[14px] transition-all duration-1000" style={{ width: `${skill.current}%`, background: `linear-gradient(135deg, ${skill.color} 0%, ${skill.color}dd 100%)`, boxShadow: `0 0 15px ${skill.color}40` }} />
                  <div className="absolute h-full rounded-[14px] border-2 border-dashed transition-all duration-1000" style={{ width: `${skill.target}%`, borderColor: `${skill.color}40`, background: `${skill.color}05` }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>{skill.current}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={onContinue}
          className="w-full py-4.5 mt-4 rounded-[18px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(129,140,248,0.4)] shadow-lg"
          style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)', color: 'white', fontSize: '16px', fontWeight: 700 }}>
          Generate Learning Trajectory
        </button>
      </div>
    </div>
  );
}
