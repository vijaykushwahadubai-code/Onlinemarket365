
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { VIDEO_EDITING_RESOURCES, VIDEO_CONVERSION_TOOLS, VIDEO_COMPRESSION_TOOLS } from '../data/toolsData';
import VideoEnhancer from './VideoEnhancer';

type Tab = 'Editing' | 'Conversion' | 'Compression' | 'Enhancer';

const VideoToolsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Enhancer');
  const [inputText, setInputText] = useState('');
  const [outputCommand, setOutputCommand] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateCommand = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setOutputCommand('');

    let systemInstruction = "You are a professional Video Engineer and FFmpeg expert.";
    let prompt = "";

    if (activeTab === 'Conversion') {
      prompt = `Generate an FFmpeg command to convert video based on this request: "${inputText}".
      Explain the flags briefly. Ensure high compatibility.
      Example user input: "Convert MKV to MP4 for iPhone"`;
    } else if (activeTab === 'Compression') {
      prompt = `Generate an FFmpeg command to compress video based on this request: "${inputText}".
      Focus on reducing file size while maintaining acceptable quality (CRF, Preset).
      Example user input: "Compress 4K video to under 50MB"`;
    }

    try {
      const result = await generateText(prompt, systemInstruction);
      setOutputCommand(result);
    } catch (e) {
      setOutputCommand("Error generating command.");
    } finally {
      setLoading(false);
    }
  };

  const renderToolCard = (tool: any, idx: number) => (
    <a 
      key={idx}
      href={tool.url}
      target="_blank"
      rel="noreferrer"
      className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      <div className={`w-14 h-14 rounded-xl ${tool.color} flex items-center justify-center text-white text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
        <i className={`fa-solid ${tool.icon} transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12 neon-icon`}></i>
      </div>
      
      <div className="mb-4">
         <h3 className="text-lg font-bold text-slate-900 mb-1">{tool.name}</h3>
         <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            {tool.category}
         </span>
      </div>
      
      <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
         {tool.description}
      </p>
      
      <div className="mt-auto w-full py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold text-center group-hover:bg-slate-900 group-hover:text-white transition-colors flex items-center justify-center gap-2">
         Open Tool <i className="fa-solid fa-arrow-up-right-from-square"></i>
      </div>
    </a>
  );

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-12">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white p-10 md:p-14 text-center shadow-2xl border border-indigo-900/50">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-indigo-300 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-photo-film neon-icon"></i> Video Command Center
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               Video Toolkit
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
               Your all-in-one hub for editing, converting, and compressing video content. Access trusted tools and generate professional workflows instantly.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
               {(['Enhancer', 'Editing', 'Conversion', 'Compression'] as Tab[]).map((tab) => (
                  <button
                     key={tab}
                     onClick={() => { setActiveTab(tab); setOutputCommand(''); setInputText(''); }}
                     className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
                  >
                     <i className={`fa-solid ${tab === 'Enhancer' ? 'fa-wand-magic-sparkles' : tab === 'Editing' ? 'fa-scissors' : tab === 'Conversion' ? 'fa-arrows-rotate' : 'fa-file-zipper'} neon-icon`}></i>
                     {tab}
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="space-y-12">
         
         {/* Video Enhancer Component */}
         {activeTab === 'Enhancer' && (
            <VideoEnhancer />
         )}

         {/* Command Generator (For Conversion & Compression) */}
         {(activeTab === 'Conversion' || activeTab === 'Compression') && (
            <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-start">
               <div className="flex-1 w-full">
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                     <i className="fa-solid fa-terminal text-indigo-600 neon-icon"></i> AI Command Generator
                  </h2>
                  <p className="text-slate-500 text-sm mb-6">
                     Describe your {activeTab.toLowerCase()} needs, and our AI will generate the perfect FFmpeg command line or settings for you.
                  </p>
                  
                  <div className="space-y-4">
                     <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={activeTab === 'Conversion' ? "e.g. Convert a folder of MOVs to MP4 for web..." : "e.g. Reduce a 2GB video to 200MB without losing much quality..."}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all h-32 resize-none text-slate-700 placeholder:text-slate-400 font-medium"
                     />
                     <button 
                        onClick={handleGenerateCommand}
                        disabled={loading || !inputText.trim()}
                        className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-indigo-600 hover:-translate-y-0.5'}`}
                     >
                        {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles neon-icon"></i>}
                        Generate Command
                     </button>
                  </div>
               </div>

               {outputCommand && (
                  <div className="flex-1 w-full bg-slate-900 rounded-2xl p-6 relative overflow-hidden group border border-slate-800 self-stretch flex flex-col">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full pointer-events-none"></div>
                     <div className="flex justify-between items-center mb-4 relative z-10">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Output</span>
                        <button onClick={() => navigator.clipboard.writeText(outputCommand)} className="text-xs font-bold text-slate-400 hover:text-white bg-white/10 px-2 py-1 rounded transition-colors"><i className="fa-regular fa-copy mr-1"></i> Copy</button>
                     </div>
                     <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap overflow-auto custom-scrollbar flex-1 relative z-10">{outputCommand}</pre>
                  </div>
               )}
            </section>
         )}

         {/* Tool Directory */}
         {activeTab !== 'Enhancer' && (
            <section>
               <div className="flex items-center gap-3 mb-8 px-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg">
                     <i className="fa-solid fa-toolbox"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                     {activeTab === 'Editing' ? 'Top Video Editors' : activeTab === 'Conversion' ? 'Conversion Tools' : 'Compression Tools'}
                  </h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {activeTab === 'Editing' && VIDEO_EDITING_RESOURCES.map((tool, idx) => renderToolCard(tool, idx))}
                  {activeTab === 'Conversion' && VIDEO_CONVERSION_TOOLS.map((tool, idx) => renderToolCard(tool, idx))}
                  {activeTab === 'Compression' && VIDEO_COMPRESSION_TOOLS.map((tool, idx) => renderToolCard(tool, idx))}
               </div>
            </section>
         )}

      </div>
    </div>
  );
};

export default VideoToolsHub;
