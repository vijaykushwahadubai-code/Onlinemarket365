
import React, { useState, useEffect, useRef } from 'react';

const MOTION_TOOLS = [
  { name: 'GSAP', desc: 'The standard for modern web animation.', url: 'https://greensock.com/gsap/', icon: 'fa-socks', color: 'bg-green-600' },
  { name: 'Three.js', desc: '3D programming for the web.', url: 'https://threejs.org/', icon: 'fa-cubes', color: 'bg-white text-black' },
  { name: 'Framer Motion', desc: 'Production-ready animation for React.', url: 'https://www.framer.com/motion/', icon: 'fa-f', color: 'bg-purple-600' },
  { name: 'LottieFiles', desc: 'Lightweight, scalable animations.', url: 'https://lottiefiles.com/', icon: 'fa-paper-plane', color: 'bg-teal-500' },
  { name: 'Spline', desc: '3D design tool for the web.', url: 'https://spline.design/', icon: 'fa-pen-ruler', color: 'bg-blue-600' },
  { name: 'Rive', desc: 'Build interactive animations that run anywhere.', url: 'https://rive.app/', icon: 'fa-bahai', color: 'bg-orange-600' },
  { name: 'Barba.js', desc: 'Fluid and smooth page transitions.', url: 'https://barba.js.org/', icon: 'fa-arrows-left-right', color: 'bg-slate-700' },
  { name: 'Locomotive', desc: 'Smooth scrolling library.', url: 'https://locomotive.ca/en', icon: 'fa-train', color: 'bg-black' },
];

