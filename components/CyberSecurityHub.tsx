
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';

type SecurityTool = 'phishing' | 'code_audit' | 'password' | 'link' | 'api_audit';

const SECURITY_RESOURCES = [
  { name: 'VirusTotal', category: 'Scanner', url: 'https://www.virustotal.com', icon: 'fa-virus', description: 'Analyze suspicious files and URLs for malware.', color: 'text-blue-500 bg-blue-50' },
  { name: 'Malwarebytes', category: 'Scanner', url: 'https://www.malwarebytes.com', icon: 'fa-shield-virus', description: 'Advanced malware protection and removal.', color: 'text-blue-600 bg-blue-100' },
  { name: 'Bitwarden', category: 'Password Manager', url: 'https://bitwarden.com', icon: 'fa-key', description: 'Secure, open-source password management.', color: 'text-blue-500 bg-slate-50' },
  { name: '1Password', category: 'Password Manager', url: 'https://1password.com', icon: 'fa-lock', description: 'Industry-leading password security.', color: 'text-sky-600 bg-sky-50' },
  { name: 'NordVPN', category: 'VPN', url: 'https://nordvpn.com', icon: 'fa-globe', description: 'Secure internet access and privacy.', color: 'text-blue-700 bg-blue-50' },
  { name: 'OWASP ZAP', category: 'API Security', url: 'https://www.zaproxy.org', icon: 'fa-spider', description: 'World’s most popular free DAST scanner.', color: 'text-indigo-600 bg-indigo-50' },
  { name: 'Postman', category: 'API Testing', url: 'https://www.postman.com', icon: 'fa-paper-plane', description: 'Test and audit API endpoints securely.', color: 'text-orange-600 bg-orange-50' },
  { name: 'Have I Been Pwned', category: 'Utility', url: 'https://haveibeenpwned.com', icon: 'fa-user-secret', description: 'Check if your email is in a data breach.', color: 'text-red-600 bg-red-50' },
  { name: 'Wireshark', category: 'Analysis', url: 'https://www.wireshark.org', icon: 'fa-network-wired', description: 'Network protocol analyzer.', color: 'text-blue-800 bg-blue-100' },
];

