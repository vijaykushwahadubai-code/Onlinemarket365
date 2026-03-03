
import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';

type Tab = 'generate' | 'scan';

const QrCodeLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  
  // Generator State
  const [text, setText] = useState('');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(300);
  
  // Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{data: string, type: string} | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${color.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}`;

  const startScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true"); // required to tell iOS safari we don't want fullscreen
        videoRef.current.play();
        setIsScanning(true);
        setScanResult(null);
        requestAnimationFrame(tick);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please ensure permissions are granted.");
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
            setScanResult({ data: code.data, type: 'QR Code' });
            stopScan();
            return; // Stop loop
          }
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      stopScan();
    };
  }, []);

  const handleDownload = async () => {
    if (!text) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in space-y-12">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white p-10 md:p-14 text-center shadow-2xl border border-slate-800">
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-emerald-300 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-qrcode"></i> Quick Tools
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               QR Code Lab
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
               Generate custom QR codes instantly or scan codes using your camera. Fast, free, and secure.
            </p>

            <div className="flex justify-center gap-4">
               <button 
                 onClick={() => { setActiveTab('generate'); stopScan(); }}
                 className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'generate' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
               >
                  <i className="fa-solid fa-pen-to-square"></i> Generator
               </button>
               <button 
                 onClick={() => setActiveTab('scan')}
                 className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'scan' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
               >
                  <i className="fa-solid fa-camera"></i> Scanner
               </button>
            </div>
         </div>
      </div>

      {/* Main Content */}
      {activeTab === 'generate' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
           {/* Controls */}
           <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                 <h2 className="text-2xl font-bold text-slate-900 mb-6">Create QR Code</h2>
                 
                 <div className="space-y-5">
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Content (URL or Text)</label>
                       <textarea 
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all h-32 resize-none"
                          placeholder="https://example.com"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Foreground</label>
                          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                             <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                             <span className="text-xs font-mono text-slate-600">{color}</span>
                          </div>
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Background</label>
                          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                             <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                             <span className="text-xs font-mono text-slate-600">{bgColor}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Preview */}
           <div className="lg:col-span-7">
              <div className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl h-full border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden text-center">
                 {text ? (
                    <div className="relative z-10 flex flex-col items-center gap-6 animate-scale-in">
                       <div className="bg-white p-4 rounded-2xl shadow-xl">
                          <img src={qrUrl} alt="QR Code" className="w-64 h-64 object-contain" />
                       </div>
                       <button 
                          onClick={handleDownload}
                          className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2"
                       >
                          <i className="fa-solid fa-download"></i> Download PNG
                       </button>
                    </div>
                 ) : (
                    <div className="text-slate-500">
                       <i className="fa-solid fa-qrcode text-6xl mb-4 opacity-20"></i>
                       <p>Enter text to generate a preview.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      ) : (
        /* Scanner Interface */
        <div className="max-w-2xl mx-auto bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 animate-fade-in text-center">
           <h2 className="text-2xl font-bold text-slate-900 mb-6">QR Scanner</h2>
           
           <div className="relative bg-black rounded-2xl overflow-hidden aspect-[3/4] md:aspect-video mb-6 shadow-inner flex items-center justify-center">
              {!isScanning && !scanResult && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-10 bg-slate-100">
                    <i className="fa-solid fa-camera text-4xl mb-3"></i>
                    <p className="text-sm font-medium">Camera access required</p>
                 </div>
              )}
              
              <video ref={videoRef} className={`w-full h-full object-cover ${!isScanning ? 'hidden' : ''}`}></video>
              <canvas ref={canvasRef} className="hidden"></canvas>
              
              {/* Scan Overlay Frame */}
              {isScanning && (
                 <div className="absolute inset-0 border-2 border-emerald-500/50 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 border-2 border-emerald-400 rounded-xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                       <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-500 -mt-1 -ml-1"></div>
                       <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-500 -mt-1 -mr-1"></div>
                       <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-500 -mb-1 -ml-1"></div>
                       <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-500 -mb-1 -mr-1"></div>
                    </div>
                 </div>
              )}
           </div>

           {scanResult ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 animate-scale-in">
                 <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                    <i className="fa-solid fa-check"></i>
                 </div>
                 <h3 className="font-bold text-slate-800 text-lg mb-2">Code Detected</h3>
                 <div className="bg-white p-3 rounded-lg border border-green-100 text-slate-600 break-all font-mono text-sm mb-4 select-all">
                    {scanResult.data}
                 </div>
                 <div className="flex justify-center gap-3">
                    <button 
                       onClick={() => {
                          navigator.clipboard.writeText(scanResult.data);
                          alert('Copied to clipboard!');
                       }} 
                       className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:text-indigo-600 text-sm"
                    >
                       Copy
                    </button>
                    {scanResult.data.startsWith('http') && (
                       <a 
                          href={scanResult.data} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 text-sm"
                       >
                          Open Link
                       </a>
                    )}
                    <button 
                       onClick={() => { setScanResult(null); startScan(); }}
                       className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-700 text-sm"
                    >
                       Scan Again
                    </button>
                 </div>
              </div>
           ) : (
              <div className="flex justify-center">
                 {!isScanning ? (
                    <button 
                       onClick={startScan}
                       className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
                    >
                       <i className="fa-solid fa-expand"></i> Start Scanning
                    </button>
                 ) : (
                    <button 
                       onClick={stopScan}
                       className="px-8 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all border border-red-200"
                    >
                       Stop Camera
                    </button>
                 )}
              </div>
           )}
        </div>
      )}

    </div>
  );
};

export default QrCodeLab;
