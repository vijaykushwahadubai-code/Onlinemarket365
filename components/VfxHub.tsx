
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { VFX_SOFTWARE, VFX_LEARNING, THREE_D_TOOLS } from '../data/toolsData';

type ActionType = 'breakdown' | 'texture_prompt' | 'script_to_shot';

const VfxHub: React.FC = () => {
  const [activeAction, setActiveAction] = useState<ActionType>('breakdown');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput('');

    let prompt = '';
    let systemInstruction = "You are a professional Visual Effects Supervisor and Technical Director.";

    switch (activeAction) {
      case 'breakdown':
        prompt = `Analyze the following script scene and provide a detailed VFX shot breakdown. List the required assets (3D models, matte paintings, stock footage), simulation requirements (fire, smoke, water), and estimate the complexity (Low/Med/High) for each shot.\n\nScript:\n${input}`;
        break;
      case 'texture_prompt':
        prompt = `Write a highly detailed, photorealistic image generation prompt to create a texture for the following description. Include details about lighting, material properties (roughness, metallic), and resolution (4k, 8k).\n\nTexture Description:\n${input}`;
        break;
      case 'script_to_shot':
        prompt = `Suggest 5 creative VFX shot concepts for the following theme/story idea. Describe the camera movement, the visual effect element, and how it enhances the narrative.\n\nTheme:\n${input}`;
        break;
    }

    try {
      const result = await generateText(prompt, systemInstruction);
      setOutput(result);
    } catch (e) {
      setOutput("Error generating content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-12">
      
      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-[2rem] p-10 md:p-14 text-center shadow-xl border border-slate-800 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-orange-200 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-wand-magic-sparkles"></i> Post-Production
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
               Visual Effects Studio
            </h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
               The professional's toolkit for motion design and VFX. Generate shot breakdowns, access industry-standard software, and streamline your pipeline.
            </p>
         </div>
      </div>

      {/* Section 1: AI Workspace */}
      <section>
         <div className="flex items-center gap-4 mb-8 px-4">
           <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-lg">
              <i className="fa-solid fa-robot"></i>
           </div>
           <div>
             <h2 className="text-2xl font-bold text-slate-900">AI VFX Assistant</h2>
             <p className="text-slate-500 text-sm">Accelerate your pre-production workflow.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Controls */}
           <div className="space-y-4">
              <button onClick={() => { setActiveAction('breakdown'); setInput(''); setOutput(''); }} className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${activeAction === 'breakdown' ? 'bg-white border-orange-500 shadow-md ring-1 ring-orange-500/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                 <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-lg"><i className="fa-solid fa-list-check"></i></div>
                 <div><h3 className="font-bold text-slate-800">Scene Breakdown</h3><p className="text-xs text-slate-500">Plan shots & assets</p></div>
              </button>
              <button onClick={() => { setActiveAction('texture_prompt'); setInput(''); setOutput(''); }} className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${activeAction === 'texture_prompt' ? 'bg-white border-purple-500 shadow-md ring-1 ring-purple-500/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                 <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-lg"><i className="fa-solid fa-image"></i></div>
                 <div><h3 className="font-bold text-slate-800">Texture Prompts</h3><p className="text-xs text-slate-500">For AI Image Gens</p></div>
              </button>
              <button onClick={() => { setActiveAction('script_to_shot'); setInput(''); setOutput(''); }} className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${activeAction === 'script_to_shot' ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500/20' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                 <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-lg"><i className="fa-solid fa-film"></i></div>
                 <div><h3 className="font-bold text-slate-800">Shot Concepts</h3><p className="text-xs text-slate-500">Creative Ideation</p></div>
              </button>
           </div>

           {/* Input/Output */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
                 <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                    {activeAction === 'breakdown' && "Paste your script scene description:"}
                    {activeAction === 'texture_prompt' && "Describe the texture material:"}
                    {activeAction === 'script_to_shot' && "Enter theme or story idea:"}
                 </label>
                 <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all h-32 resize-none mb-4 text-slate-700"
                    placeholder="Enter details here..."
                 />
                 <div className="flex justify-end">
                    <button 
                       onClick={handleGenerate}
                       disabled={loading || !input.trim()}
                       className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-indigo-600 hover:-translate-y-0.5'}`}
                    >
                       {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                       Generate
                    </button>
                 </div>
              </div>

              {output && (
                 <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-200 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                       <h3 className="font-bold text-lg text-slate-800">Analysis Result</h3>
                       <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg"><i className="fa-regular fa-copy mr-1"></i> Copy</button>
                    </div>
                    <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-600 leading-relaxed">
                       {output}
                    </div>
                 </div>
              )}
           </div>
        </div>
      </section>

      {/* Section 2: Popular VFX Software */}
      <section>
         <div className="flex items-center gap-4 mb-8 px-4">
           <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-xl shadow-lg shadow-orange-500/20">
              <i className="fa-solid fa-cubes-stacked"></i>
           </div>
           <div>
             <h2 className="text-2xl font-bold text-slate-900">Software Directory</h2>
             <p className="text-slate-500 text-sm">Industry standard tools and suites.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {VFX_SOFTWARE.map((soft: any, idx) => (
              <div key={idx} className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden">
                 
                 {soft.badge && (
                    <div className="absolute top-4 right-4 px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-lg z-10">
                       {soft.badge}
                    </div>
                 )}

                 <div className={`w-14 h-14 rounded-2xl ${soft.color} flex items-center justify-center text-white text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                    <i className={`fa-solid ${soft.icon}`}></i>
                 </div>
                 <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                      {soft.name}
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </h3>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">{soft.type}</span>
                 </div>
                 <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{soft.description}</p>
                 <a href={soft.url} target="_blank" rel="noreferrer" className="w-full py-3 rounded-xl bg-slate-50 text-slate-900 font-bold text-sm hover:bg-slate-900 hover:text-white transition-all text-center flex items-center justify-center gap-2 mt-auto">
                    Get Software <i className="fa-solid fa-download text-xs"></i>
                 </a>
              </div>
           ))}
        </div>
      </section>

      {/* Section 3: 3D Modeling Tools */}
      <section>
         <div className="flex items-center gap-4 mb-8 px-4">
           <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
              <i className="fa-solid fa-cube"></i>
           </div>
           <div>
             <h2 className="text-2xl font-bold text-slate-900">3D Modeling Suites</h2>
             <p className="text-slate-500 text-sm">Create assets, characters, and environments.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
           {THREE_D_TOOLS.map((tool, idx) => (
              <a 
                key={idx}
                href={tool.url} 
                target="_blank" 
                rel="noreferrer"
                className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
              >
                 {tool.badge && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider rounded-md z-10">
                       {tool.badge}
                    </div>
                 )}
                 <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center text-white text-xl shadow-md mb-3 group-hover:scale-110 transition-transform`}>
                    <i className={`fa-solid ${tool.icon}`}></i>
                 </div>
                 <h3 className="text-base font-bold text-slate-900 mb-1">{tool.name}</h3>
                 <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                    {tool.description}
                 </p>
                 <div className="mt-auto text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Learn More <i className="fa-solid fa-arrow-right text-[10px]"></i>
                 </div>
              </a>
           ))}
        </div>
      </section>

      {/* Section 4: Learning */}
      <section>
         <div className="bg-indigo-600 rounded-[2.5rem] p-10 md:p-12 text-white relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl backdrop-blur-sm">
                      <i className="fa-solid fa-graduation-cap"></i>
                   </div>
                   <div>
                      <h2 className="text-3xl font-bold">Knowledge & Assets</h2>
                      <p className="text-indigo-100">Curated learning resources and stock footage.</p>
                   </div>
                </div>
             </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {VFX_LEARNING.map((learn, idx) => (
                 <a key={idx} href={learn.url} target="_blank" rel="noreferrer" className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/20 transition-all flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-white text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <i className={`fa-solid ${learn.icon}`}></i>
                    </div>
                    <div>
                       <h4 className="font-bold text-white group-hover:underline">{learn.name}</h4>
                       <p className="text-xs text-indigo-100 font-medium uppercase tracking-wide">{learn.topic}</p>
                    </div>
                 </a>
              ))}
           </div>
         </div>
      </section>

    </div>
  );
};

export default VfxHub;
