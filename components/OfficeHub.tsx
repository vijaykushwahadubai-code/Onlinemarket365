import React, { useState } from 'react';
import { generateText } from '../services/geminiService';

type AppType = 'docs' | 'sheets' | 'slides' | 'mail' | 'content';
type ToneType = 'Professional' | 'Casual' | 'Persuasive' | 'Urgent' | 'Witty' | 'Empathetic';

const OfficeHub: React.FC = () => {
  const [activeApp, setActiveApp] = useState<AppType>('docs');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tone, setTone] = useState<ToneType>('Professional');

  // Specialized State for different apps
  const [sheetMode, setSheetMode] = useState<'formula' | 'data'>('formula');

  const apps = [
    { id: 'docs', label: 'AI Docs', icon: 'fa-file-word', color: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-500' },
    { id: 'sheets', label: 'AI Sheets', icon: 'fa-file-excel', color: 'bg-green-600', text: 'text-green-600', border: 'border-green-500' },
    { id: 'slides', label: 'AI Slides', icon: 'fa-file-powerpoint', color: 'bg-orange-600', text: 'text-orange-600', border: 'border-orange-500' },
    { id: 'mail', label: 'AI Mail', icon: 'fa-envelope', color: 'bg-sky-500', text: 'text-sky-500', border: 'border-sky-500' },
    { id: 'content', label: 'AI Content', icon: 'fa-pen-fancy', color: 'bg-pink-600', text: 'text-pink-600', border: 'border-pink-500' },
  ];

  const currentApp = apps.find(a => a.id === activeApp)!;

  const handleAction = async (actionType: string) => {
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setOutput('');

    let prompt = '';
    let systemInstruction = 'You are a helpful office productivity assistant.';

    try {
      switch (activeApp) {
        case 'docs':
          if (actionType === 'draft') {
            prompt = `Write a comprehensive, professionally formatted document about: "${input}". Use a ${tone} tone. Use headings, bullet points, and clear paragraphs.`;
          } else if (actionType === 'proofread') {
            prompt = `Proofread the following text, fixing grammar, spelling, and improving clarity while maintaining the original meaning: "${input}"`;
          } else if (actionType === 'summarize') {
            prompt = `Summarize the following document into key takeaways and an executive summary: "${input}"`;
          }
          break;
        
        case 'sheets':
          if (sheetMode === 'formula') {
            prompt = `Write an Excel/Google Sheets formula to achieve this: "${input}". Explain how it works briefly.`;
          } else {
            prompt = `Generate realistic dummy data in CSV format for: "${input}". Include headers.`;
          }
          break;

        case 'slides':
          prompt = `Create a detailed presentation outline for: "${input}". Include slide titles, bullet points for content, and speaker notes for each slide. Format clearly.`;
          break;

        case 'mail':
            if (actionType === 'draft') {
                 prompt = `Write a ${tone} email based on this context: "${input}". Include a clear subject line.`;
            } else if (actionType === 'reply') {
                 prompt = `Write a ${tone} reply to this email: "${input}". Be concise.`;
            }
          break;
        
        case 'content':
            if (actionType === 'article') {
                 prompt = `Write a comprehensive and engaging article about: "${input}". Tone: ${tone}. Use a catchy title, subheadings, and a conclusion.`;
            } else if (actionType === 'marketing') {
                 prompt = `Write persuasive marketing copy for: "${input}". Tone: ${tone}. Focus on benefits and a strong call to action.`;
            } else if (actionType === 'social') {
                 prompt = `Create 3 engaging social media posts (Twitter, LinkedIn, Instagram) for: "${input}". Tone: ${tone}. Include hashtags.`;
            }
          break;
      }

      const result = await generateText(prompt, systemInstruction);
      setOutput(result);
    } catch (err) {
      setError('Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center py-8">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Office Suite</span>
        </h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">
          Supercharge your productivity with intelligent tools for documents, spreadsheets, presentations, email, and content creation.
        </p>
      </div>

      {/* App Selector */}
      <div className="flex flex-wrap justify-center gap-4">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => {
              setActiveApp(app.id as AppType);
              setInput('');
              setOutput('');
              setError('');
            }}
            className={`
              relative p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 group w-32 md:w-40
              ${activeApp === app.id 
                ? `bg-white border-${app.color.replace('bg-', '')} shadow-lg scale-105 z-10` 
                : 'bg-white/50 border-slate-200 hover:bg-white hover:shadow-md'}
            `}
            style={{ borderColor: activeApp === app.id ? undefined : 'transparent' }}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl text-white shadow-md transition-transform group-hover:scale-110 ${app.color}`}>
              <i className={`fa-solid ${app.icon}`}></i>
            </div>
            <span className={`font-bold ${activeApp === app.id ? 'text-slate-900' : 'text-slate-500'}`}>
              {app.label}
            </span>
            {activeApp === app.id && (
              <div className={`absolute -bottom-2 w-12 h-1 rounded-full ${app.color}`}></div>
            )}
          </button>
        ))}
      </div>

      {/* Workspace */}
      <div className={`bg-white rounded-[2rem] p-8 shadow-xl border-t-4 ${currentApp.border.replace('border-', 'border-t-')}`}>
        
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
           <div className="flex items-center gap-3">
             <div className={`w-10 h-10 rounded-lg ${currentApp.color} flex items-center justify-center text-white`}>
               <i className={`fa-solid ${currentApp.icon}`}></i>
             </div>
             <div>
               <h3 className="text-2xl font-bold text-slate-800">{currentApp.label} Workspace</h3>
               <p className="text-sm text-slate-500">Powered by Gemini AI</p>
             </div>
           </div>

           {/* Tone Selector for specific apps */}
           {['docs', 'mail', 'content'].includes(activeApp) && (
              <div className="flex items-center gap-2">
                 <span className="text-sm font-bold text-slate-500">Tone:</span>
                 <select 
                   value={tone}
                   onChange={(e) => setTone(e.target.value as ToneType)}
                   className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
                 >
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Persuasive</option>
                    <option>Witty</option>
                    <option>Urgent</option>
                    <option>Empathetic</option>
                 </select>
              </div>
           )}
        </div>

        {/* Input Area */}
        <div className="space-y-6">
           
           {/* Specialized Controls for Sheets (Radio Buttons) */}
           {activeApp === 'sheets' && (
             <div className="flex items-center gap-6 mb-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
               <span className="text-sm font-bold text-slate-500 uppercase tracking-wide mr-2">Mode:</span>
               
               <label className="flex items-center gap-3 cursor-pointer group">
                 <div className="relative flex items-center justify-center w-5 h-5">
                   <input 
                     type="radio" 
                     name="sheetMode" 
                     value="formula" 
                     checked={sheetMode === 'formula'} 
                     onChange={() => setSheetMode('formula')}
                     className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-green-600 checked:bg-white transition-all cursor-pointer"
                   />
                   <div className="absolute w-2.5 h-2.5 bg-green-600 rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                 </div>
                 <div className="flex items-center gap-2">
                    <i className={`fa-solid fa-calculator text-sm ${sheetMode === 'formula' ? 'text-green-600' : 'text-slate-400 group-hover:text-slate-600'}`}></i>
                    <span className={`text-sm font-bold transition-colors ${sheetMode === 'formula' ? 'text-green-800' : 'text-slate-600 group-hover:text-slate-800'}`}>
                      Formula Generator
                    </span>
                 </div>
               </label>
               
               <label className="flex items-center gap-3 cursor-pointer group">
                 <div className="relative flex items-center justify-center w-5 h-5">
                   <input 
                     type="radio" 
                     name="sheetMode" 
                     value="data" 
                     checked={sheetMode === 'data'} 
                     onChange={() => setSheetMode('data')}
                     className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-green-600 checked:bg-white transition-all cursor-pointer"
                   />
                   <div className="absolute w-2.5 h-2.5 bg-green-600 rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                 </div>
                 <div className="flex items-center gap-2">
                    <i className={`fa-solid fa-table text-sm ${sheetMode === 'data' ? 'text-green-600' : 'text-slate-400 group-hover:text-slate-600'}`}></i>
                    <span className={`text-sm font-bold transition-colors ${sheetMode === 'data' ? 'text-green-800' : 'text-slate-600 group-hover:text-slate-800'}`}>
                      Dummy Data
                    </span>
                 </div>
               </label>
             </div>
           )}

           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {activeApp === 'docs' && "What would you like to write or check?"}
                {activeApp === 'sheets' && (sheetMode === 'formula' ? "Describe the calculation you need:" : "Describe the data you need (e.g., 'Sales data for 2023'):")}
                {activeApp === 'slides' && "Presentation Topic or Content:"}
                {activeApp === 'mail' && "Email Context or Text to Reply to:"}
                {activeApp === 'content' && "Topic or Description:"}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  activeApp === 'docs' ? "e.g., Write a project proposal for..." :
                  activeApp === 'sheets' ? (sheetMode === 'formula' ? "e.g., Sum column A if column B is 'Paid'" : "e.g., list of 10 customers with email and phone") :
                  activeApp === 'slides' ? "e.g., The future of renewable energy" :
                  activeApp === 'mail' ? "e.g., Ask for a meeting next Tuesday..." :
                  "e.g., The benefits of AI in healthcare..."
                }
                className={`w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-opacity-50 outline-none transition-all h-40 resize-none font-medium text-slate-700 ${
                  activeApp === 'docs' ? 'focus:ring-blue-600' :
                  activeApp === 'sheets' ? 'focus:ring-green-600' :
                  activeApp === 'slides' ? 'focus:ring-orange-600' :
                  activeApp === 'mail' ? 'focus:ring-sky-500' :
                  'focus:ring-pink-600'
                }`}
              />
           </div>

           {/* Action Buttons */}
           <div className="flex flex-wrap gap-3">
              {activeApp === 'docs' && (
                <>
                  <button onClick={() => handleAction('draft')} disabled={loading} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50">
                    <i className="fa-solid fa-pen-nib mr-2"></i> Draft Content
                  </button>
                  <button onClick={() => handleAction('proofread')} disabled={loading} className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all disabled:opacity-50">
                    <i className="fa-solid fa-check-double mr-2"></i> Proofread
                  </button>
                  <button onClick={() => handleAction('summarize')} disabled={loading} className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all disabled:opacity-50">
                    <i className="fa-solid fa-compress-arrows-alt mr-2"></i> Summarize
                  </button>
                </>
              )}

              {activeApp === 'sheets' && (
                <button onClick={() => handleAction('generate')} disabled={loading} className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50">
                   {sheetMode === 'formula' ? <><i className="fa-solid fa-function mr-2"></i> Generate Formula</> : <><i className="fa-solid fa-table mr-2"></i> Generate Data</>}
                </button>
              )}

              {activeApp === 'slides' && (
                <button onClick={() => handleAction('generate')} disabled={loading} className="px-6 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50">
                   <i className="fa-solid fa-list-ol mr-2"></i> Generate Outline
                </button>
              )}

              {activeApp === 'mail' && (
                <>
                  <button onClick={() => handleAction('draft')} disabled={loading} className="px-6 py-3 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50">
                    <i className="fa-solid fa-paper-plane mr-2"></i> Draft Email
                  </button>
                  <button onClick={() => handleAction('reply')} disabled={loading} className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all disabled:opacity-50">
                    <i className="fa-solid fa-reply mr-2"></i> Generate Reply
                  </button>
                </>
              )}

              {activeApp === 'content' && (
                <>
                  <button onClick={() => handleAction('article')} disabled={loading} className="px-6 py-3 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50">
                    <i className="fa-solid fa-newspaper mr-2"></i> Article
                  </button>
                  <button onClick={() => handleAction('marketing')} disabled={loading} className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all disabled:opacity-50">
                    <i className="fa-solid fa-bullhorn mr-2"></i> Marketing Copy
                  </button>
                  <button onClick={() => handleAction('social')} disabled={loading} className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all disabled:opacity-50">
                    <i className="fa-solid fa-hashtag mr-2"></i> Social Posts
                  </button>
                </>
              )}

              {loading && <div className="flex items-center text-slate-500 ml-4"><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Processing...</div>}
           </div>

           {error && (
             <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
               <i className="fa-solid fa-triangle-exclamation"></i> {error}
             </div>
           )}

           {/* Output Area */}
           {output && (
             <div className="animate-fade-in-up">
                <div className="flex justify-between items-center mb-2">
                   <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Result</h4>
                   <button 
                     onClick={() => navigator.clipboard.writeText(output)}
                     className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeApp === 'docs' ? 'text-blue-600 bg-blue-50' : activeApp === 'sheets' ? 'text-green-600 bg-green-50' : activeApp === 'slides' ? 'text-orange-600 bg-orange-50' : activeApp === 'mail' ? 'text-sky-600 bg-sky-50' : 'text-pink-600 bg-pink-50'}`}
                   >
                     <i className="fa-regular fa-copy"></i> Copy
                   </button>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-inner">
                   <div className="prose prose-slate max-w-none whitespace-pre-wrap leading-relaxed text-slate-700">
                     {output}
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default OfficeHub;