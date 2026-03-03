
import React, { useState } from 'react';
import { generateGroundedContent, generateText } from '../services/geminiService';

const CATEGORIES = [
  { id: 'Business', icon: 'fa-briefcase', color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'Education', icon: 'fa-graduation-cap', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { id: 'Health', icon: 'fa-heart-pulse', color: 'text-red-600', bg: 'bg-red-100' },
  { id: 'Agriculture', icon: 'fa-wheat', color: 'text-green-600', bg: 'bg-green-100' },
  { id: 'Housing', icon: 'fa-house', color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 'Startup', icon: 'fa-rocket', color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'Women', icon: 'fa-person-dress', color: 'text-pink-600', bg: 'bg-pink-100' },
  { id: 'Senior', icon: 'fa-person-cane', color: 'text-slate-600', bg: 'bg-slate-200' },
];

const GOV_PORTALS = [
  { name: 'USA.gov', url: 'https://www.usa.gov/benefits', icon: 'fa-flag-usa', color: 'bg-blue-800', desc: 'Official US government benefits, grants, and loans.' },
  { name: 'SSA.gov', url: 'https://www.ssa.gov', icon: 'fa-person-cane', color: 'bg-blue-900', desc: 'Social Security Administration benefits and services.' },
  { name: 'StudentAid.gov', url: 'https://studentaid.gov', icon: 'fa-user-graduate', color: 'bg-green-600', desc: 'Federal Student Aid for college and career school.' },
  { name: 'India.gov.in', url: 'https://www.india.gov.in/my-government/schemes', icon: 'fa-om', color: 'bg-orange-500', desc: 'National portal of India for government schemes.' },
  { name: 'MyGov.in', url: 'https://www.mygov.in', icon: 'fa-users', color: 'bg-teal-600', desc: 'Citizen engagement platform for the Government of India.' },
  { name: 'GOV.UK', url: 'https://www.gov.uk/browse/benefits', icon: 'fa-crown', color: 'bg-red-700', desc: 'United Kingdom government services and information.' },
  { name: 'Canada.ca Benefits', url: 'https://www.canada.ca/en/services/benefits.html', icon: 'fa-leaf', color: 'bg-red-600', desc: 'Government of Canada benefits finder.' },
  { name: 'MyGov Australia', url: 'https://my.gov.au', icon: 'fa-star', color: 'bg-green-700', desc: 'Simple and secure access to Australian government services.' },
  { name: 'Grants.gov', url: 'https://www.grants.gov', icon: 'fa-file-invoice-dollar', color: 'bg-blue-600', desc: 'Find and apply for US federal grants.' },
  { name: 'European Commission', url: 'https://ec.europa.eu/info/funding-tenders_en', icon: 'fa-euro-sign', color: 'bg-blue-500', desc: 'Funding and tenders opportunities across the EU.' },
];

const GovSchemesHub: React.FC = () => {
  const [country, setCountry] = useState('India');
  const [category, setCategory] = useState('Business');
  const [result, setResult] = useState('');
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Eligibility State
  const [showEligibility, setShowEligibility] = useState(false);
  const [userProfile, setUserProfile] = useState({ age: '', income: '', occupation: '' });
  const [eligibilityResult, setEligibilityResult] = useState('');
  const [eligibilityLoading, setEligibilityLoading] = useState(false);

  // Translation State
  const [language, setLanguage] = useState('English');
  const [translationLoading, setTranslationLoading] = useState(false);

  const handleSearch = async () => {
    if (!country.trim() || !category) return;
    setLoading(true);
    setResult('');
    setSources([]);
    setEligibilityResult('');
    setShowEligibility(false);

    const prompt = `Find active government schemes for ${category} in ${country}. 
    
    If multiple countries are entered (e.g. "USA, India"), group the schemes clearly by country with headings.
    
    For each scheme, provide:
    1. Scheme Name
    2. Brief Description (Benefits)
    3. Eligibility Criteria
    4. How to Apply
    
    Use Google Search to find the latest and most accurate information. Format the output clearly.`;

    try {
      const { text, sources: groundingSources } = await generateGroundedContent(prompt, 'search');
      setResult(text);
      setSources(groundingSources);
    } catch (e) {
      setResult("Unable to fetch schemes at the moment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEligibility = async () => {
    if (!result) return;
    setEligibilityLoading(true);
    
    const prompt = `Based on the following list of schemes: 
    ${result.substring(0, 2000)}...
    
    And the user profile:
    - Age: ${userProfile.age}
    - Annual Income: ${userProfile.income}
    - Occupation: ${userProfile.occupation}
    
    Determine which of the listed schemes the user is likely eligible for. 
    List the eligible schemes and explain why. Also list required documents for them.`;

    try {
      const response = await generateText(prompt, "You are a Government Benefits Caseworker.");
      setEligibilityResult(response);
    } catch (e) {
      setEligibilityResult("Could not calculate eligibility.");
    } finally {
      setEligibilityLoading(false);
    }
  };

  const handleTranslate = async (targetLang: string) => {
    if (!result || targetLang === language) return;
    setTranslationLoading(true);
    
    const prompt = `Translate the following text into ${targetLang}. Maintain formatting:
    ${result}`;

    try {
      const response = await generateText(prompt);
      setResult(response);
      setLanguage(targetLang);
    } catch (e) {
      alert("Translation failed.");
    } finally {
      setTranslationLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-12">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-slate-800 text-white p-10 md:p-14 text-center shadow-2xl border border-slate-700">
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-amber-300 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-landmark"></i> Official Benefits Finder
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               Government Schemes
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
               Discover financial aid, subsidies, grants, and support programs tailored to your needs. Powered by real-time search.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/10">
               <input 
                  type="text" 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter Country or Countries (e.g. USA, India, UK)"
                  className="flex-1 px-5 py-3 rounded-xl bg-white text-slate-900 font-bold outline-none border-none placeholder:text-slate-400"
               />
               <button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
               >
                  {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-magnifying-glass"></i>}
                  Find Schemes
               </button>
            </div>
         </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
         {CATEGORIES.map((cat) => (
            <button
               key={cat.id}
               onClick={() => { setCategory(cat.id); }}
               className={`p-4 rounded-2xl border transition-all flex items-center gap-3 text-left group ${category === cat.id ? 'bg-white border-amber-500 shadow-md ring-1 ring-amber-500/20' : 'bg-white border-slate-100 hover:border-slate-300'}`}
            >
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${cat.bg} ${cat.color}`}>
                  <i className={`fa-solid ${cat.icon}`}></i>
               </div>
               <span className={`font-bold text-sm ${category === cat.id ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{cat.id}</span>
            </button>
         ))}
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Main Result */}
         <div className="lg:col-span-8 space-y-6">
            {result ? (
               <>
                  <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100 animate-fade-in-up">
                     <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4 flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-xl">
                              <i className="fa-solid fa-scroll"></i>
                           </div>
                           <div>
                              <h3 className="font-bold text-xl text-slate-900">Available Schemes</h3>
                              <p className="text-xs text-slate-500">For {category} in {country}</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <select 
                              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none cursor-pointer"
                              onChange={(e) => handleTranslate(e.target.value)}
                              value={language}
                              disabled={translationLoading}
                           >
                              <option>English</option>
                              <option>Hindi</option>
                              <option>Spanish</option>
                              <option>French</option>
                              <option>Arabic</option>
                           </select>
                           <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                              <i className="fa-regular fa-copy mr-1"></i> Copy
                           </button>
                        </div>
                     </div>
                     
                     <div className={`prose prose-slate max-w-none leading-relaxed text-slate-700 ${translationLoading ? 'opacity-50' : ''}`}>
                        {result}
                     </div>

                     {sources.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-slate-100">
                           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Official Sources</h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {sources.slice(0, 4).map((source, idx) => (
                                 source.web ? (
                                    <a key={idx} href={source.web.uri} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-amber-300 transition-all group">
                                       <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                                          <i className="fa-solid fa-link text-xs"></i>
                                       </div>
                                       <div className="flex-1 min-w-0">
                                          <p className="text-xs font-bold text-slate-700 truncate group-hover:text-amber-700">{source.web.title}</p>
                                          <p className="text-[10px] text-slate-400 truncate">{source.web.uri}</p>
                                       </div>
                                       <i className="fa-solid fa-arrow-up-right-from-square text-xs text-slate-300 group-hover:text-amber-500"></i>
                                    </a>
                                 ) : null
                              ))}
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Eligibility Checker Module */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2rem] p-8 text-white shadow-xl animate-fade-in-up">
                     <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl flex items-center gap-2">
                           <i className="fa-solid fa-clipboard-check text-green-400"></i> Am I Eligible?
                        </h3>
                        <button onClick={() => setShowEligibility(!showEligibility)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                           <i className={`fa-solid fa-chevron-${showEligibility ? 'up' : 'down'}`}></i>
                        </button>
                     </div>
                     
                     {showEligibility && (
                        <div className="space-y-6 animate-fade-in">
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                 <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Your Age</label>
                                 <input 
                                    type="text" 
                                    placeholder="e.g. 25"
                                    value={userProfile.age}
                                    onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-slate-500 outline-none focus:border-green-500 transition-all"
                                 />
                              </div>
                              <div>
                                 <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Annual Income</label>
                                 <input 
                                    type="text" 
                                    placeholder="e.g. $30,000"
                                    value={userProfile.income}
                                    onChange={(e) => setUserProfile({...userProfile, income: e.target.value})}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-slate-500 outline-none focus:border-green-500 transition-all"
                                 />
                              </div>
                              <div>
                                 <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Occupation</label>
                                 <input 
                                    type="text" 
                                    placeholder="e.g. Student"
                                    value={userProfile.occupation}
                                    onChange={(e) => setUserProfile({...userProfile, occupation: e.target.value})}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-slate-500 outline-none focus:border-green-500 transition-all"
                                 />
                              </div>
                           </div>
                           
                           <button 
                              onClick={handleCheckEligibility}
                              disabled={eligibilityLoading}
                              className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                           >
                              {eligibilityLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-calculator"></i>} Check Eligibility
                           </button>

                           {eligibilityResult && (
                              <div className="bg-white/10 p-6 rounded-xl border border-white/10 mt-4 animate-fade-in">
                                 <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                                    {eligibilityResult}
                                 </div>
                              </div>
                           )}
                        </div>
                     )}
                  </div>
               </>
            ) : (
               <div className="h-full min-h-[400px] bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl text-slate-300 shadow-sm mb-4">
                     <i className="fa-solid fa-magnifying-glass-location"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Search for Benefits</h3>
                  <p className="text-slate-500 max-w-sm text-sm">
                     Enter your country (or multiple countries) and select a category to find active government schemes, grants, and subsidies.
                  </p>
               </div>
            )}
         </div>

         {/* Sidebar / Tips */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white border border-slate-800 shadow-xl">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-circle-info text-amber-400"></i> Why Check Schemes?
               </h3>
               <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex gap-3">
                     <i className="fa-solid fa-check text-green-400 mt-1"></i>
                     <span><strong>Financial Aid:</strong> Direct cash transfers or low-interest loans for businesses.</span>
                  </li>
                  <li className="flex gap-3">
                     <i className="fa-solid fa-check text-green-400 mt-1"></i>
                     <span><strong>Subsidies:</strong> Reduced costs on equipment, housing, or raw materials.</span>
                  </li>
                  <li className="flex gap-3">
                     <i className="fa-solid fa-check text-green-400 mt-1"></i>
                     <span><strong>Tax Benefits:</strong> Exemptions and deductions for startups and specific sectors.</span>
                  </li>
                  <li className="flex gap-3">
                     <i className="fa-solid fa-check text-green-400 mt-1"></i>
                     <span><strong>Skill Training:</strong> Free or subsidized education programs.</span>
                  </li>
               </ul>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-4">Popular Categories</h3>
               <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">MSME Loans</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">Student Scholarships</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">Farmer Subsidies</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">Women Entrepreneurs</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">Export Incentives</span>
               </div>
            </div>
         </div>
      </div>

      {/* Official Government Portals */}
      <section>
         <div className="flex items-center gap-3 mb-8 px-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg">
               <i className="fa-solid fa-building-columns"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Official Government Portals</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GOV_PORTALS.map((portal, idx) => (
               <a 
                 key={idx}
                 href={portal.url}
                 target="_blank" 
                 rel="noreferrer"
                 className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
               >
                  <div className={`w-12 h-12 rounded-2xl ${portal.color} flex items-center justify-center text-white text-xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                     <i className={`fa-solid ${portal.icon}`}></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{portal.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">{portal.desc}</p>
                  <div className="flex items-center text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
                     Visit Portal <i className="fa-solid fa-arrow-right ml-1"></i>
                  </div>
               </a>
            ))}
         </div>
      </section>

    </div>
  );
};

export default GovSchemesHub;
