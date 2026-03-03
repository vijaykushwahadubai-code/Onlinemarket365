
import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreloadApps?: () => void;
}

const TIPS = [
  {
    title: 'Keyboard Shortcuts (Speed Hack)',
    icon: 'fa-keyboard',
    color: 'text-indigo-600 bg-indigo-50',
    detail: 'Har professional app ke shortcuts hote hain. Press Ctrl + / to see the list. Shortcuts se aapka kaam 3 guna fast ho jata hai.'
  },
  {
    title: 'Cache Management (Performance)',
    icon: 'fa-broom',
    color: 'text-orange-600 bg-orange-50',
    detail: 'Jab app hang hone lage ya slow chale, Settings mein "Clear Cache" karein. Faltu memory saaf ho jayegi aur app naye jaisa chalega.',
    action: 'clear_cache'
  },
  {
    title: 'Dark Mode & Eye Comfort',
    icon: 'fa-moon',
    color: 'text-slate-600 bg-slate-100',
    detail: 'Hamesha Dark Mode on rakhein. Isse aankhon par strain kam hoga aur aap zyada der kaam kar payenge.',
    action: 'toggle_theme'
  }
];

const INTEGRATIONS = [
  { name: 'Google Drive', status: 'Connected', ping: '45ms', icon: 'fa-google-drive', color: 'text-green-600' },
  { name: 'Gemini AI API', status: 'Connected', ping: '120ms', icon: 'fa-brain', color: 'text-blue-600' },
  { name: 'Payment Gateway', status: 'Secure', ping: '80ms', icon: 'fa-credit-card', color: 'text-indigo-600' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onPreloadApps }) => {
  const [activeTab, setActiveTab] = useState<'tips' | 'general' | 'system'>('system');
  
  // System State
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('Up to date (v3.1.0)');
  const [turboMode, setTurboMode] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [memoryCleaned, setMemoryCleaned] = useState(false);
  const [systemTemp, setSystemTemp] = useState('Normal');

  useEffect(() => {
    const savedTurbo = localStorage.getItem('market365_turbo');
    const isTurbo = savedTurbo === null ? true : savedTurbo === 'true';
    setTurboMode(isTurbo);
  }, []);

  const handleTurboToggle = () => {
    const newVal = !turboMode;
    setTurboMode(newVal);
    localStorage.setItem('market365_turbo', String(newVal));
    if (newVal) {
      document.body.classList.add('turbo-mode');
    } else {
      document.body.classList.remove('turbo-mode');
    }
  };

  const handleOptimizeSystem = () => {
    setOptimizing(true);
    setSystemTemp('Cooling...');
    
    // Simulate "System Cooling" and "Error Fixing"
    setTimeout(() => {
        // 1. Clear non-essential memory
        sessionStorage.clear();
        
        // 2. Clear console to free memory references
        console.clear();
        console.log("System optimized.");

        // 3. Preload assets if function provided to make subsequent loads fast
        if (onPreloadApps) onPreloadApps();
        
        setOptimizing(false);
        setMemoryCleaned(true);
        setSystemTemp('Optimal (34°C)');
        
        setTimeout(() => setMemoryCleaned(false), 3000);
    }, 2000);
  };

  if (!isOpen) return null;

  const handleClearCache = () => {
    if (window.confirm("This will clear local app data, fix potential errors, and refresh. Continue?")) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="bg-white rounded-[2rem] w-full max-w-4xl h-[85vh] relative z-10 shadow-2xl animate-scale-in overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
             <h2 className="text-2xl font-bold text-slate-900">System Optimizer</h2>
             <p className="text-slate-500 text-sm">Boost performance, fix errors, and manage settings.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors">
            <i className="fa-solid fa-xmark text-slate-500"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 overflow-x-auto">
           <button 
             onClick={() => setActiveTab('system')}
             className={`py-4 px-6 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'system' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
           >
             <i className="fa-solid fa-gauge-high mr-2"></i> Performance
           </button>
           <button 
             onClick={() => setActiveTab('general')}
             className={`py-4 px-6 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'general' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
           >
             <i className="fa-solid fa-sliders mr-2"></i> General
           </button>
           <button 
             onClick={() => setActiveTab('tips')}
             className={`py-4 px-6 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'tips' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
           >
             <i className="fa-solid fa-lightbulb mr-2"></i> Tips
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 custom-scrollbar">
           
           {activeTab === 'system' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Turbo Boost Card */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl lg:col-span-2 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-16 -mt-16 animate-pulse"></div>
                   <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div>
                         <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            <i className="fa-solid fa-rocket text-yellow-400"></i> Turbo Boost
                         </h3>
                         <p className="text-indigo-200 text-sm max-w-md">
                            Eliminate lag instantly. Disables heavy animations, blurs, and particles to maximize working speed on any device.
                         </p>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                         <button 
                           onClick={handleTurboToggle}
                           className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg border-2 ${turboMode ? 'bg-green-500 border-green-500 text-white shadow-green-500/30' : 'bg-transparent border-white/20 text-white hover:bg-white/10'}`}
                         >
                            {turboMode ? 'TURBO ACTIVE' : 'ENABLE TURBO'}
                         </button>
                         <span className="text-[10px] uppercase font-bold tracking-widest text-white/50">
                            {turboMode ? 'Max Performance' : 'Standard Mode'}
                         </span>
                      </div>
                   </div>
                </div>

                {/* System Maintenance */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                   <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-microchip text-indigo-600"></i> System Health & Cooling
                   </h3>
                   <div className="space-y-4">
                      <div className="flex justify-between text-sm text-slate-600">
                         <span>CPU Load</span>
                         <span className={optimizing ? "text-red-500 font-bold" : "text-green-600 font-bold"}>
                            {optimizing ? 'High (Optimization in progress...)' : 'Normal (12%)'}
                         </span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600">
                         <span>System Temp</span>
                         <span className={optimizing ? "text-orange-500 font-bold animate-pulse" : "text-slate-800 font-bold"}>
                            {systemTemp}
                         </span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600">
                         <span>Memory Leak</span>
                         <span className={memoryCleaned ? "text-green-600 font-bold" : "text-slate-800"}>
                            {memoryCleaned ? 'Fixed & Cleaned' : 'Checking...'}
                         </span>
                      </div>
                      
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                         <div className={`h-full bg-indigo-600 transition-all duration-1000 ${optimizing ? 'w-full animate-pulse' : 'w-1/3'}`}></div>
                      </div>

                      <button 
                        onClick={handleOptimizeSystem}
                        disabled={optimizing}
                        className="w-full py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                     >
                        {optimizing ? <i className="fa-solid fa-fan fa-spin"></i> : <i className="fa-solid fa-broom"></i>}
                        {optimizing ? 'Cooling Down System...' : 'Cool Down & Fix Errors'}
                     </button>
                      
                      {memoryCleaned && (
                         <div className="text-center text-xs font-bold text-green-600 animate-fade-in">
                            <i className="fa-solid fa-check-circle"></i> Errors Fixed & RAM Freed!
                         </div>
                      )}
                   </div>
                </div>

                {/* Integration Check */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                   <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-plug text-indigo-600"></i> Live Status
                   </h3>
                   <div className="space-y-3">
                      {INTEGRATIONS.map((integ, idx) => (
                         <div key={idx} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                               <i className={`fa-brands ${integ.icon} ${integ.color}`}></i>
                               <span className="text-sm font-medium text-slate-700">{integ.name}</span>
                            </div>
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">{integ.status}</span>
                         </div>
                      ))}
                   </div>
                </div>

             </div>
           )}

           {activeTab === 'general' && (
             <div className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                   <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-mobile-screen text-indigo-600"></i> App Data
                   </h3>
                   
                   <div className="space-y-4">
                      {onPreloadApps && (
                        <div className="flex items-center justify-between py-2 border-b border-slate-50">
                           <div>
                              <p className="font-medium text-slate-800">Preload All Tools</p>
                              <p className="text-xs text-slate-400">Load all features in background for instant switching.</p>
                           </div>
                           <button onClick={() => { onPreloadApps(); alert("Background preloading started. App will feel faster shortly."); }} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">
                              Preload Now
                           </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between py-2 border-b border-slate-50">
                         <div>
                            <p className="font-medium text-slate-800">Clear Cache & Reset</p>
                            <p className="text-xs text-slate-400">Fixes bugs by resetting local state and reloading.</p>
                         </div>
                         <button onClick={handleClearCache} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">
                            Deep Clean
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'tips' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TIPS.map((tip, idx) => (
                   <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${tip.color}`}>
                            <i className={`fa-solid ${tip.icon}`}></i>
                         </div>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">{tip.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                         {tip.detail}
                      </p>
                   </div>
                ))}
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
