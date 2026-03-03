
import React, { useState } from 'react';
import { WEBSITE_RESOURCES } from '../data/toolsData';
import { WebsiteResource } from '../types';

const WebsiteCreatorsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Builder' | 'Hosting' | 'Free Hosting' | 'Learning' | 'Domain' | 'Commerce' | 'Design' | 'Analytics'>('All');

  // Group resources by type for the "All" view
  const sections = {
    'Build & Design': WEBSITE_RESOURCES.filter(r => ['Builder', 'Design'].includes(r.type)),
    'Host & Deploy': WEBSITE_RESOURCES.filter(r => ['Hosting', 'Domain', 'Free Hosting'].includes(r.type)),
    'Learn & Grow': WEBSITE_RESOURCES.filter(r => ['Learning', 'Analytics', 'Commerce'].includes(r.type)),
  };

  const renderCard = (resource: WebsiteResource, idx: number) => (
    <div 
       key={idx}
       className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative"
    >
       <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl ${resource.color} flex items-center justify-center text-white text-2xl shadow-lg`}>
             {resource.icon.startsWith('fa-') ? <i className={`fa-brands ${resource.icon.replace('fa-brands ','')} ${resource.icon}`}></i> : <i className={`fa-solid ${resource.icon}`}></i>}
          </div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${resource.type === 'Free Hosting' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
             {resource.type}
          </span>
       </div>

       <h3 className="font-bold text-xl text-slate-900 mb-2">{resource.name}</h3>
       <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-2">
          {resource.description}
       </p>

       <div className="space-y-3 mb-6">
          {resource.features.slice(0, 3).map((feature, i) => (
             <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <i className="fa-solid fa-check text-green-500"></i> {feature}
             </div>
          ))}
       </div>

       <a 
          href={resource.url} 
          target="_blank" 
          rel="noreferrer"
          className="w-full py-3 rounded-xl bg-slate-50 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-all text-center flex items-center justify-center gap-2 group-hover:shadow-lg"
       >
          Visit Site <i className="fa-solid fa-arrow-right text-xs"></i>
       </a>
       
       <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full pointer-events-none"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12 animate-fade-in">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-12 md:p-20 text-center shadow-2xl">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
         
         <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-indigo-300 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-layer-group"></i> All-In-One Resource
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               Digital Creator Hub
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
               The complete ecosystem for building your digital empire. From domains and design to hosting, analytics, and education.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2">
               {['All', 'Builder', 'Hosting', 'Free Hosting', 'Domain', 'Design', 'Commerce', 'Analytics', 'Learning'].map((tab) => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab as any)}
                   className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${activeTab === tab ? 'bg-white text-slate-900 border-white shadow-lg' : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="space-y-16">
        {activeTab === 'All' ? (
          <>
            {/* Build & Design Section */}
            <section className="space-y-6">
               <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                    <i className="fa-solid fa-pen-ruler"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Build & Design</h2>
                    <p className="text-slate-500 text-sm">Tools to create stunning websites and visuals.</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {sections['Build & Design'].map((resource, idx) => renderCard(resource, idx))}
               </div>
            </section>

            {/* Host & Deploy Section */}
            <section className="space-y-6">
               <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
                    <i className="fa-solid fa-server"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Host & Deploy</h2>
                    <p className="text-slate-500 text-sm">Secure your domain and launch your site.</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {sections['Host & Deploy'].map((resource, idx) => renderCard(resource, idx))}
               </div>
            </section>

            {/* Learn & Grow Section */}
            <section className="space-y-6">
               <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Learn & Grow</h2>
                    <p className="text-slate-500 text-sm">Master new skills, sell products, and track growth.</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {sections['Learn & Grow'].map((resource, idx) => renderCard(resource, idx))}
               </div>
            </section>
          </>
        ) : (
          /* Filtered View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WEBSITE_RESOURCES.filter(r => r.type === activeTab).map((resource, idx) => renderCard(resource, idx))}
            {WEBSITE_RESOURCES.filter(r => r.type === activeTab).length === 0 && (
               <div className="col-span-full text-center py-20 text-slate-400">
                  <p>No resources found for this category yet.</p>
               </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200 mt-12">
         <h3 className="text-lg font-bold text-slate-800 mb-2">Need help creating content?</h3>
         <p className="text-slate-500 mb-6 max-w-lg mx-auto">Use our AI tools to generate copy, images, and marketing strategies for your new project.</p>
         <div className="flex justify-center gap-4">
            <button className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:text-indigo-600 transition-colors">
               <i className="fa-solid fa-pen-nib mr-2"></i> Copywriter
            </button>
            <button className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:text-pink-600 transition-colors">
               <i className="fa-solid fa-image mr-2"></i> Image Gen
            </button>
         </div>
      </div>

    </div>
  );
};

export default WebsiteCreatorsHub;
