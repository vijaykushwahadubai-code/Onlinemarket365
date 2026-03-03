
import React, { useState, useEffect, useRef } from 'react';
import { generateReasoning } from '../services/geminiService';
import { ThinkingLevel } from '@google/genai';

const BUDGET_OPTIONS = [
  { value: ThinkingLevel.LOW, label: 'Fast Reasoning', desc: 'Good for quick logic checks & optimization', icon: 'fa-bolt' },
  { value: ThinkingLevel.HIGH, label: 'Deep Thinker', desc: 'Best for complex algorithms & architecture', icon: 'fa-brain' },
];

const LOGIC_RESOURCES = [
  { name: 'LeetCode', url: 'https://leetcode.com', icon: 'fa-code', color: 'bg-orange-500', desc: 'Practice coding problems and prepare for interviews.' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'fa-layer-group', color: 'bg-orange-600', desc: 'Community-based question and answer site for developers.' },
  { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org', icon: 'fa-terminal', color: 'bg-green-600', desc: 'Computer science portal for geeks.' },
  { name: 'WolframAlpha', url: 'https://www.wolframalpha.com', icon: 'fa-square-root-variable', color: 'bg-red-500', desc: 'Computational intelligence and knowledge engine.' },
  { name: 'HackerRank', url: 'https://www.hackerrank.com', icon: 'fa-laptop-code', color: 'bg-green-700', desc: 'Practice coding, compete, and find jobs.' },
  { name: 'GitHub', url: 'https://github.com', icon: 'fa-github', color: 'bg-slate-800', desc: 'World\'s largest software development platform.' },
];

const LogicArchitect: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [budget, setBudget] = useState<ThinkingLevel>(ThinkingLevel.HIGH);
  const [fullOutput, setFullOutput] = useState('');
  const [displayedOutput, setDisplayedOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Typewriter effect
  useEffect(() => {
    if (!fullOutput) return;
    setDisplayedOutput('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedOutput(prev => prev + fullOutput.charAt(i));
      i++;
      if (i >= fullOutput.length) clearInterval(interval);
    }, 5); // 5ms per char for a fast but noticeable typing effect
    return () => clearInterval(interval);
  }, [fullOutput]);

  const handleSolve = async () => {
    if (!problem.trim()) return;
    setLoading(true);
    setFullOutput('');
    setDisplayedOutput('');
    setCopied(false);

    const prompt = `You are a Logic Architect, an advanced AI programming assistant capable of deep reasoning.
    
    Task:
    ${problem}
    
    Instructions:
    1. Analyze the problem thoroughly using your thinking budget.
    2. Provide a structured solution. If code is required, write efficient, clean, and commented code.
    3. Explain your reasoning process briefly before the solution.
    4. Consider edge cases and potential optimizations.`;

    try {
      const result = await generateReasoning(prompt, budget);
      setFullOutput(result);
    } catch (e) {
      setFullOutput("An error occurred during the reasoning process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!fullOutput) return;
    navigator.clipboard.writeText(fullOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12 animate-fade-in">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-[#0A0E17] text-white p-10 md:p-14 text-center shadow-2xl border border-cyan-900/50">
         <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] -mr-20 -mt-20 animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-bold text-cyan-300 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-network-wired"></i> Cognitive Engine
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
               Logic Architect
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
               A program that thinks before it speaks. Use deep reasoning to solve complex algorithmic problems, design system architectures, and debug intricate logic.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Input Panel */}
         <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 h-full flex flex-col">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center text-lg shadow-lg shadow-cyan-500/20">
                     <i className="fa-solid fa-code-branch"></i>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Define Problem</h2>
               </div>

               <div className="flex-1 space-y-6">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Complexity Level (Thinking Budget)</label>
                     <div className="grid grid-cols-1 gap-3">
                        {BUDGET_OPTIONS.map((opt) => (
                           <button
                              key={opt.value}
                              onClick={() => setBudget(opt.value)}
                              className={`flex items-center gap-4 p-3 rounded-xl border transition-all text-left group ${budget === opt.value ? 'bg-cyan-50 border-cyan-200 ring-1 ring-cyan-500/20' : 'bg-white border-slate-200 hover:border-cyan-200 hover:bg-slate-50'}`}
                           >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-colors ${budget === opt.value ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:text-cyan-600'}`}>
                                 <i className={`fa-solid ${opt.icon}`}></i>
                              </div>
                              <div>
                                 <span className={`block text-sm font-bold ${budget === opt.value ? 'text-cyan-900' : 'text-slate-700'}`}>{opt.label}</span>
                                 <span className="text-[10px] text-slate-500">{opt.desc}</span>
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Problem Statement</label>
                     <textarea 
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all h-48 resize-none font-mono text-sm text-slate-700 placeholder:text-slate-400"
                        placeholder="// Describe your algorithm, architecture, or logic puzzle here..."
                        spellCheck={false}
                     />
                  </div>

                  <button 
                     onClick={handleSolve}
                     disabled={loading || !problem.trim()}
                     className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 ${loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-slate-900 hover:bg-cyan-600 hover:-translate-y-0.5 shadow-slate-900/30'}`}
                  >
                     {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Reasoning...</> : <><i className="fa-solid fa-play"></i> Initialize Thinker</>}
                  </button>
               </div>
            </div>
         </div>

         {/* Output Panel */}
         <div className="lg:col-span-7">
            <div className={`bg-[#1e1e24] rounded-[2rem] p-8 shadow-2xl h-full border border-slate-800 flex flex-col relative overflow-hidden min-h-[600px]`}>
               {/* Terminal Header */}
               <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4 relative z-10">
                  <div className="flex items-center gap-3">
                     <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                     </div>
                     <span className="text-xs font-mono text-slate-500 ml-2">logic_architect.ts</span>
                  </div>
                  <div className="flex gap-3">
                     {loading && <span className="text-xs font-mono text-cyan-400 animate-pulse">Thinking...</span>}
                     <button 
                        onClick={handleCopy} 
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                     >
                        {copied ? <><i className="fa-solid fa-check"></i> Copied</> : <><i className="fa-regular fa-copy"></i> Copy Output</>}
                     </button>
                  </div>
               </div>

               {/* Output Area with Typewriter */}
               <div className="flex-1 overflow-auto custom-scrollbar relative z-10 font-mono text-sm leading-relaxed">
                  {(displayedOutput || loading) ? (
                     <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                        {displayedOutput}
                        {/* Cursor Blinker */}
                        <span className="inline-block w-2 h-4 bg-cyan-500 ml-1 animate-pulse align-middle"></span>
                     </div>
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                        <i className="fa-solid fa-microchip text-6xl mb-4"></i>
                        <p className="text-sm">Awaiting input stream...</p>
                     </div>
                  )}
               </div>

               {/* Decorative Glow */}
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none"></div>
            </div>
         </div>
      </div>

      {/* Directory Section */}
      <section>
         <div className="flex items-center gap-3 mb-8 px-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg">
               <i className="fa-solid fa-code"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Logic & Coding Resources</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOGIC_RESOURCES.map((res, idx) => (
               <a 
                 key={idx}
                 href={res.url}
                 target="_blank" 
                 rel="noreferrer"
                 className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
               >
                  <div className={`w-12 h-12 rounded-2xl ${res.color} flex items-center justify-center text-white text-xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                     <i className={`fa-brands ${res.icon.replace('fa-brands ', '')} ${res.icon}`}></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{res.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">{res.desc}</p>
                  <div className="flex items-center text-xs font-bold text-cyan-600 group-hover:translate-x-1 transition-transform">
                     Visit Site <i className="fa-solid fa-arrow-right ml-1"></i>
                  </div>
               </a>
            ))}
         </div>
      </section>

    </div>
  );
};

export default LogicArchitect;
