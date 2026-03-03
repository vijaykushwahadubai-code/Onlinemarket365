
import React, { useState } from 'react';
import { editImage } from '../services/geminiService';

const EXTERNAL_TOOLS = [
  { name: 'Remove.bg', url: 'https://www.remove.bg', icon: 'fa-layer-group', color: 'bg-blue-500' },
  { name: 'Adobe Express', url: 'https://www.adobe.com/express/feature/image/remove-background', icon: 'fa-infinity', color: 'bg-red-600' },
  { name: 'PhotoRoom', url: 'https://www.photoroom.com/background-remover', icon: 'fa-wand-magic-sparkles', color: 'bg-purple-600' },
  { name: 'Slazzer', url: 'https://www.slazzer.com', icon: 'fa-scissors', color: 'bg-indigo-500' },
];

const BackgroundRemover: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setResultUrl(null);
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError('');
    setResultUrl(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          // Send to Gemini with prompt to isolate subject
          const editedImage = await editImage(base64data, "remove the background and replace it with a solid white background, isolate the main subject cleanly");
          setResultUrl(editedImage);
        } catch (err) {
          setError("Failed to process image. Please try again.");
        } finally {
          setLoading(false);
        }
      };
    } catch (e) {
      setError("Error reading file.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12 animate-fade-in">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white p-10 md:p-14 text-center shadow-2xl border border-indigo-500/50">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-indigo-300 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-eraser"></i> AI Photo Editor
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               Background Remover
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
               Instantly isolate subjects from your photos using advanced AI models. Upload your image below.
            </p>
         </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Upload & Original */}
         <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col h-full">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
               <i className="fa-regular fa-image"></i> Original Image
            </h3>
            
            <div 
               onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
               onDragLeave={() => setIsDragging(false)}
               onDrop={handleDrop}
               className={`flex-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed relative overflow-hidden group min-h-[300px] transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[0.99] shadow-inner' : 'border-slate-200 bg-slate-50'}`}
            >
               {previewUrl ? (
                  <img src={previewUrl} alt="Original" className="w-full h-full object-contain p-4" />
               ) : (
                  <div className="text-center p-6 pointer-events-none">
                     <div className={`w-16 h-16 rounded-full shadow-md flex items-center justify-center text-3xl mb-4 mx-auto transition-transform ${isDragging ? 'bg-indigo-600 text-white scale-110' : 'bg-white text-indigo-500 group-hover:scale-110'}`}>
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                     </div>
                     <p className={`font-bold ${isDragging ? 'text-indigo-700' : 'text-slate-600'}`}>
                        {isDragging ? 'Drop Image Now' : 'Click or Drop Image Here'}
                     </p>
                     <p className="text-sm text-slate-400 mt-1">JPG, PNG supported</p>
                  </div>
               )}
               <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  title="Upload Image"
               />
            </div>

            <div className="mt-6">
               <button 
                  onClick={handleRemoveBackground}
                  disabled={loading || !selectedFile}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${loading || !selectedFile ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 shadow-indigo-500/30'}`}
               >
                  {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                  Remove Background
               </button>
               {error && <p className="text-red-500 text-sm mt-3 text-center font-bold">{error}</p>}
            </div>
         </div>

         {/* Result */}
         <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col h-full">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
               <i className="fa-solid fa-check-circle text-green-500"></i> Processed Result
            </h3>
            
            <div className="flex-1 flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] rounded-2xl border border-slate-200 relative overflow-hidden min-h-[300px]">
               {loading ? (
                  <div className="text-center">
                     <i className="fa-solid fa-circle-notch fa-spin text-4xl text-indigo-500 mb-4"></i>
                     <p className="font-bold text-slate-600">Processing Image...</p>
                     <p className="text-xs text-slate-400 mt-1">This uses Generative AI (Gemini)</p>
                  </div>
               ) : resultUrl ? (
                  <img src={resultUrl} alt="Processed" className="w-full h-full object-contain p-4" />
               ) : (
                  <div className="text-center text-slate-400">
                     <i className="fa-solid fa-image text-4xl mb-3 opacity-30"></i>
                     <p>Result will appear here</p>
                  </div>
               )}
            </div>

            <div className="mt-6">
               <a 
                  href={resultUrl || '#'}
                  download={`removed-bg-${Date.now()}.png`}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${!resultUrl ? 'bg-slate-300 cursor-not-allowed pointer-events-none' : 'bg-green-600 hover:bg-green-700 hover:-translate-y-0.5 shadow-green-500/30'}`}
               >
                  <i className="fa-solid fa-download"></i> Download Image
               </a>
            </div>
         </div>
      </div>

      {/* External Tools Directory */}
      <section>
         <div className="flex items-center gap-4 mb-8 px-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg">
               <i className="fa-solid fa-toolbox"></i>
            </div>
            <div>
               <h2 className="text-2xl font-bold text-slate-900">Alternative Tools</h2>
               <p className="text-sm text-slate-500">Other trusted background removal services.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXTERNAL_TOOLS.map((tool, idx) => (
               <a 
                  key={idx}
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center"
               >
                  <div className={`w-14 h-14 rounded-full ${tool.color} flex items-center justify-center text-white text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                     <i className={`fa-solid ${tool.icon}`}></i>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{tool.name}</h3>
                  <div className="mt-auto flex items-center text-xs font-bold text-indigo-600 pt-2">
                     Open Tool <i className="fa-solid fa-arrow-right ml-1 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                  </div>
               </a>
            ))}
         </div>
      </section>

    </div>
  );
};

export default BackgroundRemover;
