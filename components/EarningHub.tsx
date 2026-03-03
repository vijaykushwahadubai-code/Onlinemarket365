
import React, { useState } from 'react';
import { EARNING_PLATFORMS } from '../data/toolsData';

type FilterType = 'All' | 'Read' | 'Watch' | 'Listen' | 'Play';

const EarningHub: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filteredPlatforms = EARNING_PLATFORMS.filter(p => 
    activeFilter === 'All' || p.category === activeFilter
  );

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-12">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white p-10 md:p-14 text-center shadow-2xl border border-emerald-500/50">
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-emerald-300 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-money-bill-wave"></i> Content Monetization
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               Turn Time Into Money
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
               Get paid to read emails, watch videos, listen to music, and play games. Legit platforms for side income.
            </p>

            <div className="flex flex-wrap justify-center gap-2">
               {['All', 'Read', 'Watch', 'Listen', 'Play'].map((filter) => (
                  <button
                     key={filter}
                     onClick={() => setActiveFilter(filter as FilterType)}
                     className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                        activeFilter === filter 
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30' 
                        : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/20'
                     }`}
                  >
                     {filter === 'Read' && <i className="fa-solid fa-book-open mr-2"></i>}
                     {filter === 'Watch' && <i className="fa-solid fa-video mr-2"></i>}
                     {filter === 'Listen' && <i className="fa-solid fa-headphones mr-2"></i>}
                     {filter === 'Play' && <i className="fa-solid fa-gamepad mr-2"></i>}
                     {filter}
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* Stats / Info Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
               <i className="fa-solid fa-check-double"></i>
            </div>
            <div>
               <h3 className="font-bold text-slate-900">Verified & Legit</h3>
               <p className="text-xs text-slate-500">Only trusted platforms listed.</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
               <i className="fa-solid fa-globe"></i>
            </div>
            <div>
               <h3 className="font-bold text-slate-900">Global Access</h3>
               <p className="text-xs text-slate-500">Most work worldwide.</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
               <i className="fa-solid fa-wallet"></i>
            </div>
            <div>
               <h3 className="font-bold text-slate-900">Multiple Payouts</h3>
               <p className="text-xs text-slate-500">PayPal, Crypto, Gift Cards.</p>
            </div>
         </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filteredPlatforms.map((platform, idx) => (
            <div 
               key={idx}
               className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
            >
               {platform.badge && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg z-10">
                     {platform.badge}
                  </div>
               )}

               <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${platform.color} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                     <i className={`fa-solid ${platform.icon}`}></i>
                  </div>
                  <div>
                     <h3 className="font-bold text-lg text-slate-900 leading-tight">{platform.name}</h3>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded-md">{platform.category}</span>
                  </div>
               </div>

               <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {platform.description}
               </p>

               <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 bg-slate-50 p-2 rounded-xl">
                     <span><i className="fa-solid fa-money-bill-transfer mr-1"></i> Payout:</span>
                     <span className="text-slate-700">{platform.payout}</span>
                  </div>
                  
                  <a 
                     href={platform.url} 
                     target="_blank" 
                     rel="noreferrer"
                     className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-emerald-600 transition-all text-center flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                     Start Earning <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                  </a>
               </div>
            </div>
         ))}
      </div>

      {filteredPlatforms.length === 0 && (
         <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-200">
            <i className="fa-solid fa-ghost text-4xl text-slate-300 mb-4"></i>
            <p className="text-slate-500 font-medium">No platforms found for this category.</p>
            <button onClick={() => setActiveFilter('All')} className="mt-4 text-emerald-600 font-bold hover:underline">View All</button>
         </div>
      )}

    </div>
  );
};

export default EarningHub;
