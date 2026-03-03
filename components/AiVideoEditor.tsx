
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';

const EFFECTS = [
  { id: 'cinematic', name: 'Cinematic Look', icon: 'fa-film', color: 'bg-orange-500' },
  { id: 'vhs', name: 'VHS Retro', icon: 'fa-video', color: 'bg-purple-500' },
  { id: 'glitch', name: 'Glitch Effect', icon: 'fa-bolt', color: 'bg-cyan-500' },
  { id: 'bw', name: 'Noir B&W', icon: 'fa-moon', color: 'bg-slate-500' },
];

const AI_TOOLS = [
  { id: 'reframe', name: 'Auto Reframe', desc: 'Crop for TikTok/Reels', icon: 'fa-crop-simple' },
  { id: 'silence', name: 'Silence Remover', desc: 'Cut dead air instantly', icon: 'fa-scissors' },
  { id: 'denoise', name: 'AI Denoise', desc: 'Clean audio tracks', icon: 'fa-wave-square' },
  { id: 'caption', name: 'Auto Captions', desc: 'Generate subtitles', icon: 'fa-closed-captioning' },
];

const AiVideoEditor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeLayer, setActiveLayer] = useState('Video Track 1');
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);

  const handleAiEdit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult('');

    try {
      const response = await generateText(
        `Act as an AI Video Editor Copilot. 
        User Request: "${prompt}".
        
        Provide a JSON-style editing plan with:
        1. Action: Summary of what to do (e.g. "Applying color grade").
        2. Adjustments: List of specific changes (Contrast +10, Saturation -5).
        3. FFmpeg Command: A conceptual FFmpeg command to achieve this effect on 'input.mp4'.
        `, 
        "You are a professional Video Editor AI."
      );
      setResult(response);
    } catch (e) {
      setResult("AI Editor is offline. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] bg-slate-900 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl border border-slate-800 animate-fade-in">
      
      {/* Toolbar Header */}
      <div className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6">
         <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center text-white">
               <i className="fa-solid fa-scissors"></i>
            </div>
            <h2 className="font-bold text-white tracking-wide">Smart Video Editor <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full ml-2">Beta</span></h2>
         </div>
         <div className="flex gap-4 text-slate-400 text-sm">
            <button className="hover:text-white transition-colors"><i className="fa-solid fa-undo mr-1"></i> Undo</button>
            <button className="hover:text-white transition-colors"><i className="fa-solid fa-redo mr-1"></i> Redo</button>
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-1.5 rounded-lg font-bold transition-all ml-4">Export</button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         
         {/* Left Sidebar: Assets & Effects */}
         <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-800">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">AI Magic Tools</h3>
               <div className="grid grid-cols-2 gap-3">
                  {AI_TOOLS.map(tool => (
                     <button key={tool.id} className="bg-slate-800 p-3 rounded-xl hover:bg-slate-700 transition-all text-left group border border-transparent hover:border-slate-600">
                        <i className={`fa-solid ${tool.icon} text-xl text-pink-500 mb-2 group-hover:scale-110 transition-transform block`}></i>
                        <span className="text-xs font-bold text-slate-300 block">{tool.name}</span>
                        <span className="text-[9px] text-slate-500 block leading-tight mt-1">{tool.desc}</span>
                     </button>
                  ))}
               </div>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Filters & VFX</h3>
               <div className="space-y-2">
                  {EFFECTS.map(effect => (
                     <div 
                        key={effect.id} 
                        onClick={() => setSelectedEffect(effect.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${selectedEffect === effect.id ? 'bg-slate-800 border-pink-500/50' : 'hover:bg-slate-800 border-transparent'}`}
                     >
                        <div className={`w-8 h-8 rounded-lg ${effect.color} flex items-center justify-center text-white shadow-lg`}>
                           <i className={`fa-solid ${effect.icon}`}></i>
                        </div>
                        <span className="text-sm font-medium text-slate-300">{effect.name}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Center: Preview Area */}
         <div className="flex-1 bg-black flex flex-col relative">
            <div className="flex-1 flex items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
               {/* Mock Video Player */}
               <div className="aspect-video w-[80%] bg-slate-800 rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden group border border-slate-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                     <i className="fa-solid fa-play text-6xl text-white/20 group-hover:text-white/80 transition-colors cursor-pointer backdrop-blur-sm p-6 rounded-full"></i>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-white font-mono opacity-50">
                     <span>00:00:14:05</span>
                     <span>1080p 60fps</span>
                  </div>
                  {/* Overlay for Effects */}
                  {selectedEffect && (
                     <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs text-white border border-white/10 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${EFFECTS.find(e => e.id === selectedEffect)?.color}`}></span>
                        Preview: {EFFECTS.find(e => e.id === selectedEffect)?.name}
                     </div>
                  )}
               </div>
            </div>

            {/* AI Copilot Input */}
            <div className="h-auto min-h-[140px] bg-slate-900 border-t border-slate-800 p-4">
               <div className="max-w-3xl mx-auto w-full">
                  <label className="text-xs font-bold text-pink-500 uppercase tracking-wide mb-2 block flex items-center gap-2">
                     <i className="fa-solid fa-wand-magic-sparkles"></i> AI Copilot
                  </label>
                  <div className="relative">
                     <input 
                        type="text" 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Tell the AI what to edit (e.g., 'Make the colors warm and vintage', 'Remove silence')..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-200 focus:border-pink-600 focus:ring-1 focus:ring-pink-600 outline-none transition-all placeholder:text-slate-600 font-mono"
                        onKeyDown={(e) => e.key === 'Enter' && handleAiEdit()}
                     />
                     <button 
                        onClick={handleAiEdit}
                        disabled={loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-pink-600 transition-all"
                     >
                        {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-arrow-up"></i>}
                     </button>
                  </div>
                  {result && (
                     <div className="mt-3 bg-slate-950 rounded-lg p-3 border border-slate-800 text-xs font-mono text-green-400 whitespace-pre-wrap max-h-32 overflow-y-auto custom-scrollbar">
                        {result}
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Right Sidebar: Properties */}
         <div className="w-64 bg-slate-900 border-l border-slate-800 p-4 flex flex-col gap-6">
            <div>
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Properties</h3>
               <div className="space-y-4">
                  <div>
                     <label className="text-xs text-slate-400 block mb-1">Scale</label>
                     <input type="range" className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-600" />
                  </div>
                  <div>
                     <label className="text-xs text-slate-400 block mb-1">Opacity</label>
                     <input type="range" className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-600" />
                  </div>
                  <div>
                     <label className="text-xs text-slate-400 block mb-1">Rotation</label>
                     <div className="flex gap-2">
                        <input type="text" value="0°" className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 text-center" readOnly />
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
               <h4 className="text-xs font-bold text-slate-300 mb-2">Clip Info</h4>
               <div className="space-y-1 text-[10px] text-slate-500">
                  <div className="flex justify-between"><span>Name:</span> <span className="text-slate-400">clip_04.mp4</span></div>
                  <div className="flex justify-between"><span>Duration:</span> <span className="text-slate-400">00:14:05</span></div>
                  <div className="flex justify-between"><span>Format:</span> <span className="text-slate-400">H.264 / AAC</span></div>
               </div>
            </div>
         </div>

      </div>

      {/* Bottom Timeline */}
      <div className="h-48 bg-slate-950 border-t border-slate-800 flex flex-col">
         {/* Timeline Tools */}
         <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-4">
            <span className="text-xs font-mono text-slate-500">00:00:00:00</span>
            <div className="h-4 w-[1px] bg-slate-700"></div>
            <div className="flex gap-2 text-slate-400 text-xs">
               <button className="hover:text-white"><i className="fa-solid fa-scissors"></i></button>
               <button className="hover:text-white"><i className="fa-solid fa-magnet"></i></button>
               <button className="hover:text-white"><i className="fa-solid fa-trash"></i></button>
            </div>
            <div className="flex-1"></div>
            <input type="range" min="1" max="100" className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-500" />
         </div>

         {/* Tracks */}
         <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar relative p-2 space-y-1">
            {/* Time Ruler (Mock) */}
            <div className="h-4 w-[2000px] border-b border-slate-800 flex text-[9px] text-slate-600 mb-1">
               {Array.from({length: 20}).map((_, i) => (
                  <div key={i} className="w-[100px] border-l border-slate-800 pl-1">{`00:0${i}:00`}</div>
               ))}
            </div>

            {/* Video Track 1 */}
            <div 
               className={`h-12 w-[2000px] bg-slate-900 rounded border border-slate-800 relative flex items-center ${activeLayer === 'Video Track 1' ? 'bg-slate-800' : ''}`}
               onClick={() => setActiveLayer('Video Track 1')}
            >
               <div className="absolute left-0 w-24 h-full bg-slate-950 border-r border-slate-800 flex items-center justify-center text-xs text-slate-500 z-10 font-bold">V1</div>
               <div className="ml-24 w-64 h-8 bg-blue-900/50 border border-blue-700 rounded mx-2 flex items-center px-2 text-[10px] text-blue-200 truncate cursor-pointer hover:bg-blue-800/50">
                  Intro_Scene.mp4
               </div>
               <div className="w-96 h-8 bg-blue-900/50 border border-blue-700 rounded mx-1 flex items-center px-2 text-[10px] text-blue-200 truncate cursor-pointer hover:bg-blue-800/50">
                  Main_Interview_CamA.mp4
               </div>
            </div>

            {/* Audio Track 1 */}
            <div 
               className={`h-12 w-[2000px] bg-slate-900 rounded border border-slate-800 relative flex items-center ${activeLayer === 'Audio Track 1' ? 'bg-slate-800' : ''}`}
               onClick={() => setActiveLayer('Audio Track 1')}
            >
               <div className="absolute left-0 w-24 h-full bg-slate-950 border-r border-slate-800 flex items-center justify-center text-xs text-slate-500 z-10 font-bold">A1</div>
               <div className="ml-24 w-[500px] h-8 bg-green-900/40 border border-green-700 rounded mx-2 flex items-center px-2 text-[10px] text-green-200 truncate cursor-pointer hover:bg-green-800/40">
                  <i className="fa-solid fa-wave-square mr-2 opacity-50"></i> Background_Music_LoFi.mp3
               </div>
            </div>

            {/* Playhead */}
            <div className="absolute top-0 bottom-0 left-[300px] w-[1px] bg-red-500 z-20 pointer-events-none">
               <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 transform rotate-45"></div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default AiVideoEditor;
