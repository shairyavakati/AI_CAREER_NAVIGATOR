import React from 'react';

export function AiCoreVisual() {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent blur-3xl" />
      
      {/* Outer Rotating Ring */}
      <div className="absolute w-64 h-64 border-2 border-indigo-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
      <div className="absolute w-64 h-64 border-t-2 border-indigo-400 rounded-full animate-[spin_10s_linear_infinite]" />
      
      {/* Middle Rotating Ring */}
      <div className="absolute w-48 h-48 border border-cyan-500/20 rounded-full animate-[spin_7s_linear_infinite_reverse]" />
      <div className="absolute w-48 h-48 border-b-2 border-cyan-400 rounded-full animate-[spin_7s_linear_infinite_reverse]" />
      
      {/* Inner Core */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Glowing Orb */}
        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-40 animate-pulse" />
        <div className="absolute inset-2 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full shadow-[0_0_40px_rgba(129,140,248,0.8)]" />
        
        {/* Core Detail */}
        <div className="absolute inset-8 border border-white/30 rounded-full animate-ping" />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="w-1 h-12 bg-white/40 rounded-full rotate-45" />
          <div className="w-1 h-12 bg-white/40 rounded-full -rotate-45" />
        </div>
      </div>
      
      {/* Floating Particles (CSS Only) */}
      {[...Array(6)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float shadow-[0_0_8px_#22d3ee]"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
            animationDelay: `${i * 0.5}s`,
            opacity: 0.6
          }}
        />
      ))}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-35px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(-15px); }
        }
      `}} />
    </div>
  );
}
