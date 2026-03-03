
import React, { useState } from 'react';
import { generateVideo, generateText } from '../services/geminiService';
import { GeneratedVideo } from '../types';

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<GeneratedVideo[]>([]);

  // Note: Video Blob URLs are session-only.
  // Veo model requires "Paid" tier project in Google AI Studio usually.

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setEnhancing(true);
    try {
      const enhanced = await generateText(
        `Rewrite the following video prompt to be highly detailed, cinematic, and photorealistic. 
         Focus on lighting, camera angles, texture, and mood. Keep it under 60 words.
         Original Prompt: "${prompt}"`,
        "You are a professional Film Director and Prompt Engineer."
      );
      setPrompt(enhanced.replace(/^"|"$/g, '')); // Remove quotes if present
    } catch (e) {
      console.error("Enhancement failed");
    } finally {
      setEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError('');

    try {
      const url = await generateVideo(prompt, aspectRatio);
      const newVideo: GeneratedVideo = {
        url,
        prompt,
        createdAt: new Date(),
        aspectRatio
      };
      setHistory([newVideo, ...history]);
    } catch (err: any) {
      if (err.message && (err.message.includes("Requested entity was not found") || err.message.includes("403") || err.message.includes("404"))) {
         setError("Veo Model Access Error: Your current API key may not have access to the Veo video model. Please check Google AI Studio settings.");
      } else {
         setError(err.message || 'Failed to generate video.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-white/50">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <i className="fa-solid fa-video text-red-500"></i> Video Studio <span className="text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 rounded-full shadow-sm font-bold uppercase tracking-wider">Veo Pro</span>
        </h2>
        
        <div className="space-y-6">
          <div>
             <div className="flex justify-between items-end mb-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Video Prompt</label>
                <button 
                  onClick={handleEnhancePrompt}
                  disabled={enhancing || !prompt.trim()}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${enhancing ? 'bg-purple-100 text-purple-400' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}
               >
                   {enhancing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>} 
                   {enhancing ? 'Enhancing...' : 'Magic Enhance'}
                </button>
             </div>
             <div className="relative group">
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the video you want to generate (e.g., A cinematic drone shot of a cyberpunk city in rain, neon lights)..."
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all h-32 resize-none font-medium text-slate-700 pr-4"
                />
                <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-bold bg-white/80 px-2 py-1 rounded-md pointer-events-none">
                   {prompt.length} chars
                </div>
             </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                <button 
                  onClick={() => setAspectRatio('16:9')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${aspectRatio === '16:9' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
               >
                   <i className="fa-solid fa-tv"></i> Landscape (16:9)
                </button>
                <button 
                  onClick={() => setAspectRatio('9:16')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${aspectRatio === '9:16' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
               >
                   <i className="fa-solid fa-mobile-screen"></i> Portrait (9:16)
                </button>
             </div>

             <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className={`
                  flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-red-500/30 transition-all transform active:scale-95
                  ${loading || !prompt.trim() ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:-translate-y-0.5'}
                `}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i> Generating...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-clapperboard"></i> Generate Video
                  </>
                )}
              </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3 animate-fade-in">
            <i className="fa-solid fa-triangle-exclamation text-xl"></i> 
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* History Grid */}
      {history.length > 0 && (
        <div className="animate-fade-in-up">
           <div className="flex items-center gap-3 mb-6 px-2">
              <i className="fa-solid fa-clock-rotate-left text-slate-400"></i>
              <h3 className="text-xl font-bold text-slate-800">Recent Creations (Session)</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map((video, idx) => (
                 <div key={idx} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 hover:shadow-lg transition-all group">
                    <div className={`rounded-2xl overflow-hidden bg-black relative ${video.aspectRatio === '9:16' ? 'aspect-[9/16] max-w-[300px] mx-auto' : 'aspect-video'}`}>
                       <video 
                         src={video.url} 
                         controls 
                         className="w-full h-full object-contain"
                       />
                    </div>
                    <div className="mt-4 px-2">
                       <p className="text-sm font-medium text-slate-700 line-clamp-2 mb-3" title={video.prompt}>{video.prompt}</p>
                       <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-lg">
                             {video.aspectRatio} • {video.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          <a 
                            href={video.url} 
                            download={`veo-video-${idx}.mp4`}
                            className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                          >
                             <i className="fa-solid fa-download"></i> Save
                          </a>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;
