
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';

type Mode = 'expression' | 'script' | 'recipe';

const MotionLab: React.FC = () => {
  const [activeMode, setActiveMode] = useState<Mode>('expression');
  const [description, setDescription] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setOutput('');
    setCopied(false);

    let prompt = '';
    const baseInstruction = "You are an expert Adobe After Effects Technical Director and Motion Graphics Artist.";

    switch (activeMode) {
      case 'expression':
        prompt = `Write an optimized After Effects Expression (JavaScript) to achieve the following: "${description}".
        
        Requirements:
        - Provide ONLY the code block at the beginning.
        - Add comments explaining key variables.
        - After the code, briefly explain which property to apply this to (e.g., Position, Opacity, Source Text).
        - If sliders/controls are needed, mention how to set them up.`;
        break;
      
      case 'script':
        prompt = `Write an Adobe After Effects ExtendScript (.jsx) to automate the following task: "${description}".
        
        Requirements:
        - The code must be wrapped in a function and an undo group.
        - Include comments explaining the steps.
        - Ensure error handling (e.g., checking if a comp is active).`;
        break;

      case 'recipe':
        prompt = `Create a step-by-step 'Effect Recipe' to achieve this visual style in After Effects: "${description}".
        
        Format:
        1. **Core Effects**: List built-in effects to apply (e.g., Fractal Noise, displacement Map).
        2. **Key Settings**: Specific parameter values to tweak.
        3. **Layer Stack**: How to order the layers and blending modes.
        4. **Pro Tip**: One advanced tip to polish the look.`;
        break;
    }

    try {
      const result = await generateText(prompt, baseInstruction);
      setOutput(result);
    } catch (e) {
      setOutput("Error creating motion asset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12 animate-fade-in">
      
      {/* Hero Header */}
      <div className="bg-white rounded-[2rem] p-10 md:p-14 text-center shadow-xl border border-slate-200 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full -mr-16 -mt-16"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full -ml-16 -mb-16"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-bold text-purple-600 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-infinity"></i> Motion Graphics Copilot
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
               Motion Lab
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
               Generate After Effects expressions, automation scripts, and VFX recipes instantly. 
               The ultimate assistant for motion designers.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
               <button 
                 onClick={() => setActiveMode('expression')} 
                 className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border ${activeMode === 'expression' ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
               >
                  <i className="fa-solid fa-code"></i> Expressions
               </button>
               <button 
                 onClick={() => setActiveMode('script')} 
                 className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border ${activeMode === 'script' ? 'bg-cyan-600 border-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
               >
                  <i className="fa-solid fa-scroll"></i> Scripts (.jsx)
               </button>
               <button 
                 onClick={() => setActiveMode('recipe')} 
                 className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border ${activeMode === 'recipe' ? 'bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-500/20' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
               >
                  <i className="fa-solid fa-wand-magic-sparkles"></i> VFX Recipes
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Input Panel */}
         <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 h-full">
               <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  {activeMode === 'expression' && <><i className="fa-solid fa-code text-purple-600"></i> Expression Generator</>}
                  {activeMode === 'script' && <><i className="fa-solid fa-scroll text-cyan-600"></i> Script Automation</>}
                  {activeMode === 'recipe' && <><i className="fa-solid fa-flask text-pink-600"></i> Effect Recipe</>}
               </h2>
               <p className="text-slate-500 text-sm mb-6">
                  {activeMode === 'expression' && "Describe the motion behavior (e.g., 'loop seamlessly', 'bounce on scale')."}
                  {activeMode === 'script' && "Describe the task to automate (e.g., 'randomize layer start times')."}
                  {activeMode === 'recipe' && "Describe the visual style (e.g., 'Cyberpunk glitch text', 'VHS retro look')."}
               </p>
               
               <div className="space-y-4">
                  <textarea 
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all h-48 resize-none font-medium text-slate-700 placeholder:text-slate-400"
                     placeholder={
                        activeMode === 'expression' ? "e.g. Inertial bounce on rotation..." : 
                        activeMode === 'script' ? "e.g. Create a null object parent for all selected layers..." : 
                        "e.g. Glowing neon outline with flickering intensity..."
                     }
                     onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                  />
                  <button 
                     onClick={handleGenerate}
                     disabled={loading || !description.trim()}
                     className={`w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-indigo-600 transition-all shadow-lg flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                     {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                     Generate Code
                  </button>
               </div>
            </div>
         </div>

         {/* Output Panel */}
         <div className="lg:col-span-7">
            <div className={`bg-slate-900 rounded-[2rem] p-8 shadow-2xl h-full border border-slate-800 flex flex-col relative overflow-hidden min-h-[500px]`}>
               {/* Terminal Header */}
               <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                     {activeMode === 'expression' ? 'expression.js' : activeMode === 'script' ? 'script.jsx' : 'recipe.md'}
                  </div>
                  <button 
                     onClick={handleCopy} 
                     className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                  >
                     {copied ? <><i className="fa-solid fa-check"></i> Copied</> : <><i className="fa-regular fa-copy"></i> Copy</>}
                  </button>
               </div>

               {/* Output Area */}
               <div className="flex-1 overflow-auto custom-scrollbar relative z-10">
                  {output ? (
                     <div className="prose prose-invert max-w-none text-sm font-mono leading-relaxed whitespace-pre-wrap text-slate-300">
                        {output}
                     </div>
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-600">
                        <i className={`fa-solid ${activeMode === 'expression' ? 'fa-code' : activeMode === 'script' ? 'fa-scroll' : 'fa-flask'} text-6xl mb-4 opacity-10`}></i>
                        <p className="text-sm font-medium">Ready to generate.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* Quick Tips Section */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8">
         <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-lightbulb text-yellow-500"></i> Pro Tips
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
               <h4 className="font-bold text-sm text-slate-900 mb-2">Expressions</h4>
               <p className="text-xs text-slate-500 leading-relaxed">
                  Alt-click the stopwatch icon next to any property in After Effects to paste your expression code.
               </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
               <h4 className="font-bold text-sm text-slate-900 mb-2">Scripts</h4>
               <p className="text-xs text-slate-500 leading-relaxed">
                  Save scripts as `.jsx` files in your AE Scripts folder to access them from the File &gt; Scripts menu.
               </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
               <h4 className="font-bold text-sm text-slate-900 mb-2">GPU Acceleration</h4>
               <p className="text-xs text-slate-500 leading-relaxed">
                  When using heavy effects (fractal noise, blurs), ensure your project settings are set to Mercury GPU Acceleration.
               </p>
            </div>
         </div>
      </div>

    </div>
  );
};

export default MotionLab;
