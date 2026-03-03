
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';

const STYLES = [
  { id: 'stylish', label: 'Stylish & Trendy', icon: 'fa-wand-magic-sparkles', color: 'bg-pink-100 text-pink-600', border: 'border-pink-200', hover: 'hover:border-pink-400' },
  { id: 'professional', label: 'Professional', icon: 'fa-briefcase', color: 'bg-blue-100 text-blue-600', border: 'border-blue-200', hover: 'hover:border-blue-400' },
  { id: 'unique', label: 'Unique & Abstract', icon: 'fa-fingerprint', color: 'bg-purple-100 text-purple-600', border: 'border-purple-200', hover: 'hover:border-purple-400' },
  { id: 'tech', label: 'Tech & Modern', icon: 'fa-microchip', color: 'bg-cyan-100 text-cyan-600', border: 'border-cyan-200', hover: 'hover:border-cyan-400' },
  { id: 'playful', label: 'Playful & Fun', icon: 'fa-face-laugh-beam', color: 'bg-yellow-100 text-yellow-600', border: 'border-yellow-200', hover: 'hover:border-yellow-400' },
  { id: 'luxury', label: 'Luxury & Elegant', icon: 'fa-gem', color: 'bg-slate-100 text-slate-600', border: 'border-slate-200', hover: 'hover:border-slate-400' },
];

const NameGenerator: React.FC = () => {
  const [description, setDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('stylish');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setLoading(true);
    setResults([]);
    setError('');

    const styleLabel = STYLES.find(s => s.id === selectedStyle)?.label || 'Creative';
    
    const prompt = `Generate a list of 12 ${styleLabel} names for: "${description}". 
    The names should be suitable for a brand, product, or company. 
    Output ONLY the names separated by commas, without numbering or explanations.
    Example output: NameOne, NameTwo, NameThree`;

    try {
      const text = await generateText(prompt, "You are a creative naming expert. You invent catchy, memorable, and appropriate names.");
      // Split by comma and clean up
      const names = text.split(',').map(n => n.trim()).filter(n => n.length > 0);
      setResults(names);
    } catch (err) {
      setError('Failed to generate names. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12 animate-fade-in">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-900 to-violet-900 text-white p-10 md:p-14 text-center shadow-2xl border border-indigo-800">
         <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px] -ml-20 -mt-20 animate-pulse"></div>
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -mr-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-indigo-200 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-signature"></i> Brand Identity
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               Name Generator
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 font-medium leading-relaxed max-w-2xl mx-auto">
               Create the perfect identity for your next project. Generate stylish, professional, and unique names instantly with AI.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Controls */}
         <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 h-full">
               <div className="space-y-6">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Describe your project</label>
                     <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all h-32 resize-none text-slate-700 placeholder:text-slate-400 font-medium"
                        placeholder="e.g. A coffee shop that also sells rare books, cozy atmosphere..."
                        onKeyDown={(e) => {
                           if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleGenerate();
                           }
                        }}
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Select Style</label>
                     <div className="grid grid-cols-2 gap-3">
                        {STYLES.map((style) => (
                           <button
                              key={style.id}
                              onClick={() => setSelectedStyle(style.id)}
                              className={`
                                 flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                                 ${selectedStyle === style.id 
                                    ? `${style.color} ${style.border} bg-opacity-100 shadow-sm ring-2 ring-offset-1 ring-indigo-100` 
                                    : `bg-white border-slate-100 text-slate-500 hover:bg-slate-50 ${style.hover}`}
                              `}
                           >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${selectedStyle === style.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                                 <i className={`fa-solid ${style.icon}`}></i>
                              </div>
                              <span className="text-xs font-bold">{style.label}</span>
                           </button>
                        ))}
                     </div>
                  </div>

                  <button 
                     onClick={handleGenerate}
                     disabled={loading || !description.trim()}
                     className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 shadow-indigo-500/30'}`}
                  >
                     {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                     Generate Names
                  </button>
                  
                  {error && (
                     <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 text-center">
                        {error}
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Results */}
         <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-[2rem] p-8 border-2 border-dashed border-slate-200 h-full min-h-[400px]">
               {results.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                     {results.map((name, idx) => (
                        <div 
                           key={idx} 
                           className="group bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all flex items-center justify-between"
                        >
                           <span className="font-bold text-lg text-slate-800">{name}</span>
                           <button 
                              onClick={() => handleCopy(name, idx)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${copiedIndex === idx ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50'}`}
                              title="Copy Name"
                           >
                              <i className={`fa-solid ${copiedIndex === idx ? 'fa-check' : 'fa-copy'}`}></i>
                           </button>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mb-4 shadow-sm">
                        <i className="fa-solid fa-lightbulb opacity-20"></i>
                     </div>
                     <h3 className="text-xl font-bold text-slate-600 mb-2">Ready to Brainstorm</h3>
                     <p className="max-w-xs">Enter a description and select a style to generate unique name ideas.</p>
                  </div>
               )}
            </div>
         </div>
      </div>

    </div>
  );
};

export default NameGenerator;
