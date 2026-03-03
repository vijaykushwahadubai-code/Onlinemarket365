
import React, { useState, useEffect } from 'react';
import { ToolId } from '../types';
import { MAIN_NAV, CREATIVE_NAV, TOOLS_NAV, LIFESTYLE_NAV, FOOTER_NAV } from '../data/navigation';

interface SidebarProps {
  activeTool: ToolId;
  onNavigate: (tool: ToolId) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onOpenSettings: () => void;
  onOpenFeedback: () => void;
  accentColor?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onNavigate, isOpen, setIsOpen, onOpenSettings, onOpenFeedback, accentColor = '#6366f1' }) => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setInstallPrompt(null);
    });
  };

  const renderNavGroup = (title: string, items: typeof MAIN_NAV) => (
    <div className="mb-8 animate-fade-in">
      <p className="px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 opacity-80 font-heading">{title}</p>
      <div className="space-y-1 px-3">
        {items.map((item) => {
          const isActive = activeTool === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden
                ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}
              `}
              style={isActive ? { 
                backgroundColor: `${accentColor}1A`,
                borderColor: `${accentColor}26`,
                borderWidth: '1px',
                borderStyle: 'solid',
                color: '#fff'
              } : {}}
            >
              <div 
                className={`
                  relative w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-500
                  ${isActive ? 'text-white' : 'bg-transparent group-hover:bg-slate-800/80'}
                  overflow-hidden
                `}
                style={isActive ? {
                  backgroundColor: accentColor,
                  color: '#fff',
                  boxShadow: `0 0 15px ${accentColor}66`
                } : {}}
              >
                {/* Hover Glow Effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-indigo-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-lg"></div>
                )}
                <i className={`${item.icon} text-xs relative z-10 transition-all duration-500 ease-out group-hover:scale-[1.3] group-hover:-rotate-12 neon-icon`}></i>
              </div>
              
              <span className={`text-sm font-medium tracking-wide transition-all z-10 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                {item.label}
              </span>
              
              {isActive && (
                <div 
                  className="ml-auto w-1.5 h-1.5 rounded-full" 
                  style={{ 
                    backgroundColor: accentColor,
                    boxShadow: `0 0 8px ${accentColor}`
                  }}
                ></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden transition-opacity backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed md:sticky md:top-0 inset-y-0 left-0 z-50 w-72 transform transition-transform duration-500 cubic-bezier(0.19, 1, 0.22, 1)
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          bg-[#0B0F19]/90 backdrop-blur-2xl border-r border-white/5 h-screen flex flex-col shadow-2xl md:shadow-none
        `}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between shrink-0 relative z-20">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => onNavigate(ToolId.DASHBOARD)}
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xl transition-all duration-500 ring-1 ring-white/10 group-hover:shadow-indigo-500/50 group-hover:scale-110 overflow-hidden relative"
              style={{ backgroundColor: accentColor, boxShadow: `0 0 20px ${accentColor}40` }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              <i className="fa-solid fa-cube text-lg relative z-10 transition-transform duration-500 group-hover:rotate-180 group-hover:scale-110 neon-icon"></i>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl text-white leading-none tracking-tight flex items-center">
                Market<span style={{ color: accentColor }}>365</span>
                <span style={{ color: accentColor }} className="text-sm ml-1 opacity-90"><i className="fa-solid fa-infinity neon-icon"></i></span>
              </span>
              <span className="text-[9px] font-bold text-slate-500 mt-1.5 tracking-[0.2em] uppercase group-hover:text-white transition-colors">Pro Suite v3.0</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors p-2 bg-white/5 rounded-lg">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar scroll-smooth relative z-10">
          {renderNavGroup('Core Modules', MAIN_NAV)}
          {renderNavGroup('Creative Studio', CREATIVE_NAV)}
          {renderNavGroup('Toolbox', TOOLS_NAV)}
          {renderNavGroup('Lifestyle', LIFESTYLE_NAV)}
          {renderNavGroup('System', FOOTER_NAV)}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#0B0F19]/50 shrink-0 z-20 backdrop-blur-md space-y-3">
          
          {/* Pro Badge (Freemium Look) */}
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-3">
             <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">Pro Plan Active</span>
                <span className="text-[10px] text-amber-200">85%</span>
             </div>
             <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
             </div>
             <p className="text-[9px] text-slate-400 mt-1.5">15/20 Credits remaining today.</p>
          </div>

          {/* Install App Button */}
          {installPrompt && (
            <button
              onClick={handleInstallClick}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 animate-pulse-slow"
            >
              <i className="fa-solid fa-download"></i> Install App
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
             <button 
               onClick={onOpenFeedback}
               className="group py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-white/10 hover:shadow-lg hover:shadow-white/5"
             >
               <i className="fa-regular fa-comment-dots transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12 neon-icon"></i> Feedback
             </button>
             <button 
               onClick={onOpenSettings}
               className="group py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-white/10 hover:shadow-lg hover:shadow-white/5"
             >
               <i className="fa-solid fa-gear transition-transform duration-500 group-hover:rotate-90 group-hover:scale-125 neon-icon"></i> Settings
             </button>
          </div>
          
          <div className="flex items-center justify-between px-3 py-2 bg-black/20 rounded-lg border border-white/5">
             <div className="flex items-center gap-2">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Online</span>
             </div>
             <div className="flex gap-3 text-slate-600 text-[10px]">
                <i className="fa-brands fa-google hover:text-white cursor-pointer transition-colors" title="Google Gemini"></i>
                <i className="fa-brands fa-aws hover:text-white cursor-pointer transition-colors" title="Cloud Sync"></i>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
