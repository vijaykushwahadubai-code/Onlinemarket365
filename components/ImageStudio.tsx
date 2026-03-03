
import React, { useState } from 'react';
import ImageGenerator from './ImageGenerator';
import BackgroundRemover from './BackgroundRemover';

type Tab = 'generate' | 'remove_bg';

const ImageStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generate');

  return (
    <div className="max-w-full mx-auto animate-fade-in space-y-6 pb-12 px-4 md:px-8 p-6 rounded-[3rem] border border-pink-500/30 shadow-[0_0_40px_rgba(236,72,153,0.15)] bg-[#0B0F19]/50 backdrop-blur-sm">
      
      {/* Studio Header */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100/50 rounded-full blur-[80px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-[80px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
                   <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg">
                      <i className="fa-solid fa-palette"></i>
                   </span>
                   Image Studio
                </h1>
                <p className="text-slate-500 font-medium ml-1">Create, Edit, and Refine visuals in one place.</p>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
               <button 
                 onClick={() => setActiveTab('generate')}
                 className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 focus:outline-none ${activeTab === 'generate' ? 'bg-white text-pink-600 shadow-lg ring-2 ring-pink-500 ring-offset-2 scale-105 z-10' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
               >
                  <i className="fa-solid fa-paintbrush"></i> AI Generator
               </button>
               <button 
                 onClick={() => setActiveTab('remove_bg')}
                 className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 focus:outline-none ${activeTab === 'remove_bg' ? 'bg-white text-indigo-600 shadow-lg ring-2 ring-indigo-500 ring-offset-2 scale-105 z-10' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
               >
                  <i className="fa-solid fa-eraser"></i> Background Remover
               </button>
            </div>
         </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
         {activeTab === 'generate' && <ImageGenerator />}
         {activeTab === 'remove_bg' && <BackgroundRemover />}
      </div>

    </div>
  );
};

export default ImageStudio;
