
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';

interface Agent {
  id: string;
  role: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  systemInstruction: string;
  placeholder: string;
}

const AI_LABS = [
  { name: 'OpenAI', url: 'https://openai.com', icon: 'fa-robot', color: 'bg-green-600', desc: 'Creators of GPT-4 and DALL-E.' },
  { name: 'Anthropic', url: 'https://www.anthropic.com', icon: 'fa-brain', color: 'bg-amber-600', desc: 'AI safety and research company.' },
  { name: 'DeepMind', url: 'https://deepmind.google', icon: 'fa-dna', color: 'bg-cyan-600', desc: 'Solving intelligence to advance science.' },
  { name: 'Hugging Face', url: 'https://huggingface.co', icon: 'fa-face-smile', color: 'bg-yellow-500', desc: 'The AI community building the future.' },
  { name: 'LangChain', url: 'https://www.langchain.com', icon: 'fa-link', color: 'bg-slate-700', desc: 'Building applications with LLMs.' },
  { name: 'Papers With Code', url: 'https://paperswithcode.com', icon: 'fa-file-code', color: 'bg-blue-600', desc: 'Trends in Machine Learning research.' },
];

const AGENTS: Agent[] = [
  {
    id: 'devops',
    role: 'Senior DevOps Engineer',
    name: 'Atlas',
    icon: 'fa-server',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Expert in Docker, Kubernetes, CI/CD pipelines, and cloud infrastructure optimization.',
    systemInstruction: 'You are Atlas, a Senior DevOps Engineer with 15 years of experience. You specialize in AWS, Docker, Kubernetes, and Terraform. Provide concrete, technical, and secure solutions. Always follow best practices for infrastructure as code.',
    placeholder: 'Ask about Dockerfiles, CI pipelines, or AWS architecture...'
  },
  {
    id: 'fullstack',
    role: 'Full Stack Architect',
    name: 'Neo',
    icon: 'fa-code',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    description: 'Specializes in React, Node.js, database design, and scalable system architecture.',
    systemInstruction: 'You are Neo, a Full Stack Software Architect. You write clean, modern, type-safe code (TypeScript preferred). You explain complex architectural patterns simply and prioritize performance and maintainability.',
    placeholder: 'Ask to design a schema, write a React hook, or debug an API...'
  },
  {
    id: 'seo',
    role: 'SEO Audit Specialist',
    name: 'Rank',
    icon: 'fa-magnifying-glass-chart',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Analyzes content, technical SEO, and backlink strategies to improve rankings.',
    systemInstruction: 'You are Rank, an SEO Audit Specialist. You focus on data-driven SEO strategies, keyword research, technical SEO fixes, and content optimization. You always keep up with the latest Google Core updates.',
    placeholder: 'Paste your URL or content here for an SEO analysis...'
  },
  {
    id: 'legal',
    role: 'Legal Consultant',
    name: 'Lex',
    icon: 'fa-scale-balanced',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    description: 'Assists with contract review, legal terminology, and compliance (Informational Only).',
    systemInstruction: 'You are Lex, a helpful Legal Consultant AI. You help draft and review contracts, explain legal terms, and identify potential risks in clauses. DISCLAIMER: You are an AI, not a lawyer. Always advise the user to consult a human attorney for binding advice.',
    placeholder: 'Paste a contract clause or ask about legal terms...'
  },
  {
    id: 'finance',
    role: 'Financial Analyst',
    name: 'Sterling',
    icon: 'fa-chart-line',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Provides market insights, financial modeling, and investment terminology explanations.',
    systemInstruction: 'You are Sterling, a Wall Street Financial Analyst. You assist with financial modeling, explaining complex market trends, and analyzing balance sheets. DISCLAIMER: This is not financial advice. Do not predict specific stock prices.',
    placeholder: 'Ask about ROI calculations, market trends, or Excel financial models...'
  },
  {
    id: 'ux',
    role: 'UX Researcher',
    name: 'Aura',
    icon: 'fa-pen-ruler',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    description: 'Helps with user personas, journey mapping, and usability testing scripts.',
    systemInstruction: 'You are Aura, a Senior UX Researcher. You advocate for the user. You help create user personas, write usability testing scripts, and analyze user flows for friction points. You prioritize accessibility (WCAG).',
    placeholder: 'Describe your app idea to get user personas and journey maps...'
  },
  {
    id: 'security',
    role: 'Cybersecurity Analyst',
    name: 'Cipher',
    icon: 'fa-shield-halved',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    description: 'Identifies vulnerabilities, audits code for security risks, and explains protocols.',
    systemInstruction: 'You are Cipher, a Cybersecurity Analyst. You analyze code for common vulnerabilities (OWASP Top 10), suggest security headers, and explain encryption protocols. You are paranoid about security so the user does not have to be.',
    placeholder: 'Paste code to scan for vulnerabilities or ask about security protocols...'
  },
  {
    id: 'marketing',
    role: 'Digital Strategist',
    name: 'Nova',
    icon: 'fa-bullseye',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Creates comprehensive marketing plans, social strategies, and brand positioning.',
    systemInstruction: 'You are Nova, a Chief Digital Strategist. You create viral marketing campaigns, comprehensive go-to-market strategies, and brand positioning statements. You are creative, data-aware, and trend-focused.',
    placeholder: 'Ask for a launch strategy for your new product...'
  },
  {
    id: 'academic',
    role: 'Academic Researcher',
    name: 'Sage',
    icon: 'fa-graduation-cap',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    description: 'Assists with literature reviews, citation formatting, and complex topic summarization.',
    systemInstruction: 'You are Sage, a PhD-level Academic Researcher. You help structure research papers, explain complex theories, suggest methodologies, and ensure correct citation formatting (APA, MLA, etc.). You value rigor and precision.',
    placeholder: 'Ask to summarize a theory or structure a research paper...'
  },
  {
    id: 'prompt',
    role: 'Prompt Engineer',
    name: 'Spark',
    icon: 'fa-wand-magic-sparkles',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Optimizes your prompts to get the best results from LLMs like Gemini and GPT.',
    systemInstruction: 'You are Spark, an expert Prompt Engineer. Your job is to take a user\'s basic request and rewrite it into a highly optimized, structured prompt (using techniques like Chain-of-Thought, Few-Shot, etc.) that yields the best results from LLMs.',
    placeholder: 'Paste a basic prompt you want to improve...'
  }
];

