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
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl rounded-[20px] p-12 backdrop-blur-[30px] border border-white/30 shadow-[0_8px_32px_rgba(79,70,229,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.7)' }}>
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)' }}>
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Skill Gap Analysis</h2>
          <p className="text-[#6B7280]" style={{ fontSize: '16px' }}>Your personalized learning roadmap based on assessment results</p>
        </div>

        <div className="space-y-6 mb-10">
          {skills.map((skill, idx) => {
            const gap = skill.target - skill.current;
            const hasGap = gap > 15;
            return (
              <div key={idx} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>{skill.name}</span>
                    {hasGap && (
                      <div className="px-3 py-1 rounded-full flex items-center gap-1" style={{ background: `linear-gradient(135deg, ${skill.color}20 0%, ${skill.color}10 100%)`, border: `1px solid ${skill.color}30` }}>
                        <AlertCircle className="w-3 h-3" style={{ color: skill.color }} />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: skill.color }}>Focus Area</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[#6B7280]" style={{ fontSize: '14px' }}>{skill.current}% → {skill.target}%</span>
                </div>
                <div className="relative h-8 rounded-[12px] overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.03)' }}>
                  <div className="absolute h-full rounded-[12px] transition-all duration-1000" style={{ width: `${skill.current}%`, background: `linear-gradient(135deg, ${skill.color} 0%, ${skill.color}dd 100%)`, boxShadow: `inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 12px ${skill.color}40` }} />
                  <div className="absolute h-full rounded-[12px] border-2 border-dashed transition-all duration-1000" style={{ width: `${skill.target}%`, borderColor: skill.color, background: `${skill.color}10` }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>{skill.current}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={onContinue}
          className="w-full py-4 rounded-[16px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(79,70,229,0.3)]"
          style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', color: 'white', fontSize: '16px', fontWeight: 600, boxShadow: '0 8px 24px rgba(79, 70, 229, 0.25)' }}>
          Generate Learning Path
        </button>
      </div>
    </div>
  );
}
