
import React, { useState, useRef, useEffect } from 'react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat, GenerateContentResponse } from "@google/genai";

const PERSONAS = [
  { id: 'general', name: 'General Assistant', icon: 'fa-robot', color: 'bg-teal-500', system: 'You are a helpful, professional AI assistant.' },
  { id: 'creative', name: 'Creative Writer', icon: 'fa-pen-nib', color: 'bg-pink-500', system: 'You are a creative writer and poet. Use evocative language.' },
  { id: 'coder', name: 'Code Expert', icon: 'fa-code', color: 'bg-indigo-500', system: 'You are a senior software engineer. Write clean, efficient code and explain concepts clearly.' },
  { id: 'business', name: 'Business Strategist', icon: 'fa-briefcase', color: 'bg-blue-600', system: 'You are a business strategist. Focus on ROI, growth, and professional communication.' },
  { id: 'marketing', name: 'Marketing Guru', icon: 'fa-bullhorn', color: 'bg-orange-500', system: 'You are a digital marketing expert. Focus on engagement, SEO, and viral strategies.' },
];

const AI_MODELS = [
  { id: 'gemini', name: 'Gemini Pro', icon: 'fa-google', system: 'You are Gemini, a large language model trained by Google.' },
  { id: 'chatgpt', name: 'ChatGPT', icon: 'fa-robot', system: 'You are ChatGPT, a large language model trained by OpenAI.' },
  { id: 'claude', name: 'Claude 3', icon: 'fa-brain', system: 'You are Claude, a helpful AI assistant created by Anthropic.' },
  { id: 'llama', name: 'Meta Llama', icon: 'fa-cube', system: 'You are Llama, an AI model created by Meta.' },
  { id: 'copilot', name: 'Copilot', icon: 'fa-microsoft', system: 'You are Copilot, an AI assistant created by Microsoft.' },
];

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activePersona, setActivePersona] = useState(PERSONAS[0]);
  const [activeModel, setActiveModel] = useState(AI_MODELS[0]);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history
  useEffect(() => {
    try {
      const saved = localStorage.getItem('chat_history');
      if (saved) {
        setMessages(JSON.parse(saved).map((m: any) => ({...m, timestamp: new Date(m.timestamp)})));
      } else {
        setMessages([{
          id: 'welcome',
          role: 'model',
          text: 'Hello! I am your AI assistant. How can I help you today?',
          timestamp: new Date()
        }]);
      }
      // Initialize safe session
      const session = createChatSession();
      if (session) {
        chatSessionRef.current = session;
      } else {
        setMessages(prev => [...prev, {
          id: 'error-init',
          role: 'model',
          text: 'System: API Key missing or invalid. Chat capabilities are limited.',
          timestamp: new Date()
        }]);
      }
    } catch (e) {
      console.error("Chat init error", e);
    }
  }, []);

  // Save chat history
  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    if (!chatSessionRef.current) {
        // Try to re-init
        const session = createChatSession();
        if (session) {
            chatSessionRef.current = session;
        } else {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                text: "I cannot connect to the AI service. Please check your API Key configuration.",
                timestamp: new Date()
            }]);
            setIsTyping(false);
            return;
        }
    }

    try {
      // Inject persona and model system instructions
      const systemContext = `[System Context: ${activeModel.system} ${activePersona.system}] `;
      const result = await chatSessionRef.current.sendMessageStream({ message: systemContext + userMsg.text });
      
      let fullText = '';
      const modelMsgId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: new Date()
      }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || '';
        fullText += text;
        
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId ? { ...msg, text: fullText } : msg
        ));
      }
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: `Error: ${error.message || "Connection interrupted."}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePersonaChange = (personaId: string) => {
    const newPersona = PERSONAS.find(p => p.id === personaId) || PERSONAS[0];
    setActivePersona(newPersona);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'model',
      text: `Switched to ${newPersona.name} mode.`,
      timestamp: new Date()
    }]);
  };

  const handleModelChange = (modelId: string) => {
    const newModel = AI_MODELS.find(m => m.id === modelId) || AI_MODELS[0];
    setActiveModel(newModel);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'model',
      text: `Switched AI Engine to ${newModel.name}.`,
      timestamp: new Date()
    }]);
  };

  const handleClear = () => {
    if (window.confirm("Clear chat history?")) {
      setMessages([{
        id: Date.now().toString(),
        role: 'model',
        text: 'Chat cleared. How can I help?',
        timestamp: new Date()
      }]);
      const session = createChatSession();
      if (session) chatSessionRef.current = session;
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/60">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${activePersona.color} flex items-center justify-center text-white shadow-lg`}>
            <i className={`fa-brands ${activeModel.icon} text-xl`}></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{activeModel.name} Chat</h3>
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
           <select 
             className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg py-2 px-3 outline-none focus:border-indigo-500"
             value={activeModel.id}
             onChange={(e) => handleModelChange(e.target.value)}
           >
              {AI_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
           </select>
           <select 
             className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg py-2 px-3 outline-none focus:border-indigo-500"
             value={activePersona.id}
             onChange={(e) => handlePersonaChange(e.target.value)}
           >
              {PERSONAS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
           </select>
           <button 
             onClick={handleClear}
             className="w-9 h-9 rounded-lg bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center border border-slate-200" 
             title="Clear Chat"
           >
             <i className="fa-solid fa-trash-can text-sm"></i>
           </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[85%] lg:max-w-[70%] rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed relative
                ${msg.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-200/60 rounded-tl-none shadow-md shadow-slate-200/50'}
              `}
            >
              <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
              <div className={`text-[10px] mt-1 font-bold opacity-50 ${msg.role === 'user' ? 'text-slate-300' : 'text-slate-400'} text-right`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-end gap-2 bg-slate-50 border-2 border-slate-100 rounded-xl p-2 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all shadow-inner">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Message ${activeModel.name} as ${activePersona.name}...`}
            className="w-full bg-transparent border-none focus:ring-0 p-2 max-h-32 min-h-[44px] resize-none text-slate-700 placeholder-slate-400 font-medium text-sm"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`
              p-3 rounded-lg flex-shrink-0 transition-all duration-300 h-10 w-10 flex items-center justify-center
              ${!input.trim() || isTyping 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5'}
            `}
          >
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
