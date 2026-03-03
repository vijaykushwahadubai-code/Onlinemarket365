
import React, { useState, useRef, useEffect } from 'react';
import { generateSpeech, analyzeAudio } from '../services/geminiService';

const VOICES = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];

const SpeechGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tts' | 'clone'>('tts');
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Kore');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Clone State
  const [cloneFile, setCloneFile] = useState<File | null>(null);
  const [analyzedProfile, setAnalyzedProfile] = useState<{ gender: string, tone: string } | null>(null);
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const stopAudio = () => {
    if (sourceRef.current) {
        try { sourceRef.current.stop(); } catch (e) {}
        sourceRef.current = null;
    }
    if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
    }
    setIsPlaying(false);
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
        animationRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        // Clear canvas with transparent fill
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2; // Scale down
            
            // Emergent Gradient Color
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, '#9333ea'); // Purple-600
            gradient.addColorStop(1, '#ec4899'); // Pink-500
            
            ctx.fillStyle = gradient;
            
            // Rounded bars look cleaner
            if (barHeight > 0) {
               ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            }
            
            x += barWidth + 1;
        }
    };
    draw();
  };

  const decodeAndPlay = async (base64Data: string) => {
    stopAudio(); 

    try {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        }
        const ctx = audioContextRef.current;

        // Decode base64
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const dataInt16 = new Int16Array(bytes.buffer);
        const numChannels = 1;
        const sampleRate = 24000; 
        const frameCount = dataInt16.length;
        
        const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = ctx.createBufferSource();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        source.buffer = buffer;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        
        source.onended = () => {
            setIsPlaying(false);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
        
        sourceRef.current = source;
        source.start();
        setIsPlaying(true);
        drawVisualizer();

    } catch (err) {
        console.error("Audio playback error", err);
        setError("Failed to play audio.");
        setIsPlaying(false);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    stopAudio();

    try {
      const base64Audio = await generateSpeech(text, voice);
      await decodeAndPlay(base64Audio);
    } catch (err) {
      setError('Failed to generate speech. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCloneFile(e.target.files[0]);
      setAnalyzedProfile(null); // Reset profile
    }
  };

  const handleCloneAndGenerate = async () => {
    if (!text.trim() || !cloneFile) return;
    
    setLoading(true);
    setError('');
    stopAudio();

    try {
      // 1. Convert Audio to Base64
      const reader = new FileReader();
      reader.readAsDataURL(cloneFile);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const mimeType = cloneFile.type;

        // 2. Analyze Audio if not yet analyzed
        let targetVoice = 'Kore'; // Default fallback
        if (!analyzedProfile) {
           try {
             const analysis = await analyzeAudio(base64Audio, mimeType);
             setAnalyzedProfile(analysis);
             
             // 3. Smart Voice Matching
             const isMale = analysis.gender.toLowerCase() === 'male';
             const tone = analysis.tone.toLowerCase();
             
             if (isMale) {
                targetVoice = tone.includes('deep') ? 'Charon' : 'Fenrir';
             } else {
                targetVoice = tone.includes('energetic') ? 'Zephyr' : 'Kore';
             }
           } catch (e) {
             console.warn("Analysis failed, using default voice");
           }
        } else {
             // Use existing profile logic
             const isMale = analyzedProfile.gender.toLowerCase() === 'male';
             const tone = analyzedProfile.tone.toLowerCase();
             if (isMale) targetVoice = tone.includes('deep') ? 'Charon' : 'Fenrir';
             else targetVoice = tone.includes('energetic') ? 'Zephyr' : 'Kore';
        }

        // 4. Generate Speech with Matched Voice
        const generatedAudio = await generateSpeech(text, targetVoice);
        await decodeAndPlay(generatedAudio);
        setLoading(false);
      };
    } catch (err) {
      setError("Failed to clone/generate audio.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Tabs */}
      <div className="flex justify-center gap-4 mb-2">
         <button 
           onClick={() => setActiveTab('tts')}
           className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === 'tts' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
         >
            <i className="fa-solid fa-microphone-lines mr-2"></i> Text to Speech
         </button>
         <button 
           onClick={() => setActiveTab('clone')}
           className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === 'clone' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
         >
            <i className="fa-solid fa-fingerprint mr-2"></i> Voice Cloning
         </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/50">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          {activeTab === 'tts' ? <><i className="fa-solid fa-language text-purple-600"></i> Standard TTS</> : <><i className="fa-solid fa-wave-square text-purple-600"></i> Voice Cloner</>}
        </h2>

        <div className="space-y-6">
          
          {activeTab === 'tts' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Select Voice</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {VOICES.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVoice(v)}
                    className={`
                      py-2 px-3 rounded-lg text-sm font-medium transition-all border
                      ${voice === v 
                        ? 'bg-purple-100 border-purple-300 text-purple-700 shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
                    `}
                  >
                    <i className="fa-solid fa-music mr-2 opacity-50"></i>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
               {/* File Upload for Cloning */}
               <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer group">
                  <input 
                     type="file" 
                     accept="audio/*" 
                     onChange={handleFileUpload} 
                     className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="pointer-events-none">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-purple-500 text-xl group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                     </div>
                     <p className="text-sm font-bold text-slate-700">{cloneFile ? cloneFile.name : 'Upload Reference Audio'}</p>
                     <p className="text-xs text-slate-400 mt-1">MP3, WAV (Max 5MB)</p>
                  </div>
               </div>

               {analyzedProfile && (
                  <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl flex items-center gap-4 animate-fade-in">
                     <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-lg">
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                     </div>
                     <div>
                        <h4 className="font-bold text-sm text-purple-900">Voice Profile Detected</h4>
                        <p className="text-xs text-purple-700">Gender: {analyzedProfile.gender} • Tone: {analyzedProfile.tone}</p>
                     </div>
                  </div>
               )}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Text to Speak</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all h-32 resize-none"
            />
          </div>

          {/* Visualizer Area */}
          <div className={`h-24 bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-800 ${isPlaying ? 'opacity-100' : 'opacity-50'}`}>
             <canvas ref={canvasRef} width="600" height="96" className="w-full h-full absolute inset-0"></canvas>
             {!isPlaying && !loading && (
                <span className="text-slate-500 text-xs font-mono relative z-10">Audio Visualizer Ready</span>
             )}
             {loading && (
                <span className="text-purple-400 text-xs font-mono relative z-10 flex items-center gap-2">
                   <i className="fa-solid fa-circle-notch fa-spin"></i> {activeTab === 'clone' && !analyzedProfile ? 'Analyzing & Cloning...' : 'Synthesizing Voice...'}
                </span>
             )}
          </div>

          <div className="flex justify-end gap-3">
             {isPlaying && (
                <button
                    onClick={stopAudio}
                    className="px-6 py-3 rounded-xl font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all border border-red-200"
                >
                    <i className="fa-solid fa-stop"></i> Stop
                </button>
             )}
            <button
              onClick={activeTab === 'clone' ? handleCloneAndGenerate : handleGenerate}
              disabled={loading || !text.trim() || (activeTab === 'clone' && !cloneFile)}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-white shadow-lg shadow-purple-500/30 transition-all
                ${loading || !text.trim() || (activeTab === 'clone' && !cloneFile) ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 hover:-translate-y-0.5'}
              `}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i> Processing...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-volume-high"></i> {activeTab === 'clone' ? 'Clone & Speak' : 'Generate Audio'}
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i> {error}
          </div>
        )}
      </div>
      
      <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 text-sm text-slate-500 border border-white/40 flex gap-3">
          <i className="fa-solid fa-lightbulb text-yellow-500 mt-0.5"></i>
          <p>{activeTab === 'clone' ? 'Tip: Upload a clear, noise-free sample for best analysis results.' : 'Tip: You can use this tool to generate voiceovers for your videos or read out your marketing copy.'}</p>
      </div>
    </div>
  );
};

export default SpeechGenerator;
