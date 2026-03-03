import React, { useState, useRef, useEffect } from 'react';
import { generateText } from '../services/geminiService';

const VideoEnhancer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
      setProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
      setProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleEnhance = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setError('');
    setResult(null);
    setProgress(0);

    try {
      // Step 1: Analyze user needs with Gemini
      const systemInstruction = "You are an expert video processing AI. Analyze the user's request and return a JSON object with the recommended video processing settings. The JSON must have these exact keys: 'resolution' (e.g., '4K', '1080p'), 'compression' (e.g., 'High', 'Medium', 'Lossless'), 'fps' (e.g., 30, 60), 'enhancements' (array of strings like 'Denoise', 'Color Grade', 'Sharpen'), and 'estimatedSizeReduction' (string like '40%'). Do not include markdown formatting, just the raw JSON.";
      
      const userRequest = prompt.trim() ? prompt : "Upscale to highest quality and compress for web sharing.";
      const aiResponse = await generateText(`User request: "${userRequest}". Video file name: "${file.name}". Size: ${(file.size / (1024 * 1024)).toFixed(2)}MB.`, systemInstruction);
      
      let settings;
      try {
        // Clean up potential markdown from Gemini response
        const cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        settings = JSON.parse(cleanJson);
      } catch (e) {
        // Fallback if JSON parsing fails
        settings = {
          resolution: '1080p',
          compression: 'Optimized',
          fps: 60,
          enhancements: ['AI Upscaling', 'Noise Reduction'],
          estimatedSizeReduction: '30%'
        };
      }

      setIsAnalyzing(false);
      setIsProcessing(true);

      // Step 2: Simulate processing
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }

      // Step 3: Show result
      setIsProcessing(false);
      setResult(settings);

    } catch (err) {
      setError('An error occurred during processing. Please try again.');
      setIsAnalyzing(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-panel rounded-[2rem] p-8 shadow-xl border border-white/10 relative overflow-hidden animate-fade-in-up">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      
      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg border border-indigo-500/30">
          <i className="fa-solid fa-wand-magic-sparkles text-xl neon-icon"></i>
        </div>
        <div>
          <h2 className="text-2xl font-heading font-bold text-white">AI Video Enhancer</h2>
          <p className="text-slate-400 text-sm">Upscale, compress, and enhance your videos automatically.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Column: Upload & Settings */}
        <div className="space-y-6">
          {/* Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
              ${file ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/10 hover:border-indigo-500/30 hover:bg-white/5 bg-slate-900/50'}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="video/*" 
              className="hidden" 
            />
            
            {file && previewUrl ? (
              <div className="space-y-3 relative group">
                <div className="relative rounded-xl overflow-hidden bg-black/50 border border-white/10 aspect-video flex items-center justify-center">
                  <video src={previewUrl} controls className="max-w-full max-h-full" />
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setFile(null); 
                      setPreviewUrl(null); 
                      setResult(null); 
                    }}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-colors z-10 opacity-0 group-hover:opacity-100"
                    title="Remove Video"
                  >
                    <i className="fa-solid fa-trash text-sm"></i>
                  </button>
                </div>
                <div>
                  <p className="text-white font-bold truncate max-w-[250px] mx-auto">{file.name}</p>
                  <p className="text-slate-400 text-xs mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/5 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                  <i className="fa-solid fa-cloud-arrow-up neon-icon"></i>
                </div>
                <div>
                  <p className="text-white font-bold">Click or drag video to upload</p>
                  <p className="text-slate-500 text-xs mt-1">MP4, MOV, AVI up to 2GB</p>
                </div>
              </div>
            )}
          </div>

          {/* Prompt Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Enhancement Goals</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Upscale to 4K, remove background noise, and compress for WhatsApp..."
              className="w-full px-5 py-4 rounded-xl bg-slate-900/50 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all h-28 resize-none text-white placeholder:text-slate-600 font-medium"
              disabled={isProcessing || isAnalyzing}
            />
          </div>

          <button
            onClick={handleEnhance}
            disabled={!file || isAnalyzing || isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 group
              ${!file || isAnalyzing || isProcessing ? 'bg-indigo-500/50 cursor-not-allowed opacity-70' : 'bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-1 shadow-indigo-500/25'}`}
          >
            {isAnalyzing ? (
              <><i className="fa-solid fa-brain fa-pulse neon-icon"></i> AI is analyzing...</>
            ) : isProcessing ? (
              <><i className="fa-solid fa-circle-notch fa-spin neon-icon"></i> Processing Video...</>
            ) : (
              <><i className="fa-solid fa-wand-magic-sparkles transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12 neon-icon"></i> Enhance Video</>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 flex items-center gap-3 text-sm">
              <i className="fa-solid fa-circle-exclamation"></i> {error}
            </div>
          )}
        </div>

        {/* Right Column: Progress & Results */}
        <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6 flex flex-col justify-center min-h-[400px] relative overflow-hidden">
          {!isAnalyzing && !isProcessing && !result && (
            <div className="text-center text-slate-500 space-y-4">
              <i className="fa-solid fa-photo-film text-5xl opacity-20 neon-icon"></i>
              <p className="text-sm font-medium">Upload a video and specify your goals to see the AI-enhanced results here.</p>
            </div>
          )}

          {(isAnalyzing || isProcessing) && (
            <div className="space-y-8 w-full max-w-md mx-auto relative z-10">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 mb-4">
                  <i className={`fa-solid text-2xl ${isAnalyzing ? 'fa-brain fa-pulse' : 'fa-gear fa-spin'} neon-icon`}></i>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {isAnalyzing ? 'Analyzing Request...' : 'Applying Enhancements...'}
                </h3>
                <p className="text-slate-400 text-sm">
                  {isAnalyzing ? 'Determining optimal processing parameters' : 'Upscaling and compressing video frames'}
                </p>
              </div>
              
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-200 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {result && !isProcessing && !isAnalyzing && (
            <div className="space-y-6 animate-fade-in relative z-10">
              <div className="text-center space-y-2 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                  <i className="fa-solid fa-check text-xl neon-icon"></i>
                </div>
                <h3 className="text-xl font-bold text-white">Enhancement Complete</h3>
                <p className="text-slate-400 text-sm">Your video has been successfully processed.</p>
              </div>

              {previewUrl && (
                <div className="relative rounded-xl overflow-hidden bg-black/50 border border-emerald-500/30 aspect-video flex items-center justify-center mb-6">
                  {/* Simulated "Enhanced" Video Preview - just showing the original with a slight filter for demo purposes */}
                  <video src={previewUrl} controls className="max-w-full max-h-full contrast-125 saturate-110" />
                  <div className="absolute top-2 left-2 bg-emerald-500/80 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider backdrop-blur-md">
                    Enhanced Preview
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Resolution</p>
                  <p className="text-lg font-bold text-white">{result.resolution}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Frame Rate</p>
                  <p className="text-lg font-bold text-white">{result.fps} FPS</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Compression</p>
                  <p className="text-lg font-bold text-white">{result.compression}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Size Reduction</p>
                  <p className="text-lg font-bold text-emerald-400">~{result.estimatedSizeReduction}</p>
                </div>
              </div>

              <div className="bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/20">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Applied Filters</p>
                <div className="flex flex-wrap gap-2">
                  {result.enhancements?.map((enh: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                      {enh}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                <i className="fa-solid fa-download"></i> Download Enhanced Video
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoEnhancer;
