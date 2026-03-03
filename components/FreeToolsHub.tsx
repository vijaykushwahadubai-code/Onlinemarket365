import React, { useState } from 'react';
import { ALL_TOOLS } from '../data/toolsData';
import { AiTool } from '../types';
import { generateText } from '../services/geminiService';

const CATEGORY_FILTERS = ['All', 'Text', 'SEO', 'Dev', 'Fun'];

// Helper to map utilities to sub-filters
const getToolSubCategory = (tool: AiTool): string => {
  const id = tool.id;
  if (['mkt-2', 'util-11', 'util-12'].includes(id)) return 'SEO';
  if (['write-1', 'write-2', 'write-3', 'util-6', 'util-13'].includes(id)) return 'Text';
  if (['code-1', 'code-2', 'util-1', 'biz-1'].includes(id)) return 'Dev';
  if (['util-2', 'util-3', 'util-4', 'util-5', 'util-7', 'util-9', 'util-10'].includes(id)) return 'Fun';
  return 'Other';
};

const ToolCard: React.FC<{ tool: AiTool; onClick: (tool: AiTool) => void }> = ({ tool, onClick }) => {
  const subCat = getToolSubCategory(tool);
  let colorClass = "bg-indigo-50 text-indigo-600";
  if (subCat === 'SEO') colorClass = "bg-blue-50 text-blue-600";
  if (subCat === 'Fun') colorClass = "bg-pink-50 text-pink-600";
  if (subCat === 'Dev') colorClass = "bg-slate-100 text-slate-600";
  if (subCat === 'Text') colorClass = "bg-emerald-50 text-emerald-600";

  return (
    <div 
      onClick={() => onClick(tool)}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>
        <i className={`fa-solid ${tool.icon}`}></i>
      </div>
      <div className="flex items-center gap-2 mb-2">
         <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{tool.title}</h3>
         {subCat !== 'Other' && (
           <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">{subCat}</span>
         )}
      </div>
      <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{tool.description}</p>
      <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-slate-800 transition-colors uppercase tracking-wider">
        Try It Free <i className="fa-solid fa-arrow-right ml-2"></i>
      </div>
    </div>
  );
};

const FreeToolsHub: React.FC = () => {
  const [activeTool, setActiveTool] = useState<AiTool | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Base list of tools for the hub (Utilities + select others)
  const hubTools = ALL_TOOLS.filter(t => 
    t.category === 'Utilities' || 
    ['mkt-2', 'write-1', 'write-2', 'code-2', 'biz-1'].includes(t.id)
  );

  // Filter Logic
  const filteredTools = hubTools.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'All') return matchesSearch;
    return matchesSearch && getToolSubCategory(t) === selectedFilter;
  });

  const openTool = (tool: AiTool) => {
    setActiveTool(tool);
    setInputValues({});
    setResult('');
    setLoading(false);
  };

  const closeTool = () => {
    setActiveTool(null);
  };

  const handleRunTool = async () => {
    if (!activeTool) return;
    setLoading(true);
    setResult('');
    try {
      let prompt = activeTool.promptTemplate;
      Object.entries(inputValues).forEach(([key, value]) => {
        prompt = prompt.replace(`{{${key}}}`, value);
      });
      const text = await generateText(prompt, "You are a helpful utility assistant. Keep answers concise and direct.");
      setResult(text);
    } catch (error) {
      setResult("Error generating content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 animate-fade-in">
       {/* Header */}
       <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-teal-500/10 to-transparent"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
             <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4">
               No Login Required
             </div>
             <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Free Tools Hub</h1>
             <p className="text-slate-300 text-lg font-medium leading-relaxed mb-8">
               Instantly access our collection of handy utilities. From SEO generators to quick text fixers.
             </p>
             
             {/* Search Bar */}
             <div className="relative max-w-lg mx-auto mb-6">
               <input 
                  type="text" 
                  placeholder="Search tools (e.g. Meta Tags, Password)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 shadow-lg"
               />
               <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <i className="fa-solid fa-search"></i>
               </div>
             </div>

             {/* Categories */}
             <div className="flex flex-wrap justify-center gap-2">
                {CATEGORY_FILTERS.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${selectedFilter === filter ? 'bg-white text-slate-900 border-white' : 'bg-transparent text-slate-300 border-slate-700 hover:border-slate-500'}`}
                  >
                    {filter}
                  </button>
                ))}
             </div>
          </div>
       </div>

       {/* Tools Grid */}
       {filteredTools.length > 0 ? (
         <div>
           <div className="flex items-center gap-3 mb-6 px-2">
              <i className="fa-solid fa-bolt text-amber-500 text-xl"></i>
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedFilter === 'All' ? 'All Utilities' : `${selectedFilter} Tools`}
              </h2>
              <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {filteredTools.length}
              </span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                 <ToolCard key={tool.id} tool={tool} onClick={openTool} />
              ))}
           </div>
         </div>
       ) : (
         <div className="text-center py-12 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
           <i className="fa-solid fa-ghost text-4xl mb-4 opacity-50"></i>
           <p>No tools found matching "{searchQuery}" in {selectedFilter}</p>
           <button onClick={() => {setSearchQuery(''); setSelectedFilter('All')}} className="mt-2 text-indigo-600 font-bold hover:underline">Clear Filters</button>
         </div>
       )}

       {/* Modal */}
       {activeTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={closeTool}></div>
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl animate-scale-in">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <i className={`fa-solid ${activeTool.icon}`}></i>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">{activeTool.title}</h3>
               </div>
               <button onClick={closeTool} className="text-slate-400 hover:text-slate-700 transition-colors">
                 <i className="fa-solid fa-xmark text-xl"></i>
               </button>
            </div>
            
            <div className="p-6 space-y-6">
               <p className="text-slate-600">{activeTool.description}</p>
               <div className="space-y-4">
                  {activeTool.inputs.map(input => (
                    <div key={input.key}>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{input.label}</label>
                      <input
                        type="text"
                        placeholder={input.placeholder}
                        value={inputValues[input.key] || ''}
                        onChange={(e) => setInputValues(prev => ({ ...prev, [input.key]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                      />
                    </div>
                  ))}
               </div>

               {result && (
                  <div className="bg-slate-900 rounded-xl p-4 text-white mt-4 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
                       <span className="text-xs font-bold text-emerald-400 uppercase">Output</span>
                       <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-slate-400 hover:text-white"><i className="fa-regular fa-copy"></i> Copy</button>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{result}</p>
                  </div>
               )}

               <button 
                 onClick={handleRunTool}
                 disabled={loading}
                 className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all ${loading ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 shadow-emerald-500/30'}`}
               >
                 {loading ? 'Processing...' : 'Run Tool'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeToolsHub;