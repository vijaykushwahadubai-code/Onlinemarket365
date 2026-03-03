
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { FREELANCE_PLATFORMS } from '../data/toolsData';

type ActionType = 'proposal' | 'email' | 'profile' | 'negotiate' | 'contract' | 'smart_contract';
type ToneType = 'Professional' | 'Casual' | 'Persuasive' | 'Urgent' | 'Witty' | 'Empathetic';

const FreelanceHub: React.FC = () => {
  const [activeAction, setActiveAction] = useState<ActionType>('proposal');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tone, setTone] = useState<ToneType>('Professional');

  const actions = [
    { id: 'proposal', label: 'Proposal Writer', icon: 'fa-hand-point-up', color: 'bg-green-600' },
    { id: 'email', label: 'Client Email', icon: 'fa-envelope', color: 'bg-blue-600' },
    { id: 'profile', label: 'Bio Generator', icon: 'fa-id-card', color: 'bg-purple-600' },
    { id: 'negotiate', label: 'Rate Negotiator', icon: 'fa-hand-holding-dollar', color: 'bg-amber-600' },
    { id: 'contract', label: 'Legal Review', icon: 'fa-file-signature', color: 'bg-slate-600' },
    { id: 'smart_contract', label: 'Smart Contract', icon: 'fa-file-code', color: 'bg-indigo-600' },
  ];

  const currentAction = actions.find(a => a.id === activeAction)!;

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setOutput('');

    let prompt = '';
    const systemInstruction = "You are a highly experienced freelance business coach and copywriter.";

    switch (activeAction) {
      case 'proposal':
        prompt = `Write a ${tone} freelance proposal for the following job description. Focus on value, relevant skills, and a call to action. Job: "${input}"`;
        break;
      case 'email':
        prompt = `Draft a ${tone} client email based on this context: "${input}". Ensure the message is clear and action-oriented.`;
        break;
      case 'profile':
        prompt = `Write a compelling professional bio for a freelancer with the following skills/role: "${input}". Tone: ${tone}. Highlight expertise and trustworthiness.`;
        break;
      case 'negotiate':
        prompt = `Write a script or email to negotiate a higher rate or better terms for this situation: "${input}". Tone: ${tone}. Be firm but professional.`;
        break;
      case 'contract':
        prompt = `Explain the following contract clause in simple terms and highlight any potential risks for a freelancer: "${input}"`;
        break;
      case 'smart_contract':
        prompt = `Generate a Solidity smart contract for a freelance agreement described as: "${input}". Include comments explaining the functions (e.g., escrow, release funds).`;
        break;
    }

    try {
      const result = await generateText(prompt, systemInstruction);
      setOutput(result);
    } catch (err) {
      setError('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12 animate-fade-in">
      
      {/* Hero Section */}
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-10 md:p-14 text-center shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-green-300 uppercase tracking-widest mb-6">
             <i className="fa-solid fa-laptop-code"></i> Gig Economy HQ
           </div>
           <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
             Freelance & Gig Hub
           </h1>
           <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
             Everything you need to land your next client. Generate winning proposals, manage communications, and secure payments with blockchain.
           </p>
        </div>
      </div>

      {/* AI Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-3">
           <h3 className="text-lg font-bold text-slate-800 px-2 mb-2">AI Tools</h3>
           {actions.map(action => (
             <button
               key={action.id}
               onClick={() => { setActiveAction(action.id as ActionType); setInput(''); setOutput(''); setError(''); }}
               className={`
                 w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 border text-left group
                 ${activeAction === action.id 
                   ? 'bg-white border-slate-200 shadow-md ring-2 ring-indigo-500/10' 
                   : 'bg-white/50 border-transparent hover:bg-white hover:shadow-sm'}
               `}
             >
               <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${action.color} shadow-sm group-hover:scale-110 transition-transform`}>
                 <i className={`fa-solid ${action.icon}`}></i>
               </div>
               <div>
                 <span className={`block font-bold ${activeAction === action.id ? 'text-slate-900' : 'text-slate-600'}`}>
                   {action.label}
                 </span>
               </div>
               {activeAction === action.id && <i className="fa-solid fa-chevron-right ml-auto text-slate-300 text-xs"></i>}
             </button>
           ))}
        </div>

        {/* Workspace Area */}
        <div className="lg:col-span-8">
           <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100 min-h-[500px] flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                 <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${currentAction.color}`}>
                      <i className={`fa-solid ${currentAction.icon}`}></i>
                   </div>
                   <h2 className="text-xl font-bold text-slate-800">{currentAction.label}</h2>
                 </div>

                 {/* Tone Selector */}
                 {activeAction !== 'contract' && activeAction !== 'smart_contract' && (
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-slate-500">Tone:</span>
                       <select 
                         value={tone}
                         onChange={(e) => setTone(e.target.value as ToneType)}
                         className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                       >
                          <option>Professional</option>
                          <option>Casual</option>
                          <option>Persuasive</option>
                          <option>Urgent</option>
                          <option>Empathetic</option>
                       </select>
                    </div>
                 )}
              </div>

              <div className="space-y-4 flex-1">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                       {activeAction === 'proposal' && "Paste Job Description:"}
                       {activeAction === 'email' && "Context for the Email:"}
                       {activeAction === 'profile' && "Your Skills & Role:"}
                       {activeAction === 'negotiate' && "Situation details:"}
                       {activeAction === 'contract' && "Paste Contract Clause:"}
                       {activeAction === 'smart_contract' && "Describe terms (e.g. 50% deposit, release on delivery):"}
                    </label>
                    <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter details here..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all h-32 resize-none"
                    />
                 </div>

                 <div className="flex justify-end">
                    <button 
                      onClick={handleGenerate}
                      disabled={loading || !input.trim()}
                      className={`
                        px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2
                        ${loading || !input.trim() ? 'bg-slate-300 cursor-not-allowed' : `${currentAction.color} hover:opacity-90 hover:-translate-y-0.5`}
                      `}
                    >
                       {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                       Generate
                    </button>
                 </div>

                 {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                       {error}
                    </div>
                 )}

                 {output && (
                    <div className="mt-6 animate-fade-in-up">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Result</span>
                          <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800"><i className="fa-regular fa-copy mr-1"></i> Copy</button>
                       </div>
                       <div className={`bg-slate-50 border border-slate-200 rounded-xl p-5 text-slate-700 whitespace-pre-wrap leading-relaxed ${activeAction === 'smart_contract' ? 'font-mono text-sm bg-slate-900 text-green-400' : ''}`}>
                          {output}
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Platform Directory */}
      <div>
         <div className="flex items-center gap-3 mb-6">
            <i className="fa-solid fa-globe text-2xl text-slate-400"></i>
            <h2 className="text-2xl font-bold text-slate-900">Top Gig Platforms</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FREELANCE_PLATFORMS.map((platform, idx) => (
               <a 
                 key={idx}
                 href={platform.url}
                 target="_blank"
                 rel="noreferrer"
                 className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-4"
               >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-md ${platform.color} group-hover:scale-110 transition-transform`}>
                     <i className={`fa-brands ${platform.icon}`}></i>
                  </div>
                  <div>
                     <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                        {platform.name}
                        <i className="fa-solid fa-arrow-up-right-from-square text-xs opacity-0 group-hover:opacity-100 transition-opacity text-slate-400"></i>
                     </h3>
                     <p className="text-sm text-slate-500 leading-relaxed mt-1">
                        {platform.description}
                     </p>
                  </div>
               </a>
            ))}
         </div>
      </div>

    </div>
  );
};

export default FreelanceHub;
