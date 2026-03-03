
import React, { useState } from 'react';
import { generateImage, generateVideo, generateText } from '../services/geminiService';

type Mode = '3d_render' | 'cartoon_video' | 'anime_art' | 'blender_script';

const STYLES: Record<string, { label: string, value: string }[]> = {
  '3d_render': [
    { label: 'Isometric', value: 'isometric view, 3d render, blender cycles, high fidelity, cute, soft lighting' },
    { label: 'Low Poly', value: 'low poly, 3d game asset, flat shading, vibrant colors' },
    { label: 'Photorealistic', value: 'unreal engine 5, 8k, raytracing, highly detailed, cinematic lighting' },
    { label: 'Claymation', value: 'claymation style, plasticine texture, stop motion look, soft focus' }
  ],
  'cartoon_video': [
    { label: 'Classic Disney', value: 'classic 2d hand drawn animation, disney style, fluid motion' },
    { label: 'Modern Vector', value: 'flat vector art, corporate memphis style, clean lines, bright colors' },
    { label: 'Pixar Style', value: '3d animated movie style, pixar, cute characters, expressive' },
    { label: 'Watercolor', value: 'animated watercolor painting, soft edges, artistic, dreamy' }
  ],
  'anime_art': [
    { label: 'Studio Ghibli', value: 'studio ghibli style, detailed background, lush scenery, cel shaded' },
    { label: 'Cyberpunk', value: 'anime style, cyberpunk city, neon lights, high contrast, futuristic' },
    { label: 'Retro 90s', value: '90s anime aesthetic, vhs grain, retro color palette' },
    { label: 'Manga', value: 'black and white manga style, screentones, ink lines, dynamic' }
  ]
};

