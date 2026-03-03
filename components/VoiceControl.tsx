
import React, { useState, useEffect } from 'react';
import { ToolId } from '../types';

interface VoiceControlProps {
  onNavigate: (tool: ToolId) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onNavigate }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    const w = window as any;
    if (!('webkitSpeechRecognition' in w)) {
      alert("Voice control not supported in this browser.");
      return;
    }
    
    const recognition = new w.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);
      processCommand(text);
    };

    recognition.start();
  };

  const processCommand = (text: string) => {
    // Navigation Commands
    if (text.includes('dashboard') || text.includes('home')) onNavigate(ToolId.DASHBOARD);
    else if (text.includes('project')) onNavigate(ToolId.PROJECT_MANAGER);
    else if (text.includes('analytics')) onNavigate(ToolId.ANALYTICS);
    else if (text.includes('image')) onNavigate(ToolId.IMAGE_STUDIO);
    else if (text.includes('video')) onNavigate(ToolId.VIDEO_STUDIO);
    else if (text.includes('chat')) onNavigate(ToolId.CHAT);
    else if (text.includes('copy')) onNavigate(ToolId.COPYWRITER);
    else if (text.includes('freelance')) onNavigate(ToolId.FREELANCE_HUB);
    else if (text.includes('market') || text.includes('trend') || text.includes('stock')) onNavigate(ToolId.TRENDING_HUB);
    else if (text.includes('free tools') || text.includes('mr free') || text.includes('utility')) onNavigate(ToolId.MR_FREETOOLS);
    else if (text.includes('fitness') || text.includes('health') || text.includes('yoga')) onNavigate(ToolId.FITNESS_HUB);
    else if (text.includes('vpn') || text.includes('shield') || text.includes('secure')) onNavigate(ToolId.VPN_HUB);
    else if (text.includes('notepad') || text.includes('note') || text.includes('write')) onNavigate(ToolId.SMART_TOOLS);
    else if (text.includes('scheme') || text.includes('government') || text.includes('benefit')) onNavigate(ToolId.GOV_SCHEMES);
    else if (text.includes('farm') || text.includes('agriculture') || text.includes('crop')) onNavigate(ToolId.AGRICULTURE_HUB);
    else if (text.includes('future') || text.includes('lab') || text.includes('roadmap')) onNavigate(ToolId.FUTURE_LABS);
    
    // Auto-clear transcript after execution
    setTimeout(() => setTranscript(''), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {transcript && (
        <div className="absolute bottom-full right-0 mb-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium animate-fade-in whitespace-nowrap shadow-lg">
          "{transcript}"
        </div>
      )}
      <button 
        onClick={startListening}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${listening ? 'bg-red-500 animate-pulse text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-110'}`}
      >
        <i className={`fa-solid ${listening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
      </button>
    </div>
  );
};

export default VoiceControl;
