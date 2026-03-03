
import React, { useState } from 'react';
import { generateGroundedContent, generateText } from '../services/geminiService';

type AppId = 'search' | 'maps' | 'docs' | 'sheets' | 'slides' | 'gmail' | 'youtube' | 'meet';

interface GoogleApp {
  id: AppId;
  label: string;
  icon: string;
  color: string;
  textColor: string;
  description: string;
}

const APPS: GoogleApp[] = [
  { id: 'search', label: 'Search', icon: 'fa-brands fa-google', color: 'bg-blue-100', textColor: 'text-blue-600', description: 'Real-time web information.' },
  { id: 'maps', label: 'Maps', icon: 'fa-solid fa-map-location-dot', color: 'bg-green-100', textColor: 'text-green-600', description: 'Find places and locations.' },
  { id: 'docs', label: 'Docs', icon: 'fa-solid fa-file-lines', color: 'bg-blue-50', textColor: 'text-blue-700', description: 'Draft and format documents.' },
  { id: 'sheets', label: 'Sheets', icon: 'fa-solid fa-table', color: 'bg-green-50', textColor: 'text-green-700', description: 'Formulas and data sets.' },
  { id: 'slides', label: 'Slides', icon: 'fa-solid fa-presentation-screen', color: 'bg-orange-50', textColor: 'text-orange-600', description: 'Presentation outlines.' },
  { id: 'gmail', label: 'Gmail', icon: 'fa-solid fa-envelope', color: 'bg-red-50', textColor: 'text-red-600', description: 'Write professional emails.' },
  { id: 'youtube', label: 'YouTube', icon: 'fa-brands fa-youtube', color: 'bg-red-100', textColor: 'text-red-700', description: 'Video scripts and ideas.' },
  { id: 'meet', label: 'Meet', icon: 'fa-solid fa-video', color: 'bg-indigo-50', textColor: 'text-indigo-600', description: 'Meeting agendas & notes.' },
];

