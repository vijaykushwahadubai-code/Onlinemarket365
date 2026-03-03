
import React, { useState } from 'react';
import { generateGroundedContent, generateText, analyzeImage } from '../services/geminiService';

type Tab = 'schemes' | 'market' | 'advisor' | 'doctor';

const AGRI_RESOURCES = [
  { name: 'FAO (UN)', url: 'https://www.fao.org/home/en', icon: 'fa-earth-americas', color: 'bg-blue-600', desc: 'Food and Agriculture Organization of the United Nations.' },
  { name: 'USDA', url: 'https://www.usda.gov', icon: 'fa-flag-usa', color: 'bg-blue-800', desc: 'U.S. Department of Agriculture resources and grants.' },
  { name: 'e-NAM', url: 'https://www.enam.gov.in', icon: 'fa-shop', color: 'bg-green-600', desc: 'National Agriculture Market (India) for online trading.' },
  { name: 'CGIAR', url: 'https://www.cgiar.org', icon: 'fa-flask', color: 'bg-emerald-600', desc: 'Global research partnership for a food-secure future.' },
  { name: 'AgFunder', url: 'https://agfunder.com', icon: 'fa-seedling', color: 'bg-teal-600', desc: 'News and investment in FoodTech and AgTech.' },
  { name: 'World Bank Ag', url: 'https://www.worldbank.org/en/topic/agriculture', icon: 'fa-building-columns', color: 'bg-slate-600', desc: 'Data, projects, and research on global agriculture.' },
  { name: 'ISRO Ag', url: 'https://www.isro.gov.in/Applications.html', icon: 'fa-satellite', color: 'bg-orange-600', desc: 'Satellite remote sensing for crop monitoring.' },
  { name: 'John Deere Ops', url: 'https://www.deere.com/en/technology-products/precision-ag-technology/data-management/operations-center/', icon: 'fa-tractor', color: 'bg-green-700', desc: 'Farm management software and precision ag tech.' },
  { name: 'Climate FieldView', url: 'https://climate.com', icon: 'fa-cloud-sun-rain', color: 'bg-red-600', desc: 'Digital agriculture platform for data-driven decisions.' },
];

const AgricultureHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('schemes');
  
  // State for Schemes & Market (Grounded Search)
  const [region, setRegion] = useState('');
  const [commodity, setCommodity] = useState('');
  const [groundedResult, setGroundedResult] = useState('');
  const [sources, setSources] = useState<any[]>([]);
  
  // State for Advisor (Reasoning)
  const [soilType, setSoilType] = useState('');
  const [season, setSeason] = useState('');
  const [acres, setAcres] = useState('');
  const [advisorResult, setAdvisorResult] = useState('');

  // State for Disease Doctor (Multimodal)
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  
  const [loading, setLoading] = useState(false);

  // Weather Logic
  const handleGetWeather = async () => {
    if (!region.trim()) return;
    setLoading(true);
    setGroundedResult('');
    setSources([]);

    const prompt = `Get the detailed farming weather forecast for ${region} for the next 7 days. 
    Include:
    1. Rainfall probability
    2. Temperature highs/lows
    3. Humidity levels
    4. Advice for farmers based on this forecast.
    Use Google Search.`;

    try {
      const { text, sources: groundingSources } = await generateGroundedContent(prompt, 'search');
      setGroundedResult(text);
      setSources(groundingSources);
    } catch (e) {
      setGroundedResult("Weather data unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSchemes = async () => {
    if (!region.trim()) return;
    setLoading(true);
    setGroundedResult('');
    setSources([]);

    const prompt = `Find active government agriculture schemes and subsidies for farmers in ${region}. 
    Include details about:
    1. Scheme Name
    2. Benefits (Financial/Equipment)
    3. Eligibility
    4. Application Process
    
    Use Google Search for the latest official information.`;

    try {
      const { text, sources: groundingSources } = await generateGroundedContent(prompt, 'search');
      setGroundedResult(text);
      setSources(groundingSources);
    } catch (e) {
      setGroundedResult("Unable to fetch schemes. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckMarket = async () => {
    if (!region.trim() || !commodity.trim()) return;
    setLoading(true);
    setGroundedResult('');
    setSources([]);

    const prompt = `What is the current market price (mandi rate) of ${commodity} in ${region} today? 
    Also provide:
    1. Price trend (Up/Down) over the last week.
    2. Best nearby markets for selling.
    
    Use Google Search for real-time data.`;

    try {
      const { text, sources: groundingSources } = await generateGroundedContent(prompt, 'search');
      setGroundedResult(text);
      setSources(groundingSources);
    } catch (e) {
      setGroundedResult("Unable to fetch market prices.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetAdvice = async () => {
    if (!soilType.trim()) return;
    setLoading(true);
    setAdvisorResult('');

    const prompt = `You are an expert Agricultural Scientist and Farming Consultant.
    
    User Profile:
    - Region/Soil: ${soilType}
    - Season/Time: ${season}
    - Land Size: ${acres}
    
    Task:
    1. Recommend the best 3 crops to grow right now for maximum profit.
    2. Provide a brief cultivation guide for the top recommendation (Watering, Fertilizer, Harvest time).
    3. Suggest organic pest control methods.
    
    Keep the advice practical and easy to understand for a farmer.`;

    try {
      const text = await generateText(prompt, "You are a helpful farming assistant.");
      setAdvisorResult(text);
    } catch (e) {
      setAdvisorResult("Advisor is currently unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setDiagnosis('');
    }
  };

  const handleDiagnose = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setDiagnosis('');

    try {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onloadend = async () => {
            const base64data = reader.result as string;
            const prompt = "You are an expert Botanist and Plant Pathologist. Analyze this image of a plant. Identify the crop, diagnose any visible diseases, pests, or nutrient deficiencies. Provide 3 concrete steps to cure or treat the issue using both chemical and organic methods.";
            
            try {
               const result = await analyzeImage(base64data, prompt);
               setDiagnosis(result);
            } catch (err) {
               setDiagnosis("Could not analyze the image. Please try a clearer photo.");
            } finally {
               setLoading(false);
            }
        };
    } catch (e) {
        setDiagnosis("Error processing image.");
        setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-10">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-emerald-900 text-white p-10 md:p-14 text-center shadow-2xl border border-emerald-700">
         <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-emerald-300 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-wheat-awn"></i> Smart Agriculture
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               Farming Command Center
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
               Access real-time market prices, AI crop diagnosis, weather forecasts, and subsidies in one place.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
               <button 
                 onClick={() => { setActiveTab('schemes'); setGroundedResult(''); setSources([]); }}
                 className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'schemes' ? 'bg-white text-emerald-900 shadow-lg' : 'bg-emerald-800/50 text-emerald-100 hover:bg-emerald-800'}`}
               >
                  <i className="fa-solid fa-landmark"></i> Schemes
               </button>
               <button 
                 onClick={() => { setActiveTab('market'); setGroundedResult(''); setSources([]); }}
                 className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'market' ? 'bg-white text-emerald-900 shadow-lg' : 'bg-emerald-800/50 text-emerald-100 hover:bg-emerald-800'}`}
               >
                  <i className="fa-solid fa-sack-dollar"></i> Market
               </button>
               <button 
                 onClick={() => { setActiveTab('advisor'); setAdvisorResult(''); }}
                 className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'advisor' ? 'bg-white text-emerald-900 shadow-lg' : 'bg-emerald-800/50 text-emerald-100 hover:bg-emerald-800'}`}
               >
                  <i className="fa-solid fa-user-doctor"></i> Advisor
               </button>
               <button 
                 onClick={() => { setActiveTab('doctor'); setDiagnosis(''); setImagePreview(null); }}
                 className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${activeTab === 'doctor' ? 'bg-white text-emerald-900 shadow-lg' : 'bg-emerald-800/50 text-emerald-100 hover:bg-emerald-800'}`}
               >
                  <i className="fa-solid fa-stethoscope"></i> Crop Doctor
               </button>
            </div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Controls Sidebar */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm h-full">
               <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <i className={`fa-solid ${activeTab === 'schemes' ? 'fa-file-signature' : activeTab === 'market' ? 'fa-chart-line' : activeTab === 'doctor' ? 'fa-leaf' : 'fa-seedling'} text-emerald-600`}></i>
                  {activeTab === 'schemes' ? 'Find Subsidies' : activeTab === 'market' ? 'Rates & Weather' : activeTab === 'doctor' ? 'Identify Disease' : 'Farming Details'}
               </h2>

               {activeTab === 'schemes' && (
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">State / Region</label>
                        <input 
                           type="text" 
                           value={region}
                           onChange={(e) => setRegion(e.target.value)}
                           className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                           placeholder="e.g. Punjab, India"
                        />
                     </div>
                     <button 
                        onClick={handleSearchSchemes}
                        disabled={loading || !region.trim()}
                        className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                        {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-magnifying-glass"></i>}
                        Search Schemes
                     </button>
                  </div>
               )}

               {activeTab === 'market' && (
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Crop / Commodity</label>
                        <input 
                           type="text" 
                           value={commodity}
                           onChange={(e) => setCommodity(e.target.value)}
                           className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                           placeholder="e.g. Wheat, Cotton"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Market / Region</label>
                        <input 
                           type="text" 
                           value={region}
                           onChange={(e) => setRegion(e.target.value)}
                           className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                           placeholder="e.g. Nashik Mandi"
                        />
                     </div>
                     <div className="flex gap-2">
                        <button 
                           onClick={handleCheckMarket}
                           disabled={loading || !region.trim() || !commodity.trim()}
                           className="flex-1 py-3.5 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                           {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-indian-rupee-sign"></i>}
                           Price
                        </button>
                        <button 
                           onClick={handleGetWeather}
                           disabled={loading || !region.trim()}
                           className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                           <i className="fa-solid fa-cloud-sun"></i> Weather
                        </button>
                     </div>
                  </div>
               )}

               {activeTab === 'advisor' && (
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Region & Soil Type</label>
                        <input 
                           type="text" 
                           value={soilType}
                           onChange={(e) => setSoilType(e.target.value)}
                           className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                           placeholder="e.g. Black Soil, Maharashtra"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Current Season</label>
                        <input 
                           type="text" 
                           value={season}
                           onChange={(e) => setSeason(e.target.value)}
                           className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                           placeholder="e.g. Monsoon / Kharif"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Land Size (Acres)</label>
                        <input 
                           type="text" 
                           value={acres}
                           onChange={(e) => setAcres(e.target.value)}
                           className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none transition-all"
                           placeholder="e.g. 5 Acres"
                        />
                     </div>
                     <button 
                        onClick={handleGetAdvice}
                        disabled={loading || !soilType.trim()}
                        className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                        {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-clipboard-list"></i>}
                        Get Expert Advice
                     </button>
                  </div>
               )}

               {activeTab === 'doctor' && (
                  <div className="space-y-6">
                     <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all relative cursor-pointer">
                        <input 
                           type="file" 
                           accept="image/*" 
                           onChange={handleImageUpload}
                           className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        {imagePreview ? (
                           <img src={imagePreview} alt="Leaf" className="w-full h-40 object-contain rounded-lg" />
                        ) : (
                           <div className="text-slate-400">
                              <i className="fa-solid fa-camera text-4xl mb-3"></i>
                              <p className="text-xs font-bold uppercase">Upload Photo of Affected Plant</p>
                           </div>
                        )}
                     </div>
                     <button 
                        onClick={handleDiagnose}
                        disabled={loading || !selectedImage}
                        className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                        {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-microscope"></i>}
                        Diagnose Disease
                     </button>
                  </div>
               )}
            </div>
         </div>

         {/* Output Display */}
         <div className="lg:col-span-8">
            {(groundedResult || advisorResult || diagnosis) ? (
               <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100 animate-fade-in-up">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
                           <i className={`fa-solid ${activeTab === 'advisor' || activeTab === 'doctor' ? 'fa-robot' : 'fa-globe'}`}></i>
                        </div>
                        <div>
                           <h3 className="font-bold text-xl text-slate-900">
                              {activeTab === 'schemes' ? 'Available Schemes' : activeTab === 'market' ? 'Market & Weather' : activeTab === 'doctor' ? 'Diagnosis Report' : 'Expert Recommendation'}
                           </h3>
                           <p className="text-xs text-slate-500">
                              {activeTab === 'schemes' || activeTab === 'market' ? 'Sourced from Google Search' : 'AI Analysis'}
                           </p>
                        </div>
                     </div>
                     <button onClick={() => navigator.clipboard.writeText(groundedResult || advisorResult || diagnosis)} className="text-xs font-bold text-slate-400 hover:text-emerald-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <i className="fa-regular fa-copy mr-1"></i> Copy
                     </button>
                  </div>
                  
                  <div className="prose prose-slate max-w-none leading-relaxed text-slate-700">
                     {activeTab === 'doctor' ? diagnosis : activeTab === 'advisor' ? advisorResult : groundedResult}
                  </div>

                  {sources.length > 0 && (
                     <div className="mt-8 pt-6 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Verified Sources</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           {sources.slice(0, 4).map((source, idx) => (
                              source.web ? (
                                 <a key={idx} href={source.web.uri} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-emerald-300 transition-all group">
                                    <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                                       <i className="fa-solid fa-link text-xs"></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <p className="text-xs font-bold text-slate-700 truncate group-hover:text-emerald-700">{source.web.title}</p>
                                       <p className="text-[10px] text-slate-400 truncate">{source.web.uri}</p>
                                    </div>
                                    <i className="fa-solid fa-arrow-up-right-from-square text-xs text-slate-300 group-hover:text-emerald-500"></i>
                                 </a>
                              ) : null
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            ) : (
               <div className="h-full min-h-[400px] bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl text-slate-300 shadow-sm mb-4">
                     <i className={`fa-solid ${activeTab === 'schemes' ? 'fa-magnifying-glass-location' : activeTab === 'market' ? 'fa-chart-simple' : activeTab === 'doctor' ? 'fa-user-md' : 'fa-seedling'}`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">
                     {activeTab === 'schemes' ? 'Search for Benefits' : activeTab === 'market' ? 'Check Market & Weather' : activeTab === 'doctor' ? 'Diagnose Plant Issues' : 'Get Crop Advice'}
                  </h3>
                  <p className="text-slate-500 max-w-sm text-sm">
                     {activeTab === 'schemes' ? 'Enter your region to find active government schemes and subsidies.' : activeTab === 'market' ? 'Get real-time pricing and weather forecasts for your farm.' : activeTab === 'doctor' ? 'Upload a photo of a sick plant for instant diagnosis.' : 'Enter your soil and land details for expert farming tips.'}
                  </p>
               </div>
            )}
         </div>

      </div>

      {/* Global Agriculture Resources */}
      <section>
         <div className="flex items-center gap-3 mb-8 px-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg">
               <i className="fa-solid fa-globe"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Global Farming Resources</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AGRI_RESOURCES.map((res, idx) => (
               <a 
                 key={idx}
                 href={res.url}
                 target="_blank" 
                 rel="noreferrer"
                 className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
               >
                  <div className={`w-12 h-12 rounded-2xl ${res.color} flex items-center justify-center text-white text-xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                     <i className={`fa-solid ${res.icon}`}></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{res.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">{res.desc}</p>
                  <div className="flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                     Visit Website <i className="fa-solid fa-arrow-right ml-1"></i>
                  </div>
               </a>
            ))}
         </div>
      </section>

    </div>
  );
};

export default AgricultureHub;