const ScrollEffectsHub: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  
  // Update scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    // Initial set
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full relative overflow-hidden animate-fade-in bg-white rounded-[3rem]">
      
      {/* Section 1: Parallax Hero */}
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black rounded-t-[3rem]">
         <div 
            className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
         ></div>
         
         {/* Moving Gradient Orbs */}
         <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px] mix-blend-screen"
            style={{ transform: `translateY(${scrollY * -0.3}px) translateX(${scrollY * 0.1}px)` }}
         ></div>
         <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full blur-[120px] mix-blend-screen"
            style={{ transform: `translateY(${scrollY * -0.5}px) translateX(${scrollY * -0.2}px)` }}
         ></div>

         <div className="relative z-10 text-center mix-blend-overlay">
            <h1 
               className="text-[12rem] font-black text-white leading-none tracking-tighter"
               style={{ 
                  transform: `scale(${1 + scrollY * 0.0005})`, 
                  letterSpacing: `${-10 + scrollY * 0.05}px`,
                  opacity: Math.max(0, 1 - scrollY * 0.002)
               }}
            >
               MOTION
            </h1>
            <p 
               className="text-2xl font-bold text-white uppercase tracking-[1em] mt-4"
               style={{ 
                  transform: `translateY(${scrollY * 0.5}px)`, 
                  opacity: Math.max(0, 1 - scrollY * 0.003) 
               }}
            >
               Showcase
            </p>
         </div>
      </div>

      {/* Section 2: Marquee Text */}
      <div className="bg-indigo-600 py-12 overflow-hidden -mt-10 relative z-20 skew-y-3 origin-top-left shadow-2xl">
         <div className="whitespace-nowrap flex gap-12 animate-[marquee_15s_linear_infinite] text-6xl font-black text-white/90">
            <span>CREATE • DESIGN • INNOVATE • BUILD • LAUNCH • SCALE • </span>
            <span>CREATE • DESIGN • INNOVATE • BUILD • LAUNCH • SCALE • </span>
         </div>
      </div>

      {/* Section 3: Sticky Cards */}
      <div className="bg-slate-50 py-32 px-8">
         <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center mb-24">
               <h2 className="text-5xl font-black text-slate-900 mb-6">Sticky Stacking</h2>
               <p className="text-xl text-slate-500">Cards that stack as you scroll, creating a focused reading experience.</p>
            </div>

            {/* Card 1 */}
            <div className="sticky top-24 bg-white rounded-3xl p-10 shadow-2xl border border-slate-100 min-h-[400px] flex flex-col justify-center transition-transform hover:scale-[1.02] origin-top">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center text-4xl text-indigo-600">
                     <i className="fa-solid fa-layer-group"></i>
                  </div>
                  <h3 className="text-4xl font-bold text-slate-900">Layered Depth</h3>
               </div>
               <p className="text-xl text-slate-500 mt-6 leading-relaxed">
                  Depth creates hierarchy. By stacking elements, we guide the user's eye naturally through the content flow without overwhelming them.
               </p>
            </div>

            {/* Card 2 */}
            <div className="sticky top-32 bg-slate-900 text-white rounded-3xl p-10 shadow-2xl border border-slate-800 min-h-[400px] flex flex-col justify-center transition-transform hover:scale-[1.02] origin-top">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-pink-500 rounded-2xl flex items-center justify-center text-4xl text-white">
                     <i className="fa-solid fa-bolt"></i>
                  </div>
                  <h3 className="text-4xl font-bold">Velocity</h3>
               </div>
               <p className="text-xl text-slate-400 mt-6 leading-relaxed">
                  Speed matters. Elements reacting to scroll velocity feel organic and responsive, making the interface feel alive under your fingertips.
               </p>
            </div>

            {/* Card 3 */}
            <div className="sticky top-40 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl p-10 shadow-2xl border border-white/20 min-h-[400px] flex flex-col justify-center transition-transform hover:scale-[1.02] origin-top">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl text-white">
                     <i className="fa-solid fa-star"></i>
                  </div>
                  <h3 className="text-4xl font-bold">Focus</h3>
               </div>
               <p className="text-xl text-indigo-100 mt-6 leading-relaxed">
                  Sticky headers and cards ensure the most important content stays in view until the user is ready to move on.
               </p>
            </div>
         </div>
      </div>

      {/* Section 4: Horizontal Scroll Imitation */}
      <div className="bg-[#0f172a] py-32 overflow-hidden text-white relative">
         <div className="max-w-7xl mx-auto px-8 mb-16">
            <h2 className="text-5xl font-black mb-4">Perspective Grid</h2>
            <p className="text-slate-400 text-lg">3D transforms driven by scroll position.</p>
         </div>

         <div 
            className="flex gap-8 px-8"
            style={{ 
               transform: `translateX(-${(scrollY - 1500) * 0.5}px) perspective(1000px) rotateY(10deg)`, 
               opacity: Math.min(1, Math.max(0, (scrollY - 1200) / 500)) 
            }}
         >
            {[1, 2, 3, 4, 5].map((i) => (
               <div 
                  key={i} 
                  className="min-w-[400px] h-[500px] bg-slate-800 rounded-3xl border border-slate-700 p-8 flex flex-col justify-end shadow-2xl hover:bg-slate-700 transition-colors cursor-pointer group"
               >
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl mb-auto group-hover:scale-110 transition-transform">
                     <span className="font-bold">{i}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Card {i}</h3>
                  <p className="text-slate-400">Content reveals as you scroll horizontally across the canvas.</p>
               </div>
            ))}
         </div>
      </div>

      {/* Free Tools Directory */}
      <div className="bg-slate-100 py-32 px-8 relative z-10">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-black text-slate-900 mb-4">Essential Motion Libraries</h2>
               <p className="text-slate-500">Free, industry-standard tools to build these effects yourself.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {MOTION_TOOLS.map((tool, idx) => (
                  <a 
                     key={idx}
                     href={tool.url}
                     target="_blank"
                     rel="noreferrer"
                     className="group bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
                  >
                     <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center text-white text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <i className={`fa-solid ${tool.icon}`}></i>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-1">{tool.name}</h3>
                     <p className="text-sm text-slate-500 mb-4 flex-1">{tool.desc}</p>
                     <div className="flex items-center text-xs font-bold text-slate-900 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                        Visit Site <i className="fa-solid fa-arrow-right ml-2"></i>
                     </div>
                  </a>
               ))}
            </div>
         </div>
      </div>

      {/* Footer Reveal */}
      <div className="h-[50vh] flex items-center justify-center bg-white sticky bottom-0 -z-10">
         <div className="text-center">
            <h2 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">Ready to Build?</h2>
            <p className="text-xl text-slate-500 mb-8">Motion design is the future of web interaction.</p>
            <button className="px-10 py-4 bg-black text-white rounded-full font-bold text-lg hover:scale-105 transition-transform">
               Start Creating
            </button>
         </div>
      </div>
      
      {/* Spacer to allow footer reveal */}
      <div className="h-[50vh] bg-transparent pointer-events-none"></div>

    </div>
  );
};

export default ScrollEffectsHub;
