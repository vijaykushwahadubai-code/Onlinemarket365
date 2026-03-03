
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { MARKETING_SOFTWARE, ECOMMERCE_PLATFORMS, SOCIAL_MEDIA_PLATFORMS } from '../data/toolsData';

type StrategyMode = 'campaign' | 'email_drip' | 'ad_copy' | 'product_desc' | 'viral_hooks' | 'content_calendar';
type TabCategory = 'AI Strategist' | 'Software Suite' | 'E-Commerce' | 'Social Media' | 'Analytics';

const MarketingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabCategory>('AI Strategist');
  const [strategyMode, setStrategyMode] = useState<StrategyMode>('campaign');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  // Analytics State
  const [isAnalyticsConnected, setIsAnalyticsConnected] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const handleConnectAnalytics = () => {
    setAnalyticsLoading(true);
    setTimeout(() => {
        setIsAnalyticsConnected(true);
        setAnalyticsLoading(false);
    }, 2000);
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput('');

    let prompt = '';
    const systemInstruction = "You are a Chief Marketing Officer and Senior Copywriter.";

    switch (strategyMode) {
      case 'campaign':
        prompt = `Create a comprehensive 360-degree marketing campaign strategy for: "${input}". Include target audience, key channels, messaging pillars, and a rough timeline.`;
        break;
      case 'email_drip':
        prompt = `Outline a 5-part email nurture sequence for a customer interested in: "${input}". Include subject lines and brief body content for each email.`;
        break;
      case 'ad_copy':
        prompt = `Write high-converting ad copy (Headline + Body) for Facebook, Google, and LinkedIn ads promoting: "${input}". Focus on benefits and ROI.`;
        break;
      case 'product_desc':
        prompt = `Write a persuasive, SEO-optimized e-commerce product description for: "${input}". Use sensory words and focus on solving user pain points.`;
        break;
      case 'viral_hooks':
        prompt = `Generate 10 viral marketing hooks, one-liners, and angles for: "${input}".
        Include:
        1. Curiosity Gaps
        2. Negative Framing (Stop doing X...)
        3. "How-To" Promises
        4. Social Proof Angles
        5. Controversial/Bold Statements
        Format as a punchy list.`;
        break;
      case 'content_calendar':
        prompt = `Develop a detailed 4-week Content Calendar Strategy based on the following input: "${input}".
        
        Analyze the Target Audience, Product, and Goals from the input.
        
        Structure the response with:
        1. **Strategy Overview**: Audience persona and core messaging.
        2. **Weekly Themes**: A theme for each of the 4 weeks.
        3. **Content Calendar**: Day-by-day plan (or key posts 3-4x/week) including Platform, Content Format (Reel/Post/Story), and Hook/Caption idea.
        4. **KPIs**: Key metrics to track for the stated goals.`;
        break;
    }

    try {
      const result = await generateText(prompt, systemInstruction);
      setOutput(result);
    } catch (e) {
      setOutput("Error generating content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderDirectory = (items: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item, idx) => (
        <a 
          key={idx}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden h-full animate-fade-in"
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
              {item.icon.startsWith('fa-') ? <i className={`fa-brands ${item.icon.replace('fa-brands ', '')} ${item.icon}`}></i> : <i className={`fa-solid ${item.icon}`}></i>}
            </div>
            <span className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-100">
               {item.category}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
             {item.name}
             <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"></i>
          </h3>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
             {item.description}
          </p>

          <div className="mt-auto text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
             Open Platform <i className="fa-solid fa-chevron-right text-[10px]"></i>
          </div>
        </a>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-12">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-orange-600 to-red-700 text-white p-10 md:p-14 text-center shadow-2xl border border-orange-500">
         <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-[100px] -mr-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-orange-100 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-bullhorn"></i> Marketing Command Center
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               Marketing Professional
            </h1>
            <p className="text-lg md:text-xl text-orange-100 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
               The ultimate directory for marketers. Access AI strategy tools, top software suites, e-commerce giants, and all social platforms in one place.
            </p>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-3">
               {(['AI Strategist', 'Analytics', 'Software Suite', 'E-Commerce', 'Social Media'] as TabCategory[]).map((tab) => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`px-6 py-3 rounded-full text-sm font-bold transition-all border ${
                        activeTab === tab 
                        ? 'bg-white text-orange-700 border-white shadow-lg' 
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                     }`}
                  >
                     {tab === 'AI Strategist' && <i className="fa-solid fa-robot mr-2"></i>}
                     {tab === 'Analytics' && <i className="fa-solid fa-chart-pie mr-2"></i>}
                     {tab === 'Software Suite' && <i className="fa-solid fa-layer-group mr-2"></i>}
                     {tab === 'E-Commerce' && <i className="fa-solid fa-cart-shopping mr-2"></i>}
                     {tab === 'Social Media' && <i className="fa-solid fa-share-nodes mr-2"></i>}
                     {tab}
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[500px]">
         
         {activeTab === 'AI Strategist' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               
               {/* Sidebar Controls */}
               <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm h-full">
                     <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <i className="fa-solid fa-chess text-orange-600"></i> Strategy Generator
                     </h2>
                     <div className="space-y-2">
                        <button 
                           onClick={() => { setStrategyMode('campaign'); setInput(''); setOutput(''); }}
                           className={`w-full text-left p-4 rounded-xl transition-all font-medium border ${strategyMode === 'campaign' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'}`}
                        >
                           <i className="fa-solid fa-bullseye mr-3"></i> Full Campaign
                        </button>
                        <button 
                           onClick={() => { setStrategyMode('content_calendar'); setInput(''); setOutput(''); }}
                           className={`w-full text-left p-4 rounded-xl transition-all font-medium border ${strategyMode === 'content_calendar' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'}`}
                        >
                           <i className="fa-solid fa-calendar-days mr-3"></i> Content Calendar
                        </button>
                        <button 
                           onClick={() => { setStrategyMode('email_drip'); setInput(''); setOutput(''); }}
                           className={`w-full text-left p-4 rounded-xl transition-all font-medium border ${strategyMode === 'email_drip' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'}`}
                        >
                           <i className="fa-solid fa-envelope-open-text mr-3"></i> Email Sequence
                        </button>
                        <button 
                           onClick={() => { setStrategyMode('ad_copy'); setInput(''); setOutput(''); }}
                           className={`w-full text-left p-4 rounded-xl transition-all font-medium border ${strategyMode === 'ad_copy' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'}`}
                        >
                           <i className="fa-solid fa-rectangle-ad mr-3"></i> Ad Copy
                        </button>
                        <button 
                           onClick={() => { setStrategyMode('product_desc'); setInput(''); setOutput(''); }}
                           className={`w-full text-left p-4 rounded-xl transition-all font-medium border ${strategyMode === 'product_desc' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'}`}
                        >
                           <i className="fa-solid fa-box-open mr-3"></i> Product Desc
                        </button>
                        <button 
                           onClick={() => { setStrategyMode('viral_hooks'); setInput(''); setOutput(''); }}
                           className={`w-full text-left p-4 rounded-xl transition-all font-medium border ${strategyMode === 'viral_hooks' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'}`}
                        >
                           <i className="fa-solid fa-fire mr-3"></i> Viral Hooks
                        </button>
                     </div>
                  </div>
               </div>

               {/* Input/Output Area */}
               <div className="lg:col-span-8 space-y-6">
                  <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
                     <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                        {strategyMode === 'campaign' && "Describe your product and main goal:"}
                        {strategyMode === 'content_calendar' && "Product, Target Audience, and Goals:"}
                        {strategyMode === 'email_drip' && "Target audience and offer details:"}
                        {strategyMode === 'ad_copy' && "Product details and platform (FB/Google):"}
                        {strategyMode === 'product_desc' && "Product name and key features:"}
                        {strategyMode === 'viral_hooks' && "Topic or niche:"}
                     </label>
                     <div className="relative">
                        <textarea 
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all h-32 resize-none text-slate-700 placeholder:text-slate-400"
                           placeholder={
                              strategyMode === 'content_calendar' 
                              ? "e.g. Product: Organic Green Tea, Audience: Health-conscious women 25-45, Goal: Drive website sales and brand awareness." 
                              : "e.g. Launching a new SaaS tool for designers..."
                           }
                        />
                        <div className="mt-4 flex justify-end">
                           <button 
                              onClick={handleGenerate}
                              disabled={loading || !input.trim()}
                              className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 hover:-translate-y-0.5 shadow-orange-500/30'}`}
                           >
                              {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                              Generate Strategy
                           </button>
                        </div>
                     </div>
                  </div>

                  {output && (
                     <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                           <h3 className="font-bold text-lg text-slate-800">Strategic Plan</h3>
                           <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs font-bold text-orange-600 hover:text-orange-800 bg-orange-50 px-3 py-1.5 rounded-lg"><i className="fa-regular fa-copy mr-1"></i> Copy</button>
                        </div>
                        <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-600 leading-relaxed">
                           {output}
                        </div>
                     </div>
                  )}
               </div>
            </div>
         )}

         {activeTab === 'Software Suite' && renderDirectory(MARKETING_SOFTWARE)}
         {activeTab === 'E-Commerce' && renderDirectory(ECOMMERCE_PLATFORMS)}
         {activeTab === 'Social Media' && renderDirectory(SOCIAL_MEDIA_PLATFORMS)}
         
         {activeTab === 'Analytics' && (
            <div className="bg-white rounded-[2rem] p-10 text-center border border-slate-100 shadow-sm">
               {isAnalyticsConnected ? (
                  <div className="space-y-6 animate-fade-in">
                     <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto">
                        <i className="fa-solid fa-check"></i>
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900">Analytics Connected</h3>
                     <p className="text-slate-500 max-w-md mx-auto">
                        Your marketing data is now synced. Visit the dedicated Analytics Dashboard from the sidebar to view full reports.
                     </p>
                  </div>
               ) : (
                  <div className="space-y-6">
                     <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center text-4xl mx-auto">
                        <i className="fa-solid fa-chart-simple"></i>
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900">Connect Your Data</h3>
                     <p className="text-slate-500 max-w-md mx-auto">
                        Integrate with Google Analytics, Meta Ads, and Shopify to get AI-powered insights on your campaigns.
                     </p>
                     <button 
                        onClick={handleConnectAnalytics}
                        disabled={analyticsLoading}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
                     >
                        {analyticsLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-link"></i>}
                        {analyticsLoading ? 'Connecting...' : 'Connect Accounts'}
                     </button>
                  </div>
               )}
            </div>
         )}

      </div>

    </div>
  );
};

export default MarketingHub;
