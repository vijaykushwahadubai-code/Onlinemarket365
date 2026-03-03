
import React, { useState } from 'react';

interface FutureFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  status: 'In Development' | 'Planned' | 'Under Review';
  eta: string;
  votes: number;
}

const UPCOMING_FEATURES: FutureFeature[] = [
  {
    id: 'team-collab',
    title: 'Team Collaboration',
    description: 'Real-time multi-user editing for documents and projects with role-based access control.',
    icon: 'fa-users',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    status: 'In Development',
    eta: 'Q3 2024',
    votes: 1240
  },
  {
    id: 'api-access',
    title: 'Public API v2',
    description: 'Comprehensive API endpoints allowing developers to integrate our tools into their own workflows.',
    icon: 'fa-code',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    status: 'Planned',
    eta: 'Q4 2024',
    votes: 890
  },
  {
    id: 'mobile-app',
    title: 'Native Mobile App',
    description: 'Full-featured iOS and Android applications with offline capabilities and push notifications.',
    icon: 'fa-mobile-screen',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    status: 'In Development',
    eta: 'Q3 2024',
    votes: 2100
  },
  {
    id: 'analytics-pro',
    title: 'Advanced Analytics',
    description: 'Deeper insights with custom reporting, heatmaps, and exportable PDF summaries.',
    icon: 'fa-chart-pie',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    status: 'Planned',
    eta: 'Q1 2025',
    votes: 1560
  },
  {
    id: 'white-label',
    title: 'White Labeling',
    description: 'Remove our branding and use your own domain and logo for client-facing tools.',
    icon: 'fa-tag',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    status: 'Under Review',
    eta: 'TBD',
    votes: 2800
  },
  {
    id: 'crm-integration',
    title: 'CRM Integrations',
    description: 'Direct sync with Salesforce, HubSpot, and Zoho CRM for seamless lead management.',
    icon: 'fa-handshake',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    status: 'Planned',
    eta: 'Q4 2024',
    votes: 1100
  }
];

const FutureLabs: React.FC = () => {
  const [voted, setVoted] = useState<string[]>([]);

  const handleVote = (id: string) => {
    if (voted.includes(id)) {
      setVoted(voted.filter(v => v !== id));
    } else {
      setVoted([...voted, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-12 p-6 rounded-[3rem] border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)] bg-[#0B0F19]/50 backdrop-blur-sm">
      
      {/* Hero Header */}
      <div className="bg-white rounded-[2rem] p-10 md:p-14 text-center shadow-xl border border-slate-100 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-16 -mt-16"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full -ml-16 -mb-16"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-map"></i> Development Roadmap
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
               What's Coming Next
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
               We are constantly improving. View our roadmap, track progress, and vote on the features that matter most to your business.
            </p>
            
            <div className="flex justify-center gap-6 text-sm font-medium text-slate-500">
               <span className="flex items-center gap-2"><i className="fa-solid fa-code-commit text-slate-400"></i> Current Version: v3.0.0</span>
               <span className="flex items-center gap-2"><i className="fa-solid fa-server text-green-500"></i> Systems Operational</span>
            </div>
         </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {UPCOMING_FEATURES.map((feature) => (
            <div 
               key={feature.id}
               className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
            >
               <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center text-xl ${feature.color}`}>
                     <i className={`fa-solid ${feature.icon}`}></i>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                     feature.status === 'In Development' ? 'bg-green-100 text-green-700' : 
                     feature.status === 'Planned' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                     {feature.status}
                  </span>
               </div>

               <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
               </h3>
               
               <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                  {feature.description}
               </p>

               <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-400">
                     ETA: <span className="text-slate-600">{feature.eta}</span>
                  </div>
                  
                  <button 
                     onClick={() => handleVote(feature.id)}
                     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${voted.includes(feature.id) ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                     <i className={`fa-solid ${voted.includes(feature.id) ? 'fa-check' : 'fa-thumbs-up'}`}></i>
                     {voted.includes(feature.id) ? 'Voted' : 'Vote'}
                     <span className="opacity-80 ml-1">{(feature.votes + (voted.includes(feature.id) ? 1 : 0)).toLocaleString()}</span>
                  </button>
               </div>
            </div>
         ))}
      </div>

      {/* Newsletter Section */}
      <div className="bg-slate-900 rounded-[2rem] p-10 md:p-14 text-center relative overflow-hidden shadow-xl">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
         <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Join the Beta Program</h2>
            <p className="text-slate-300 mb-8">
               Get early access to new features and help shape the future of our platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
               <input 
                  type="email" 
                  placeholder="Enter your work email" 
                  className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 outline-none backdrop-blur-md transition-all font-medium"
               />
               <button className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg">
                  Request Access
               </button>
            </div>
            <p className="text-xs text-slate-500 mt-4">Limited spots available for the next cohort.</p>
         </div>
      </div>

    </div>
  );
};

export default FutureLabs;
