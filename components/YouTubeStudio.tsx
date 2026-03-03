
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';

type YouTubeTool = 'title' | 'description' | 'tags' | 'script' | 'thumbnail' | 'community' | 'reply';

const YouTubeStudio: React.FC = () => {
  const [activeTool, setActiveTool] = useState<YouTubeTool>('title');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const tools = [
    { id: 'title', label: 'Viral Titles', icon: 'fa-heading', desc: 'Click-worthy titles' },
    { id: 'tags', label: 'SEO Tags', icon: 'fa-tags', desc: 'Optimized keywords' },
    { id: 'description', label: 'Description', icon: 'fa-align-left', desc: 'SEO-rich summary' },
    { id: 'thumbnail', label: 'Thumbnail Ideas', icon: 'fa-image', desc: 'Visual concepts' },
    { id: 'script', label: 'Script Writer', icon: 'fa-file-video', desc: 'Hook, Body, CTA' },
    { id: 'community', label: 'Community Post', icon: 'fa-users', desc: 'Polls & updates' },
    { id: 'reply', label: 'Comment Reply', icon: 'fa-reply', desc: 'Engaging responses' },
  ];

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput('');
    setCopied(false);

    let prompt = '';
    const systemInstruction = "You are a professional YouTube Strategist and Certified Channel Manager. You understand the algorithm, CTR, and retention.";

    switch (activeTool) {
      case 'title':
        prompt = `Generate 10 viral YouTube video titles for a video about: "${input}". 
        Categorize them into styles:
        1. Curiosity Gap
        2. How-To / Educational
        3. Listicle
        4. Negative/Warning (Stop doing this...)
        5. Storytelling`;
        break;
      case 'tags':
        prompt = `Generate a comma-separated list of high-volume, low-competition YouTube tags for a video about: "${input}". 
        Also provide a set of hashtags (#) for the description.`;
        break;
      case 'description':
        prompt = `Write an SEO-optimized YouTube video description for: "${input}". 
        Include:
        - A strong hook in the first 2 lines.
        - Key takeaways.
        - Timestamps placeholder (0:00 Intro).
        - Social links placeholder.
        - Hashtags.`;
        break;
      case 'thumbnail':
        prompt = `Describe 3 high-CTR thumbnail concepts for a video about: "${input}".
        For each concept, specify:
        - Background image
        - Foreground subject (facial expression, action)
        - Text overlay (keep it under 4 words)
        - Color psychology notes.`;
        break;
      case 'script':
        prompt = `Write a structured YouTube script for: "${input}".
        Structure:
        1. The Hook (0-30s): Grab attention immediately.
        2. The Setup: What they will learn.
        3. The Content: 3 key points.
        4. The Engagement Spike: Ask a question for comments.
        5. The CTA & Outro.`;
        break;
      case 'community':
        prompt = `Write 3 engaging YouTube Community Posts to promote a video about: "${input}".
        1. A Poll question.
        2. A "Behind the Scenes" teaser text.
        3. A direct link promotion with a hype hook.`;
        break;
      case 'reply':
        prompt = `Draft a friendly, engaging, and community-building reply to a comment that says: "${input}". 
        Encourage further discussion or specific action (like subscribing).`;
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

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTool = tools.find(t => t.id === activeTool)!;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 animate-fade-in">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-[#0F0F0F] text-white p-10 md:p-14 text-center shadow-2xl border border-red-900/50">
         <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-900/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-bold text-red-400 uppercase tracking-widest mb-6">
               <i className="fa-brands fa-youtube"></i> Creator Command Center
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               YouTube Studio
            </h1>
            <p className="text-lg md:text-xl text-stone-300 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
               Optimize your channel growth. Generate viral titles, SEO tags, scripts, and thumbnail ideas powered by advanced AI.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Tools Sidebar */}
         <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-[2rem] p-6 border border-stone-200 shadow-sm">
               <h3 className="font-bold text-stone-800 mb-4 px-2">Studio Tools</h3>
               <div className="space-y-2">
                  {tools.map(tool => (
                     <button
                        key={tool.id}
                        onClick={() => { setActiveTool(tool.id as YouTubeTool); setInput(''); setOutput(''); }}
                        className={`w-full text-left p-3.5 rounded-xl flex items-center gap-4 transition-all group ${activeTool === tool.id ? 'bg-red-50 text-red-600 border border-red-100 shadow-sm' : 'hover:bg-stone-50 text-stone-600 border border-transparent'}`}
                     >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-colors ${activeTool === tool.id ? 'bg-red-600 text-white' : 'bg-stone-100 text-stone-400 group-hover:bg-stone-200 group-hover:text-stone-600'}`}>
                           <i className={`fa-solid ${tool.icon}`}></i>
                        </div>
                        <div>
                           <div className="font-bold text-sm">{tool.label}</div>
                           <div className="text-[10px] text-stone-400 font-medium">{tool.desc}</div>
                        </div>
                        {activeTool === tool.id && <i className="fa-solid fa-chevron-right ml-auto text-xs"></i>}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Workspace */}
         <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-200">
               <div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center text-xl shadow-lg shadow-red-500/20">
                     <i className={`fa-solid ${currentTool.icon}`}></i>
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900">{currentTool.label}</h2>
               </div>

               <div className="space-y-4">
                  <label className="block text-sm font-bold text-stone-600 ml-1">
                     {activeTool === 'title' && "What is your video about?"}
                     {activeTool === 'tags' && "Enter video topic or title:"}
                     {activeTool === 'description' && "Video title and key points:"}
                     {activeTool === 'thumbnail' && "Video title/topic:"}
                     {activeTool === 'script' && "Video topic and target length:"}
                     {activeTool === 'community' && "What are you promoting or asking?"}
                     {activeTool === 'reply' && "Paste the viewer's comment:"}
                  </label>
                  <textarea 
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     className="w-full px-5 py-4 rounded-xl bg-stone-50 border border-stone-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all h-32 resize-none text-stone-800 placeholder:text-stone-400 font-medium"
                     placeholder="Enter details..."
                     onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                  />
                  <div className="flex justify-end">
                     <button 
                        onClick={handleGenerate}
                        disabled={loading || !input.trim()}
                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${loading ? 'bg-stone-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:-translate-y-0.5 shadow-red-500/30'}`}
                     >
                        {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                        Generate
                     </button>
                  </div>
               </div>
            </div>

            {output && (
               <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-stone-200 animate-fade-in-up relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
                     <h3 className="font-bold text-xl text-stone-800">Result</h3>
                     <button 
                        onClick={handleCopy} 
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${copied ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                     >
                        {copied ? <><i className="fa-solid fa-check"></i> Copied</> : <><i className="fa-regular fa-copy"></i> Copy</>}
                     </button>
                  </div>
                  <div className="prose prose-stone max-w-none text-stone-600 whitespace-pre-wrap leading-relaxed">
                     {output}
                  </div>
               </div>
            )}
         </div>
      </div>

    </div>
  );
};

export default YouTubeStudio;
