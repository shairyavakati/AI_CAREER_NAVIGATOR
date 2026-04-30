import { Brain, Target, TrendingUp, Zap } from 'lucide-react';
import { AiCoreVisual } from './AiCoreVisual';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-transparent">
      {/* Hero Section - Futuristic AI */}
      <div className="max-w-6xl w-full mb-16 relative">
        <div
          className="rounded-[32px] p-12 backdrop-blur-[40px] border border-white/10 shadow-[0_0_100px_rgba(79,70,229,0.15)] overflow-hidden relative"
          style={{ background: 'rgba(15, 23, 42, 0.6)' }}
        >
          {/* Animated Background Element */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px]" />
          
          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
            <div className="text-left max-w-2xl flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
                <Zap className="w-3.5 h-3.5" />
                Next-Gen AI Technology
              </div>
              <h1 className="mb-6 bg-gradient-to-r from-white via-white to-indigo-300 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, sans-serif', fontSize: '56px', fontWeight: 800, lineHeight: '1.1' }}>
                Navigate Your Career with <span className="text-indigo-400">Realistic AI</span>
              </h1>
              <p className="mb-10 text-slate-400" style={{ fontSize: '18px', lineHeight: '1.8' }}>
                Experience the future of professional growth. Our adaptive AI engine analyzes your skills in real-time, bridging gaps with precision-engineered learning paths.
              </p>
              <div className="flex items-center gap-6">
                <button
                  onClick={onGetStarted}
                  className="px-10 py-5 rounded-[18px] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(129,140,248,0.4)] active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 700,
                  }}
                >
                  Initialize Assistant
                </button>
              </div>
            </div>
            
            <div className="flex-1 w-full lg:w-auto">
              <AiCoreVisual />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards - Modern Dark */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Brain, title: 'Neural Assessment', desc: 'AI-driven skill detection', color: '#818CF8' },
          { icon: Target, title: 'Precision Mapping', desc: 'Targeted gap analysis', color: '#2DD4BF' },
          { icon: TrendingUp, title: 'Adaptive Engine', desc: 'Dynamic learning trajectories', color: '#C084FC' },
          { icon: Zap, title: 'Instant Evolution', desc: 'Accelerated revision system', color: '#4ADE80' }
        ].map((feature, idx) => (
          <div
            key={idx}
            className="rounded-[24px] p-8 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden"
            style={{
              background: 'rgba(30, 41, 59, 0.4)',
              border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div
              className="w-14 h-14 rounded-[18px] flex items-center justify-center mb-6 relative z-10"
              style={{
                background: `linear-gradient(135deg, ${feature.color}20 0%, ${feature.color}05 100%)`,
                border: `1px solid ${feature.color}30`,
                boxShadow: `0 0 20px ${feature.color}15`
              }}
            >
              <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
            </div>
            <h3 className="text-white relative z-10" style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              {feature.title}
            </h3>
            <p className="text-slate-400 text-sm relative z-10 leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
