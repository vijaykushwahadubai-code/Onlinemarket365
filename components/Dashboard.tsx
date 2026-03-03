
import React from 'react';
import { ToolId } from '../types';
import { MAIN_NAV, CREATIVE_NAV, TOOLS_NAV, LIFESTYLE_NAV } from '../data/navigation';

interface DashboardProps {
  onNavigate: (tool: ToolId) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [zoomedCard, setZoomedCard] = React.useState<ToolId | null>(null);

  const handleCardClick = (id: ToolId) => {
    setZoomedCard(id);
    setTimeout(() => {
      onNavigate(id);
    }, 500);
  };

  const handleIconMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    e.currentTarget.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
  };

  const handleIconMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translate(0px, 0px) scale(1)';
  };

  const renderSection = (title: string, icon: string, description: string, items: typeof MAIN_NAV, gradient: string) => (
    <div className="relative space-y-6 animate-fade-in-up mb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2 border-b border-white/5 pb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-2xl bg-gradient-to-br ${gradient} text-white ring-1 ring-white/20 backdrop-blur-xl`}>
            <i className={`${icon} neon-icon`}></i>
          </div>
          <div>
             <h2 className="text-3xl font-heading font-bold text-white tracking-tight drop-shadow-sm">{title}</h2>
             <p className="text-slate-300 font-medium text-sm mt-1">{description}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 relative z-10">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleCardClick(item.id)}
            className={`group relative flex flex-col p-8 h-full text-left rounded-[2rem] bg-slate-900/40 hover:bg-slate-800/60 border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl backdrop-blur-md overflow-hidden ring-1 ring-white/5 min-h-[280px] glass-panel animate-float ${zoomedCard === item.id ? 'zoomed' : ''}`}
          >
            {/* Subtle internal glow on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

            <div className="flex items-start justify-between w-full mb-6 relative z-10">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 bg-white/5 border border-white/10 text-slate-200 group-hover:text-white shadow-lg magnetic-icon"
                onMouseMove={handleIconMouseMove}
                onMouseLeave={handleIconMouseLeave}
              >
                <i className={`${item.icon} transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12 neon-icon`}></i>
              </div>
              <div className="flex flex-col gap-2 items-end">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-black transition-all">
                   <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                 </div>
                 {/* Freemium / Pro Badges */}
                 {['VIDEO_STUDIO', 'LOGIC_ARCHITECT', 'FUTURE_LABS'].includes(item.id) && (
                    <span className="text-[10px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded shadow-lg uppercase tracking-wide">
                       PRO
                    </span>
                 )}
              </div>
            </div>
            
            <div className="relative z-10 mt-auto">
              <h3 className="text-2xl font-bold text-slate-100 mb-2 group-hover:text-white transition-colors">{item.label}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium line-clamp-2 group-hover:text-slate-300">
                {item.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-full mx-auto space-y-12 pb-20 p-6 rounded-[3rem] border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)] bg-[#0B0F19]/50 backdrop-blur-sm">
        
        {/* Zoom Overlay */}
        <div className={`zoom-overlay ${zoomedCard ? 'active' : ''}`}></div>

        {/* Transparent Glass Hero Section */}
        <div className="relative rounded-[3rem] overflow-hidden bg-white/5 p-12 md:p-24 shadow-2xl border border-white/10 backdrop-blur-xl animate-fade-in group mt-4">
           
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-10">
                  <div>
                    <h1 className="text-5xl md:text-7xl xl:text-8xl font-heading font-black tracking-tight leading-tight text-white mb-2 drop-shadow-lg flex items-center flex-wrap">
                        Market<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">365</span>
                        <span className="text-indigo-400 text-4xl md:text-5xl ml-3 opacity-90"><i className="fa-solid fa-infinity neon-icon"></i></span>
                    </h1>
                    <p className="text-2xl md:text-3xl text-slate-300 font-light">
                        The Operating System for <span className="font-bold text-white">Modern Business</span>.
                    </p>
                  </div>
                  
                  <p className="text-xl text-slate-400 leading-relaxed max-w-xl border-l-2 border-white/20 pl-6">
                     Access a unified suite of AI agents, creative studios, and analytics tools designed to scale your operations instantly.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 pt-6">
                     <button 
                        onClick={() => onNavigate(ToolId.CHAT)}
                        className="px-10 py-5 bg-white text-black rounded-2xl font-bold text-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all flex items-center gap-3 group"
                     >
                        <i className="fa-solid fa-robot text-indigo-600 text-2xl neon-icon"></i>
                        Launch AI
                     </button>
                     <button 
                        onClick={() => onNavigate(ToolId.TOOL_EXPLORER)}
                        className="px-10 py-5 bg-black/30 border border-white/20 text-white rounded-2xl font-bold text-xl hover:bg-black/50 hover:border-white/40 transition-all flex items-center gap-3 hover:-translate-y-1 backdrop-blur-md group"
                     >
                        <i className="fa-solid fa-compass text-2xl neon-icon"></i>
                        Explorer
                     </button>
                  </div>
              </div>

              {/* Holographic Visual */}
              <div className="relative hidden lg:flex items-center justify-center h-full min-h-[500px]">
                 {/* Glowing Orb behind image */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 blur-[100px] rounded-full pointer-events-none animate-pulse-slow"></div>
                 
                 <div className="relative w-full max-w-lg bg-black/40 border border-white/10 rounded-[2.5rem] p-4 backdrop-blur-md shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-indigo-500 rounded-full blur-2xl opacity-60"></div>
                    <img 
                       src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2232&auto=format&fit=crop" 
                       className="rounded-[2rem] w-full h-80 object-cover shadow-inner opacity-90 hover:opacity-100 transition-opacity" 
                       alt="Dashboard Interface"
                    />
                    <div className="mt-4 flex gap-3">
                        <div className="flex-1 h-24 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center items-center">
                            <span className="text-3xl font-bold text-white">98%</span>
                            <span className="text-xs uppercase text-slate-400 tracking-wider font-bold">Efficiency</span>
                        </div>
                        <div className="flex-1 h-24 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center items-center">
                            <span className="text-3xl font-bold text-emerald-400">24/7</span>
                            <span className="text-xs uppercase text-slate-400 tracking-wider font-bold">Uptime</span>
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* 1. Core Modules */}
        {renderSection(
          "Core Modules", 
          "fa-solid fa-cube", 
          "Essential management tools.",
          MAIN_NAV,
          "from-indigo-600 to-blue-600"
        )}

        {/* 2. Creative Studio */}
        {renderSection(
          "Creative Studio", 
          "fa-solid fa-wand-magic-sparkles", 
          "Generative AI for media.",
          CREATIVE_NAV,
          "from-pink-600 to-rose-600"
        )}

        {/* 3. Toolbox */}
        {renderSection(
          "Utility Toolbox", 
          "fa-solid fa-toolbox", 
          "Everyday productivity utilities.",
          TOOLS_NAV,
          "from-emerald-600 to-teal-600"
        )}

        {/* 4. Lifestyle */}
        {renderSection(
          "Lifestyle Hubs", 
          "fa-solid fa-mug-hot", 
          "Entertainment and personal growth.",
          LIFESTYLE_NAV,
          "from-amber-500 to-orange-600"
        )}

        {/* Footer Info */}
        <div className="border-t border-white/5 pt-12 mt-20 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-slate-500 bg-black/20 p-10 rounded-[2rem] backdrop-blur-md animate-fade-in">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white text-xl">
                 <i className="fa-solid fa-infinity"></i>
              </div>
              <p className="font-medium text-slate-400 text-base">
                 © 2026 Market365 Pro. <br/>All rights reserved.
              </p>
           </div>
           
           <div className="flex flex-col items-center md:items-end gap-6">
               <div className="flex gap-8 text-base">
                  <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
                  <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
                  <span className="hover:text-white cursor-pointer transition-colors">Support</span>
               </div>
               
               {/* System Online Badge */}
               <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs font-bold text-emerald-400 shadow-lg hover:bg-black/60 transition-colors cursor-default">
                  <span className="relative flex h-2.5 w-2.5">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  System Online
               </div>
           </div>
        </div>
    </div>
  );
};

export default Dashboard;
