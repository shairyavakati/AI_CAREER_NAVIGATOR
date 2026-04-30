import { BookOpen, Video, FileText, Code, ExternalLink, Star, Loader2, Zap } from 'lucide-react';
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
        { id: 1, type: 'Course', iconComponent: Video, title: 'Advanced TypeScript Patterns', provider: 'Neural Masters', duration: '4.0h Sequence', rating: 4.8, difficulty: 'Advanced', color: '#818CF8', tags: ['TypeScript', 'Design Patterns'] },
        { id: 2, type: 'Article', iconComponent: FileText, title: 'State Management Intelligence', provider: 'React Core', duration: '15m Sync', rating: 4.9, difficulty: 'Intermediate', color: '#2DD4BF', tags: ['State Management', 'React'] },
        { id: 3, type: 'Book', iconComponent: BookOpen, title: 'Testing Logic Applications', provider: "O'Reilly Neural", duration: '8 Iterations', rating: 4.7, difficulty: 'Intermediate', color: '#10B981', tags: ['Testing', 'Jest', 'TDD'] },
        { id: 4, type: 'Practice', iconComponent: Code, title: 'React Performance Matrices', provider: 'CodeSignal AI', duration: '12 Sequences', rating: 4.6, difficulty: 'Advanced', color: '#F59E0B', tags: ['Performance', 'Optimization'] },
        { id: 5, type: 'Course', iconComponent: Video, title: 'Modern React Hooks Deep Scan', provider: 'Egghead Cognitive', duration: '3.5h Sequence', rating: 4.9, difficulty: 'Intermediate', color: '#C084FC', tags: ['React', 'Hooks'] },
        { id: 6, type: 'Article', iconComponent: FileText, title: 'Scalable Neural Architectures', provider: 'Cognitive Medium', duration: '20m Sync', rating: 4.5, difficulty: 'Advanced', color: '#EF4444', tags: ['Redux', 'Architecture'] },
      ]);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-transparent overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 relative">
          <div className="absolute -top-10 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-indigo-400" />
            <h2 className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontSize: '44px', fontWeight: 800 }}>Neural Knowledge Repository</h2>
          </div>
          <p className="text-slate-400 font-medium" style={{ fontSize: '18px' }}>Curated intellectual assets prioritized by your cognitive synchronization gaps.</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
          {['All', 'Courses', 'Articles', 'Books', 'Practice'].map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)}
              className="px-8 py-3.5 rounded-[20px] transition-all duration-300 relative group overflow-hidden"
              style={{ 
                background: activeFilter === filter ? 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)' : 'rgba(30, 41, 59, 0.4)', 
                color: activeFilter === filter ? 'white' : '#94A3B8', 
                border: activeFilter === filter ? 'none' : '1px solid rgba(255,255,255,0.05)', 
                fontSize: '14px', 
                fontWeight: 700, 
                boxShadow: activeFilter === filter ? '0 10px 25px rgba(79,70,229,0.3)' : 'none' 
              }}>
              {activeFilter !== filter && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
              <span className="relative z-10">{filter}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-32"><Loader2 className="w-12 h-12 animate-spin text-indigo-400" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((r) => {
              const Icon = r.iconComponent || BookOpen;
              const diffColor = DIFF_COLORS[r.difficulty] || '#64748B';
              return (
                <div key={r.id} className="rounded-[32px] p-8 backdrop-blur-[30px] border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(0,0,0,0.4)] cursor-pointer group relative overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="w-16 h-16 rounded-[22px] flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${r.color}20 0%, ${r.color}05 100%)`, border: `1px solid ${r.color}30`, boxShadow: `0 0 20px ${r.color}20` }}>
                      <Icon className="w-8 h-8" style={{ color: r.color }} />
                    </div>
                    <div className="px-4 py-1.5 rounded-full shadow-lg" style={{ background: `${diffColor}10`, border: `1px solid ${diffColor}30` }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: diffColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.difficulty}</span>
                    </div>
                  </div>

                  <div className="mb-6 relative z-10">
                    <div className="px-3 py-1 rounded-lg inline-block mb-4" style={{ background: `${r.color}15`, border: `1px solid ${r.color}30` }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: r.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.type}</span>
                    </div>
                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 700, color: '#F8FAFC', marginBottom: '8px', lineHeight: '1.4' }}>{r.title}</h3>
                    <p className="text-slate-500 font-medium mb-4" style={{ fontSize: '14px' }}>{r.provider} • {r.duration}</p>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5" style={{ color: i < Math.floor(r.rating) ? '#F59E0B' : 'rgba(255,255,255,0.1)', fill: i < Math.floor(r.rating) ? '#F59E0B' : 'none' }} />)}
                      </div>
                      <span className="text-slate-400 font-bold" style={{ fontSize: '13px' }}>{r.rating}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {(r.tags || []).map((tag: string, idx: number) => (
                        <div key={idx} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 shadow-inner">
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8' }}>{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-4 rounded-[20px] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 relative z-10 shadow-xl group/btn"
                    style={{ background: `linear-gradient(135deg, ${r.color} 0%, ${r.color}dd 100%)`, color: 'white', fontSize: '15px', fontWeight: 700 }}>
                    <span>Initiate Sequence</span><ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
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
