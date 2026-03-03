
import React, { useState, useRef, useEffect } from 'react';
import { generateText } from '../services/geminiService';
import { EXTERNAL_TOOLS } from '../data/toolsData';

type Mode = 'vocal_remover' | 'music_generator';

const MusicHub: React.FC = () => {
  const [activeMode, setActiveMode] = useState<Mode>('vocal_remover');
  
  // Vocal Remover State
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Music Generator State
  const [musicPrompt, setMusicPrompt] = useState('');
  const [musicResult, setMusicResult] = useState('');
  const [musicLoading, setMusicLoading] = useState(false);

  // --- Vocal Remover Logic (Phase Inversion Simulation) ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
      setIsProcessed(false);
      setIsPlaying(false);
      stopAudio();
    }
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
        try { sourceNodeRef.current.stop(); } catch (e) {}
        sourceNodeRef.current = null;
    }
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
    }
    setIsPlaying(false);
  };

  const processAudio = async () => {
    if (!audioFile) return;
    setIsProcessing(true);
    stopAudio();

    try {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const arrayBuffer = await audioFile.arrayBuffer();
        const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
        
        // Karaoke Effect: Left - Right (removes center panned vocals)
        // We create a new mono buffer
        const length = decodedBuffer.length;
        const newBuffer = ctx.createBuffer(1, length, decodedBuffer.sampleRate);
        const channelData = newBuffer.getChannelData(0);
        const left = decodedBuffer.getChannelData(0);
        const right = decodedBuffer.getChannelData(1); // Assuming stereo

        for (let i = 0; i < length; i++) {
            channelData[i] = (left[i] - right[i]); 
        }

        audioBufferRef.current = newBuffer;
        setIsProcessed(true);
    } catch (e) {
        console.error("Audio Processing Failed", e);
        alert("Could not process audio. Ensure file is stereo.");
    } finally {
        setIsProcessing(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
        stopAudio();
    } else {
        playProcessedAudio();
    }
  };

  const playProcessedAudio = () => {
    if (!audioBufferRef.current || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const source = ctx.createBufferSource();
    source.buffer = audioBufferRef.current;
    
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const gainNode = ctx.createGain();
    // Boost gain because phase cancellation reduces volume
    gainNode.gain.value = 1.5; 
    
    source.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(ctx.destination);
    
    source.onended = () => setIsPlaying(false);
    source.start();
    sourceNodeRef.current = source;
    setIsPlaying(true);
    drawVisualizer();
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = '#0f172a'; // Match bg
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, '#4f46e5');
            gradient.addColorStop(1, '#a855f7');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    };
    draw();
  };

  // --- Music Generator Logic ---
  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim()) return;
    setMusicLoading(true);
    setMusicResult('');

    const prompt = `Act as an expert Music Composer and Songwriter. 
    User Request: "${musicPrompt}".
    
    Output a structured response:
    1. **Genre & Vibe**: Describe the style.
    2. **Lyrics**: Write one verse and a chorus (if applicable).
    3. **Chord Progression**: Provide the chord progression (e.g., C - G - Am - F).
    4. **Prompt for Suno/Udio**: Write a specific, high-quality prompt the user can copy-paste into an AI Music Generator tool to get this result.
    `;

    try {
        const result = await generateText(prompt);
        setMusicResult(result);
    } catch (e) {
        setMusicResult("Error creating music composition.");
    } finally {
        setMusicLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-12">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white p-10 md:p-14 text-center shadow-2xl border border-purple-500/50">
         <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -mr-20 -mt-20 animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-purple-300 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-music"></i> Audio Intelligence
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               Music Studio
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
               Extract vocals from tracks, generate new compositions, and access top AI music tools.
            </p>

            <div className="flex justify-center gap-4">
               <button 
                 onClick={() => setActiveMode('vocal_remover')} 
                 className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeMode === 'vocal_remover' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
               >
                  <i className="fa-solid fa-microphone-slash"></i> Vocal Remover
               </button>
               <button 
                 onClick={() => setActiveMode('music_generator')} 
                 className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeMode === 'music_generator' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
               >
                  <i className="fa-solid fa-wand-magic-sparkles"></i> AI Composer
               </button>
            </div>
         </div>
      </div>

      {activeMode === 'vocal_remover' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
           {/* Upload & Controls */}
           <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Stem Splitter</h2>
                 <p className="text-slate-500 text-sm mb-6">Extract instrumentals using phase inversion.</p>
                 
                 <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                    <input 
                       type="file" 
                       accept="audio/*" 
                       onChange={handleFileUpload}
                       className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="pointer-events-none">
                       <i className="fa-solid fa-cloud-arrow-up text-4xl text-slate-300 mb-3"></i>
                       <p className="font-bold text-slate-700">Click to Upload Audio</p>
                       <p className="text-xs text-slate-400 mt-1">MP3, WAV (Stereo required)</p>
                    </div>
                 </div>

                 {audioFile && (
                    <div className="mt-6 space-y-4">
                       <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-purple-600 shadow-sm"><i className="fa-solid fa-music"></i></div>
                          <div className="flex-1 min-w-0">
                             <p className="text-sm font-bold text-slate-800 truncate">{audioFile.name}</p>
                             <p className="text-xs text-slate-500">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                       </div>
                       
                       <button 
                          onClick={processAudio}
                          disabled={isProcessing}
                          className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-purple-600 transition-all shadow-lg flex items-center justify-center gap-2"
                       >
                          {isProcessing ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processing...</> : <><i className="fa-solid fa-sliders"></i> Remove Vocals</>}
                       </button>
                    </div>
                 )}
              </div>
           </div>

           {/* Visualization & Playback */}
           <div className="lg:col-span-7">
              <div className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl h-full border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                 {isProcessed ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-8 relative z-10">
                       <canvas ref={canvasRef} width="600" height="200" className="w-full h-48 rounded-xl bg-slate-950/50 border border-white/5"></canvas>
                       
                       <div className="flex items-center gap-6">
                          <button 
                             onClick={togglePlay}
                             className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all shadow-xl hover:scale-105 ${isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                          >
                             <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play pl-1'}`}></i>
                          </button>
                       </div>
                       <p className="text-slate-400 text-sm font-medium animate-pulse">{isPlaying ? 'Playing Instrumental...' : 'Ready to Play'}</p>
                    </div>
                 ) : (
                    <div className="text-center text-slate-600">
                       <i className="fa-solid fa-wave-square text-6xl mb-4 opacity-20"></i>
                       <p>Upload and process a song to see the visualizer.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
           {/* Generator Input */}
           <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">AI Composer</h2>
                 <p className="text-slate-500 text-sm mb-6">Generate lyrics, chords, and prompts for AI music tools.</p>
                 
                 <div className="space-y-4">
                    <textarea 
                       value={musicPrompt}
                       onChange={(e) => setMusicPrompt(e.target.value)}
                       className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all h-40 resize-none font-medium text-slate-700"
                       placeholder="Describe the song (e.g., A melancholic lo-fi hip hop beat about rainy days in Tokyo)..."
                    />
                    <button 
                       onClick={handleGenerateMusic}
                       disabled={musicLoading || !musicPrompt.trim()}
                       className={`w-full py-4 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 transition-all shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 ${musicLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                       {musicLoading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Composing...</> : <><i className="fa-solid fa-wand-magic-sparkles"></i> Regenerate Music</>}
                    </button>
                 </div>
              </div>

              {/* External Tools Links */}
              <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-200">
                 <h3 className="font-bold text-slate-700 mb-4 px-2">External Generators</h3>
                 <div className="space-y-3">
                    {EXTERNAL_TOOLS.filter(t => t.category === 'Audio').map((tool, idx) => (
                       <a key={idx} href={tool.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-pink-300 transition-all group">
                          <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center text-white text-sm group-hover:scale-110 transition-transform`}>
                             <i className={`fa-solid ${tool.icon}`}></i>
                          </div>
                          <div className="flex-1">
                             <h4 className="font-bold text-slate-800 text-sm">{tool.name}</h4>
                             <p className="text-[10px] text-slate-500">{tool.description}</p>
                          </div>
                          <i className="fa-solid fa-arrow-up-right-from-square text-xs text-slate-300 group-hover:text-pink-500"></i>
                       </a>
                    ))}
                 </div>
              </div>
           </div>

           {/* Generator Output */}
           <div className="lg:col-span-7">
              {musicResult ? (
                 <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100 h-full animate-fade-in-up">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                       <h3 className="font-bold text-xl text-slate-800">Composition Result</h3>
                       <button onClick={() => navigator.clipboard.writeText(musicResult)} className="text-xs font-bold text-pink-600 hover:text-pink-800 bg-pink-50 px-3 py-1.5 rounded-lg"><i className="fa-regular fa-copy mr-1"></i> Copy</button>
                    </div>
                    <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-600 leading-relaxed font-mono text-sm bg-slate-50 p-6 rounded-xl border border-slate-200">
                       {musicResult}
                    </div>
                 </div>
              ) : (
                 <div className="h-full bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                    <i className="fa-solid fa-music text-6xl mb-4 opacity-20"></i>
                    <p>Enter a prompt to generate lyrics, chords, and production notes.</p>
                 </div>
              )}
           </div>
        </div>
      )}

    </div>
  );
};

export default MusicHub;