const GoogleFeatureHub: React.FC = () => {
  const [activeApp, setActiveApp] = useState<AppId>('search');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAction = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResult('');
    setSources([]);
    setError('');

    try {
      if (activeApp === 'search' || activeApp === 'maps') {
        // Use Grounding API
        const response = await generateGroundedContent(query, activeApp);
        setResult(response.text);
        setSources(response.sources);
      } else {
        // Use Standard Text Generation for Workspace Apps
        let prompt = '';
        let systemInstruction = "You are a helpful AI assistant integrated with Google Workspace.";

        switch (activeApp) {
          case 'docs':
            prompt = `Create a professionally formatted document content for: "${query}". Use headings, bullet points, and clear paragraphs.`;
            break;
          case 'sheets':
            prompt = `Generate either a Google Sheets formula or a CSV dataset for: "${query}". If formula, explain it briefly.`;
            break;
          case 'slides':
            prompt = `Create a presentation outline for: "${query}". Include 5-7 slides with titles and bullet points.`;
            break;
          case 'gmail':
            prompt = `Draft a professional email regarding: "${query}". Include a subject line.`;
            break;
          case 'youtube':
            prompt = `Generate 5 viral YouTube video title ideas and a short script outline for a video about: "${query}".`;
            break;
          case 'meet':
            prompt = `Create a structured meeting agenda for: "${query}". Include time slots and key discussion points.`;
            break;
        }

        const text = await generateText(prompt, systemInstruction);
        setResult(text);
      }
    } catch (err) {
      setError('Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentApp = APPS.find(a => a.id === activeApp)!;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12 animate-fade-in">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-white text-slate-900 p-10 md:p-14 text-center shadow-xl border border-slate-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
           <div className="flex justify-center gap-3 mb-6">
             <div className="w-4 h-4 rounded-full bg-[#4285F4] animate-bounce delay-0"></div>
             <div className="w-4 h-4 rounded-full bg-[#EA4335] animate-bounce delay-100"></div>
             <div className="w-4 h-4 rounded-full bg-[#FBBC05] animate-bounce delay-200"></div>
             <div className="w-4 h-4 rounded-full bg-[#34A853] animate-bounce delay-300"></div>
           </div>
           <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Google Studio<span className="text-blue-600">+</span></h1>
           <p className="text-slate-500 text-lg font-medium leading-relaxed">
             One hub for everything Google. From real-time Search & Maps grounding to AI-powered Docs, Sheets, and YouTube creation.
           </p>
        </div>
      </div>

      {/* App Selector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {APPS.map((app) => (
          <button
            key={app.id}
            onClick={() => { setActiveApp(app.id); setQuery(''); setResult(''); setSources([]); setError(''); }}
            className={`
              flex flex-col items-center justify-center gap-3 p-4 rounded-2xl transition-all duration-200
              ${activeApp === app.id ? 'bg-white shadow-lg scale-105 border border-slate-100 ring-2 ring-blue-500/10' : 'bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md'}
            `}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${app.color} ${app.textColor}`}>
              <i className={app.icon}></i>
            </div>
            <span className={`text-xs font-bold ${activeApp === app.id ? 'text-slate-800' : 'text-slate-500'}`}>
              {app.label}
            </span>
          </button>
        ))}
      </div>

      {/* Workspace Interface */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border border-white/50">
         <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="flex items-center gap-3 mb-2">
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm ${currentApp.color.replace('bg-', 'bg-').replace('100', '500').replace('50', '500')}`}>
                  <i className={currentApp.icon}></i>
               </div>
               <div>
                  <h3 className="text-lg font-bold text-slate-800">{currentApp.label} Assistant</h3>
                  <p className="text-xs text-slate-500">{currentApp.description}</p>
               </div>
            </div>

            {/* Input Area */}
            <div className="relative group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAction()}
                placeholder={
                  activeApp === 'search' ? "Ask about current events, news, or facts..." :
                  activeApp === 'maps' ? "Find restaurants, parks, or landmarks..." :
                  activeApp === 'docs' ? "Describe the document you want to write..." :
                  activeApp === 'sheets' ? "Describe the data or formula you need..." :
                  activeApp === 'youtube' ? "Video topic or script idea..." :
                  "Enter your request..."
                }
                className="w-full pl-6 pr-16 py-5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-lg shadow-inner"
              />
              <button 
                onClick={handleAction}
                disabled={loading || !query.trim()}
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${loading ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'}`}
              >
                {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-arrow-right"></i>}
              </button>
            </div>

            {/* Error */}
            {error && (
               <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3 animate-fade-in">
                 <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                 <div>
                   <p className="font-bold">Request Failed</p>
                   <p className="text-sm">{error}</p>
                 </div>
               </div>
            )}

            {/* Results */}
            {result && (
              <div className="animate-fade-in space-y-6">
                 {/* Text Content */}
                 <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                    <div className="prose prose-lg prose-slate max-w-none leading-relaxed whitespace-pre-wrap">
                      {result}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                       <button 
                         onClick={() => navigator.clipboard.writeText(result)}
                         className="text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-2 transition-colors"
                       >
                         <i className="fa-regular fa-copy"></i> Copy to Clipboard
                       </button>
                    </div>
                 </div>

                 {/* Sources / Map Cards (Only for Search/Maps) */}
                 {sources.length > 0 && (
                   <div className="border-t border-slate-100 pt-6">
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                        {activeApp === 'search' ? <><i className="fa-solid fa-link"></i> Sources</> : <><i className="fa-solid fa-location-dot"></i> Places Found</>}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sources.map((source, idx) => {
                          if (source.web) {
                            return (
                              <a key={idx} href={source.web.uri} target="_blank" rel="noreferrer" className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-200 group-hover:border-blue-200 group-hover:text-blue-500">
                                  <i className="fa-solid fa-earth-americas text-xs"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-blue-700">{source.web.title}</h4>
                                  <p className="text-xs text-slate-500 truncate">{source.web.uri}</p>
                                </div>
                                <i className="fa-solid fa-arrow-up-right-from-square text-xs text-slate-300 group-hover:text-blue-400"></i>
                              </a>
                            );
                          }
                          if (source.maps) {
                             return (
                              <a key={idx} href={source.maps.uri} target="_blank" rel="noreferrer" className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-green-50 hover:border-green-200 transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-200 group-hover:border-green-200 group-hover:text-green-500">
                                  <i className="fa-solid fa-map-pin text-xs"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-green-700">{source.maps.title}</h4>
                                  <p className="text-xs text-slate-500 truncate">View on Google Maps</p>
                                </div>
                                <i className="fa-solid fa-arrow-up-right-from-square text-xs text-slate-300 group-hover:text-green-400"></i>
                              </a>
                             );
                          }
                          return null;
                        })}
                      </div>
                   </div>
                 )}
              </div>
            )}
         </div>
      </div>
      
      {/* Footer Disclaimer */}
      <div className="text-center text-xs text-slate-400">
         <p>Powered by Gemini API. Includes Google Search & Maps Grounding.</p>
      </div>

    </div>
  );
};

export default GoogleFeatureHub;
