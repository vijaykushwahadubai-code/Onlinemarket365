
import React, { useState, useEffect } from 'react';
import { generateText } from '../services/geminiService';
import { VPN_PROVIDERS } from '../data/toolsData';

type ConnectionStatus = 'Disconnected' | 'Connecting...' | 'Protected';
type VpnProtocol = 'WireGuard' | 'OpenVPN' | 'IKEv2';

const SERVERS = [
  { country: 'United States', code: 'US', lat: '45ms' },
  { country: 'Netherlands', code: 'NL', lat: '120ms' },
  { country: 'Japan', code: 'JP', lat: '210ms' },
  { country: 'Switzerland', code: 'CH', lat: '95ms' },
  { country: 'Singapore', code: 'SG', lat: '180ms' },
];

const VpnHub: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>('Disconnected');
  const [protocol, setProtocol] = useState<VpnProtocol>('WireGuard');
  const [server, setServer] = useState(SERVERS[0]);
  const [ip, setIp] = useState('192.168.1.105'); // Mock local IP initially
  const [configPrompt, setConfigPrompt] = useState('');
  const [configOutput, setConfigOutput] = useState('');
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Simulate connection process
  const toggleConnection = () => {
    if (status === 'Disconnected') {
      setStatus('Connecting...');
      setTimeout(() => {
        setStatus('Protected');
        setIp(`10.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`);
      }, 2000);
    } else {
      setStatus('Disconnected');
      setIp('192.168.1.105');
    }
  };

  const handleGenerateConfig = async () => {
    if (!configPrompt.trim()) return;
    setLoadingConfig(true);
    setConfigOutput('');

    const prompt = `Generate a ${protocol} configuration file template based on this requirement: "${configPrompt}".
    Includes comments explaining what each line does. Do not include real private keys, use placeholders like <PRIVATE_KEY>.`;

    try {
      const result = await generateText(prompt, "You are a Network Security Engineer specializing in VPN configurations.");
      setConfigOutput(result);
    } catch (e) {
      setConfigOutput("Error generating configuration.");
    } finally {
      setLoadingConfig(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-12">
      
      {/* Hero / Interface */}
      <div className="relative rounded-[3rem] overflow-hidden bg-[#1a1a1a] text-white p-8 md:p-12 shadow-2xl border border-green-900/50 min-h-[600px] flex flex-col items-center justify-center">
         {/* Map Background (Abstract) */}
         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/connected.png')]"></div>
         <div className={`absolute inset-0 bg-green-500/5 transition-opacity duration-1000 ${status === 'Protected' ? 'opacity-100' : 'opacity-0'}`}></div>
         
         <div className="relative z-10 w-full max-w-lg mx-auto text-center space-y-8">
            
            {/* Status Indicator */}
            <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border backdrop-blur-md transition-all ${status === 'Protected' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
               <div className={`w-2 h-2 rounded-full ${status === 'Protected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
               <span className="text-sm font-bold uppercase tracking-widest">{status === 'Protected' ? 'VPN Connected' : 'Unprotected'}</span>
            </div>

            {/* Connect Button */}
            <button 
               onClick={toggleConnection}
               className={`w-40 h-40 rounded-full border-4 flex items-center justify-center transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)] group relative mx-auto ${status === 'Protected' ? 'border-green-500 bg-green-900/20 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'border-slate-600 bg-slate-800 hover:border-slate-400'}`}
            >
               <i className={`fa-solid fa-power-off text-6xl transition-colors ${status === 'Protected' ? 'text-green-500' : 'text-slate-400 group-hover:text-white'} neon-icon`}></i>
               {status === 'Connecting...' && (
                  <div className="absolute inset-0 rounded-full border-4 border-t-green-500 border-transparent animate-spin"></div>
               )}
            </button>

            {/* IP Display */}
            <div>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Your Virtual IP</p>
               <h2 className="text-3xl font-mono font-bold text-slate-200 tracking-wider">{ip}</h2>
               {status === 'Protected' && <p className="text-green-500 text-xs mt-1">Encrypted & Secure</p>}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Protocol</label>
                  <select 
                     value={protocol}
                     onChange={(e) => setProtocol(e.target.value as VpnProtocol)}
                     className="w-full bg-transparent text-white font-bold outline-none cursor-pointer"
                     disabled={status !== 'Disconnected'}
                  >
                     <option value="WireGuard">WireGuard</option>
                     <option value="OpenVPN">OpenVPN (TCP)</option>
                     <option value="IKEv2">IKEv2</option>
                  </select>
               </div>
               <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Server Location</label>
                  <select 
                     onChange={(e) => setServer(SERVERS.find(s => s.code === e.target.value)!)}
                     className="w-full bg-transparent text-white font-bold outline-none cursor-pointer"
                     disabled={status !== 'Disconnected'}
                  >
                     {SERVERS.map(s => (
                        <option key={s.code} value={s.code}>{s.country} ({s.lat})</option>
                     ))}
                  </select>
               </div>
            </div>

         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Config Generator */}
         <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg">
                     <i className="fa-solid fa-file-code neon-icon"></i>
                  </div>
                  <div>
                     <h2 className="text-xl font-bold text-slate-900">Config Generator</h2>
                     <p className="text-slate-500 text-sm">Generate custom configs for manual setup.</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <textarea 
                     value={configPrompt}
                     onChange={(e) => setConfigPrompt(e.target.value)}
                     className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all h-24 resize-none text-slate-700 placeholder:text-slate-400 font-medium"
                     placeholder="e.g. WireGuard config for a client with KeepAlive 25 and specific DNS..."
                  />
                  <div className="flex justify-end">
                     <button 
                        onClick={handleGenerateConfig}
                        disabled={loadingConfig || !configPrompt.trim()}
                        className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${loadingConfig ? 'bg-slate-400' : 'bg-slate-900 hover:bg-green-600'}`}
                     >
                        {loadingConfig ? <i className="fa-solid fa-circle-notch fa-spin neon-icon"></i> : <i className="fa-solid fa-wand-magic-sparkles neon-icon"></i>}
                        Generate Config
                     </button>
                  </div>
               </div>

               {configOutput && (
                  <div className="mt-6 bg-slate-900 rounded-xl p-6 border border-slate-800 relative overflow-hidden animate-fade-in-up">
                     <button onClick={() => navigator.clipboard.writeText(configOutput)} className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-white bg-white/10 px-2 py-1 rounded">Copy</button>
                     <pre className="text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">{configOutput}</pre>
                  </div>
               )}
            </div>
         </div>

         {/* Providers Directory */}
         <div className="lg:col-span-4 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 px-2">Top VPN Providers</h3>
            {VPN_PROVIDERS.map((vpn, idx) => (
               <a 
                  key={idx}
                  href={vpn.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all flex items-center gap-4"
               >
                  <div className={`w-12 h-12 rounded-xl ${vpn.color} flex items-center justify-center text-white text-xl shadow-md group-hover:scale-110 transition-transform`}>
                     <i className={`fa-solid ${vpn.icon} neon-icon`}></i>
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors">{vpn.name}</h4>
                     <p className="text-xs text-slate-500 line-clamp-1">{vpn.description}</p>
                  </div>
                  <i className="fa-solid fa-arrow-up-right-from-square text-xs text-slate-300 ml-auto group-hover:text-green-600"></i>
               </a>
            ))}
         </div>
      </div>

    </div>
  );
};

export default VpnHub;
