
import React, { useState } from 'react';
import { ALL_TOOLS, TOOL_CATEGORIES, EXTERNAL_TOOLS } from '../data/toolsData';
import { AiTool, ToolId } from '../types';
import { generateText } from '../services/geminiService';

interface ToolExplorerProps {
  onNavigate?: (tool: ToolId) => void;
}

type SortOption = 'Recommended' | 'A-Z' | 'Z-A';

const ToolExplorer: React.FC<ToolExplorerProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('Recommended');
  const [activeTool, setActiveTool] = useState<AiTool | null>(null);
  const [userTools, setUserTools] = useState<AiTool[]>([]);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const [newTool, setNewTool] = useState<Partial<AiTool>>({
    title: '', description: '', category: 'Productivity', icon: 'fa-robot', promptTemplate: '', inputs: []
  });
  const [newInput, setNewInput] = useState({ key: '', label: '', placeholder: '' });
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoomedCard, setZoomedCard] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Marketing': return 'fa-bullhorn';
      case 'Business': return 'fa-briefcase';
      case 'Freelance': return 'fa-laptop-file';
      case 'Writing': return 'fa-pen-nib';
      case 'Productivity': return 'fa-check-double';
      case 'Design': return 'fa-palette';
      case 'Coding': return 'fa-code';
      case 'Social Media': return 'fa-hashtag';
      case 'Education': return 'fa-graduation-cap';
      case 'Lifestyle': return 'fa-mug-hot';
      case 'Finance': return 'fa-coins';
      case 'HR & Legal': return 'fa-scale-balanced';
      case 'App Development': return 'fa-mobile-screen';
      case 'Custom': return 'fa-wrench';
      default: return 'fa-layer-group';
    }
  };

  let allDisplayedTools = [...userTools, ...ALL_TOOLS];
  let filteredTools = allDisplayedTools.filter(tool => {
     const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
     const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
     return matchesCategory && matchesSearch;
  });

  filteredTools = filteredTools.sort((a, b) => {
     if (sortBy === 'A-Z') return a.title.localeCompare(b.title);
     if (sortBy === 'Z-A') return b.title.localeCompare(a.title);
     return 0;
  });

  const getCategoryCount = (category: string) => {
    return allDisplayedTools.filter(t => t.category === category).length;
  };

  const hasExternalCounterpart = (category: string) => {
    return EXTERNAL_TOOLS.some(ext => ext.category === category);
  };

  const openTool = (tool: AiTool) => {
    setZoomedCard(tool.id);
    setTimeout(() => {
      setActiveTool(tool);
      setInputValues({});
      setResult('');
      setLoading(false);
      setCopied(false);
      setZoomedCard(null);
    }, 500);
  };

  const closeTool = () => setActiveTool(null);

  const handleIconMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    e.currentTarget.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
  };

  const handleIconMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translate(0px, 0px) scale(1)';
  };

  const handleRunTool = async () => {
    if (!activeTool) return;
    setLoading(true);
    setResult('');
    try {
      let prompt = activeTool.promptTemplate;
      Object.entries(inputValues).forEach(([key, value]) => {
        prompt = prompt.split(`{{${key}}}`).join(value);
      });
      const text = await generateText(prompt, "You are a specialized AI assistant.");
      setResult(text);
    } catch (error) {
      setResult("Error generating content.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveNewTool = () => {
    if (newTool.title && newTool.description && newTool.promptTemplate) {
      const tool: AiTool = {
        id: `custom-${Date.now()}`,
        title: newTool.title,
        description: newTool.description,
        category: newTool.category || 'Custom',
        icon: newTool.icon || 'fa-robot',
        promptTemplate: newTool.promptTemplate,
        inputs: newTool.inputs || []
      };
      setUserTools([tool, ...userTools]);
      setIsCreatorOpen(false);
      setNewTool({ title: '', description: '', category: 'Productivity', icon: 'fa-robot', promptTemplate: '', inputs: [] });
    }
  };

  const handleNavigateExternal = (category: string) => {
    sessionStorage.setItem('aixploria_category', category);
    onNavigate?.(ToolId.AIXPLORIA);
  };

  const renderToolCard = (tool: AiTool, index: number) => {
    const isCustom = tool.id.startsWith('custom-');
    const hasExternal = hasExternalCounterpart(tool.category);

    return (
      <div 
        key={tool.id}
        onClick={() => openTool(tool)}
        className={`glass-panel p-6 rounded-[1.5rem] cursor-pointer group flex flex-col h-full relative overflow-hidden animate-float ${zoomedCard === tool.id ? 'zoomed' : ''}`}
        style={{ animationDelay: `${(index % 10) * 50}ms` }}
      >
        {isCustom && (
           <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl z-10 shadow-sm">CUSTOM</div>
        )}
        <div className="flex items-start justify-between mb-4">
          <div 
            className={`w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white magnetic-icon ${isCustom ? 'text-indigo-400' : 'text-slate-300'}`}
            onMouseMove={handleIconMouseMove}
            onMouseLeave={handleIconMouseLeave}
          >
            <i className={`fa-solid ${tool.icon} transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12 neon-icon`}></i>
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-white/5 px-2 py-1 rounded-lg border border-white/5 group-hover:border-indigo-500/30 group-hover:text-indigo-300 transition-colors">
               {tool.category}
             </span>
          </div>
        </div>
        
        <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">{tool.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-6 flex-1">{tool.description}</p>
        
        <div className="mt-auto flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center text-xs font-bold text-indigo-400">
            Launch <i className="fa-solid fa-arrow-right ml-1"></i>
          </div>
          {hasExternal && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateExternal(tool.category);
              }}
              className="text-[10px] font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1.5 rounded-lg transition-colors border border-white/5 flex items-center gap-1.5"
              title="View external tools"
            >
              <i className="fa-solid fa-globe"></i> Apps
            </button>
          )}
        </div>
      </div>
    );
  };

  const displayCategories = userTools.length > 0 ? ['Custom', ...TOOL_CATEGORIES] : TOOL_CATEGORIES;

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-[1600px] mx-auto animate-fade-in pb-12">
      
      {/* Zoom Overlay */}
      <div className={`zoom-overlay ${zoomedCard ? 'active' : ''}`}></div>

      {/* LEFT SIDEBAR - Desktop */}
      <aside className="hidden lg:block w-72 flex-shrink-0 space-y-2 sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar pr-4 bg-slate-900/50 backdrop-blur-md rounded-[2rem] p-6 border border-white/5 shadow-xl">
         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 px-2">Library Categories</h3>
         <button
            onClick={() => setSelectedCategory('All')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${selectedCategory === 'All' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
         >
            <div className="flex items-center gap-3">
              <i className={`fa-solid fa-layer-group w-5 text-center neon-icon`}></i>
              <span>All Tools</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedCategory === 'All' ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500 group-hover:text-white'}`}>
               {allDisplayedTools.length}
            </span>
         </button>
         <div className="space-y-1">
            {displayCategories.map(cat => (
            <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
                <div className="flex items-center gap-3">
                    <i className={`fa-solid ${getCategoryIcon(cat)} w-5 text-center neon-icon`}></i>
                    <span>{cat}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500 group-hover:text-white'}`}>
                    {getCategoryCount(cat)}
                </span>
            </button>
            ))}
         </div>
      </aside>

      {/* RIGHT CONTENT */}
      <div className="flex-1 min-w-0">
        
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 bg-slate-900/50 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 shadow-sm">
            <div className="flex-1">
                <h2 className="text-2xl font-heading font-bold text-white tracking-tight mb-1">Tool Explorer</h2>
                <p className="text-slate-400 text-sm">Access 100+ specialized AI agents for every task.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative w-full sm:w-64 group">
                    <input
                        type="text"
                        placeholder="Search tools..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-bold text-white placeholder:text-slate-500 placeholder:font-normal"
                    />
                    <i className="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
                </div>
                
                <button 
                    onClick={() => setIsCreatorOpen(true)}
                    className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                    <i className="fa-solid fa-plus"></i> <span className="hidden sm:inline">Create Tool</span>
                </button>
            </div>
        </div>

        {/* Mobile Filters */}
        <div className="lg:hidden overflow-x-auto pb-6 -mx-4 px-4 custom-scrollbar flex gap-2 mb-4">
            <button
            onClick={() => setSelectedCategory('All')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold border transition-all whitespace-nowrap ${selectedCategory === 'All' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
            >
            All
            </button>
            {displayCategories.map(cat => (
            <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold border transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
            >
                {cat}
            </button>
            ))}
        </div>

        {/* Grid */}
        <div className="min-h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool, index) => renderToolCard(tool, index))}
            </div>
            
            {filteredTools.length === 0 && (
                <div className="col-span-full py-32 text-center">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600 text-5xl border border-white/5">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-300 mb-2">No tools found</h3>
                    <p className="text-slate-500">Try searching for something else or change the category.</p>
                    <button 
                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                        className="mt-6 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Tool Modal (Dark Theme) */}
      {activeTool && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={closeTool}></div>
          <div className="bg-[#0f172a] rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col animate-scale-in border border-white/10">
            {/* Modal Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-start bg-white/5">
              <div className="flex gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-indigo-500/20 shrink-0">
                  <i className={`fa-solid ${activeTool.icon} neon-icon`}></i>
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-1">{activeTool.title}</h3>
                  <div className="flex items-center gap-3">
                     <span className="bg-white/10 text-slate-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border border-white/5">
                        {activeTool.category}
                     </span>
                     {hasExternalCounterpart(activeTool.category) && (
                        <span 
                            className="text-xs font-bold text-indigo-400 flex items-center gap-1 cursor-pointer hover:text-indigo-300" 
                            onClick={() => handleNavigateExternal(activeTool.category)}
                        >
                           View External Apps <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </span>
                     )}
                  </div>
                </div>
              </div>
              <button onClick={closeTool} className="w-10 h-10 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f172a] flex flex-col lg:flex-row text-slate-300">
               {/* Left: Description & Inputs */}
               <div className="flex-1 p-8 border-r border-white/5">
                  <div className="prose prose-sm prose-invert mb-8 bg-white/5 p-6 rounded-2xl border border-white/5">
                     <p className="font-medium text-slate-300">{activeTool.description}</p>
                  </div>
                  
                  <div className="space-y-6">
                     {activeTool.inputs.map(input => (
                        <div key={input.key} className="space-y-2">
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{input.label}</label>
                           <input
                              type="text"
                              placeholder={input.placeholder}
                              value={inputValues[input.key] || ''}
                              onChange={(e) => setInputValues(prev => ({ ...prev, [input.key]: e.target.value }))}
                              className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white font-medium placeholder:text-slate-600"
                           />
                        </div>
                     ))}
                  </div>
               </div>

               {/* Right: Output */}
               <div className="lg:w-[45%] bg-black/20 p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Result</h4>
                     {result && (
                        <button 
                           onClick={handleCopy}
                           className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${copied ? 'bg-green-500/20 text-green-400' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                        >
                           {copied ? <i className="fa-solid fa-check"></i> : <i className="fa-regular fa-copy"></i>} 
                           {copied ? 'Copied' : 'Copy'}
                        </button>
                     )}
                  </div>
                  
                  <div className="flex-1 bg-[#0B0F19] border border-white/5 rounded-2xl p-6 shadow-inner overflow-y-auto custom-scrollbar min-h-[300px] relative">
                     {result ? (
                        <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                           {result}
                        </div>
                     ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                           <i className="fa-solid fa-wand-magic-sparkles text-4xl mb-3 opacity-20"></i>
                           <p className="text-sm font-medium">Ready to generate</p>
                        </div>
                     )}
                     
                     {loading && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                           <i className="fa-solid fa-circle-notch fa-spin text-3xl text-indigo-500 mb-3"></i>
                           <p className="text-sm font-bold text-slate-400 animate-pulse">AI is thinking...</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/5 bg-[#0f172a] flex justify-end gap-3 shrink-0">
               <button onClick={closeTool} className="px-6 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                 Cancel
               </button>
               <button 
                 onClick={handleRunTool}
                 disabled={loading}
                 className={`px-8 py-3 rounded-xl text-sm font-bold text-white shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2 transform active:scale-95
                   ${loading ? 'bg-indigo-500/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-0.5'}
                 `}
               >
                 <i className="fa-solid fa-bolt"></i> Run Tool
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Creator Modal (Dark Theme) */}
      {isCreatorOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setIsCreatorOpen(false)}></div>
          <div className="bg-[#0f172a] rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col animate-scale-in border border-white/10 text-white">
             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-heading font-bold text-white">Create Custom AI Tool</h3>
                <button onClick={() => setIsCreatorOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors">
                  <i className="fa-solid fa-xmark"></i>
                </button>
             </div>
             
             <div className="p-6 overflow-y-auto custom-scrollbar space-y-5 bg-[#0f172a] flex-1">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Tool Name</label>
                      <input 
                        type="text" 
                        value={newTool.title} 
                        onChange={e => setNewTool({...newTool, title: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl bg-black/20 border border-white/10 focus:border-indigo-500 outline-none text-sm text-white"
                        placeholder="e.g. Email Summarizer"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                      <select 
                        value={newTool.category}
                        onChange={e => setNewTool({...newTool, category: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl bg-black/20 border border-white/10 focus:border-indigo-500 outline-none text-sm text-white"
                      >
                         <option className="bg-slate-900">Custom</option>
                         {TOOL_CATEGORIES.map(c => <option key={c} className="bg-slate-900">{c}</option>)}
                      </select>
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                   <textarea 
                     value={newTool.description}
                     onChange={e => setNewTool({...newTool, description: e.target.value})}
                     className="w-full px-4 py-2 rounded-xl bg-black/20 border border-white/10 focus:border-indigo-500 outline-none text-sm h-20 resize-none text-white"
                     placeholder="What does this tool do?"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Prompt Template</label>
                   <textarea 
                     value={newTool.promptTemplate}
                     onChange={e => setNewTool({...newTool, promptTemplate: e.target.value})}
                     className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-indigo-500 outline-none text-sm h-32 font-mono text-slate-300 resize-none"
                     placeholder="Write a blog post about {{topic}}..."
                   />
                </div>
             </div>

             <div className="p-5 border-t border-white/5 flex justify-end gap-3 bg-white/5">
                <button onClick={() => setIsCreatorOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all">
                   Cancel
                </button>
                <button 
                   onClick={saveNewTool}
                   disabled={!newTool.title || !newTool.promptTemplate}
                   className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-50 disabled:opacity-50 transition-all"
                >
                   Create Tool
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolExplorer;