const CyberSecurityHub: React.FC = () => {
  const [activeTool, setActiveTool] = useState<SecurityTool>('phishing');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordOptions, setPasswordOptions] = useState({ length: 16, symbols: true, numbers: true, uppercase: true });

  const handleGenerate = async () => {
    if (activeTool === 'password') {
      generatePassword();
      return;
    }

    if (!input.trim()) return;
    setLoading(true);
    setOutput('');

    let prompt = '';
    const systemInstruction = "You are a professional Cybersecurity Analyst. Analyze content for threats with precision and provide actionable advice.";

    switch (activeTool) {
      case 'phishing':
        prompt = `Analyze the following email or message text for phishing indicators (e.g., urgency, suspicious links, spoofing). 
        
        Text to analyze:
        "${input}"
        
        Provide a verdict: LOW RISK, MEDIUM RISK, or HIGH RISK. Then explain why bullet by bullet.`;
        break;
      case 'code_audit':
        prompt = `Audit the following code snippet for security vulnerabilities (e.g., SQL Injection, XSS, Buffer Overflows).
        
        Code:
        ${input}
        
        Provide a list of vulnerabilities found and the secure fixed code.`;
        break;
      case 'link':
        prompt = `Analyze this URL structure for suspicious patterns (typosquatting, obfuscation). Do not visit the link.
        
        URL: "${input}"
        
        Verdict and explanation.`;
        break;
      case 'api_audit':
        prompt = `Analyze the following API Schema or Headers for security flaws (OWASP API Top 10).
        
        Input Data:
        ${input}
        
        Provide a Security Report with risk levels and remediation.`;
        break;
    }

    try {
      const result = await generateText(prompt, systemInstruction);
      setOutput(result);
    } catch (e) {
      setOutput("Analysis module offline. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let validChars = chars;
    if (passwordOptions.uppercase) validChars += upper;
    if (passwordOptions.numbers) validChars += nums;
    if (passwordOptions.symbols) validChars += syms;

    let pass = '';
    const array = new Uint32Array(passwordOptions.length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < passwordOptions.length; i++) {
      pass += validChars.charAt(array[i] % validChars.length);
    }
    setOutput(pass);
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-12 p-6 rounded-[3rem] border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.15)] bg-[#0B0F19]/50 backdrop-blur-sm">
      
      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-[2rem] p-10 md:p-14 text-center shadow-xl border border-slate-800 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-blue-300 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-shield-halved"></i> Security Center
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
               Cyber Defense Hub
            </h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
               Protect your digital assets. Analyze threats, audit code, and generate secure credentials using enterprise-grade tools.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Tools Sidebar */}
         <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
               <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4 px-2">Analysis Tools</h3>
               <div className="space-y-2">
                  <button 
                     onClick={() => { setActiveTool('phishing'); setInput(''); setOutput(''); }}
                     className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-4 ${activeTool === 'phishing' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTool === 'phishing' ? 'bg-white/20 text-white' : 'bg-white text-blue-600 shadow-sm'}`}>
                        <i className="fa-solid fa-envelope-open-text"></i>
                     </div>
                     <div>
                        <span className="font-bold block text-sm">Phishing Analysis</span>
                     </div>
                  </button>
                  
                  <button 
                     onClick={() => { setActiveTool('code_audit'); setInput(''); setOutput(''); }}
                     className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-4 ${activeTool === 'code_audit' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTool === 'code_audit' ? 'bg-white/20 text-white' : 'bg-white text-blue-600 shadow-sm'}`}>
                        <i className="fa-solid fa-bug"></i>
                     </div>
                     <div>
                        <span className="font-bold block text-sm">Code Audit</span>
                     </div>
                  </button>

                  <button 
                     onClick={() => { setActiveTool('api_audit'); setInput(''); setOutput(''); }}
                     className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-4 ${activeTool === 'api_audit' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTool === 'api_audit' ? 'bg-white/20 text-white' : 'bg-white text-blue-600 shadow-sm'}`}>
                        <i className="fa-solid fa-server"></i>
                     </div>
                     <div>
                        <span className="font-bold block text-sm">API Security</span>
                     </div>
                  </button>

                  <button 
                     onClick={() => { setActiveTool('password'); setInput(''); setOutput(''); }}
                     className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-4 ${activeTool === 'password' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTool === 'password' ? 'bg-white/20 text-white' : 'bg-white text-blue-600 shadow-sm'}`}>
                        <i className="fa-solid fa-key"></i>
                     </div>
                     <div>
                        <span className="font-bold block text-sm">Password Gen</span>
                     </div>
                  </button>

                  <button 
                     onClick={() => { setActiveTool('link'); setInput(''); setOutput(''); }}
                     className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-4 ${activeTool === 'link' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTool === 'link' ? 'bg-white/20 text-white' : 'bg-white text-blue-600 shadow-sm'}`}>
                        <i className="fa-solid fa-link"></i>
                     </div>
                     <div>
                        <span className="font-bold block text-sm">URL Inspector</span>
                     </div>
                  </button>
               </div>
            </div>
         </div>

         {/* Main Interface */}
         <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 min-h-[500px] flex flex-col h-full">
               
               {activeTool === 'password' ? (
                  <div className="flex flex-col h-full justify-center">
                     <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <i className="fa-solid fa-lock text-blue-600"></i> Secure Password Generator
                     </h2>
                     
                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 flex items-center justify-between">
                        <span className="text-xl font-mono text-slate-800 break-all font-bold">{output || '...'}</span>
                        <button onClick={() => navigator.clipboard.writeText(output)} className="text-slate-400 hover:text-blue-600 ml-4 p-2"><i className="fa-regular fa-copy text-xl"></i></button>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <label className="flex items-center gap-2 text-slate-600 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-100">
                           <input type="checkbox" checked={passwordOptions.symbols} onChange={() => setPasswordOptions({...passwordOptions, symbols: !passwordOptions.symbols})} className="accent-blue-600 w-5 h-5" />
                           <span className="text-sm font-bold">Symbols</span>
                        </label>
                        <label className="flex items-center gap-2 text-slate-600 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-100">
                           <input type="checkbox" checked={passwordOptions.numbers} onChange={() => setPasswordOptions({...passwordOptions, numbers: !passwordOptions.numbers})} className="accent-blue-600 w-5 h-5" />
                           <span className="text-sm font-bold">Numbers</span>
                        </label>
                        <label className="flex items-center gap-2 text-slate-600 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-100">
                           <input type="checkbox" checked={passwordOptions.uppercase} onChange={() => setPasswordOptions({...passwordOptions, uppercase: !passwordOptions.uppercase})} className="accent-blue-600 w-5 h-5" />
                           <span className="text-sm font-bold">Uppercase</span>
                        </label>
                        <div className="flex flex-col justify-center px-2">
                           <span className="text-xs text-slate-500 mb-1 font-bold">Length: {passwordOptions.length}</span>
                           <input type="range" min="8" max="64" value={passwordOptions.length} onChange={(e) => setPasswordOptions({...passwordOptions, length: Number(e.target.value)})} className="accent-blue-600" />
                        </div>
                     </div>

                     <button 
                        onClick={handleGenerate}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                     >
                        <i className="fa-solid fa-rotate"></i> Generate Secure Password
                     </button>
                  </div>
               ) : (
                  <>
                     <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                           {activeTool === 'phishing' && "Paste Suspicious Text / Email Body"}
                           {activeTool === 'code_audit' && "Paste Code Snippet"}
                           {activeTool === 'api_audit' && "Paste API Schema (JSON) or Headers"}
                           {activeTool === 'link' && "Paste URL (Do not visit it)"}
                        </label>
                        <textarea 
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           className="w-full h-40 bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 font-mono focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none placeholder:text-slate-400"
                           placeholder="Enter data for analysis..."
                        />
                     </div>

                     <div className="flex justify-end mb-6">
                        <button 
                           onClick={handleGenerate}
                           disabled={loading || !input.trim()}
                           className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}
                        >
                           {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Analyzing...</> : <><i className="fa-solid fa-magnifying-glass-chart"></i> Run Analysis</>}
                        </button>
                     </div>

                     {output && (
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex-1 overflow-y-auto custom-scrollbar animate-fade-in-up">
                           <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Report</span>
                              <button onClick={() => navigator.clipboard.writeText(output)} className="text-slate-400 hover:text-blue-600 transition-colors"><i className="fa-regular fa-copy"></i></button>
                           </div>
                           <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                              {output}
                           </div>
                        </div>
                     )}
                  </>
               )}
            </div>
         </div>
      </div>

      {/* Security Best Practices */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
         <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <i className="fa-solid fa-shield-halved text-blue-600"></i> Best Practices
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
               <h4 className="font-bold text-slate-800 mb-2">Enable 2FA</h4>
               <p className="text-sm text-slate-500">Never rely on passwords alone. Use an authenticator app (Google Auth, Authy) instead of SMS.</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
               <h4 className="font-bold text-slate-800 mb-2">Inspect URLs</h4>
               <p className="text-sm text-slate-500">Hover before you click. Hackers use typo-squatting (e.g., g0ogle.com) to trick you.</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
               <h4 className="font-bold text-slate-800 mb-2">Regular Updates</h4>
               <p className="text-sm text-slate-500">Zero-day exploits target outdated software. Enable auto-updates on all devices.</p>
            </div>
         </div>
      </div>

      {/* External Tools Directory */}
      <div className="space-y-6">
         <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg">
               <i className="fa-solid fa-toolbox"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Security Resources</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SECURITY_RESOURCES.map((tool, idx) => (
               <a 
                  key={idx}
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col h-full"
               >
                  <div className="flex items-center justify-between mb-4">
                     <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform`}>
                        <i className={`fa-solid ${tool.icon}`}></i>
                     </div>
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">
                        {tool.category}
                     </span>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
                     {tool.description}
                  </p>
                  
                  <div className="mt-auto flex items-center text-xs font-bold text-blue-600">
                     Visit Site <i className="fa-solid fa-arrow-up-right-from-square ml-2 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                  </div>
               </a>
            ))}
         </div>
      </div>

    </div>
  );
};

export default CyberSecurityHub;