const AI_MODELS = [
  { id: 'gemini', name: 'Gemini Pro', system: 'You are Gemini, a large language model trained by Google.' },
  { id: 'chatgpt', name: 'ChatGPT', system: 'You are ChatGPT, a large language model trained by OpenAI.' },
  { id: 'claude', name: 'Claude 3', system: 'You are Claude, a helpful AI assistant created by Anthropic.' },
  { id: 'llama', name: 'Meta Llama', system: 'You are Llama, an AI model created by Meta.' },
  { id: 'copilot', name: 'Copilot', system: 'You are Copilot, an AI assistant created by Microsoft.' },
];

const AiAgentHub: React.FC = () => {
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
  const [activeModel, setActiveModel] = useState(AI_MODELS[0]);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgents = AGENTS.filter(agent => 
    agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConsult = async () => {
    if (!activeAgent || !input.trim()) return;

    setLoading(true);
    setResult('');

    try {
      const systemContext = `[System Context: ${activeModel.system}] ${activeAgent.systemInstruction}`;
      const response = await generateText(input, systemContext);
      setResult(response);
    } catch (e) {
      setResult("My connection was interrupted. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeSession = () => {
    setActiveAgent(null);
    setInput('');
    setResult('');
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-12">
      
      {/* Hero Section */}
      <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-indigo-300 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-users-gear"></i> Expert Systems
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               AI Agent Workforce
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed">
               Hire a specialized AI professional for your specific needs. From Senior DevOps Engineers to Legal Consultants, our agents are pre-trained with expert personas.
            </p>
         </div>
      </div>

      {/* Search & Selection UI */}
      <div className="max-w-3xl mx-auto mb-10 px-4 flex flex-col md:flex-row gap-4">
        <div className="relative group flex-1">
           <input 
             type="text" 
             placeholder="Find an expert (e.g. DevOps, Legal, Marketing)..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
           />
           <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
        </div>
        
        {/* Quick Select Dropdown */}
        <div className="relative w-full md:w-64">
           <select 
             onChange={(e) => {
                const agent = AGENTS.find(a => a.id === e.target.value);
                if(agent) setActiveAgent(agent);
             }}
             defaultValue=""
             className="w-full h-full px-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 font-medium appearance-none cursor-pointer"
           >
              <option value="" disabled>Quick Select Expert...</option>
              {AGENTS.map(agent => (
                <option key={agent.id} value={agent.id}>
                   {agent.role} ({agent.name})
                </option>
              ))}
           </select>
           <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
        </div>
      </div>

      {/* Agents Grid (Selection UI) */}
      {filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
          {filteredAgents.map((agent) => (
            <div 
              key={agent.id}
              onClick={() => setActiveAgent(agent)}
              className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden"
            >
               <div className="flex items-center justify-between mb-4">
                 <div className={`w-14 h-14 rounded-2xl ${agent.bgColor} ${agent.color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                   <i className={`fa-solid ${agent.icon}`}></i>
                 </div>
                 <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-full">
                   AI Agent
                 </span>
               </div>
               
               <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{agent.role}</h3>
               <p className="text-sm font-semibold text-slate-400 mb-4">Code Name: {agent.name}</p>
               
               <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                 {agent.description}
               </p>

               <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
                 Start Session <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
               </div>

               <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/0 to-${agent.color.split('-')[1]}-50/50 rounded-bl-full pointer-events-none`}></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-200 mx-4">
           <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
              <i className="fa-solid fa-user-slash"></i>
           </div>
           <h3 className="text-lg font-bold text-slate-700">No agents found</h3>
           <p className="text-slate-500">Try adjusting your search terms.</p>
           <button onClick={() => setSearchQuery('')} className="mt-4 text-indigo-600 font-bold hover:underline">Clear Search</button>
        </div>
      )}

      {/* Directory Section */}
      <section>
         <div className="flex items-center gap-3 mb-8 px-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg">
               <i className="fa-solid fa-flask"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">AI Research & Frameworks</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_LABS.map((lab, idx) => (
               <a 
                 key={idx}
                 href={lab.url}
                 target="_blank" 
                 rel="noreferrer"
                 className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
               >
                  <div className={`w-12 h-12 rounded-2xl ${lab.color} flex items-center justify-center text-white text-xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                     <i className={`fa-solid ${lab.icon}`}></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{lab.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">{lab.desc}</p>
                  <div className="flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                     Visit Lab <i className="fa-solid fa-arrow-right ml-1"></i>
                  </div>
               </a>
            ))}
         </div>
      </section>

      {/* Agent Interface Modal */}
      {activeAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={closeSession}></div>
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden animate-scale-in">
             
             {/* Header */}
             <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                   <div className={`w-14 h-14 rounded-2xl ${activeAgent.bgColor} ${activeAgent.color} flex items-center justify-center text-2xl shadow-sm`}>
                      <i className={`fa-solid ${activeAgent.icon}`}></i>
                   </div>
                   <div>
                      <h3 className="text-2xl font-bold text-slate-900">{activeAgent.role}</h3>
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Agent {activeAgent.name} is Online</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <select 
                     className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg py-2 px-3 outline-none focus:border-indigo-500 shadow-sm"
                     value={activeModel.id}
                     onChange={(e) => {
                        const newModel = AI_MODELS.find(m => m.id === e.target.value) || AI_MODELS[0];
                        setActiveModel(newModel);
                     }}
                   >
                      {AI_MODELS.map(m => <option key={m.id} value={m.id}>{m.name} Engine</option>)}
                   </select>
                   <button 
                     onClick={closeSession}
                     className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all shadow-sm"
                   >
                     <i className="fa-solid fa-xmark text-lg"></i>
                   </button>
                </div>
             </div>

             {/* Content Area */}
             <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white flex flex-col gap-6 custom-scrollbar">
                {/* Intro Message */}
                <div className="flex items-start gap-4 animate-fade-in-up">
                   <div className={`w-10 h-10 rounded-full ${activeAgent.bgColor} ${activeAgent.color} flex items-center justify-center flex-shrink-0 mt-1`}>
                      <i className="fa-solid fa-robot"></i>
                   </div>
                   <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-5 text-slate-700 leading-relaxed shadow-sm max-w-3xl">
                      <p className="font-bold text-slate-900 text-sm mb-2">{activeAgent.role}</p>
                      Hello. I am {activeAgent.name}, powered by {activeModel.name}. {activeAgent.description} How can I assist you with your task today?
                   </div>
                </div>

                {/* Result Message */}
                {result && (
                   <div className="flex items-start gap-4 animate-fade-in-up">
                      <div className={`w-10 h-10 rounded-full ${activeAgent.bgColor} ${activeAgent.color} flex items-center justify-center flex-shrink-0 mt-1`}>
                         <i className="fa-solid fa-robot"></i>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-6 text-slate-700 leading-relaxed shadow-sm w-full">
                         <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                            <span className="font-bold text-slate-900 text-sm">{activeAgent.role} Response</span>
                            <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800"><i className="fa-regular fa-copy"></i> Copy</button>
                         </div>
                         <div className="prose prose-slate max-w-none whitespace-pre-wrap">
                            {result}
                         </div>
                      </div>
                   </div>
                )}
                
                {loading && (
                   <div className="flex items-center gap-3 ml-14 text-slate-400 text-sm animate-pulse">
                      <i className="fa-solid fa-circle-notch fa-spin"></i> {activeAgent.name} is thinking...
                   </div>
                )}
             </div>

             {/* Input Area */}
             <div className="p-6 border-t border-slate-100 bg-white">
                <div className="relative max-w-4xl mx-auto">
                   <textarea 
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault();
                           handleConsult();
                        }
                     }}
                     placeholder={activeAgent.placeholder}
                     className="w-full pl-5 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none shadow-inner"
                     rows={2}
                   />
                   <button 
                     onClick={handleConsult}
                     disabled={loading || !input.trim()}
                     className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${loading || !input.trim() ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'}`}
                   >
                      <i className="fa-solid fa-paper-plane"></i>
                   </button>
                </div>
                <p className="text-center text-xs text-slate-400 mt-3 font-medium">
                   {activeAgent.name} uses advanced reasoning. Responses may take a moment.
                </p>
             </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AiAgentHub;
