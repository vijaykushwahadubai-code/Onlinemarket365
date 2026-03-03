
import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';

type Tab = 'send' | 'receive';
type SendMode = 'files' | 'text';

const QuickShareHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('send');
  const [sendMode, setSendMode] = useState<SendMode>('files');
  
  // Send State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState('');
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  
  // Receive/Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // --- Send Logic ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setGeneratedQR(null);
    }
  };

  const shareViaSystem = async () => {
    if (selectedFiles.length === 0 && !textInput) return;

    try {
      if (selectedFiles.length > 0 && navigator.canShare && navigator.canShare({ files: selectedFiles })) {
        await navigator.share({
          files: selectedFiles,
          title: 'Shared via QuickShare',
          text: 'Here are the files I wanted to share.',
        });
      } else if (textInput && navigator.share) {
        await navigator.share({
          title: 'Shared Text',
          text: textInput,
        });
      } else {
        alert("System sharing not supported on this device/browser for this content.");
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const generateQRCode = () => {
    // Ideally, for files, we'd upload to a server and link to it. 
    // Here we will just QR code the text, or if file, warn user (or create a data URI if tiny).
    if (sendMode === 'files') {
       alert("For large files, please use 'Share via System' to send to other apps. QR codes can only store small text links.");
       return;
    }
    if (!textInput.trim()) return;
    
    // Create QR
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(textInput)}`;
    setGeneratedQR(qrUrl);
  };

  // --- Receive Logic (Scanner) ---
  const startScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.play();
        setIsScanning(true);
        setScanResult(null);
        requestAnimationFrame(tick);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access denied or unavailable.");
    }
  };

  const stopScan = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsScanning(false);
  };

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.height = videoRef.current.videoHeight;
          canvas.width = videoRef.current.videoWidth;
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            setScanResult(code.data);
            stopScan();
            return;
          }
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => stopScan();
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in space-y-12">
      
      {/* Hero */}
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-900 to-indigo-950 text-white p-10 md:p-14 text-center shadow-2xl border border-indigo-800">
         <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-cyan-300 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-wifi neon-icon"></i> Peer-to-Peer Transfer
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               QuickShare Hub
            </h1>
            <p className="text-lg text-indigo-200 font-medium leading-relaxed mb-10">
               Share files, links, and text instantly with devices nearby. No login required.
            </p>

            <div className="flex justify-center gap-4 bg-white/10 p-1.5 rounded-2xl backdrop-blur-md w-fit mx-auto border border-white/10">
               <button 
                 onClick={() => { setActiveTab('send'); stopScan(); }}
                 className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'send' ? 'bg-white text-indigo-900 shadow-lg' : 'text-indigo-200 hover:text-white'}`}
               >
                  <i className="fa-solid fa-paper-plane neon-icon"></i> Send
               </button>
               <button 
                 onClick={() => { setActiveTab('receive'); }}
                 className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'receive' ? 'bg-white text-indigo-900 shadow-lg' : 'text-indigo-200 hover:text-white'}`}
               >
                  <i className="fa-solid fa-download neon-icon"></i> Receive
               </button>
            </div>
         </div>
      </div>

      {activeTab === 'send' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
           {/* Input Zone */}
           <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col h-full">
              <div className="flex gap-4 mb-6">
                 <button 
                   onClick={() => { setSendMode('files'); setGeneratedQR(null); }}
                   className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${sendMode === 'files' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'}`}
                 >
                    <i className="fa-solid fa-file mr-2"></i> Files
                 </button>
                 <button 
                   onClick={() => { setSendMode('text'); setSelectedFiles([]); setGeneratedQR(null); }}
                   className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${sendMode === 'text' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'}`}
                 >
                    <i className="fa-solid fa-font mr-2"></i> Text / URL
                 </button>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                 {sendMode === 'files' ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors relative h-64 flex flex-col items-center justify-center text-center p-6 group">
                       <input 
                          type="file" 
                          multiple 
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                       />
                       <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center text-3xl text-indigo-500 mb-4 group-hover:scale-110 transition-transform">
                          <i className="fa-solid fa-cloud-arrow-up neon-icon"></i>
                       </div>
                       <h3 className="font-bold text-slate-700 text-lg">Drop files here</h3>
                       <p className="text-slate-400 text-sm mt-1">or click to browse</p>
                       {selectedFiles.length > 0 && (
                          <div className="mt-4 bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-xs font-bold">
                             {selectedFiles.length} files selected
                          </div>
                       )}
                    </div>
                 ) : (
                    <textarea 
                       value={textInput}
                       onChange={(e) => setTextInput(e.target.value)}
                       placeholder="Paste text or a URL link here..."
                       className="w-full h-64 p-5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none resize-none transition-all"
                    />
                 )}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                 <button 
                    onClick={shareViaSystem}
                    disabled={sendMode === 'files' ? selectedFiles.length === 0 : !textInput}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    <i className="fa-solid fa-share-nodes"></i> Share via System
                 </button>
                 
                 {sendMode === 'text' && (
                    <button 
                       onClick={generateQRCode}
                       disabled={!textInput}
                       className="w-full py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                       <i className="fa-solid fa-qrcode neon-icon"></i> Generate QR Code
                    </button>
                 )}
              </div>
           </div>

           {/* Output Zone */}
           <div className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden border border-slate-800">
              {generatedQR ? (
                 <div className="relative z-10 text-center animate-scale-in">
                    <div className="bg-white p-4 rounded-3xl shadow-xl mb-6 inline-block">
                       <img src={generatedQR} alt="Share QR" className="w-64 h-64 object-contain" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">Scan to Receive</h3>
                    <p className="text-slate-400 text-sm">Use the 'Receive' tab on another device.</p>
                 </div>
              ) : (
                 <div className="text-center text-slate-600 relative z-10">
                    <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-4xl mb-6 mx-auto">
                       <i className="fa-solid fa-tower-broadcast animate-pulse neon-icon"></i>
                    </div>
                    <h3 className="text-slate-500 font-bold text-lg">Waiting for action...</h3>
                    <p className="text-slate-600 text-sm mt-2 max-w-xs mx-auto">Select files or text on the left to start sharing.</p>
                 </div>
              )}
              
              {/* Background Decoration */}
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent)] pointer-events-none"></div>
           </div>
        </div>
      )}

      {activeTab === 'receive' && (
         <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 text-center">
               <h2 className="text-2xl font-bold text-slate-900 mb-6">Receive Content</h2>
               
               <div className="relative bg-black rounded-3xl overflow-hidden aspect-[3/4] md:aspect-video mb-8 shadow-inner flex items-center justify-center border-4 border-slate-100">
                  {!isScanning && !scanResult && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50 z-10">
                        <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                           <i className="fa-solid fa-camera text-3xl text-slate-300 neon-icon"></i>
                        </div>
                        <p className="font-bold">Camera Offline</p>
                     </div>
                  )}
                  
                  <video ref={videoRef} className={`w-full h-full object-cover ${!isScanning ? 'hidden' : ''}`}></video>
                  <canvas ref={canvasRef} className="hidden"></canvas>
                  
                  {isScanning && (
                     <div className="absolute inset-0 border-2 border-cyan-400/50 flex items-center justify-center">
                        <div className="w-64 h-64 border-2 border-cyan-400 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                           <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-cyan-400 -mt-1 -ml-1 rounded-tl-lg"></div>
                           <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-cyan-400 -mt-1 -mr-1 rounded-tr-lg"></div>
                           <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-cyan-400 -mb-1 -ml-1 rounded-bl-lg"></div>
                           <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-cyan-400 -mb-1 -mr-1 rounded-br-lg"></div>
                           <div className="absolute top-1/2 left-0 w-full h-0.5 bg-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-scan"></div>
                        </div>
                        <div className="absolute bottom-8 text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                           Searching for codes...
                        </div>
                     </div>
                  )}
               </div>

               {scanResult ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 animate-scale-in text-left">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl shadow-sm">
                           <i className="fa-solid fa-check neon-icon"></i>
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-800">Content Found!</h3>
                           <p className="text-xs text-slate-500">Successfully scanned code.</p>
                        </div>
                     </div>
                     
                     <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-700 break-all font-mono text-sm mb-6 shadow-inner max-h-32 overflow-y-auto">
                        {scanResult}
                     </div>
                     
                     <div className="flex gap-3">
                        <button 
                           onClick={() => { navigator.clipboard.writeText(scanResult); alert('Copied!'); }}
                           className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                        >
                           Copy Text
                        </button>
                        {scanResult.startsWith('http') && (
                           <a 
                              href={scanResult} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-center flex items-center justify-center gap-2"
                           >
                              Open Link <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                           </a>
                        )}
                        <button 
                           onClick={() => { setScanResult(null); startScan(); }}
                           className="py-3 px-4 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                           title="Scan Again"
                        >
                           <i className="fa-solid fa-rotate-right neon-icon"></i>
                        </button>
                     </div>
                  </div>
               ) : (
                  <div className="flex justify-center">
                     {!isScanning ? (
                        <button 
                           onClick={startScan}
                           className="px-10 py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-indigo-600 transition-all shadow-lg flex items-center gap-3 text-lg"
                        >
                           <i className="fa-solid fa-expand neon-icon"></i> Start Scanner
                        </button>
                     ) : (
                        <button 
                           onClick={stopScan}
                           className="px-10 py-4 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all border border-red-200 flex items-center gap-3"
                        >
                           <i className="fa-solid fa-stop neon-icon"></i> Stop Camera
                        </button>
                     )}
                  </div>
               )}
            </div>
         </div>
      )}

    </div>
  );
};

export default QuickShareHub;
