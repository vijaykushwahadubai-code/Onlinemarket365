
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';

const FILMORA_FEATURES = [
  { name: 'AI Copilot Editing', icon: 'fa-robot', desc: 'Ask the AI assistant to edit your video via text commands.' },
  { name: 'AI Text-Based Editing', icon: 'fa-file-lines', desc: 'Edit video by editing the transcript text automatically.' },
  { name: 'AI Music Generator', icon: 'fa-music', desc: 'Generate royalty-free music tailored to your video mood.' },
  { name: 'AI Thumbnail Creator', icon: 'fa-image', desc: 'Select top frames and use AI to design high-CTR thumbnails.' },
  { name: 'AI Smart Masking', icon: 'fa-mask', desc: 'Brush over objects to create seamless masks frame-by-frame.' },
  { name: 'Instant Mode', icon: 'fa-bolt', desc: 'Add media and let Filmora auto-generate a complete video.' },
  { name: 'Auto Reframe', icon: 'fa-crop', desc: 'Automatically resize videos for different social platforms.' },
  { name: 'Silence Detection', icon: 'fa-microphone-slash', desc: 'Automatically cut out silent pauses in talking head videos.' },
  { name: 'Speech to Text', icon: 'fa-closed-captioning', desc: 'Convert voice to subtitles with high accuracy.' },
  { name: 'Text to Video', icon: 'fa-film', desc: 'Generate video content from simple text prompts.' },
];

const PRICING_PLANS = [
  {
    name: 'Free Plan',
    price: '$0',
    period: 'Forever',
    features: [
      'All Editing Features',
      'Export with Watermark',
      'Basic Stock Media',
      'Limited AI Credits'
    ],
    color: 'bg-slate-100 border-slate-200',
    btn: 'Download Free'
  },
  {
    name: 'Cross-Platform',
    price: '$49.99',
    period: 'Per Year',
    features: [
      'No Watermark',
      'Windows, Mac, Android, iOS',
      'Unlimited Updates',
      '1GB Cloud Storage',
      'More AI Credits'
    ],
    color: 'bg-teal-50 border-teal-200',
    btn: 'Get Annual'
  },
  {
    name: 'Perpetual Plan',
    price: '$79.99',
    period: 'One-Time',
    features: [
      'No Watermark',
      'Windows Only (Specific Version)',
      'No Future Major Updates',
      'Standard Support'
    ],
    color: 'bg-indigo-50 border-indigo-200',
    btn: 'Buy Perpetual'
  }
];

const FilmoraResources: React.FC = () => {
  const [promptInput, setPromptInput] = useState('');
  const [promptResult, setPromptResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGeneratePrompt = async () => {
    if (!promptInput.trim()) return;
    setLoading(true);
    setPromptResult('');

    const systemInstruction = "You are a Filmora AI expert. Create optimized prompts for Filmora's AI Image or Video features.";
    const prompt = `Write a highly detailed descriptive prompt that a user can paste into Wondershare Filmora's AI Image Generator or AI Text-to-Video feature to get the best result for: "${promptInput}". 
    Include details about style, lighting, and composition.`;

    try {
      const result = await generateText(prompt, systemInstruction);
      setPromptResult(result);
    } catch (e) {
      setPromptResult("Could not generate prompt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* Hero Banner */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-[#30C5B3] to-[#0092FF] text-white p-10 md:p-14 shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/20 backdrop-blur-md text-xs font-bold text-white uppercase tracking-widest mb-6">
                  <i className="fa-solid fa-star"></i> Featured Partner Integration
               </div>
               <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Wondershare Filmora</h2>
               <p className="text-lg text-white/90 font-medium leading-relaxed mb-8">
                  The all-in-one AI video editor for everyone. From smart cutting to AI-generated assets, Filmora simplifies professional editing.
               </p>
               <div className="flex gap-4">
                  <a href="https://filmora.wondershare.com/" target="_blank" rel="noreferrer" className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2">
                     <i className="fa-solid fa-download"></i> Download App
                  </a>
                  <a href="https://filmora.wondershare.com/guide/" target="_blank" rel="noreferrer" className="px-8 py-3 bg-white/20 border border-white/40 text-white rounded-xl font-bold hover:bg-white/30 transition-all">
                     User Guide
                  </a>
               </div>
            </div>
            {/* Filmora Logo Placeholder or Icon */}
            <div className="w-32 h-32 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner rotate-3 hover:rotate-6 transition-transform">
               <i className="fa-solid fa-f text-6xl"></i>
            </div>
         </div>
      </div>

      {/* AI Features Grid */}
      <div>
         <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
               <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Filmora AI Features</h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {FILMORA_FEATURES.map((feature, idx) => (
               <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-lg mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                     <i className={`fa-solid ${feature.icon}`}></i>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{feature.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
               </div>
            ))}
         </div>
      </div>

      {/* Pricing Comparison */}
      <div>
         <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-lg">
               <i className="fa-solid fa-tags"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Plans & Pricing</h3>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan, idx) => (
               <div key={idx} className={`p-8 rounded-[2rem] border ${plan.color} relative overflow-hidden flex flex-col`}>
                  <div className="mb-4">
                     <h4 className="text-lg font-bold text-slate-700">{plan.name}</h4>
                     <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                        <span className="text-sm font-medium text-slate-500">/{plan.period}</span>
                     </div>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                     {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                           <i className="fa-solid fa-check text-teal-500"></i> {feat}
                        </li>
                     ))}
                  </ul>
                  <a href="https://filmora.wondershare.com/buy/win-video-editor.html" target="_blank" rel="noreferrer" className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-center hover:bg-indigo-600 transition-all shadow-lg">
                     {plan.btn}
                  </a>
               </div>
            ))}
         </div>
         <p className="text-center text-xs text-slate-400 mt-4">*Prices subject to change by Wondershare.</p>
      </div>

      {/* AI Prompt Helper */}
      <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">
         <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
               <i className="fa-solid fa-keyboard text-purple-500"></i> Filmora AI Prompt Gen
            </h3>
            <p className="text-slate-500 text-sm mb-6">
               Struggling to get good results from Filmora's AI Image or Sticker generator? 
               Describe what you want below, and we'll write the perfect prompt for you.
            </p>
            
            <div className="flex gap-2 mb-4">
               <input 
                  type="text" 
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. A futuristic cyberpunk city with neon rain..."
                  className="flex-1 px-5 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleGeneratePrompt()}
               />
               <button 
                  onClick={handleGeneratePrompt}
                  disabled={loading}
                  className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg disabled:opacity-50"
               >
                  {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Optimize'}
               </button>
            </div>

            {promptResult && (
               <div className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm animate-fade-in-up">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">Optimized Prompt</span>
                     <button onClick={() => navigator.clipboard.writeText(promptResult)} className="text-xs font-bold text-slate-400 hover:text-purple-600"><i className="fa-regular fa-copy"></i> Copy</button>
                  </div>
                  <p className="text-slate-700 font-medium text-sm leading-relaxed">{promptResult}</p>
               </div>
            )}
         </div>
      </div>

    </div>
  );
};

export default FilmoraResources;
