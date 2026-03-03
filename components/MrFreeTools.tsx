
import React, { useState } from 'react';
import { ALL_TOOLS } from '../data/toolsData';
import { AiTool } from '../types';
import { generateText } from '../services/geminiService';

const MR_FREETOOLS_CATEGORY = 'Mr. Freetools';

const MrFreeTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<AiTool | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tools = ALL_TOOLS.filter(t => t.category === MR_FREETOOLS_CATEGORY);
  
  const filteredTools = tools.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRunTool = async () => {
    if (!activeTool) return;
    setLoading(true);
    setResult('');
    
    try {
      let prompt = activeTool.promptTemplate;
      Object.entries(inputValues).forEach(([key, value]) => {
        // Use split().join() for robust replaceAll without regex escaping issues
        prompt = prompt.split(`{{${key}}}`).join(value);
      });
      
      const text = await generateText(prompt, "You are Mr. Freetools, a precise and helpful utility bot. Provide only the requested output (code, text, formula) without markdown backticks unless asked for code blocks.");
      setResult(text);
    } catch (error) {
      setResult("Error executing utility. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeTool = () => {
    setActiveTool(null);
    setInputValues({});
    setResult('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 animate-fade-in p-6 rounded-[3rem] border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] bg-[#0B0F19]/50 backdrop-blur-sm">
      
      {/* Brand Header */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-center text-white relative overflow-hidden shadow-2xl border-b-4 border-cyan-500">
         <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -mr-16 -mt-16"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -ml-16 -mb-16"></div>
         
         <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl text-slate-900 shadow-xl mx-auto mb-6 transform -rotate-6 border-4 border-cyan-400">
               <i className="fa-solid fa-screwdriver-wrench neon-icon"></i>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Mr. Freetools</h1>
            <p className="text-slate-300 text-lg font-medium leading-relaxed mb-8">
               The Swiss Army Knife for the web. Instant, free, AI-powered utilities for developers, designers, and creators.
            </p>
            
            {/* Search */}
            <div className="relative max-w-lg mx-auto">
               <input 
                  type="text" 
                  placeholder="What do you need to fix? (e.g. Regex, Cron, SVG)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 shadow-lg font-medium"
               />
               <i className="fa-solid fa-search absolute right-6 top-1/2 -translate-y-1/2 text-slate-400"></i>
            </div>
         </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filteredTools.map((tool) => (
            <div 
               key={tool.id}
               onClick={() => setActiveTool(tool)}
               className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden"
            >
               <div className="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform shadow-md shadow-cyan-500/20">
                  <i className={`fa-solid ${tool.icon} neon-icon`}></i>
               </div>
               <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-cyan-700 transition-colors">{tool.title}</h3>
               <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1 line-clamp-2">{tool.description}</p>
               
               <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-cyan-600 uppercase tracking-wider">
                  Use Tool <i className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
               </div>
               
               {/* Hover Effect */}
               <div className="absolute inset-x-0 bottom-0 h-1 bg-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
         ))}
         
         {filteredTools.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400">
               <i className="fa-solid fa-toolbox text-4xl mb-3 opacity-30 neon-icon"></i>
               <p>No utilities found matching your search.</p>
            </div>
         )}
      </div>

      {/* Tool Modal */}
      {activeTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={closeTool}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl animate-scale-in flex flex-col max-h-[90vh]">
            
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center text-xl shadow-lg">
                    <i className={`fa-solid ${activeTool.icon} neon-icon`}></i>
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-slate-900">{activeTool.title}</h3>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Mr. Freetools Utility</p>
                 </div>
               </div>
               <button onClick={closeTool} className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all">
                 <i className="fa-solid fa-xmark"></i>
               </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
               <div className="bg-cyan-50 border border-cyan-100 p-4 rounded-xl text-cyan-800 text-sm leading-relaxed">
                  {activeTool.description}
               </div>

               <div className="space-y-4">
                  {activeTool.inputs.map(input => (
                    <div key={input.key}>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">{input.label}</label>
                      <input
                        type="text"
                        placeholder={input.placeholder}
                        value={inputValues[input.key] || ''}
                        onChange={(e) => setInputValues(prev => ({ ...prev, [input.key]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                        onKeyDown={(e) => e.key === 'Enter' && handleRunTool()}
                      />
                    </div>
                  ))}
               </div>

               {result && (
                  <div className="bg-slate-900 rounded-xl p-5 text-white animate-fade-in-up shadow-inner relative overflow-hidden group border border-slate-800">
                    <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                       <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Output</span>
                       <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"><i className="fa-regular fa-copy mr-1"></i> Copy</button>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm font-mono text-slate-300 overflow-x-auto custom-scrollbar">{result}</pre>
                  </div>
               )}
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
               <button onClick={closeTool} className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-white border border-transparent hover:border-slate-200 transition-all">
                 Close
               </button>
               <button 
                 onClick={handleRunTool}
                 disabled={loading}
                 className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700 hover:-translate-y-0.5 shadow-cyan-500/30'}`}
               >
                 {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-bolt neon-icon"></i>}
                 {loading ? 'Processing...' : 'Run Utility'}
               </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MrFreeTools;
