
import React, { useState, useRef, useEffect } from 'react';
import { generateImage } from '../services/geminiService';
import { GeneratedImage } from '../types';
import { IMAGE_EDITING_SOFTWARE } from '../data/toolsData';

const COLOR_STYLES = [
  { label: 'None', value: '' },
  { label: 'Vivid & Vibrant', value: 'vivid, high saturation, vibrant colors' },
  { label: 'Pastel & Soft', value: 'pastel color palette, soft tones, dreamy' },
  { label: 'Cyberpunk Neon', value: 'neon, cyberpunk, magenta and cyan, glowing' },
  { label: 'Vintage Film', value: 'vintage, retro, sepia tones, film grain' },
  { label: 'Black & White', value: 'black and white, monochrome, high contrast' },
  { label: 'Earthy & Natural', value: 'earth tones, forest greens, browns, natural colors' },
];

const FILTER_PRESETS = [
  { name: 'Normal', filter: 'none', overlay: null },
  { name: 'Grayscale', filter: 'grayscale(100%)', overlay: null },
  { name: 'Sepia', filter: 'sepia(100%)', overlay: null },
  { name: 'Vintage', filter: 'sepia(40%) contrast(85%) brightness(110%) saturate(80%)', overlay: 'rgba(255, 230, 180, 0.15)' },
  { name: 'High Contrast', filter: 'contrast(150%)', overlay: null },
  { name: 'Warm', filter: 'sepia(30%) saturate(140%)', overlay: 'rgba(255, 150, 50, 0.1)' },
  { name: 'Cool', filter: 'hue-rotate(180deg) sepia(20%)', overlay: 'rgba(0, 100, 255, 0.1)' },
  { name: 'Dramatic', filter: 'contrast(120%) saturate(120%) brightness(90%)', overlay: null },
];

const STYLE_INSPIRATIONS = [
  {
    id: 'product',
    label: 'Product Shot',
    prompt: 'Professional product photography of a sleek modern coffee maker on a marble counter, soft studio lighting, 4k, photorealistic',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'abstract',
    label: 'Abstract Art',
    prompt: 'Abstract 3D digital art, swirling fluid shapes, vibrant neon colors, glossy texture, raytracing, 8k resolution',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'portrait',
    label: 'Cinematic Portrait',
    prompt: 'Cinematic portrait of a cyberpunk character with glowing neon glasses, rainy city night background, bokeh, highly detailed',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'landscape',
    label: 'Fantasy Landscape',
    prompt: 'Epic fantasy landscape with floating islands and waterfalls, mystical atmosphere, golden hour lighting, wide angle view',
    url: 'https://images.unsplash.com/photo-1479030160180-b1860951d6ec?auto=format&fit=crop&w=300&q=80'
  }
];

