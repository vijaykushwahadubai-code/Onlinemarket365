
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { EDUCATION_PLATFORMS, SIMPLILEARN_COURSES } from '../data/toolsData';

const UNIVERSITIES = [
  { name: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu', icon: 'fa-microchip', color: 'bg-red-700', desc: 'Free access to course materials from thousands of MIT courses.' },
  { name: 'Stanford Online', url: 'https://online.stanford.edu/free-courses', icon: 'fa-tree', color: 'bg-red-800', desc: 'Free online courses from Stanford University faculty.' },
  { name: 'Harvard Online', url: 'https://pll.harvard.edu/catalog/free', icon: 'fa-building-columns', color: 'bg-red-600', desc: 'Free courses in humanities, science, and business from Harvard.' },
  { name: 'Open Yale Courses', url: 'https://oyc.yale.edu', icon: 'fa-book-open', color: 'bg-blue-800', desc: 'Free and open access to introductory courses taught by Yale scholars.' },
  { name: 'Carnegie Mellon', url: 'https://oli.cmu.edu/courses', icon: 'fa-robot', color: 'bg-red-500', desc: 'Open Learning Initiative with independent learner courses.' },
  { name: 'UC Berkeley Class', url: 'https://airbear.berkeley.edu', icon: 'fa-bear', color: 'bg-blue-700', desc: 'Webcasts and course capture from UC Berkeley.' },
  { name: 'Princeton Online', url: 'https://online.princeton.edu', icon: 'fa-graduation-cap', color: 'bg-orange-600', desc: 'Online courses from Princeton faculty and experts.' },
  { name: 'Caltech', url: 'https://www.coursera.org/caltech', icon: 'fa-atom', color: 'bg-orange-500', desc: 'Science and engineering courses from California Institute of Technology.' },
  { name: 'Columbia University', url: 'https://online.columbia.edu', icon: 'fa-building', color: 'bg-blue-900', desc: 'Online programs and courses from Columbia University.' },
];

const EducationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'career' | 'assessment'>('career');
  const [careerGoal, setCareerGoal] = useState('');
  const [learningPlan, setLearningPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(SIMPLILEARN_COURSES[0].category);
  
  // Assessment State
  const [assessmentTopic, setAssessmentTopic] = useState('');
  const [assessmentResult, setAssessmentResult] = useState('');

  const handleGeneratePlan = async () => {
    if (!careerGoal.trim()) return;
    setLoading(true);
    setLearningPlan('');

    const prompt = `Create a structured 3-step learning path for someone who wants to become a "${careerGoal}". 
    For each step, recommend specific types of courses or certifications (mention Simplilearn or Coursera if relevant). 
    Keep it concise and actionable.`;
    
    try {
      const result = await generateText(prompt, "You are an expert Career Coach and Education Advisor.");
      setLearningPlan(result);
    } catch (e) {
      setLearningPlan("Unable to generate plan at the moment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssessment = async () => {
    if (!assessmentTopic.trim()) return;
    setLoading(true);
    setAssessmentResult('');

    const prompt = `Generate a short skill assessment quiz (3 questions) for the topic "${assessmentTopic}". After the questions, provide a "Learning Path Recommendation" based on potential beginner gaps.`;
    
    try {
      const result = await generateText(prompt, "You are an expert tutor creating diagnostic assessments.");
      setAssessmentResult(result);
    } catch (e) {
      setAssessmentResult("Error generating assessment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-16">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-10 md:p-14 text-center shadow-2xl border border-blue-800">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-cyan-300 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-graduation-cap"></i> Knowledge Center
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               Education & Learning Hub
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
               Upskill for the future. Explore top certifications, generate personalized study plans, and take AI-driven skill assessments.
            </p>
            
            <div className="flex justify-center gap-4">
               <button onClick={() => setActiveTab('career')} className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'career' ? 'bg-white text-blue-900' : 'bg-white/10 text-white'}`}>Career Coach</button>
               <button onClick={() => setActiveTab('assessment')} className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'assessment' ? 'bg-white text-blue-900' : 'bg-white/10 text-white'}`}>Skill Assessment</button>
            </div>
         </div>
      </div>

      {activeTab === 'career' ? (
      /* AI Career Coach */
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
         <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 h-full flex flex-col justify-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-4 -mt-4"></div>
               <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                     <i className="fa-solid fa-compass text-blue-600"></i> AI Career Coach
                  </h2>
                  <p className="text-slate-500 mb-6">Tell us your dream job, and we'll map out the path.</p>
                  
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ml-1">Your Career Goal</label>
                        <input 
                           type="text" 
                           value={careerGoal}
                           onChange={(e) => setCareerGoal(e.target.value)}
                           className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                           placeholder="e.g. Data Scientist, Digital Marketer..."
                           onKeyDown={(e) => e.key === 'Enter' && handleGeneratePlan()}
                        />
                     </div>
                     <button 
                        onClick={handleGeneratePlan}
                        disabled={loading || !careerGoal.trim()}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-blue-500/30'}`}
                     >
                        {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                        Generate Plan
                     </button>
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-7">
            {learningPlan ? (
               <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl h-full border border-slate-800 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                     <h3 className="font-bold text-xl text-cyan-400">Your Personalized Roadmap</h3>
                     <button onClick={() => navigator.clipboard.writeText(learningPlan)} className="text-xs font-bold text-slate-400 hover:text-white transition-colors"><i className="fa-regular fa-copy mr-1"></i> Save</button>
                  </div>
                  <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">
                     {learningPlan}
                  </div>
               </div>
            ) : (
               <div className="bg-slate-50 rounded-[2rem] p-8 border border-dashed border-slate-300 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl text-slate-300 shadow-sm mb-4">
                     <i className="fa-solid fa-lightbulb"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to start?</h3>
                  <p className="text-slate-500 max-w-sm">Enter your desired role on the left to get a custom curriculum generated by AI.</p>
               </div>
            )}
         </div>
      </section>
      ) : (
      /* Skill Assessment */
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
         <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
               <i className="fa-solid fa-clipboard-check text-cyan-600"></i> Skill Assessment
            </h2>
            <p className="text-slate-500 mb-6">Test your knowledge on any topic. The AI will generate specific questions to gauge your level.</p>
            <input 
               type="text" 
               value={assessmentTopic}
               onChange={(e) => setAssessmentTopic(e.target.value)}
               className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all font-medium text-slate-700 mb-4"
               placeholder="Topic (e.g. React Hooks, SEO, Python Basics)..."
            />
            <button 
               onClick={handleAssessment}
               disabled={loading || !assessmentTopic.trim()}
               className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${loading ? 'bg-slate-300' : 'bg-cyan-600 hover:bg-cyan-700'}`}
            >
               {loading ? 'Generating...' : 'Start Assessment'}
            </button>
         </div>
         <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">
            {assessmentResult ? (
               <div className="prose prose-slate max-w-none whitespace-pre-wrap">{assessmentResult}</div>
            ) : (
               <div className="text-center text-slate-400 mt-10">Results will appear here.</div>
            )}
         </div>
      </section>
      )}

      {/* Simplilearn Feature Section */}
      <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
         <div className="bg-[#1062FE] text-white p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#1062FE] text-4xl shadow-lg">
                     <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                  <div>
                     <h2 className="text-3xl font-extrabold">Simplilearn</h2>
                     <p className="text-blue-100 font-medium">Featured Partner • World's #1 Online Bootcamp</p>
                  </div>
               </div>
               <a href="https://www.simplilearn.com" target="_blank" rel="noreferrer" className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
                  Visit Website <i className="fa-solid fa-arrow-up-right-from-square ml-2 text-sm"></i>
               </a>
            </div>
         </div>

         <div className="p-8 md:p-12">
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
               {SIMPLILEARN_COURSES.map((cat, idx) => (
                  <button
                     key={idx}
                     onClick={() => setActiveCategory(cat.category)}
                     className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat.category ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                     {cat.category}
                  </button>
               ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
               {SIMPLILEARN_COURSES.find(c => c.category === activeCategory)?.courses.map((course, idx) => (
                  <div key={idx} className="group p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all cursor-default bg-slate-50 hover:bg-white">
                     <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
                           <i className="fa-solid fa-certificate"></i>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white px-2 py-1 rounded-md border border-slate-100">Certification</span>
                     </div>
                     <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">{course}</h3>
                     <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                        <span><i className="fa-solid fa-users mr-1"></i> Cohort Based</span>
                        <span><i className="fa-solid fa-clock mr-1"></i> Flexible</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Top Free University Courseware */}
      <section>
         <div className="flex items-center gap-3 mb-8 px-4">
            <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center text-lg">
               <i className="fa-solid fa-university"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Top Free University Courseware</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {UNIVERSITIES.map((uni, idx) => (
               <a 
                 key={idx}
                 href={uni.url}
                 target="_blank" 
                 rel="noreferrer"
                 className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
               >
                  <div className={`w-12 h-12 rounded-2xl ${uni.color} flex items-center justify-center text-white text-xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                     <i className={`fa-solid ${uni.icon}`}></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{uni.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">{uni.desc}</p>
                  <div className="flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                     Access Courses <i className="fa-solid fa-arrow-right ml-1"></i>
                  </div>
               </a>
            ))}
         </div>
      </section>

      {/* Other Platforms */}
      <section>
         <div className="flex items-center gap-3 mb-8 px-4">
            <i className="fa-solid fa-earth-americas text-2xl text-slate-400"></i>
            <h2 className="text-3xl font-bold text-slate-900">Global Learning Platforms</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EDUCATION_PLATFORMS.filter(p => p.name !== 'Simplilearn').map((platform, idx) => (
               <a 
                 key={idx}
                 href={platform.url}
                 target="_blank" 
                 rel="noreferrer"
                 className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
               >
                  <div className={`w-12 h-12 rounded-2xl ${platform.color} flex items-center justify-center text-white text-xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                     <i className={`fa-brands ${platform.icon.replace('fa-', '')} ${platform.icon}`}></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{platform.name}</h3>
                  <span className="inline-block mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{platform.type}</span>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">{platform.description}</p>
                  <div className="flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                     Explore <i className="fa-solid fa-arrow-right ml-1"></i>
                  </div>
               </a>
            ))}
         </div>
      </section>

    </div>
  );
};

export default EducationHub;
