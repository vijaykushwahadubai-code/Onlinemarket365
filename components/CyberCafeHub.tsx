
import React, { useState } from 'react';
import { BROWSERS_AND_ENGINES } from '../data/toolsData';
import { generateGroundedContent } from '../services/geminiService';

type Category = 'All' | 'Search Engine' | 'Browser';

const CyberCafeHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [engine, setEngine] = useState('https://www.google.com/search?q=');
  
  // AI Search State
  const [searchMode, setSearchMode] = useState<'redirect' | 'google'>('google');
  const [aiResult, setAiResult] = useState('');
  const [aiSources, setAiSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchMode === 'redirect') {
      window.open(engine + encodeURIComponent(searchQuery), '_blank');
    } else {
      setLoading(true);
      setAiResult('');
      setAiSources([]);
      try {
        const { text, sources } = await generateGroundedContent(searchQuery, 'search');
        setAiResult(text);
        setAiSources(sources);
      } catch (error) {
        console.error(error);
        setAiResult("Connection to Google Search interrupted. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredItems = BROWSERS_AND_ENGINES.filter(item => {
    const matchesTab = activeTab === 'All' || item.type === activeTab;
    return matchesTab;
  });

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-12">
      
      {/* Hero Header */}
      <div className="bg-white rounded-[2rem] p-10 md:p-14 text-center shadow-xl border border-slate-100 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -mr-16 -mt-16"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full -ml-16 -mb-16"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-700 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-globe"></i> Web Gateway
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
               Access the Web
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
               Search securely, browse efficiently, and access your favorite engines directly from one hub.
            </p>

            {/* Quick Search Bar */}
            <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-lg relative transition-all duration-300">
               {/* Mode Toggles */}
               <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex bg-white/80 rounded-full p-1 border border-slate-200 backdrop-blur-md shadow-sm">
                  <button 
                    onClick={() => setSearchMode('google')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${searchMode === 'google' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    <i className="fa-brands fa-google"></i> Google AI
                  </button>
                  <button 
                    onClick={() => setSearchMode('redirect')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${searchMode === 'redirect' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square"></i> Redirect
                  </button>
               </div>

               <form onSubmit={handleSearch} className="flex gap-2">
                  {searchMode === 'redirect' ? (
                    <select 
                      value={engine}
                      onChange={(e) => setEngine(e.target.value)}
                      className="bg-slate-50 text-slate-700 text-xs font-bold rounded-xl px-3 py-3 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer w-24 md:w-auto"
                    >
                       <option value="https://www.google.com/search?q=">Google</option>
                       <option value="https://www.bing.com/search?q=">Bing</option>
                       <option value="https://duckduckgo.com/?q=">DuckDuckGo</option>
                       <option value="https://search.yahoo.com/search?p=">Yahoo</option>
                    </select>
                  ) : (
                    <div className="bg-blue-50 text-blue-600 text-xs font-bold rounded-xl px-3 py-3 border border-blue-100 flex items-center justify-center min-w-[40px]">
                       <i className="fa-brands fa-google"></i>
                    </div>
                  )}
                  
                  <input 
                     type="text" 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder={searchMode === 'redirect' ? "Enter query to search..." : "Ask Google (AI Powered)..."}
                     className="flex-1 bg-transparent text-slate-800 placeholder:text-slate-400 px-2 py-3 outline-none font-medium"
                  />
                  <button 
                    type="submit" 
                    disabled={loading || !searchQuery.trim()}
                    className={`rounded-xl px-5 transition-all text-white ${loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`}
                  >
                     {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-magnifying-glass"></i>}
                  </button>
               </form>
            </div>
         </div>
      </div>

      {/* Google Search Results */}
      {(aiResult || loading) && searchMode === 'google' && (
        <div className="animate-fade-in-up bg-white rounded-[2rem] p-8 border border-slate-200 shadow-lg max-w-4xl mx-auto relative overflow-hidden">
           {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                 <i className="fa-brands fa-google text-4xl mb-4 animate-bounce text-blue-500"></i>
                 <p className="font-medium animate-pulse">Searching Google...</p>
              </div>
           ) : (
              <>
                 <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
                       <i className="fa-brands fa-google"></i>
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-slate-900">Google Search Results</h3>
                       <p className="text-xs text-slate-500">AI Summary & Sources</p>
                    </div>
                 </div>
                 
                 <div className="prose prose-slate max-w-none mb-8 leading-relaxed text-slate-700">
                    {aiResult}
                 </div>

                 {aiSources.length > 0 && (
                    <div className="space-y-3">
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sources</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {aiSources.map((source, idx) => (
                             source.web ? (
                                <a key={idx} href={source.web.uri} target="_blank" rel="noreferrer" className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all group">
                                   <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-200 group-hover:text-blue-600 flex-shrink-0">
                                      <i className="fa-solid fa-earth-americas text-xs"></i>
                                   </div>
                                   <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-blue-700">{source.web.title}</h4>
                                      <p className="text-xs text-slate-500 truncate">{source.web.uri}</p>
                                   </div>
                                   <i className="fa-solid fa-arrow-up-right-from-square text-xs text-slate-300 group-hover:text-blue-500"></i>
                                </a>
                             ) : null
                          ))}
                       </div>
                    </div>
                 )}
              </>
           )}
        </div>
      )}

      {/* Main Directory */}
      <div className="space-y-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
               <i className="fa-solid fa-bookmark text-indigo-600"></i> Directory
            </h2>
            
            <div className="flex gap-2">
               {['All', 'Search Engine', 'Browser'].map((cat) => (
                  <button
                     key={cat}
                     onClick={() => setActiveTab(cat as Category)}
                     className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
                        activeTab === cat 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                     }`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, idx) => (
               <a 
                 key={idx}
                 href={item.url}
                 target="_blank"
                 rel="noreferrer"
                 className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
               >
                  <div className="flex items-center justify-between mb-6">
                     <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-white text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                        <i className={`fa-brands ${item.icon.replace('fa-brands ', '')} ${item.icon}`}></i>
                     </div>
                     <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.type === 'Browser' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                        {item.type}
                     </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                     {item.name}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                     {item.description}
                  </p>

                  <div className="w-full py-3 rounded-xl bg-slate-50 text-slate-700 font-bold group-hover:bg-slate-900 group-hover:text-white transition-all text-center flex items-center justify-center gap-2">
                     Open <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                  </div>
               </a>
            ))}
         </div>
      </div>

    </div>
  );
};

export default CyberCafeHub;
