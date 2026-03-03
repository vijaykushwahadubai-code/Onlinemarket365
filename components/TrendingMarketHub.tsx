
import React, { useState } from 'react';
import { generateGroundedContent } from '../services/geminiService';
import { FINANCIAL_PLATFORMS } from '../data/toolsData';

type MarketTab = 'stocks' | 'crypto' | 'trends';

const INDICES = [
  { name: 'S&P 500', value: '5,230.15', change: '+0.45%', up: true },
  { name: 'NASDAQ', value: '16,428.82', change: '+0.82%', up: true },
  { name: 'DOW JONES', value: '39,112.40', change: '-0.12%', up: false },
  { name: 'BTC/USD', value: '$68,420.00', change: '+2.10%', up: true },
  { name: 'ETH/USD', value: '$3,540.50', change: '+1.55%', up: true },
];

const TrendingMarketHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MarketTab>('stocks');
  const [tickerInput, setTickerInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [trendCategory, setTrendCategory] = useState('Technology');

  const handleAnalyze = async () => {
    if (!tickerInput.trim()) return;
    setLoading(true);
    setAnalysisResult('');
    setSources([]);

    let prompt = '';
    if (activeTab === 'stocks' || activeTab === 'crypto') {
      prompt = `Provide a real-time financial analysis for ${tickerInput}. 
      Include:
      1. Current Sentiment (Bullish/Bearish/Neutral) based on recent news.
      2. Key Drivers (Why is it moving?).
      3. Recent Headlines.
      4. Risk Factors.
      Use Google Search to find the absolute latest data.`;
    }

    try {
      const { text, sources: groundingSources } = await generateGroundedContent(prompt, 'search');
      setAnalysisResult(text);
      setSources(groundingSources);
    } catch (e) {
      setAnalysisResult("Unable to fetch market data at this moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleScanTrends = async () => {
    setLoading(true);
    setAnalysisResult('');
    setSources([]);

    const prompt = `What are the top 5 emerging trends in ${trendCategory} right now? 
    For each trend, provide:
    - Name of the trend
    - Why it is viral/important
    - A key company or entity involved.
    Use Google Search for the latest info.`;

    try {
      const { text, sources: groundingSources } = await generateGroundedContent(prompt, 'search');
      setAnalysisResult(text);
      setSources(groundingSources);
    } catch (e) {
      setAnalysisResult("Unable to scan trends.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in">
      
      {/* Ticker Tape */}
      <div className="bg-slate-900 text-white overflow-hidden py-3 rounded-xl shadow-lg relative border-t-4 border-emerald-500">
         <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] flex gap-12 px-4">
            {/* Duplicated list for seamless loop */}
            {[...INDICES, ...INDICES, ...INDICES].map((idx, i) => (
               <div key={i} className="flex items-center gap-3 text-sm font-mono">
                  <span className="font-bold text-slate-300">{idx.name}</span>
                  <span className="font-medium">{idx.value}</span>
                  <span className={`font-bold ${idx.up ? 'text-emerald-400' : 'text-red-400'}`}>
                     {idx.change} {idx.up ? '▲' : '▼'}
                  </span>
               </div>
            ))}
         </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-6">
         <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Market Pulse</h1>
            <p className="text-slate-500 font-medium">Real-time AI analysis of stocks, crypto, and global trends.</p>
         </div>
         <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            {['stocks', 'crypto', 'trends'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => { setActiveTab(tab as MarketTab); setAnalysisResult(''); setTickerInput(''); setSources([]); }}
                 className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all capitalize ${activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
               >
                 {tab}
               </button>
            ))}
         </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Left Control Panel */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm h-full flex flex-col">
               <div className="mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl text-white mb-4 shadow-lg ${activeTab === 'trends' ? 'bg-purple-600 shadow-purple-500/30' : 'bg-emerald-600 shadow-emerald-500/30'}`}>
                     <i className={`fa-solid ${activeTab === 'trends' ? 'fa-fire' : 'fa-chart-line'}`}></i>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                     {activeTab === 'trends' ? 'Trend Spotter' : 'Financial Analyst'}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                     {activeTab === 'trends' ? 'Discover viral topics across industries.' : 'Get grounded insights on market movers.'}
                  </p>
               </div>

               <div className="space-y-4 flex-1">
                  {activeTab === 'trends' ? (
                     <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase">Select Sector</label>
                        <select 
                           value={trendCategory}
                           onChange={(e) => setTrendCategory(e.target.value)}
                           className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none focus:border-purple-500 transition-all"
                        >
                           {['Technology', 'Business', 'Crypto & Web3', 'Consumer Goods', 'Healthcare', 'AI Tools'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button 
                           onClick={handleScanTrends}
                           disabled={loading}
                           className="w-full py-3.5 rounded-xl bg-purple-600 text-white font-bold shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                           {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-radar"></i>} Scan Trends
                        </button>
                     </div>
                  ) : (
                     <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase">
                           Enter {activeTab === 'stocks' ? 'Ticker Symbol' : 'Coin Symbol'}
                        </label>
                        <div className="relative">
                           <input 
                              type="text" 
                              value={tickerInput}
                              onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                              placeholder={activeTab === 'stocks' ? 'e.g. NVDA, TSLA' : 'e.g. BTC, ETH'}
                              className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-lg text-slate-800 outline-none focus:border-emerald-500 transition-all placeholder:text-slate-400"
                              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                           />
                           <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">
                              {activeTab === 'stocks' ? 'NYSE/NAS' : 'CRYPTO'}
                           </div>
                        </div>
                        <button 
                           onClick={handleAnalyze}
                           disabled={loading || !tickerInput}
                           className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                           {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-magnifying-glass-chart"></i>} Analyze
                        </button>
                     </div>
                  )}
               </div>
               
               <div className="mt-6 pt-6 border-t border-slate-100 text-[10px] text-slate-400 font-medium text-center">
                  Powered by Gemini Grounding (Google Search)
               </div>
            </div>
         </div>

         {/* Right Output Panel */}
         <div className="lg:col-span-8">
            {analysisResult ? (
               <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100 animate-fade-in-up">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                     <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${activeTab === 'trends' ? 'bg-purple-600' : 'bg-emerald-600'}`}>
                           <i className={`fa-solid ${activeTab === 'trends' ? 'fa-fire' : 'fa-robot'}`}></i>
                        </div>
                        <h3 className="font-bold text-xl text-slate-900">AI Insights</h3>
                     </div>
                     <button onClick={() => navigator.clipboard.writeText(analysisResult)} className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1">
                        <i className="fa-regular fa-copy"></i> Copy
                     </button>
                  </div>
                  
                  <div className="prose prose-slate max-w-none leading-relaxed text-slate-700">
                     {analysisResult}
                  </div>

                  {/* Sources Section */}
                  {sources.length > 0 && (
                     <div className="mt-8 pt-6 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Sources & Citations</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           {sources.slice(0, 4).map((source, idx) => (
                              source.web ? (
                                 <a key={idx} href={source.web.uri} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all group">
                                    <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                                       <i className="fa-solid fa-link text-[10px]"></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <p className="text-xs font-bold text-slate-700 truncate group-hover:text-indigo-600">{source.web.title}</p>
                                       <p className="text-[10px] text-slate-400 truncate">{source.web.uri}</p>
                                    </div>
                                 </a>
                              ) : null
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            ) : (
               <div className="h-full min-h-[400px] bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl text-slate-300 shadow-sm mb-4">
                     <i className={`fa-solid ${activeTab === 'trends' ? 'fa-globe' : 'fa-chart-pie'}`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to Analyze</h3>
                  <p className="text-slate-500 max-w-sm">
                     {activeTab === 'trends' 
                        ? 'Select a category to scan for viral trends and emerging topics.' 
                        : 'Enter a symbol to get real-time price sentiment and news analysis.'}
                  </p>
               </div>
            )}
         </div>

      </div>

      {/* Market Resources Directory */}
      <div className="space-y-6">
         <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg">
               <i className="fa-solid fa-link"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Market Resources</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FINANCIAL_PLATFORMS.map((platform, idx) => (
               <a 
                  key={idx}
                  href={platform.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full"
               >
                  <div className="flex items-center justify-between mb-4">
                     <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform`}>
                        <i className={`fa-solid ${platform.icon}`}></i>
                     </div>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">
                        {platform.category}
                     </span>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{platform.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
                     {platform.description}
                  </p>
                  
                  <div className="mt-auto flex items-center text-xs font-bold text-emerald-600">
                     Visit Site <i className="fa-solid fa-arrow-up-right-from-square ml-2 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                  </div>
               </a>
            ))}
         </div>
      </div>

    </div>
  );
};

export default TrendingMarketHub;
