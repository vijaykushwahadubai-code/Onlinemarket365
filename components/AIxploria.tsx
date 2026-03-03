
import React, { useState, useEffect } from 'react';
import { EXTERNAL_TOOLS } from '../data/toolsData';

const CATEGORIES = ['All', 'LLM', 'Image', 'Video', 'Coding', 'Productivity', 'Marketing'];

const AIxploria: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const searchParam = sessionStorage.getItem('aixploria_search');
    const categoryParam = sessionStorage.getItem('aixploria_category');

    if (searchParam) {
      setSearch(searchParam);
      sessionStorage.removeItem('aixploria_search');
    }
    
    if (categoryParam) {
      setFilter(categoryParam);
      sessionStorage.removeItem('aixploria_category');
    }
  }, []);

  const filteredTools = EXTERNAL_TOOLS.filter(tool => {
    const matchesCategory = filter === 'All' || tool.category === filter;
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) || 
                          tool.company.toLowerCase().includes(search.toLowerCase()) ||
                          tool.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12 animate-fade-in">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-[#0B0F19] text-white p-12 md:p-20 text-center shadow-2xl border border-slate-800">
         {/* Animated Background Elements */}
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0B0F19] to-[#0B0F19]"></div>
         <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
         <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-bold text-cyan-300 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-atom neon-icon"></i> The AI Universe
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
               AIxploria
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-10">
               Explore the galaxy of Artificial Intelligence. A curated directory of the most powerful external tools, models, and platforms shaping the future.
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto group">
               <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search the universe (e.g. Video, OpenAI)..."
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-slate-500 focus:bg-white/15 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all backdrop-blur-md"
               />
               <i className="fa-solid fa-search absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors"></i>
            </div>
         </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
         {CATEGORIES.map(cat => (
            <button
               key={cat}
               onClick={() => setFilter(cat)}
               className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${filter === cat ? 'bg-slate-900 text-white shadow-lg shadow-indigo-500/20' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
            >
               {cat}
            </button>
         ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filteredTools.map((tool, idx) => (
            <div 
               key={idx}
               className="group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
            >
               {tool.badge && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg z-10">
                     {tool.badge}
                  </div>
               )}

               <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${tool.color} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                     <i className={`fa-solid ${tool.icon} neon-icon`}></i>
                  </div>
                  <div>
                     <h3 className="font-bold text-lg text-slate-900 leading-tight">{tool.name}</h3>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{tool.company}</p>
                  </div>
               </div>

               <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                  {tool.description}
               </p>

               <div className="mt-auto">
                  <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                     <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{tool.category}</span>
                     <a 
                        href={tool.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-2 group/link"
                     >
                        Visit Site <i className="fa-solid fa-arrow-up-right-from-square text-xs group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"></i>
                     </a>
                  </div>
               </div>
               
               {/* Decorative gradient on hover */}
               <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
         ))}
      </div>

      {filteredTools.length === 0 && (
         <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-200">
            <i className="fa-solid fa-meteor text-4xl text-slate-300 mb-4 neon-icon"></i>
            <p className="text-slate-500 font-medium">No tools found in this sector of the universe.</p>
            <button onClick={() => {setFilter('All'); setSearch('')}} className="mt-4 text-indigo-600 font-bold hover:underline">Reset Sensors</button>
         </div>
      )}

      {/* Footer Info */}
      <div className="text-center text-slate-400 text-sm py-8">
         <p>Disclaimer: AIxploria is a directory of third-party tools. We are not affiliated with these companies.</p>
      </div>

    </div>
  );
};

export default AIxploria;
