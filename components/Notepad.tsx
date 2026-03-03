
import React, { useState, useEffect, useRef } from 'react';
import { generateText } from '../services/geminiService';

const Notepad: React.FC = () => {
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedContent = localStorage.getItem('smart_notepad_content');
    if (savedContent) {
      setContent(savedContent);
      setLastSaved('Restored from backup');
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('smart_notepad_content', content);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSaved(`Saved at ${now}`);
  };

  // Auto-save logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (content) {
        localStorage.setItem('smart_notepad_content', content);
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSaved(`Auto-saved at ${now}`);
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeout);
  }, [content]);

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Note-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setLastSaved('Copied to clipboard!');
    setTimeout(() => setLastSaved(null), 2000);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your note?")) {
      setContent('');
      localStorage.removeItem('smart_notepad_content');
      setLastSaved(null);
    }
  };

  const handleAiAction = async (action: string) => {
    if (!content.trim()) return;
    setLoading(true);
    setShowAiModal(false);

    let prompt = "";
    if (action === 'Fix Grammar') {
      prompt = `Fix grammar and spelling in the following text, keeping the tone natural: \n\n${content}`;
    } else if (action === 'Summarize') {
      prompt = `Summarize the following text into bullet points: \n\n${content}`;
    } else if (action === 'Continue') {
      prompt = `Continue writing the following text creatively: \n\n${content}`;
    } else if (action === 'Custom') {
      prompt = `${aiPrompt}: \n\n${content}`;
    }

    try {
      const result = await generateText(prompt, "You are a helpful writing assistant.");
      if (action === 'Summarize' || action === 'Custom') {
        // Append or separate based on user preference, here just appending for simplicity or replacing if it's a fix
        // For fix/continue, we might replace. For summarize, maybe show in a modal or append.
        // Let's adopt a strategy: replace content for fix/continue, append for others?
        // Simpler: Just update content and let user undo if needed (no undo stack here though).
        // Safest: Append to bottom with a separator.
        setContent(prev => prev + `\n\n--- AI Output (${action}) ---\n${result}`);
      } else {
        // For fix grammar, we might want to replace, but safer to show diff or append. 
        // Let's replace for 'Fix' but keep backup in console? No, let's just replace.
        setContent(result);
      }
      handleSave();
    } catch (e) {
      alert("AI processing failed.");
    } finally {
      setLoading(false);
      setAiPrompt('');
    }
  };

  const stats = {
    chars: content.length,
    words: content.trim().split(/\s+/).filter(Boolean).length,
    lines: content.split('\n').length
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-6rem)] flex flex-col animate-fade-in pb-6">
      
      {/* Header Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4 mb-4">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl">
               <i className="fa-solid fa-note-sticky"></i>
            </div>
            <div>
               <h2 className="text-lg font-bold text-slate-900">Smart Notepad</h2>
               <p className="text-xs text-slate-500 font-medium">{lastSaved || 'Ready to write'}</p>
            </div>
         </div>

         <div className="flex items-center gap-2">
            <button onClick={handleSave} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Save Now">
               <i className="fa-solid fa-floppy-disk"></i>
            </button>
            <button onClick={handleDownload} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Download .txt">
               <i className="fa-solid fa-download"></i>
            </button>
            <button onClick={handleCopy} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Copy All">
               <i className="fa-solid fa-copy"></i>
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button onClick={() => setShowAiModal(true)} disabled={loading} className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md shadow-indigo-500/20">
               {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
               AI Tools
            </button>
            <button onClick={handleClear} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear All">
               <i className="fa-solid fa-trash"></i>
            </button>
         </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
         <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full p-6 outline-none text-slate-700 text-lg leading-relaxed resize-none custom-scrollbar font-mono md:font-sans"
            placeholder="Start typing your ideas here..."
            spellCheck="false"
         />
         
         {/* Footer Stats */}
         <div className="bg-slate-50 border-t border-slate-100 p-3 flex justify-between text-xs text-slate-500 font-mono">
            <div className="flex gap-4">
               <span>{stats.words} words</span>
               <span>{stats.chars} chars</span>
               <span>{stats.lines} lines</span>
            </div>
            <div>
               Markdown Supported (Basic)
            </div>
         </div>
      </div>

      {/* AI Modal */}
      {showAiModal && (
         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAiModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
               <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                     <i className="fa-solid fa-robot text-indigo-600"></i> AI Assistant
                  </h3>
                  <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark"></i></button>
               </div>
               <div className="p-5 space-y-3">
                  <p className="text-sm text-slate-500 mb-2">Choose an action to perform on your current text:</p>
                  
                  <button onClick={() => handleAiAction('Fix Grammar')} className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-3 group">
                     <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors"><i className="fa-solid fa-check"></i></div>
                     <div>
                        <span className="block font-bold text-sm text-slate-700">Fix Grammar & Polish</span>
                        <span className="block text-[10px] text-slate-400">Corrects errors and improves flow.</span>
                     </div>
                  </button>

                  <button onClick={() => handleAiAction('Summarize')} className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-3 group">
                     <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors"><i className="fa-solid fa-list-ul"></i></div>
                     <div>
                        <span className="block font-bold text-sm text-slate-700">Summarize</span>
                        <span className="block text-[10px] text-slate-400">Create a bulleted list summary.</span>
                     </div>
                  </button>

                  <button onClick={() => handleAiAction('Continue')} className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center gap-3 group">
                     <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors"><i className="fa-solid fa-pen-nib"></i></div>
                     <div>
                        <span className="block font-bold text-sm text-slate-700">Continue Writing</span>
                        <span className="block text-[10px] text-slate-400">Generate more content based on context.</span>
                     </div>
                  </button>

                  <div className="pt-2 border-t border-slate-100">
                     <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Custom Command</label>
                     <div className="flex gap-2">
                        <input 
                           type="text" 
                           value={aiPrompt}
                           onChange={(e) => setAiPrompt(e.target.value)}
                           placeholder="e.g. Translate to Spanish..." 
                           className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-indigo-500"
                           onKeyDown={(e) => e.key === 'Enter' && handleAiAction('Custom')}
                        />
                        <button onClick={() => handleAiAction('Custom')} disabled={!aiPrompt} className="bg-slate-900 text-white px-3 rounded-lg hover:bg-slate-700 disabled:opacity-50">
                           <i className="fa-solid fa-arrow-right"></i>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default Notepad;
