import { Code, Briefcase, GraduationCap, Users, Loader2, Sparkles, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { selectRole, listRoles } from '../api';

interface RoleSelectionProps {
  onRoleSelect: (role: string) => void;
}

const roles = [
  { id: 'developer', icon: Code, title: 'Neural Developer', desc: 'Frontend, Backend, Full Stack Architecture', color: '#818CF8' },
  { id: 'manager', icon: Briefcase, title: 'Strategic Product Architect', desc: 'Roadmaps, Ecosystem Strategy, Analytics', color: '#2DD4BF' },
  { id: 'student', icon: GraduationCap, title: 'Cognitive Explorer', desc: 'Rapid Learning & Neural Development', color: '#C084FC' },
  { id: 'designer', icon: Users, title: 'Visual Intelligence Designer', desc: 'UI/UX, Sensory Experience Design', color: '#F472B6' }
];

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await listRoles();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    }
  };

  const handleSelect = async (roleId: string) => {
    setSelectedRole(roleId);
    setLoading(true);
    try {
      await selectRole(roleId);
      setTimeout(() => onRoleSelect(roleId), 300);
    } catch (err) {
      console.error('Failed to select role:', err);
      setSelectedRole(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-transparent">
      <div
        className="w-full max-w-5xl rounded-[40px] p-12 backdrop-blur-[40px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.6)] relative overflow-hidden"
        style={{ background: 'rgba(15, 23, 42, 0.6)' }}
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Zap className="w-4 h-4" />
            Neural Path Selection
          </div>
          <h2 className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontSize: '44px', fontWeight: 800 }}>
            Choose Your Identity
          </h2>
          <p className="text-slate-400 mt-3 font-medium" style={{ fontSize: '18px' }}>
            Select the trajectory that aligns with your professional evolution
          </p>
        </div>

        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm rounded-[40px]">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-400" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {roles.map((role) => {
            const isHovered = hoveredRole === role.id;
            const isSelected = selectedRole === role.id;
            const isRecommended = suggestions.includes(role.id);

            return (
              <div
                key={role.id}
                onClick={() => !loading && handleSelect(role.id)}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                className="rounded-[32px] p-10 cursor-pointer transition-all duration-300 relative group overflow-hidden"
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: isSelected ? `2px solid ${role.color}` : `1px solid rgba(255,255,255,0.05)`,
                  boxShadow: isHovered || isSelected
                    ? `0 20px 60px -10px ${role.color}40`
                    : `none`,
                  transform: isHovered || isSelected ? 'translateY(-10px)' : 'translateY(0)',
                  opacity: loading && !isSelected ? 0.3 : 1
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col gap-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-16 h-16 rounded-[22px] flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${role.color}20 0%, ${role.color}05 100%)`, border: `1px solid ${role.color}40`, boxShadow: `0 0 20px ${role.color}30` }}
                    >
                      <role.icon className="w-8 h-8" style={{ color: role.color }} />
                    </div>
                    {isRecommended && (
                      <div className="px-4 py-1.5 rounded-full flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 shadow-lg">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          AI Match
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: 700, color: '#F8FAFC', marginBottom: '8px' }}>
                      {role.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed font-medium" style={{ fontSize: '15px' }}>
                      {role.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Initialize Protocol <Zap className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
