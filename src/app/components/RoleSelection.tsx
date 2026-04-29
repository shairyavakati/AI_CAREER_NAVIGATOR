import { Code, Briefcase, GraduationCap, Users, Loader2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { selectRole, listRoles } from '../api';

interface RoleSelectionProps {
  onRoleSelect: (role: string) => void;
}

const roles = [
  { id: 'developer', icon: Code, title: 'Software Developer', desc: 'Frontend, Backend, Full Stack', color: '#4F46E5' },
  { id: 'manager', icon: Briefcase, title: 'Product Manager', desc: 'Strategy, Roadmap, Analytics', color: '#06B6D4' },
  { id: 'student', icon: GraduationCap, title: 'Student', desc: 'Learning & Development', color: '#8B5CF6' },
  { id: 'designer', icon: Users, title: 'Designer', desc: 'UI/UX, Visual Design', color: '#10B981' }
];

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState(roles);

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
    <div className="min-h-screen flex items-center justify-center px-6">
      <div
        className="w-full max-w-5xl rounded-[20px] p-12 backdrop-blur-[30px] border border-white/30 shadow-[0_8px_32px_rgba(79,70,229,0.12)]"
        style={{ background: 'rgba(255, 255, 255, 0.7)' }}
      >
        <h2 className="text-center mb-4" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '32px', fontWeight: 700, color: '#111827' }}>
          Select Your Role
        </h2>
        <p className="text-center mb-12 text-[#6B7280]" style={{ fontSize: '16px' }}>
          Choose the career path that best matches your goals
        </p>

        {loading && (
          <div className="flex justify-center mb-6">
            <Loader2 className="w-6 h-6 animate-spin text-[#4F46E5]" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => {
            const isHovered = hoveredRole === role.id;
            const isSelected = selectedRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => !loading && handleSelect(role.id)}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                className="rounded-[20px] p-8 cursor-pointer transition-all duration-300"
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${role.color}30 0%, ${role.color}15 100%)`
                    : `linear-gradient(135deg, ${role.color}15 0%, ${role.color}08 100%)`,
                  border: isSelected ? `3px solid ${role.color}` : `2px solid ${role.color}20`,
                  boxShadow: isHovered || isSelected
                    ? `0 16px 48px ${role.color}30, inset 0 1px 3px rgba(255,255,255,0.6)`
                    : `0 8px 24px ${role.color}15, inset 0 1px 2px rgba(255,255,255,0.5)`,
                  transform: isHovered || isSelected ? 'translateY(-8px)' : 'translateY(0)',
                  opacity: loading && !isSelected ? 0.5 : 1
                }}
              >
                <div className="flex items-start gap-6">
                  <div
                    className="w-16 h-16 rounded-[18px] flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${role.color} 0%, ${role.color}dd 100%)`, boxShadow: `0 6px 20px ${role.color}40` }}
                  >
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
                      {role.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>
                      {role.desc}
                    </p>
                  </div>
                  {suggestions.includes(role.id) && (
                    <div className="px-3 py-1.5 rounded-full flex items-center gap-1.5" 
                      style={{ background: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                      <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Recommended
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