interface ImageEditorProps {
  image: GeneratedImage;
  onSave: (newUrl: string) => void;
  onCancel: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ image, onSave, onCancel }) => {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [cropRatio, setCropRatio] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState(FILTER_PRESETS[0]);
  const [extractedPalette, setExtractedPalette] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [showCollab, setShowCollab] = useState(false);
  const [comments, setComments] = useState([{user: 'Sarah', text: 'Love the contrast!'}, {user: 'Mike', text: 'Maybe warmer tones?'}]);
  const [newComment, setNewComment] = useState('');

  const extractColors = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
        const width = canvas.width;
        const height = canvas.height;
        const imageData = ctx.getImageData(0, 0, width, height).data;
        const colorMap: Record<string, number> = {};
        
        for (let i = 0; i < imageData.length; i += 4000) {
            const r = imageData[i];
            const g = imageData[i+1];
            const b = imageData[i+2];
            const a = imageData[i+3];
            
            if (a < 128) continue;

            const rQ = Math.round(r / 32) * 32;
            const gQ = Math.round(g / 32) * 32;
            const bQ = Math.round(b / 32) * 32;
            
            const hex = `#${((1 << 24) + (rQ << 16) + (gQ << 8) + bQ).toString(16).slice(1)}`;
            colorMap[hex] = (colorMap[hex] || 0) + 1;
        }

        const sortedColors = Object.entries(colorMap)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 5)
            .map(([color]) => color);
            
        setExtractedPalette(sortedColors);
    } catch (e) {
        console.error("Could not extract colors", e);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image.url;
    
    img.onload = () => {
      const isVertical = rotation % 180 !== 0;
      const displayWidth = isVertical ? img.height : img.width;
      const displayHeight = isVertical ? img.width : img.height;

      const maxWidth = 800;
      const scale = Math.min(1, maxWidth / displayWidth);
      
      canvas.width = displayWidth * scale;
      canvas.height = displayHeight * scale;

      ctx.save();
      ctx.scale(scale, scale);
      
      const baseFilter = activeFilter.filter === 'none' ? '' : activeFilter.filter;
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) ${baseFilter}`;
      
      ctx.translate(displayWidth / 2, displayHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      
      if (activeFilter.overlay) {
         ctx.filter = 'none';
         ctx.fillStyle = activeFilter.overlay;
         ctx.globalCompositeOperation = 'overlay';
         ctx.fillRect(-img.width / 2, -img.height / 2, img.width, img.height);
      }
      
      ctx.restore();

      if (cropRatio) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        
        let cropW = canvas.width;
        let cropH = canvas.height;
        const currentRatio = canvas.width / canvas.height;

        if (currentRatio > cropRatio) {
           cropW = canvas.height * cropRatio;
        } else {
           cropH = canvas.width / cropRatio;
        }

        const x = (canvas.width - cropW) / 2;
        const y = (canvas.height - cropH) / 2;

        ctx.fillRect(0, 0, canvas.width, y);
        ctx.fillRect(0, y + cropH, canvas.width, canvas.height - (y + cropH));
        ctx.fillRect(0, y, x, cropH);
        ctx.fillRect(x + cropW, y, canvas.width - (x + cropW), cropH);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cropW, cropH);
      }
    };
  }, [brightness, contrast, rotation, cropRatio, activeFilter, image.url]);

  const handleSave = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image.url;
    
    img.onload = () => {
        const isVertical = rotation % 180 !== 0;
        const fullW = isVertical ? img.height : img.width;
        const fullH = isVertical ? img.width : img.height;

        canvas.width = fullW;
        canvas.height = fullH;

        ctx.save();
        
        const baseFilter = activeFilter.filter === 'none' ? '' : activeFilter.filter;
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) ${baseFilter}`;
        
        ctx.translate(fullW / 2, fullH / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        if (activeFilter.overlay) {
            ctx.filter = 'none';
            ctx.fillStyle = activeFilter.overlay;
            ctx.globalCompositeOperation = 'overlay';
            ctx.fillRect(-img.width / 2, -img.height / 2, img.width, img.height);
        }
        
        ctx.restore();

        if (cropRatio) {
            const tempCanvas = document.createElement('canvas');
            const tCtx = tempCanvas.getContext('2d');
            if (!tCtx) return;

            let cropW = fullW;
            let cropH = fullH;
            const currentRatio = fullW / fullH;

            if (currentRatio > cropRatio) {
                cropW = fullH * cropRatio;
            } else {
                cropH = fullW / cropRatio;
            }

            tempCanvas.width = cropW;
            tempCanvas.height = cropH;

            tCtx.drawImage(
                canvas, 
                (fullW - cropW) / 2, (fullH - cropH) / 2, cropW, cropH, 
                0, 0, cropW, cropH
            );
            
            onSave(tempCanvas.toDataURL('image/png'));
        } else {
            onSave(canvas.toDataURL('image/png'));
        }
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-4">
                   <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                       <i className="fa-solid fa-sliders"></i> Image Editor Studio
                   </h3>
                   <button 
                     onClick={() => setShowCollab(!showCollab)}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${showCollab ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}
                   >
                     <i className="fa-solid fa-users"></i> Team
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                   </button>
                </div>
                <div className="flex gap-2">
                    <button onClick={onCancel} className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 transition-colors shadow-lg shadow-pink-500/30">
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center p-8 overflow-auto relative">
                    <div className="bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] absolute inset-0 opacity-10 pointer-events-none"></div>
                    <canvas ref={canvasRef} className="max-w-full max-h-full rounded-lg shadow-2xl relative z-10" />
                    
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
                        {extractedPalette.length > 0 && (
                            <div className="flex gap-2 p-2 bg-white/90 backdrop-blur rounded-xl shadow-lg animate-scale-in">
                                {extractedPalette.map((color, i) => (
                                    <div key={i} className="group relative">
                                        <div 
                                            className="w-8 h-8 rounded-full border border-slate-200 cursor-pointer hover:scale-110 transition-transform" 
                                            style={{ backgroundColor: color }}
                                            onClick={() => navigator.clipboard.writeText(color)}
                                            title="Click to copy hex"
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button 
                            onClick={extractColors} 
                            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2"
                        >
                            <i className="fa-solid fa-eye-dropper"></i> Palette
                        </button>
                    </div>
                </div>

                {showCollab && (
                  <div className="w-64 bg-slate-50 border-l border-slate-200 flex flex-col animate-fade-in">
                     <div className="p-4 border-b border-slate-200">
                        <h4 className="text-sm font-bold text-slate-700">Team Chat</h4>
                     </div>
                     <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {comments.map((c, i) => (
                           <div key={i} className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                              <span className="text-xs font-bold text-indigo-600 block">{c.user}</span>
                              <p className="text-sm text-slate-600">{c.text}</p>
                           </div>
                        ))}
                     </div>
                     <div className="p-4 border-t border-slate-200">
                        <input 
                          type="text" 
                          placeholder="Add comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyDown={(e) => {
                             if(e.key === 'Enter' && newComment.trim()) {
                                setComments([...comments, {user: 'You', text: newComment}]);
                                setNewComment('');
                             }
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-indigo-500"
                        />
                     </div>
                  </div>
                )}

                <div className="w-full lg:w-80 bg-white border-l border-slate-100 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-8">
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <i className="fa-solid fa-wand-magic-sparkles"></i> Filters
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                            {FILTER_PRESETS.map((f, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveFilter(f)}
                                    className={`relative group overflow-hidden rounded-xl aspect-square border-2 transition-all shadow-sm hover:shadow-md ${activeFilter.name === f.name ? 'border-pink-500 ring-2 ring-pink-200' : 'border-slate-100 hover:border-pink-300'}`}
                                >
                                    <img 
                                        src={image.url} 
                                        className="w-full h-full object-cover" 
                                        style={{ filter: f.filter !== 'none' ? f.filter : undefined }} 
                                        alt={f.name}
                                    />
                                    {f.overlay && (
                                        <div className="absolute inset-0 w-full h-full z-10" style={{ backgroundColor: f.overlay, mixBlendMode: 'overlay' }}></div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm py-1.5 z-20">
                                        <span className="text-[9px] font-bold text-white block text-center uppercase tracking-wide">{f.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <i className="fa-solid fa-sun"></i> Adjustments
                        </h4>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm font-bold text-slate-700"><span>Brightness</span><span>{brightness}%</span></div>
                            <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pink-600" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm font-bold text-slate-700"><span>Contrast</span><span>{contrast}%</span></div>
                            <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pink-600" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><i className="fa-solid fa-crop-simple"></i> Crop</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setCropRatio(null)} className={`py-2 rounded-xl text-xs font-bold border transition-all ${cropRatio === null ? 'bg-pink-50 border-pink-200 text-pink-700' : 'bg-white border-slate-200 text-slate-600'}`}>Original</button>
                            <button onClick={() => setCropRatio(1)} className={`py-2 rounded-xl text-xs font-bold border transition-all ${cropRatio === 1 ? 'bg-pink-50 border-pink-200 text-pink-700' : 'bg-white border-slate-200 text-slate-600'}`}>1:1</button>
                            <button onClick={() => setCropRatio(16/9)} className={`py-2 rounded-xl text-xs font-bold border transition-all ${cropRatio === 16/9 ? 'bg-pink-50 border-pink-200 text-pink-700' : 'bg-white border-slate-200 text-slate-600'}`}>16:9</button>
                            <button onClick={() => setCropRatio(4/3)} className={`py-2 rounded-xl text-xs font-bold border transition-all ${cropRatio === 4/3 ? 'bg-pink-50 border-pink-200 text-pink-700' : 'bg-white border-slate-200 text-slate-600'}`}>4:3</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [editingImage, setEditingImage] = useState<GeneratedImage | null>(null);
  const [colorStyle, setColorStyle] = useState(COLOR_STYLES[0].value);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('all');

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('image_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory).map((h: any) => ({...h, createdAt: new Date(h.createdAt)})));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      // Limit to last 3 to prevent storage quota issues with base64 images
      const limitedHistory = history.slice(0, 3); 
      localStorage.setItem('image_history', JSON.stringify(limitedHistory));
    } catch (e) {
      console.error("Failed to save history - quota exceeded");
    }
  }, [history]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    
    setSearchQuery('');
    setFilterDate('all');

    try {
      const finalPrompt = colorStyle ? `${prompt}, ${colorStyle}` : prompt;
      const imageUrl = await generateImage(finalPrompt);
      const newImage: GeneratedImage = {
        url: imageUrl,
        prompt: prompt,
        createdAt: new Date(),
      };
      setHistory([newImage, ...history]);
    } catch (err) {
      setError('Failed to generate image. Try a different prompt.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdited = (newUrl: string) => {
      if (!editingImage) return;
      const newImage: GeneratedImage = {
          url: newUrl,
          prompt: `${editingImage.prompt} (Edited)`,
          createdAt: new Date()
      };
      setHistory([newImage, ...history]);
      setEditingImage(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setEditingImage({
        url,
        prompt: file.name,
        createdAt: new Date()
      });
    }
  };

  const filteredHistory = history.filter(img => {
      const matchesSearch = img.prompt.toLowerCase().includes(searchQuery.toLowerCase());
      const imgDate = new Date(img.createdAt);
      const now = new Date();
      let matchesDate = true;

      if (filterDate === 'today') {
         matchesDate = imgDate.toDateString() === now.toDateString();
      } else if (filterDate === 'week') {
         const oneWeekAgo = new Date();
         oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
         matchesDate = imgDate >= oneWeekAgo;
      }

      return matchesSearch && matchesDate;
  });

  return (
    <>
        {editingImage && (
            <ImageEditor 
                image={editingImage} 
                onSave={handleSaveEdited} 
                onCancel={() => setEditingImage(null)} 
            />
        )}

        <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/50">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-image text-pink-600"></i> Image Studio & Editor
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {STYLE_INSPIRATIONS.map((style) => (
                <div 
                  key={style.id}
                  onClick={() => setPrompt(style.prompt)}
                  className="relative group cursor-pointer overflow-hidden rounded-xl h-24 md:h-32 border border-slate-200 shadow-sm hover:shadow-lg transition-all"
                >
                  <img src={style.url} alt={style.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white font-bold text-sm text-center px-2 drop-shadow-md">{style.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the image you want to create..."
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all pr-12"
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                    </div>
                    
                    <div className="w-full md:w-64">
                       <div className="relative h-full">
                          <select 
                             value={colorStyle} 
                             onChange={(e) => setColorStyle(e.target.value)}
                             className="w-full h-full px-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all appearance-none cursor-pointer font-medium text-slate-600"
                          >
                             {COLOR_STYLES.map((style, idx) => (
                                <option key={idx} value={style.value}>{style.label}</option>
                             ))}
                          </select>
                          <i className="fa-solid fa-palette absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                       </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className={`
                            px-8 py-4 rounded-xl font-medium text-white shadow-lg shadow-pink-500/30 transition-all whitespace-nowrap h-full
                            ${loading || !prompt.trim() ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 hover:-translate-y-0.5'}
                            `}
                        >
                            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Create Art'}
                        </button>
                    </div>
                </div>
                
                {/* Upload Section */}
                <div className="relative border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-pink-300 rounded-xl p-3 text-center transition-all cursor-pointer group">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        title="Upload image to edit"
                    />
                    <div className="flex items-center justify-center gap-2 text-slate-500 group-hover:text-pink-600 text-sm font-bold">
                        <i className="fa-solid fa-upload"></i> Or Upload Your Own Image to Edit
                    </div>
                </div>
            </div>
            
            {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                {error}
            </div>
            )}
        </div>

        {/* Gallery Controls */}
        {history.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 p-4 rounded-2xl border border-white/50 backdrop-blur-sm animate-fade-in">
                <div className="relative w-full md:w-96">
                    <input 
                        type="text" 
                        placeholder="Search by prompt..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none text-sm transition-all"
                    />
                    <i className="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">Filter by:</span>
                    <select 
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="w-full md:w-48 px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none text-sm transition-all cursor-pointer"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Past 7 Days</option>
                    </select>
                </div>
            </div>
        )}

        {/* Main Display Area */}
        {history.length > 0 ? (
            filteredHistory.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredHistory.map((img, idx) => (
                        <div key={idx} className="group relative bg-white p-2 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                            <div className="aspect-square rounded-xl overflow-hidden relative bg-slate-100 cursor-pointer">
                                <img 
                                    src={img.url} 
                                    alt={img.prompt} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                    <p className="text-white text-sm font-medium line-clamp-2 mb-3 leading-snug">{img.prompt}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setEditingImage(img)}
                                                className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all shadow-lg"
                                                title="Edit Image"
                                            >
                                                <i className="fa-solid fa-sliders text-xs"></i>
                                            </button>
                                            <a 
                                                href={img.url} 
                                                download={`generated-${Date.now()}.png`}
                                                className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all shadow-lg"
                                                title="Download Image"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <i className="fa-solid fa-download text-xs"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/30 rounded-3xl border border-dashed border-slate-300 backdrop-blur-sm">
                    <p className="text-slate-500 font-medium mb-4">No matches found.</p>
                    <button 
                        onClick={() => {setSearchQuery(''); setFilterDate('all');}} 
                        className="text-pink-600 font-bold text-sm hover:text-pink-700 hover:underline transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )
        ) : (
            <div className="text-center py-24 text-slate-400">
                <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <i className="fa-solid fa-image text-4xl opacity-50"></i>
                </div>
                <p className="text-lg">No images generated yet. Start creating!</p>
            </div>
        )}

        <div className="mt-16 pt-10 border-t border-slate-200">
           <div className="flex items-center gap-3 mb-8 px-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg">
                 <i className="fa-solid fa-paintbrush"></i>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Professional Tools Directory</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {IMAGE_EDITING_SOFTWARE.map((soft, idx) => (
                 <a 
                   key={idx}
                   href={soft.url}
                   target="_blank"
                   rel="noreferrer"
                   className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden h-full"
                 >
                    <div className="flex items-center justify-between mb-4">
                       <div className={`w-14 h-14 rounded-2xl ${soft.color} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                          <i className={`fa-solid ${soft.icon}`}></i>
                       </div>
                       <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-100">
                          {soft.type}
                       </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2 group-hover:text-pink-600 transition-colors">
                       {soft.name}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                       {soft.description}
                    </p>
                    <div className="mt-auto w-full py-2 rounded-xl bg-slate-50 text-slate-600 font-bold text-xs text-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                       Visit Website
                    </div>
                 </a>
              ))}
           </div>
        </div>

        </div>
    </>
  );
};

export default ImageGenerator;
