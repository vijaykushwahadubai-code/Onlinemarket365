
import React, { useState } from 'react';
import Notepad from './Notepad';
import QrCodeLab from './QrCodeLab';
import QuickShareHub from './QuickShareHub';

type Tab = 'notepad' | 'qr' | 'share';

const SmartTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('notepad');

  return (
    <div className="max-w-[1600px] mx-auto animate-fade-in space-y-6 pb-12">
      
      {/* Studio Header */}
      <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-10 -mt-10"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-lg">
                   <i className="fa-solid fa-toolbox"></i>
                </div>
                <div>
                   <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Smart Tools</h1>
                   <p className="text-slate-400 text-sm">Essential daily utilities for productivity.</p>
                </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-2">
               <button 
                 onClick={() => setActiveTab('notepad')}
                 className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border flex items-center gap-2 ${activeTab === 'notepad' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-transparent text-slate-400 border-slate-700 hover:text-white hover:border-slate-500'}`}
               >
                  <i className="fa-solid fa-note-sticky"></i> Notepad
               </button>
               <button 
                 onClick={() => setActiveTab('qr')}
                 className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border flex items-center gap-2 ${activeTab === 'qr' ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent text-slate-400 border-slate-700 hover:text-white hover:border-slate-500'}`}
               >
                  <i className="fa-solid fa-qrcode"></i> QR Lab
               </button>
               <button 
                 onClick={() => setActiveTab('share')}
                 className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border flex items-center gap-2 ${activeTab === 'share' ? 'bg-purple-500 text-white border-purple-500' : 'bg-transparent text-slate-400 border-slate-700 hover:text-white hover:border-slate-500'}`}
               >
                  <i className="fa-solid fa-share-nodes"></i> Quick Share
               </button>
            </div>
         </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
         {activeTab === 'notepad' && <Notepad />}
         {activeTab === 'qr' && <QrCodeLab />}
         {activeTab === 'share' && <QuickShareHub />}
      </div>

    </div>
  );
};

export default SmartTools;
