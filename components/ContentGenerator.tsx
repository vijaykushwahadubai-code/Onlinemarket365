
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';

const SUGGESTIONS = [
  { 
    icon: 'fa-bolt', 
    text: 'Promote a new AI coaching service using the Hook-Story-Offer framework.', 
    type: 'Viral Framework', 
    tone: 'Persuasive',
    label: 'Hook-Story-Offer' 
  },
  { 
    icon: 'fa-pen-fancy', 
    text: 'A complete guide to digital marketing trends in 2025 covering AI, SEO, and Social Media.', 
    type: 'Blog Post', 
    tone: 'Professional',
    label: 'SEO Article' 
  },
  { 
    icon: 'fa-fire', 
    text: '5 unpopular opinions about remote work that nobody talks about.', 
    type: 'Social Media Caption', 
    tone: 'Persuasive',
    label: 'Viral Tweet' 
  },
  { 
    icon: 'fa-handshake', 
    text: 'Introductory email to a potential B2B partner proposing a strategic collaboration.', 
    type: 'Email Newsletter', 
    tone: 'Professional',
    label: 'B2B Outreach' 
  }
];

const ContentGenerator: React.FC = () => {
  const [mode, setMode] = useState<'generate' | 'improve'>('generate');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [type, setType] = useState('Blog Post');
  const [existingText, setExistingText] = useState('');
  const [improvementGoal, setImprovementGoal] = useState('Make it more professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (mode === 'generate' && !topic.trim()) return;
    if (mode === 'improve' && !existingText.trim()) return;

    setLoading(true);
    setError('');
    setGeneratedContent('');

    let prompt = '';
    let systemInstruction = "You are an expert copywriter and content strategist.";
    
    if (mode === 'generate') {
      if (type === 'Viral Framework') {
        prompt = `Apply the "Hook-Story-Offer" framework to the topic: "${topic}".
        Structure the output clearly with these sections:
        1. HOOK: A punchy, attention-grabbing opening (under 2 seconds reading time).
        2. STORY: A relatable short story about the problem and how this solution fixes it.
        3. OFFER: A direct and clear Call to Action (CTA).
        Tone: ${tone}.`;
      } else {
        prompt = `Write a ${tone.toLowerCase()} ${type.toLowerCase()} about "${topic}". Ensure the content is engaging, well-structured, and ready to use.`;
      }
      systemInstruction = "You are an expert copywriter and content strategist specializing in viral marketing frameworks.";
    } else {
      prompt = `Improve the following text. Goal: ${improvementGoal}.
      
      Original Text:
      "${existingText}"
      
      Provide the improved version, and briefly explain the changes made.`;
      systemInstruction = "You are an expert editor and copywriter. Your goal is to improve the user's text based on their specific goal, providing a polished version and a brief explanation of the improvements.";
    }

    try {
      const text = await generateText(prompt, systemInstruction);
      setGeneratedContent(text);
    } catch (err) {
      setError('Failed to generate content. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = (s: typeof SUGGESTIONS[0]) => {
    setMode('generate');
    setTopic(s.text);
    setType(s.type);
    setTone(s.tone);
  };

  const handleCopy = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="glass-panel rounded-[2rem] p-8 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
          <h2 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg border border-indigo-500/30">
              <i className="fa-solid fa-pen-nib neon-icon"></i>
            </div>
            AI Copywriter
          </h2>
          
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5 backdrop-blur-md">
            <button 
              onClick={() => setMode('generate')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'generate' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-2 neon-icon"></i> Generate Copy
            </button>
            <button 
              onClick={() => setMode('improve')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'improve' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <i className="fa-solid fa-marker mr-2 neon-icon"></i> Improve Text
            </button>
          </div>
        </div>
        
        {mode === 'generate' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Content Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl bg-slate-900/50 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-white font-medium"
              >
                <option className="bg-slate-900">Viral Framework</option>
                <option className="bg-slate-900">Blog Post</option>
                <option className="bg-slate-900">Social Media Caption</option>
                <option className="bg-slate-900">Email Newsletter</option>
                <option className="bg-slate-900">Product Description</option>
                <option className="bg-slate-900">Ad Copy</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Tone of Voice</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl bg-slate-900/50 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-white font-medium"
              >
                <option className="bg-slate-900">Persuasive</option>
                <option className="bg-slate-900">Professional</option>
                <option className="bg-slate-900">Casual & Friendly</option>
                <option className="bg-slate-900">Humorous</option>
                <option className="bg-slate-900">Urgent</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Topic or Description</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., The benefits of morning meditation for productivity..."
                className="w-full px-5 py-4 rounded-xl bg-slate-900/50 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all h-32 resize-none text-white placeholder:text-slate-600 font-medium"
              />
              
              {/* Suggestions */}
              {!topic && (
                <div className="pt-4 animate-fade-in">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 pl-1 flex items-center gap-2">
                     <i className="fa-solid fa-lightbulb text-amber-400 neon-icon"></i> Quick Start Ideas:
                   </p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SUGGESTIONS.map((s, i) => (
                         <button
                           key={i}
                           onClick={() => applySuggestion(s)}
                           className="text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:-translate-y-0.5 transition-all group flex items-start gap-4"
                         >
                            <div className="w-10 h-10 rounded-xl bg-white/10 text-slate-300 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors shadow-sm">
                              <i className={`fa-solid ${s.icon} text-sm`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                 <span className="text-xs font-bold text-slate-300 group-hover:text-indigo-300">{s.label}</span>
                                 <span className="text-[9px] bg-white/10 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{s.tone}</span>
                              </div>
                              <span className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{s.text}</span>
                            </div>
                         </button>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 mb-8 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Improvement Goal</label>
              <select 
                value={improvementGoal}
                onChange={(e) => setImprovementGoal(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl bg-slate-900/50 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-white font-medium"
              >
                <option className="bg-slate-900">Make it more professional</option>
                <option className="bg-slate-900">Make it punchier and more engaging</option>
                <option className="bg-slate-900">Make it shorter and concise</option>
                <option className="bg-slate-900">Fix grammar and spelling</option>
                <option className="bg-slate-900">Make it sound more persuasive</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Original Text</label>
              <textarea 
                value={existingText}
                onChange={(e) => setExistingText(e.target.value)}
                placeholder="Paste the text you want to improve here..."
                className="w-full px-5 py-4 rounded-xl bg-slate-900/50 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all h-48 resize-none text-white placeholder:text-slate-600 font-medium"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end relative z-10">
          <button
            onClick={handleGenerate}
            disabled={loading || (mode === 'generate' ? !topic.trim() : !existingText.trim())}
            className={`
              flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white shadow-xl transition-all
              ${loading || (mode === 'generate' ? !topic.trim() : !existingText.trim()) ? 'bg-indigo-500/50 cursor-not-allowed opacity-70' : 'bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-1 shadow-indigo-500/25'}
            `}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin neon-icon"></i> Processing...
              </>
            ) : (
              <>
                <i className={`fa-solid ${mode === 'generate' ? 'fa-wand-magic-sparkles' : 'fa-marker'} neon-icon`}></i> 
                {mode === 'generate' ? 'Generate Content' : 'Improve Text'}
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 flex items-center gap-3 animate-fade-in">
          <i className="fa-solid fa-circle-exclamation text-xl"></i> 
          <span className="font-medium">{error}</span>
        </div>
      )}

      {generatedContent && (
        <div className="glass-panel rounded-[2rem] p-8 shadow-xl border border-white/10 animate-fade-in-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-check-circle text-emerald-400"></i> Result
            </h3>
            <button 
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'}`}
            >
              <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
          
          <div className="relative z-10">
            {/* Render Hook-Story-Offer visually distinct if detected */}
            {mode === 'generate' && generatedContent.includes('HOOK:') ? (
               <div className="space-y-4">
                  {generatedContent.split(/(HOOK:|STORY:|OFFER:)/).filter(Boolean).reduce((acc: any[], curr, i, arr) => {
                     if (['HOOK:', 'STORY:', 'OFFER:'].includes(curr)) {
                        acc.push({ title: curr.replace(':', ''), content: arr[i+1] });
                     }
                     return acc;
                  }, []).map((section, idx) => (
                     <div key={idx} className="p-5 rounded-xl bg-slate-900/50 border border-white/5 shadow-inner">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-3">{section.title}</span>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{section.content?.trim()}</p>
                     </div>
                  ))}
               </div>
            ) : (
              <div className="prose prose-invert prose-indigo max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-900/50 p-6 rounded-xl border border-white/5 shadow-inner">
                {generatedContent}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;