const AnimationStudio: React.FC = () => {
  const [mode, setMode] = useState<Mode>('3d_render');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES['3d_render'][0].value);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setResult(null);
    setError('');
    // Safely reset style only if styles exist for this mode
    if (STYLES[newMode] && STYLES[newMode].length > 0) {
        setSelectedStyle(STYLES[newMode][0].value);
    } else {
        setSelectedStyle('');
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      if (mode === '3d_render' || mode === 'anime_art') {
        const fullPrompt = `${prompt}, ${selectedStyle}`;
        const url = await generateImage(fullPrompt);
        setResult(url);
      } else if (mode === 'cartoon_video') {
        const fullPrompt = `${prompt}, ${selectedStyle}`;
        const url = await generateVideo(fullPrompt, '16:9');
        setResult(url);
      } else if (mode === 'blender_script') {
        const fullPrompt = `Write a Python script for Blender 3.0+ to: ${prompt}. 
        Include comments. Ensure it imports 'bpy' and handles context correctly.
        Wrap code in markdown code block.`;
        const text = await generateText(fullPrompt, "You are an expert Blender Python developer.");
        setResult(text);
      }
    } catch (e: any) {
      setError(e.message || "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-8">
      
      {/* Hero */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 text-white p-10 md:p-12 text-center shadow-2xl border border-indigo-900">
         <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-purple-300 uppercase tracking-widest mb-4">
               <i className="fa-solid fa-cubes"></i> 3D & Animation Lab
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
               Create Worlds & Characters
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
               Generate 3D concept art, animated cartoon clips, anime scenes, or automation scripts for Blender using AI.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Controls */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm h-full">
               <h3 className="font-bold text-slate-800 mb-4 px-2">Select Studio</h3>
               
               <div className="space-y-2">
                  <button 
                    onClick={() => handleModeChange('3d_render')}
                    className={`w-full text-left p-4 rounded-xl flex items-center gap-4 transition-all border ${mode === '3d_render' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30' : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-white'}`}
                  >
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${mode === '3d_render' ? 'bg-white/20 text-white' : 'bg-white text-indigo-600 shadow-sm'}`}>
                        <i className="fa-solid fa-cube"></i>
                     </div>
                     <div>
                        <span className="font-bold block text-sm">3D Render Gen</span>
                        <span className={`text-[10px] ${mode === '3d_render' ? 'text-indigo-200' : 'text-slate-400'}`}>High quality assets & concepts</span>
                     </div>
                  </button>

                  <button 
                    onClick={() => handleModeChange('cartoon_video')}
                    className={`w-full text-left p-4 rounded-xl flex items-center gap-4 transition-all border ${mode === 'cartoon_video' ? 'bg-pink-600 text-white border-pink-600 shadow-lg shadow-pink-500/30' : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-white'}`}
                  >
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${mode === 'cartoon_video' ? 'bg-white/20 text-white' : 'bg-white text-pink-600 shadow-sm'}`}>
                        <i className="fa-solid fa-film"></i>
                     </div>
                     <div>
                        <span className="font-bold block text-sm">Cartoon Maker</span>
                        <span className={`text-[10px] ${mode === 'cartoon_video' ? 'text-pink-200' : 'text-slate-400'}`}>Generate animated clips (Veo)</span>
                     </div>
                  </button>

                  <button 
                    onClick={() => handleModeChange('anime_art')}
                    className={`w-full text-left p-4 rounded-xl flex items-center gap-4 transition-all border ${mode === 'anime_art' ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30' : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-white'}`}
                  >
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${mode === 'anime_art' ? 'bg-white/20 text-white' : 'bg-white text-orange-500 shadow-sm'}`}>
                        <i className="fa-solid fa-paintbrush"></i>
                     </div>
                     <div>
                        <span className="font-bold block text-sm">Anime Art</span>
                        <span className={`text-[10px] ${mode === 'anime_art' ? 'text-orange-100' : 'text-slate-400'}`}>Manga & Anime styles</span>
                     </div>
                  </button>

                  <button 
                    onClick={() => handleModeChange('blender_script')}
                    className={`w-full text-left p-4 rounded-xl flex items-center gap-4 transition-all border ${mode === 'blender_script' ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-500/30' : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-white'}`}
                  >
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${mode === 'blender_script' ? 'bg-white/20 text-white' : 'bg-white text-slate-800 shadow-sm'}`}>
                        <i className="fa-brands fa-python"></i>
                     </div>
                     <div>
                        <span className="font-bold block text-sm">Blender Script</span>
                        <span className={`text-[10px] ${mode === 'blender_script' ? 'text-slate-300' : 'text-slate-400'}`}>Automate 3D tasks</span>
                     </div>
                  </button>
               </div>
            </div>
         </div>

         {/* Workspace */}
         <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 h-full flex flex-col">
               
               {/* Input Section */}
               <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                     <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                        {mode === 'blender_script' ? 'Describe automation task' : 'Describe your vision'}
                     </label>
                     
                     {mode !== 'blender_script' && STYLES[mode] && (
                        <select 
                           value={selectedStyle}
                           onChange={(e) => setSelectedStyle(e.target.value)}
                           className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none cursor-pointer text-slate-600"
                        >
                           {STYLES[mode].map((s, i) => (
                              <option key={i} value={s.value}>{s.label}</option>
                           ))}
                        </select>
                     )}
                  </div>

                  <textarea 
                     value={prompt}
                     onChange={(e) => setPrompt(e.target.value)}
                     className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all h-32 resize-none text-slate-700 placeholder:text-slate-400 font-medium"
                     placeholder={
                        mode === '3d_render' ? "e.g. A futuristic flying car in a cyberpunk city..." :
                        mode === 'cartoon_video' ? "e.g. A cat chasing a butterfly in a sunny park..." :
                        mode === 'anime_art' ? "e.g. A warrior princess standing on a cliff edge..." :
                        "e.g. Create a grid of 100 cubes with random colors..."
                     }
                  />

                  <div className="flex justify-end">
                     <button 
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'}`}
                     >
                        {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                        Generate {mode === 'cartoon_video' ? 'Video' : mode === 'blender_script' ? 'Code' : 'Image'}
                     </button>
                  </div>
               </div>

               {/* Result Section */}
               <div className="flex-1 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                  {loading ? (
                     <div className="text-center">
                        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-500 font-medium animate-pulse">Creating masterpiece...</p>
                        {mode === 'cartoon_video' && <p className="text-xs text-slate-400 mt-2">Video generation takes a moment</p>}
                     </div>
                  ) : result ? (
                     mode === 'blender_script' ? (
                        <div className="w-full h-full p-6 text-left relative group">
                           <button onClick={() => navigator.clipboard.writeText(result)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-slate-500 p-2 rounded-lg transition-colors"><i className="fa-regular fa-copy"></i></button>
                           <pre className="text-sm font-mono text-slate-700 whitespace-pre-wrap overflow-auto h-full custom-scrollbar">{result}</pre>
                        </div>
                     ) : mode === 'cartoon_video' ? (
                        <div className="relative w-full h-full bg-black flex items-center justify-center group">
                           <video src={result} controls className="max-w-full max-h-full object-contain" />
                           <a href={result} download className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"><i className="fa-solid fa-download"></i></a>
                        </div>
                     ) : (
                        <div className="relative w-full h-full group">
                           <img src={result} alt="Generated Art" className="w-full h-full object-contain" />
                           <a href={result} download className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-lg shadow-lg transition-all opacity-0 group-hover:opacity-100"><i className="fa-solid fa-download"></i></a>
                        </div>
                     )
                  ) : (
                     <div className="text-center text-slate-400">
                        <i className={`fa-solid ${mode === 'blender_script' ? 'fa-code' : 'fa-image'} text-5xl mb-4 opacity-20`}></i>
                        <p>Result will appear here</p>
                     </div>
                  )}
               </div>

               {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2 text-sm font-bold animate-fade-in">
                     <i className="fa-solid fa-circle-exclamation"></i> {error}
                  </div>
               )}

            </div>
         </div>
      </div>

    </div>
  );
};

export default AnimationStudio;
