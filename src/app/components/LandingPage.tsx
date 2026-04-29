import { Brain, Target, TrendingUp, Zap } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Hero Section - Glassmorphic */}
      <div className="max-w-6xl w-full mb-16">
        <div
          className="rounded-[20px] p-12 backdrop-blur-[30px] border border-white/30 shadow-[0_8px_32px_rgba(79,70,229,0.12)]"
          style={{ background: 'rgba(255, 255, 255, 0.7)' }}
        >
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '40px', fontWeight: 700, color: '#111827' }}>
              AI Career Navigator
            </h1>
            <p className="mb-8 text-[#6B7280]" style={{ fontSize: '18px', lineHeight: '1.7' }}>
              Personalized learning paths powered by adaptive AI. Master your skills with intelligent revision scheduling and real-time progress tracking.
            </p>
            <button
              onClick={onGetStarted}
              className="px-10 py-4 rounded-[16px] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(79,70,229,0.3)]"
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(79, 70, 229, 0.25)'
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards - Claymorphic */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Brain, title: 'AI-Powered', desc: 'Intelligent skill assessment', color: '#4F46E5' },
          { icon: Target, title: 'Skill Gap Analysis', desc: 'Identify learning opportunities', color: '#06B6D4' },
          { icon: TrendingUp, title: 'Adaptive Learning', desc: 'Personalized study paths', color: '#8B5CF6' },
          { icon: Zap, title: 'Smart Revision', desc: 'Spaced repetition system', color: '#10B981' }
        ].map((feature, idx) => (
          <div
            key={idx}
            className="rounded-[20px] p-8 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${feature.color}15 0%, ${feature.color}08 100%)`,
              border: `2px solid ${feature.color}20`,
              boxShadow: `0 8px 24px ${feature.color}15, inset 0 1px 2px rgba(255,255,255,0.5)`
            }}
          >
            <div
              className="w-14 h-14 rounded-[16px] flex items-center justify-center mb-6"
              style={{
                background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}dd 100%)`,
                boxShadow: `0 4px 16px ${feature.color}40`
              }}
            >
              <feature.icon className="w-7 h-7 text-white" />
            </div>
            <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
              {feature.title}
            </h3>
            <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
