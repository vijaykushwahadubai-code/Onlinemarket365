
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { DATING_PLATFORMS } from '../data/toolsData';

type CoachMode = 'bio_writer' | 'icebreaker' | 'date_ideas' | 'red_flag_check';
type FilterCategory = 'All' | 'App' | 'Website' | 'Niche' | 'LGBTQ+';

const DatingHub: React.FC = () => {
  const [coachMode, setCoachMode] = useState<CoachMode>('bio_writer');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterCategory>('All');

  const handleCoachAction = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult('');

    let prompt = '';
    const systemInstruction = "You are a friendly and witty Dating Coach and Relationship Expert.";

    switch (coachMode) {
      case 'bio_writer':
        prompt = `Rewrite this dating profile bio to be more engaging, witty, and attractive. Keep it authentic but polished.
        User Info: "${input}"`;
        break;
      case 'icebreaker':
        prompt = `Generate 3 unique, non-cheesy icebreaker opening lines for a match who mentions: "${input}". 
        1. Funny
        2. Thought-provoking
        3. Casual`;
        break;
      case 'date_ideas':
        prompt = `Suggest 3 unique date ideas based on these interests/location: "${input}". Include a budget estimate for each.`;
        break;
      case 'red_flag_check':
        prompt = `Analyze this message or behavior description for potential red flags or green flags. Be honest but fair.
        Description: "${input}"`;
        break;
    }

    try {
      const text = await generateText(prompt, systemInstruction);
      setResult(text);
    } catch (e) {
      setResult("My love sensors are offline. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPlatforms = DATING_PLATFORMS.filter(p => 
    filter === 'All' || p.category === filter
  );

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-12">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-pink-600 to-rose-600 text-white p-10 md:p-14 text-center shadow-2xl border border-pink-500">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[100px] -mr-20 -mt-20 animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-pink-100 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-heart"></i> Digital Connections
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               Dating Hub
            </h1>
            <p className="text-lg md:text-xl text-pink-100 font-medium leading-relaxed max-w-2xl mx-auto">
               Find love, friends, or networking opportunities. Use AI to craft the perfect profile and explore top-rated platforms.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* AI Dating Coach */}
         <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -mr-6 -mt-6"></div>
               
               <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                  <i className="fa-solid fa-comments text-pink-500"></i> AI Dating Coach
               </h2>

               <div className="space-y-4 relative z-10">
                  <div className="flex flex-wrap gap-2">
                     <button onClick={() => { setCoachMode('bio_writer'); setInput(''); setResult(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${coachMode === 'bio_writer' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-slate-600 border-slate-200'}`}>Bio Writer</button>
                     <button onClick={() => { setCoachMode('icebreaker'); setInput(''); setResult(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${coachMode === 'icebreaker' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-slate-600 border-slate-200'}`}>Icebreakers</button>
                     <button onClick={() => { setCoachMode('date_ideas'); setInput(''); setResult(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${coachMode === 'date_ideas' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-slate-600 border-slate-200'}`}>Date Ideas</button>
                     <button onClick={() => { setCoachMode('red_flag_check'); setInput(''); setResult(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${coachMode === 'red_flag_check' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-slate-600 border-slate-200'}`}>Red Flag?</button>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">
                        {coachMode === 'bio_writer' && "Paste your current bio or facts about you:"}
                        {coachMode === 'icebreaker' && "Their interests or bio highlights:"}
                        {coachMode === 'date_ideas' && "Your city and shared interests:"}
                        {coachMode === 'red_flag_check' && "Describe the situation or message:"}
                     </label>
                     <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all h-32 resize-none text-slate-700 placeholder:text-slate-400 font-medium"
                        placeholder="Type here..."
                     />
                  </div>

                  <button 
                     onClick={handleCoachAction}
                     disabled={loading || !input.trim()}
                     className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? 'bg-pink-300 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 hover:-translate-y-0.5 shadow-pink-500/30'}`}
                  >
                     {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                     Ask Coach
                  </button>
               </div>
            </div>
         </div>

         {/* Coach Output */}
         <div className="lg:col-span-7">
            {result ? (
               <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100 h-full animate-fade-in-up">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                     <h3 className="font-bold text-xl text-slate-800">Coach's Advice</h3>
                     <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs font-bold text-pink-600 hover:text-pink-800 bg-pink-50 px-3 py-1.5 rounded-lg"><i className="fa-regular fa-copy mr-1"></i> Copy</button>
                  </div>
                  <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-600 leading-relaxed">
                     {result}
                  </div>
               </div>
            ) : (
               <div className="h-full bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl text-pink-200 shadow-sm mb-4">
                     <i className="fa-solid fa-heart"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Relationship Goals</h3>
                  <p className="text-slate-500 max-w-sm">
                     Need a clever opening line or a bio revamp? Your AI wingman is ready to help.
                  </p>
               </div>
            )}
         </div>
      </div>

      {/* Directory Section */}
      <section>
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg">
                  <i className="fa-solid fa-address-book"></i>
               </div>
               <h2 className="text-3xl font-bold text-slate-900">Platform Directory</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
               {['All', 'App', 'Website', 'Niche', 'LGBTQ+'].map((cat) => (
                  <button
                     key={cat}
                     onClick={() => setFilter(cat as FilterCategory)}
                     className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
                        filter === cat 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                     }`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlatforms.map((plat, idx) => (
               <a 
                 key={idx}
                 href={plat.url}
                 target="_blank"
                 rel="noreferrer"
                 className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
               >
                  {plat.badge && (
                     <div className="absolute top-4 right-4 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-md z-10">
                        {plat.badge}
                     </div>
                  )}

                  <div className={`w-14 h-14 rounded-2xl ${plat.color} flex items-center justify-center text-white text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                     <i className={`fa-solid ${plat.icon}`}></i>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                     {plat.name}
                     <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                  </h3>
                  
                  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-3 w-fit">
                     {plat.category}
                  </span>
                  
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                     {plat.description}
                  </p>

                  <div className="mt-auto w-full py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold text-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                     Visit Platform
                  </div>
               </a>
            ))}
         </div>
      </section>

    </div>
  );
};

export default DatingHub;
