
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { FITNESS_RESOURCES } from '../data/toolsData';

type Mode = 'workout' | 'meal' | 'yoga' | 'meditation';

const FitnessHub: React.FC = () => {
  const [activeMode, setActiveMode] = useState<Mode>('workout');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult('');

    let prompt = '';
    const systemInstruction = "You are a professional Personal Trainer, Nutritionist, and Wellness Coach. IMPORTANT: Always include a disclaimer that this is not medical advice and the user should consult a doctor before starting new regimens.";

    switch (activeMode) {
      case 'workout':
        prompt = `Create a detailed workout plan based on the following preferences: "${input}". 
        Include:
        1. Warm-up exercises.
        2. Main circuit/exercises with sets and reps.
        3. Cool-down stretch.
        4. Focus on form cues.`;
        break;
      case 'meal':
        prompt = `Create a healthy meal plan or nutritional advice for: "${input}". 
        Include:
        1. Meal suggestions (Breakfast, Lunch, Dinner, Snacks).
        2. Estimated calorie/macro breakdown if possible.
        3. Focus on whole foods and balanced nutrition.`;
        break;
      case 'yoga':
        prompt = `Design a yoga flow sequence for: "${input}".
        Include:
        1. Theme/Intention.
        2. Sequence of poses (Asanas) with English and Sanskrit names.
        3. Breath cues (Pranayama).
        4. Savasana guidance.`;
        break;
      case 'meditation':
        prompt = `Write a guided meditation script for: "${input}".
        Structure:
        1. Settling in (Body scan/breathing).
        2. Visualization or focus point.
        3. Affirmations.
        4. Gentle return to awareness.`;
        break;
    }

    try {
      const text = await generateText(prompt, systemInstruction);
      setResult(text);
    } catch (e) {
      setResult("Service temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-12">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-10 md:p-14 text-center shadow-2xl border border-teal-500">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[100px] -mr-20 -mt-20 animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-teal-100 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-heart-pulse"></i> Body & Mind
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               Fitness & Health Hub
            </h1>
            <p className="text-lg md:text-xl text-teal-100 font-medium leading-relaxed max-w-2xl mx-auto">
               Your personal AI wellness coach. Generate custom workouts, meal plans, yoga flows, and meditation scripts instantly.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* AI Coach Interface */}
         <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -mr-6 -mt-6"></div>
               
               <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                  <i className="fa-solid fa-dumbbell text-teal-600"></i> AI Wellness Coach
               </h2>

               <div className="space-y-4 relative z-10">
                  <div className="flex flex-wrap gap-2">
                     <button onClick={() => { setActiveMode('workout'); setInput(''); setResult(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${activeMode === 'workout' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200'}`}><i className="fa-solid fa-person-running mr-1"></i> Workout</button>
                     <button onClick={() => { setActiveMode('meal'); setInput(''); setResult(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${activeMode === 'meal' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200'}`}><i className="fa-solid fa-apple-whole mr-1"></i> Nutrition</button>
                     <button onClick={() => { setActiveMode('yoga'); setInput(''); setResult(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${activeMode === 'yoga' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200'}`}><i className="fa-solid fa-person-praying mr-1"></i> Yoga</button>
                     <button onClick={() => { setActiveMode('meditation'); setInput(''); setResult(''); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${activeMode === 'meditation' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200'}`}><i className="fa-solid fa-spa mr-1"></i> Meditate</button>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">
                        {activeMode === 'workout' && "Describe your goals (e.g. HIIT home workout, 30 min, no equipment):"}
                        {activeMode === 'meal' && "Dietary preferences (e.g. Vegan, High Protein, low carb):"}
                        {activeMode === 'yoga' && "Focus area (e.g. Back pain relief, Morning energy, Sleep):"}
                        {activeMode === 'meditation' && "Current state or goal (e.g. Anxiety relief, Focus, Gratitude):"}
                     </label>
                     <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all h-32 resize-none text-slate-700 placeholder:text-slate-400 font-medium"
                        placeholder="Type here..."
                     />
                  </div>

                  <button 
                     onClick={handleGenerate}
                     disabled={loading || !input.trim()}
                     className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 hover:-translate-y-0.5 shadow-teal-500/30'}`}
                  >
                     {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                     Generate Plan
                  </button>
               </div>
            </div>
         </div>

         {/* Output Section */}
         <div className="lg:col-span-7">
            {result ? (
               <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100 h-full animate-fade-in-up">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                     <h3 className="font-bold text-xl text-slate-800">Your Plan</h3>
                     <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs font-bold text-teal-600 hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg"><i className="fa-regular fa-copy mr-1"></i> Copy</button>
                  </div>
                  <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-600 leading-relaxed">
                     {result}
                  </div>
               </div>
            ) : (
               <div className="h-full bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl text-teal-200 shadow-sm mb-4">
                     <i className={`fa-solid ${activeMode === 'workout' ? 'fa-dumbbell' : activeMode === 'meal' ? 'fa-carrot' : activeMode === 'yoga' ? 'fa-yin-yang' : 'fa-spa'}`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to Start?</h3>
                  <p className="text-slate-500 max-w-sm">
                     Enter your details on the left to get a personalized routine instantly.
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
                  <i className="fa-solid fa-heart-pulse"></i>
               </div>
               <h2 className="text-3xl font-bold text-slate-900">Health Resources</h2>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {FITNESS_RESOURCES.map((tool, idx) => (
               <a 
                 key={idx}
                 href={tool.url}
                 target="_blank"
                 rel="noreferrer"
                 className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
               >
                  <div className={`w-14 h-14 rounded-2xl ${tool.color} flex items-center justify-center text-white text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                     <i className={`fa-solid ${tool.icon}`}></i>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                     {tool.name}
                     <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                  </h3>
                  
                  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-3 w-fit">
                     {tool.category}
                  </span>
                  
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                     {tool.description}
                  </p>

                  <div className="mt-auto w-full py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold text-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                     Open App
                  </div>
               </a>
            ))}
         </div>
      </section>

    </div>
  );
};

export default FitnessHub;
