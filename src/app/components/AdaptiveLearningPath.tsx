import { CheckCircle2, Circle, Clock, Calendar, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getLearningPath } from '../api';

interface AdaptiveLearningPathProps {
  onStartLearning: () => void;
}

interface Topic {
  title: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  duration: string;
  revisions: string[];
}

export function AdaptiveLearningPath({ onStartLearning }: AdaptiveLearningPathProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPath(); }, []);

  const loadPath = async () => {
    try {
      const data = await getLearningPath();
      setTopics((data.path || []).slice(0, 8).map((t: any) => ({
        title: t.title, status: t.status, duration: t.duration,
        revisions: (t.revisions || []).map((r: any) => r.date || r)
      })));
    } catch {
      setTopics([
        { title: 'TypeScript Basics', status: 'completed', duration: '2 hours', revisions: ['Day 1', 'Day 3', 'Day 7'] },
        { title: 'Advanced Types', status: 'in-progress', duration: '3 hours', revisions: ['Day 1', 'Day 3'] },
        { title: 'React with TypeScript', status: 'upcoming', duration: '4 hours', revisions: [] },
        { title: 'State Management Patterns', status: 'upcoming', duration: '3 hours', revisions: [] },
        { title: 'Testing Best Practices', status: 'upcoming', duration: '2.5 hours', revisions: [] }
      ]);
    } finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#4F46E5]" /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl rounded-[20px] p-12 backdrop-blur-[30px] border border-white/30 shadow-[0_8px_32px_rgba(79,70,229,0.12)]" style={{ background: 'rgba(255, 255, 255, 0.7)' }}>
        <div className="text-center mb-12">
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Your Learning Path</h2>
          <p className="text-[#6B7280]" style={{ fontSize: '16px' }}>Adaptive curriculum tailored to your goals and schedule</p>
        </div>

        <div className="relative space-y-6 mb-10">
          <div className="absolute left-[15px] top-4 bottom-4 w-[2px]" style={{ background: 'linear-gradient(180deg, #4F46E5 0%, #06B6D4 100%)' }} />
          {topics.map((topic, idx) => {
            const colors = {
              completed: { main: '#10B981', bg: '#10B98115', border: '#10B98130' },
              'in-progress': { main: '#4F46E5', bg: '#4F46E515', border: '#4F46E530' },
              upcoming: { main: '#6B7280', bg: '#6B728015', border: '#6B728030' }
            };
            const color = colors[topic.status as keyof typeof colors] || colors.upcoming;

            return (
              <div key={idx} className="relative pl-12">
                <div className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: color.main, boxShadow: `0 4px 12px ${color.main}40` }}>
                  {topic.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Circle className="w-5 h-5 text-white" fill={topic.status === 'in-progress' ? 'currentColor' : 'none'} />}
                </div>
                <div className="rounded-[16px] p-6 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(79,70,229,0.15)] hover:-translate-y-1" style={{ background: 'rgba(255, 255, 255, 0.9)', border: `2px solid ${color.border}`, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>{topic.title}</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-[#6B7280]"><Clock className="w-4 h-4" /><span style={{ fontSize: '14px' }}>{topic.duration}</span></div>
                        {topic.status !== 'upcoming' && (
                          <div className="px-3 py-1 rounded-full" style={{ background: color.bg, border: `1px solid ${color.border}` }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: color.main }}>{topic.status === 'completed' ? 'Completed' : 'In Progress'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {topic.revisions.length > 0 && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E5E7EB]">
                      <Calendar className="w-4 h-4 text-[#6B7280]" />
                      <span className="text-[#6B7280]" style={{ fontSize: '13px', fontWeight: 500 }}>Revisions:</span>
                      {topic.revisions.map((rev: string, i: number) => (
                        <div key={i} className="px-2 py-1 rounded-lg" style={{ background: 'linear-gradient(135deg, #06B6D415 0%, #06B6D408 100%)', border: '1px solid #06B6D430' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#06B6D4' }}>{rev}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={onStartLearning} className="w-full py-4 rounded-[16px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(79,70,229,0.3)]" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', color: 'white', fontSize: '16px', fontWeight: 600, boxShadow: '0 8px 24px rgba(79, 70, 229, 0.25)' }}>
          Start Learning
        </button>
      </div>
    </div>
  );
}
