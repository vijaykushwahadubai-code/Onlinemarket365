
import React, { useState } from 'react';
import { ToolId } from '../types';

interface GrowthBlueprintProps {
  onNavigate: (tool: ToolId) => void;
}

const GrowthBlueprint: React.FC<GrowthBlueprintProps> = ({ onNavigate }) => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const toggleStep = (step: string) => {
    if (completedSteps.includes(step)) {
      setCompletedSteps(completedSteps.filter(s => s !== step));
    } else {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const PHASES = [
    {
      id: 1,
      title: "The Command Center",
      subtitle: "Centralize Control",
      icon: "fa-database",
      color: "from-blue-500 to-indigo-600",
      bg: "bg-indigo-50",
      textColor: "text-indigo-700",
      description: "Establish a single source of truth for your business planning and data.",
      tools: [
        { name: "Notion", desc: "All-in-one workspace for calendar & tracker.", link: "https://www.notion.so" }
      ],
      internalAction: { label: "Open Project Manager", toolId: ToolId.PROJECT_MANAGER },
      tip: "Create columns for Content Calendar, Sales Tracker, and Client Details."
    },
    {
      id: 2,
      title: "The Traffic Engine",
      subtitle: "Automate Visibility",
      icon: "fa-share-nodes",
      color: "from-pink-500 to-rose-600",
      bg: "bg-pink-50",
      textColor: "text-pink-700",
      description: "Automate your content distribution to bring in organic traffic 24/7.",
      tools: [
        { name: "Buffer / Metricool", desc: "Schedule posts for 365 days.", link: "https://buffer.com" }
      ],
      internalAction: { label: "Go to Social Hub", toolId: ToolId.SOCIAL_MEDIA_HUB },
      tip: "Schedule one week of content every Sunday night."
    },
    {
      id: 3,
      title: "Sales & Landing",
      subtitle: "Conversion Point",
      icon: "fa-shop",
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      textColor: "text-emerald-700",
      description: "A dedicated space where visitors convert into customers.",
      tools: [
        { name: "Carrd / Linktree", desc: "Simple, high-converting landing pages.", link: "https://carrd.co" },
        { name: "Shopify / Instamojo", desc: "For e-commerce scaling.", link: "https://shopify.com" }
      ],
      internalAction: { label: "Website Creator Hub", toolId: ToolId.WEBSITE_HUB },
      tip: "Keep it simple: Headline, Offer, and a 'Buy Now' button."
    },
    {
      id: 4,
      title: "The Automation Brain",
      subtitle: "Connect Everything",
      icon: "fa-bolt",
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
      textColor: "text-amber-700",
      description: "The glue that makes apps talk to each other without your input.",
      tools: [
        { name: "Zapier / Pabbly", desc: "Connect forms to email & database.", link: "https://zapier.com" }
      ],
      internalAction: null,
      tip: "Example: When Google Form submitted -> Send WhatsApp -> Add to Notion."
    },
    {
      id: 5,
      title: "Customer Retention",
      subtitle: "Repeat Business",
      icon: "fa-envelope-open-text",
      color: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      textColor: "text-violet-700",
      description: "Keep your audience engaged and coming back for more.",
      tools: [
        { name: "MailerLite", desc: "Free email marketing automation.", link: "https://www.mailerlite.com" }
      ],
      internalAction: { label: "Marketing Hub", toolId: ToolId.MARKETING_HUB },
      tip: "Send a weekly newsletter with value, not just sales pitches."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-12">
      
      {/* Hero */}
      <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white p-10 md:p-14 shadow-2xl border border-slate-800">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-cyan-300 uppercase tracking-widest mb-6">
                  <i className="fa-solid fa-rocket"></i> Launch Strategy
               </div>
               <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                  Growth Blueprint
               </h1>
               <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed">
                  A proven 5-phase system to build, automate, and scale your digital business without burning out.
               </p>
            </div>
            
            {/* Progress Card */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 min-w-[300px]">
               <h3 className="font-bold text-lg mb-4">Launch Progress</h3>
               <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold text-cyan-400">{completedSteps.length}</span>
                  <span className="text-slate-400 font-medium mb-1">/ 3 Goals</span>
               </div>
               <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${(completedSteps.length / 3) * 100}%` }}></div>
               </div>
            </div>
         </div>
      </div>

      {/* Today's Goals */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
         <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <i className="fa-solid fa-list-check text-green-600"></i> Today's Goals
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
               onClick={() => toggleStep('identity')}
               className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-3 group ${completedSteps.includes('identity') ? 'border-green-500 bg-green-50' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}
            >
               <div className="flex justify-between items-start">
                  <span className="font-bold text-lg text-slate-800">1. Identity</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${completedSteps.includes('identity') ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>
                     {completedSteps.includes('identity') && <i className="fa-solid fa-check text-xs"></i>}
                  </div>
               </div>
               <p className="text-sm text-slate-500">Define your unique name (e.g. Market 365 Hub).</p>
            </div>

            <div 
               onClick={() => toggleStep('centralize')}
               className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-3 group ${completedSteps.includes('centralize') ? 'border-green-500 bg-green-50' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}
            >
               <div className="flex justify-between items-start">
                  <span className="font-bold text-lg text-slate-800">2. Centralize</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${completedSteps.includes('centralize') ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>
                     {completedSteps.includes('centralize') && <i className="fa-solid fa-check text-xs"></i>}
                  </div>
               </div>
               <p className="text-sm text-slate-500">Download Notion & setup your Command Center columns.</p>
            </div>

            <div 
               onClick={() => toggleStep('connect')}
               className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-3 group ${completedSteps.includes('connect') ? 'border-green-500 bg-green-50' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}
            >
               <div className="flex justify-between items-start">
                  <span className="font-bold text-lg text-slate-800">3. Connect</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${completedSteps.includes('connect') ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}>
                     {completedSteps.includes('connect') && <i className="fa-solid fa-check text-xs"></i>}
                  </div>
               </div>
               <p className="text-sm text-slate-500">Connect social accounts to Buffer/Metricool for automation.</p>
            </div>
         </div>
      </div>

      {/* The 5 Phases */}
      <div className="space-y-8 relative">
         <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-200 hidden md:block"></div>
         
         {PHASES.map((phase) => (
            <div key={phase.id} className="relative md:pl-20 animate-fade-in-up" style={{ animationDelay: `${phase.id * 100}ms` }}>
               
               {/* Timeline Node */}
               <div className={`absolute left-0 top-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${phase.color} text-white flex items-center justify-center text-2xl shadow-lg z-10 hidden md:flex`}>
                  <i className={`fa-solid ${phase.icon}`}></i>
               </div>

               <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                     <div className="flex-1">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${phase.bg} ${phase.textColor}`}>
                           Phase {phase.id}: {phase.subtitle}
                        </span>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{phase.title}</h3>
                        <p className="text-slate-500 leading-relaxed mb-6">{phase.description}</p>
                        
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
                           <h4 className="font-bold text-sm text-slate-700 mb-2 flex items-center gap-2">
                              <i className="fa-solid fa-wrench text-slate-400"></i> Recommended Tools
                           </h4>
                           <div className="flex flex-wrap gap-3">
                              {phase.tools.map((tool, i) => (
                                 <a 
                                    key={i} 
                                    href={tool.link} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
                                 >
                                    {tool.name}
                                 </a>
                              ))}
                           </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-500 italic">
                           <i className="fa-solid fa-lightbulb text-yellow-500"></i> {phase.tip}
                        </div>
                     </div>

                     <div className="w-full md:w-auto flex flex-col gap-3">
                        {phase.internalAction && (
                           <button 
                              onClick={() => onNavigate(phase.internalAction.toolId)}
                              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                           >
                              {phase.internalAction.label} <i className="fa-solid fa-arrow-right text-xs"></i>
                           </button>
                        )}
                        <button className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all">
                           Mark Complete
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>

    </div>
  );
};

export default GrowthBlueprint;
