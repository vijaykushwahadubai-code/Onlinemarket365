
import React, { useState, useEffect } from 'react';
import { generateGroundedContent } from '../services/geminiService';

type NewsTab = 'India' | 'States' | 'World' | 'Tech' | 'Business' | 'Sports';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 
  'Delhi', 'Jammu & Kashmir', 'Ladakh'
];

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Japan', 
  'Germany', 'France', 'Russia', 'China', 'Brazil', 'UAE'
];

const NewsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NewsTab>('India');
  const [selectedState, setSelectedState] = useState('Delhi');
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [loading, setLoading] = useState(false);
  
  const [newsContent, setNewsContent] = useState('');
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    fetchNews();
  }, [activeTab, selectedState, selectedCountry]);

  const fetchNews = async () => {
    setLoading(true);
    setNewsContent('');
    setSources([]);

    let query = '';
    
    switch (activeTab) {
      case 'India':
        query = 'Top latest news headlines in India today. Summarize key political, social, and economic events.';
        break;
      case 'States':
        query = `Latest news and current affairs in ${selectedState}, India today. Focus on local developments.`;
        break;
      case 'World':
        query = `Top latest news headlines in ${selectedCountry} today.`;
        break;
      case 'Tech':
        query = 'Latest technology news, AI breakthroughs, and startup updates globally today.';
        break;
      case 'Business':
        query = 'Latest stock market updates, business news, and economy trends globally today.';
        break;
      case 'Sports':
        query = 'Latest sports news, cricket scores, football results, and headlines today.';
        break;
    }

    try {
      // Use grounded generation to get real-time news
      const { text, sources: groundedSources } = await generateGroundedContent(query, 'search');
      setNewsContent(text);
      setSources(groundedSources);
    } catch (e) {
      setNewsContent("Unable to fetch latest news at this moment. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-10">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white p-10 md:p-14 shadow-2xl border border-slate-800">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-blue-300 uppercase tracking-widest mb-4">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Updates
               </div>
               <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Global Newsroom</h1>
               <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                  Real-time news coverage powered by AI. Stay informed about India, your state, and the world.
               </p>
            </div>
            
            {/* Quick Stats or Weather Widget Placeholder */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center min-w-[200px]">
               <div className="text-3xl font-bold mb-1">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{new Date().toDateString()}</div>
            </div>
         </div>
      </div>

      {/* Navigation & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-2 rounded-2xl border border-slate-100 shadow-sm sticky top-4 z-30">
         <div className="flex flex-wrap gap-2 justify-center">
            {['India', 'States', 'World', 'Tech', 'Business', 'Sports'].map((tab) => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab as NewsTab)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                     activeTab === tab 
                     ? 'bg-slate-900 text-white shadow-lg' 
                     : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
               >
                  {tab}
               </button>
            ))}
         </div>

         {/* Contextual Dropdowns */}
         <div className="flex gap-3">
            {activeTab === 'States' && (
               <select 
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-4 py-2.5 bg-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
               >
                  {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
               </select>
            )}
            {activeTab === 'World' && (
               <select 
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-4 py-2.5 bg-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
               >
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            )}
            <button 
               onClick={fetchNews}
               disabled={loading}
               className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50"
               title="Refresh News"
            >
               <i className={`fa-solid fa-rotate-right ${loading ? 'fa-spin' : ''}`}></i>
            </button>
         </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Main Feed */}
         <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3 mb-2 px-2">
               <div className="w-2 h-8 bg-red-600 rounded-full"></div>
               <h2 className="text-2xl font-bold text-slate-900">
                  {activeTab === 'States' ? `${selectedState} News` : activeTab === 'World' ? `${selectedCountry} Headlines` : `Top ${activeTab} Stories`}
               </h2>
            </div>

            {loading ? (
               <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                     <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-pulse">
                        <div className="h-6 bg-slate-200 rounded-md w-3/4 mb-4"></div>
                        <div className="h-4 bg-slate-100 rounded-md w-full mb-2"></div>
                        <div className="h-4 bg-slate-100 rounded-md w-5/6"></div>
                     </div>
                  ))}
               </div>
            ) : newsContent ? (
               <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 animate-fade-in-up">
                  {/* Safe Rendering: Using whitespace-pre-wrap to preserve formatting without dangerous HTML injection */}
                  <div className="prose prose-slate max-w-none prose-h2:text-xl prose-h2:font-bold prose-a:text-blue-600 prose-li:marker:text-slate-300 whitespace-pre-wrap leading-relaxed">
                     {newsContent}
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                     <span>Powered by Google Search Grounding</span>
                     <span>Updated just now</span>
                  </div>
               </div>
            ) : (
               <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100">
                  <div className="text-slate-300 text-5xl mb-4"><i className="fa-regular fa-newspaper"></i></div>
                  <p className="text-slate-500 font-medium">No news loaded. Click refresh to get the latest updates.</p>
               </div>
            )}
         </div>

         {/* Sidebar: Sources & Quick Links */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-200 sticky top-24">
               <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-link text-blue-600"></i> Sources
               </h3>
               {sources.length > 0 ? (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                     {sources.map((source, idx) => (
                        source.web ? (
                           <a 
                              key={idx}
                              href={source.web.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="block bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
                           >
                              <h4 className="font-bold text-xs text-slate-800 line-clamp-2 mb-1 group-hover:text-blue-700">
                                 {source.web.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                 <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                                    Source {idx + 1}
                                 </span>
                                 <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-300 ml-auto"></i>
                              </div>
                           </a>
                        ) : null
                     ))}
                  </div>
               ) : (
                  <div className="text-center text-slate-400 py-8 text-sm">
                     <p>Sources will appear here after fetching news.</p>
                  </div>
               )}
            </div>
         </div>

      </div>
    </div>
  );
};

export default NewsHub;
