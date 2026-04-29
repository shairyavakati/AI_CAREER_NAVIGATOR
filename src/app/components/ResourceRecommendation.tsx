import { BookOpen, Video, FileText, Code, ExternalLink, Star, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getResources } from '../api';

const ICON_MAP: Record<string, any> = { Video, FileText, BookOpen, Code };
const DIFF_COLORS: Record<string, string> = { Beginner: '#10B981', Intermediate: '#F59E0B', Advanced: '#EF4444' };

export function ResourceRecommendation() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => { loadResources(); }, [activeFilter]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await getResources(activeFilter);
      setResources((data.resources || []).map((r: any) => ({ ...r, iconComponent: ICON_MAP[r.icon] || BookOpen })));
    } catch {
      setResources([
        { id: 1, type: 'Course', iconComponent: Video, title: 'Advanced TypeScript Patterns', provider: 'Frontend Masters', duration: '4 hours', rating: 4.8, difficulty: 'Advanced', color: '#4F46E5', tags: ['TypeScript', 'Design Patterns'] },
        { id: 2, type: 'Article', iconComponent: FileText, title: 'State Management Best Practices', provider: 'React Docs', duration: '15 min read', rating: 4.9, difficulty: 'Intermediate', color: '#06B6D4', tags: ['State Management', 'React'] },
        { id: 3, type: 'Book', iconComponent: BookOpen, title: 'Testing JavaScript Applications', provider: "O'Reilly", duration: '8 chapters', rating: 4.7, difficulty: 'Intermediate', color: '#10B981', tags: ['Testing', 'Jest', 'TDD'] },
        { id: 4, type: 'Practice', iconComponent: Code, title: 'React Performance Challenges', provider: 'CodeSignal', duration: '12 exercises', rating: 4.6, difficulty: 'Advanced', color: '#F59E0B', tags: ['Performance', 'Optimization'] },
        { id: 5, type: 'Course', iconComponent: Video, title: 'Modern React Hooks Deep Dive', provider: 'Egghead.io', duration: '3.5 hours', rating: 4.9, difficulty: 'Intermediate', color: '#8B5CF6', tags: ['React', 'Hooks'] },
        { id: 6, type: 'Article', iconComponent: FileText, title: 'Building Scalable Apps with Redux', provider: 'Medium', duration: '20 min read', rating: 4.5, difficulty: 'Advanced', color: '#EF4444', tags: ['Redux', 'Architecture'] },
      ]);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '40px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Recommended Resources</h2>
          <p className="text-[#6B7280]" style={{ fontSize: '18px' }}>Curated learning materials based on your skill gaps and goals</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {['All', 'Courses', 'Articles', 'Books', 'Practice'].map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)}
              className="px-6 py-3 rounded-[14px] transition-all duration-200 hover:scale-105"
              style={{ background: activeFilter === filter ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' : 'rgba(255,255,255,0.8)', color: activeFilter === filter ? 'white' : '#6B7280', border: activeFilter === filter ? 'none' : '2px solid rgba(107,114,128,0.2)', fontSize: '14px', fontWeight: 600, boxShadow: activeFilter === filter ? '0 4px 16px rgba(79,70,229,0.25)' : 'none' }}>
              {filter}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[#4F46E5]" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((r) => {
              const Icon = r.iconComponent || BookOpen;
              const diffColor = DIFF_COLORS[r.difficulty] || '#6B7280';
              return (
                <div key={r.id} className="rounded-[20px] p-6 backdrop-blur-[25px] border border-white/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(79,70,229,0.15)] cursor-pointer" style={{ background: 'rgba(255,255,255,0.85)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-[14px] flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${r.color} 0%, ${r.color}dd 100%)`, boxShadow: `0 6px 20px ${r.color}40` }}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="px-3 py-1 rounded-full" style={{ background: `${diffColor}20`, border: `1px solid ${diffColor}40` }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: diffColor }}>{r.difficulty}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="px-3 py-1 rounded-lg inline-block mb-3" style={{ background: `${r.color}15`, border: `1px solid ${r.color}30` }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: r.color }}>{r.type}</span>
                    </div>
                    <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '6px', lineHeight: '1.3' }}>{r.title}</h3>
                    <p className="text-[#6B7280] mb-3" style={{ fontSize: '14px' }}>{r.provider} • {r.duration}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4" style={{ color: i < Math.floor(r.rating) ? '#F59E0B' : '#D1D5DB', fill: i < Math.floor(r.rating) ? '#F59E0B' : 'none' }} />)}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280' }}>{r.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(r.tags || []).map((tag: string, idx: number) => (
                        <div key={idx} className="px-3 py-1 rounded-lg" style={{ background: 'rgba(107,114,128,0.1)', border: '1px solid rgba(107,114,128,0.2)' }}>
                          <span style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280' }}>{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-[12px] transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${r.color} 0%, ${r.color}dd 100%)`, color: 'white', fontSize: '14px', fontWeight: 600, boxShadow: `0 4px 16px ${r.color}40` }}>
                    <span>Start Learning</span><ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
