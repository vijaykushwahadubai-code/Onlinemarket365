
import React, { useState } from 'react';
import VideoGenerator from './VideoGenerator';
import AiVideoEditor from './AiVideoEditor';
import VideoEnhancer from './VideoEnhancer';
import VideoPlanner from './VideoEditingHub';
import FilmoraResources from './FilmoraResources';
import AnimationStudio from './AnimationStudio';

type Tab = 'generate' | 'edit' | 'enhance' | 'plan' | 'filmora' | 'animation';

const VideoStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generate');

  return (
    <div className="max-w-full mx-auto animate-fade-in space-y-6 pb-12 px-4 md:px-8 p-6 rounded-[3rem] border border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.15)] bg-[#0B0F19]/50 backdrop-blur-sm">
      
      {/* Studio Header */}
      <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
         <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[10px] font-bold text-red-300 uppercase tracking-widest mb-3">
                   <i className="fa-solid fa-film"></i> Professional Suite
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">Video Studio Pro</h1>
                <p className="text-slate-400 font-medium">Generate, Edit, Plan and Enhance video content with state-of-the-art AI.</p>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 bg-slate-800/50 p-1.5 rounded-2xl backdrop-blur-md border border-white/5">
               <button 
                 onClick={() => setActiveTab('generate')}
                 className={`px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'generate' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
               >
                  <i className="fa-solid fa-video"></i> Generate
               </button>
               <button 
                 onClick={() => setActiveTab('animation')}
                 className={`px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'animation' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
               >
                  <i className="fa-solid fa-cubes"></i> 3D & Anime
               </button>
               <button 
                 onClick={() => setActiveTab('edit')}
                 className={`px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'edit' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
               >
                  <i className="fa-solid fa-scissors"></i> Editor
               </button>
               <button 
                 onClick={() => setActiveTab('enhance')}
                 className={`px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'enhance' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
               >
                  <i className="fa-solid fa-wand-magic-sparkles"></i> Enhance
               </button>
               <button 
                 onClick={() => setActiveTab('plan')}
                 className={`px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'plan' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
               >
                  <i className="fa-solid fa-mobile-screen-button"></i> Tools & Apps
               </button>
               <button 
                 onClick={() => setActiveTab('filmora')}
                 className={`px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'filmora' ? 'bg-[#30C5B3] text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
               >
                  <i className="fa-solid fa-star"></i> Filmora
               </button>
            </div>
         </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
         {activeTab === 'generate' && <VideoGenerator />}
         {activeTab === 'animation' && <AnimationStudio />}
         {activeTab === 'edit' && <AiVideoEditor />}
         {activeTab === 'enhance' && <VideoEnhancer />}
         {activeTab === 'plan' && <VideoPlanner />}
         {activeTab === 'filmora' && <FilmoraResources />}
      </div>

    </div>
  );
};

export default VideoStudio;
