
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { VIDEO_EDITING_RESOURCES } from '../data/toolsData';

type PlannerMode = 'script_outline' | 'youtube_idea' | 'description';
type TabCategory = 'All' | 'Pro Software' | 'Online Editors' | 'AI Tools' | 'Open Source' | 'Mobile Apps' | 'Free / Offline' | 'Utilities';

interface VideoTool {
  name: string;
  category: string;
  url: string;
  color: string;
  icon: string;
  description: string;
  badge?: string;
  tutorial?: string;
}

const VideoPlanner: React.FC = () => {
  const [plannerMode, setPlannerMode] = useState<PlannerMode>('youtube_idea');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Directory State
  const [activeTab, setActiveTab] = useState<TabCategory>('All');

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput('');

    let prompt = '';
    const systemInstruction = "You are an expert video content strategist and editor.";

    switch (plannerMode) {
      case 'youtube_idea':
        prompt = `Generate 5 viral YouTube video concepts based on the topic: "${input}". Include catchy titles and brief thumbnail ideas.`;
        break;
      case 'script_outline':
        prompt = `Create a structured video script outline for a video about: "${input}". Include Intro, Key Points, and Outro/Call to Action.`;
        break;
      case 'description':
        prompt = `Write an SEO-optimized YouTube video description with hashtags for a video titled: "${input}".`;
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

  // Filter Logic
  const filteredTools = VIDEO_EDITING_RESOURCES.filter(tool => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pro Software') return tool.category === 'Software';
    if (activeTab === 'Online Editors') return ['Online Editor', 'Collaboration'].includes(tool.category);
    if (activeTab === 'AI Tools') return tool.category === 'AI Tool';
    if (activeTab === 'Open Source') return tool.category === 'Open Source';
    if (activeTab === 'Mobile Apps') return ['Mobile App', 'Software/App'].includes(tool.category);
    if (activeTab === 'Free / Offline') return ['Mobile App', 'Open Source'].includes(tool.category) || (tool.badge && (tool.badge.includes('Free') || tool.badge.includes('Offline')));
    if (activeTab === 'Utilities') return tool.category === 'Utility';
    return true;
  });

  const categories: TabCategory[] = ['All', 'Pro Software', 'Online Editors', 'AI Tools', 'Open Source', 'Mobile Apps', 'Free / Offline', 'Utilities'];

  return (
    <div className="space-y-16 animate-fade-in">
      
      {/* AI Planner Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
           <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                 <i className="fa-solid fa-brain text-red-600"></i> AI Video Planner
              </h2>
              <div className="space-y-2">
                 <button 
                   onClick={() => { setPlannerMode('youtube_idea'); setInput(''); setOutput(''); }}
                   className={`w-full text-left p-4 rounded-xl transition-all font-medium border ${plannerMode === 'youtube_idea' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'}`}
                 >
                    <i className="fa-brands fa-youtube mr-3"></i> Viral Ideas
                 </button>
                 <button 
                   onClick={() => { setPlannerMode('script_outline'); setInput(''); setOutput(''); }}
                   className={`w-full text-left p-4 rounded-xl transition-all font-medium border ${plannerMode === 'script_outline' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'}`}
                 >
                    <i className="fa-solid fa-list-ol mr-3"></i> Script Outline
                 </button>
                 <button 
                   onClick={() => { setPlannerMode('description'); setInput(''); setOutput(''); }}
                   className={`w-full text-left p-4 rounded-xl transition-all font-medium border ${plannerMode === 'description' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'}`}
                 >
                    <i className="fa-solid fa-tags mr-3"></i> SEO Description
                 </button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                 {plannerMode === 'youtube_idea' && "Enter a topic or niche:"}
                 {plannerMode === 'script_outline' && "What is your video about?"}
                 {plannerMode === 'description' && "Enter your video title:"}
              </label>
              <div className="relative">
                 <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full pl-5 pr-32 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
                    placeholder="Type here..."
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                 />
                 <button 
                    onClick={handleGenerate}
                    disabled={loading || !input.trim()}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-lg font-bold text-white text-sm transition-all ${loading ? 'bg-slate-400' : 'bg-red-600 hover:bg-red-700'}`}
                 >
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : "Generate"}
                 </button>
              </div>
           </div>

           {output && (
              <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100 animate-fade-in-up">
                 <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                    <h3 className="font-bold text-lg text-slate-800">Generated Plan</h3>
                    <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 rounded-lg"><i className="fa-regular fa-copy mr-1"></i> Copy</button>
                 </div>
                 <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-600 leading-relaxed">
                    {output}
                 </div>
              </div>
           )}
        </div>
      </section>

      {/* Tools Directory */}
      <section>
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-2">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center text-xl shadow-lg shadow-slate-500/20">
                  <i className="fa-solid fa-photo-film"></i>
               </div>
               <div>
                  <h2 className="text-3xl font-bold text-slate-900">Editing Directory</h2>
                  <p className="text-slate-500">Curated list of {filteredTools.length} video tools.</p>
               </div>
            </div>
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
               {categories.map((cat) => (
                  <button
                     key={cat}
                     onClick={() => setActiveTab(cat)}
                     className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                        activeTab === cat 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700'
                     }`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((t, idx) => {
               const tool = t as VideoTool;
               return (
               <div key={idx} className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden animate-fade-in-up">
                  
                  {tool.badge && (
                     <div className="absolute top-4 right-4 px-2 py-1 bg-slate-900/5 backdrop-blur-sm text-slate-900 text-[10px] font-bold uppercase tracking-wider rounded-lg z-10 border border-slate-900/10">
                        {tool.badge}
                     </div>
                  )}

                  <div className={`w-14 h-14 rounded-2xl ${tool.color} flex items-center justify-center text-white text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                     <i className={`fa-solid ${tool.icon}`}></i>
                  </div>
                  
                  <div className="mb-4">
                     <h3 className="text-lg font-bold text-slate-900 mb-1">{tool.name}</h3>
                     <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        tool.category === 'AI Tool' ? 'bg-purple-50 text-purple-600' : 
                        tool.category === 'Utility' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-500'
                     }`}>
                        {tool.category}
                     </span>
                  </div>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">{tool.description}</p>
                  
                  <div className="mt-auto flex gap-2 w-full">
                      <a href={tool.url} target="_blank" rel="noreferrer" className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-900 font-bold text-sm hover:bg-slate-900 hover:text-white transition-all text-center flex items-center justify-center gap-2 group-hover:shadow-lg">
                         {tool.category === 'AI Tool' ? 'Try AI Tool' : 'Get Tool'} <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                      </a>
                      {tool.tutorial && (
                        <a href={tool.tutorial} target="_blank" rel="noreferrer" className="px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm hover:bg-indigo-100 transition-all flex items-center justify-center border border-indigo-100" title="Watch Tutorial">
                            <i className="fa-solid fa-graduation-cap"></i>
                        </a>
                      )}
                  </div>
               </div>
            )})}
            
            {filteredTools.length === 0 && (
               <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">No tools found in this category.</p>
               </div>
            )}
         </div>
      </section>

    </div>
  );
};

export default VideoPlanner;
