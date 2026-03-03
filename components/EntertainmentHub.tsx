
import React, { useState } from 'react';

type Category = 'All' | 'Movies' | 'Sports' | 'Gaming' | 'Events';

const CATEGORIES: Category[] = ['All', 'Movies', 'Sports', 'Gaming', 'Events'];

const APPS = [
  { name: 'YouTube', url: 'https://www.youtube.com', icon: 'fa-youtube', color: 'text-red-500', bg: 'bg-white' },
  { name: 'Netflix', url: 'https://www.netflix.com', icon: 'fa-n', color: 'text-red-600', bg: 'bg-black' },
  { name: 'BookMyShow', url: 'https://in.bookmyshow.com', icon: 'fa-ticket', color: 'text-white', bg: 'bg-red-500' },
  { name: 'Disney+', url: 'https://www.hotstar.com', icon: 'fa-star', color: 'text-white', bg: 'bg-blue-900' },
  { name: 'Prime Video', url: 'https://www.primevideo.com', icon: 'fa-amazon', color: 'text-blue-400', bg: 'bg-slate-800' },
  { name: 'Twitch', url: 'https://www.twitch.tv', icon: 'fa-twitch', color: 'text-white', bg: 'bg-purple-600' },
  { name: 'SonyLIV', url: 'https://www.sonyliv.com', icon: 'fa-play', color: 'text-white', bg: 'bg-orange-500' },
  { name: 'JioCinema', url: 'https://www.jiocinema.com', icon: 'fa-circle-play', color: 'text-white', bg: 'bg-pink-600' },
];

const MOVIES = [
  { title: "Oppenheimer", genre: "Biography", rating: "9.4", img: "https://images.unsplash.com/photo-1596727147705-06a4688422fb?auto=format&fit=crop&w=600&q=80" },
  { title: "Avatar: Way of Water", genre: "Sci-Fi", rating: "8.9", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80" },
  { title: "John Wick 4", genre: "Action", rating: "9.0", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80" },
  { title: "Stranger Things", genre: "Horror", rating: "9.2", img: "https://images.unsplash.com/photo-1620510625142-b45cbb784397?auto=format&fit=crop&w=600&q=80" },
  { title: "The Mandalorian", genre: "Adventure", rating: "8.8", img: "https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?auto=format&fit=crop&w=600&q=80" },
];

const MATCHES = [
  { league: "ICC World Cup", t1: "IND", t2: "AUS", score: "285/4 - 190/2", status: "LIVE", color: "text-blue-400" },
  { league: "Premier League", t1: "MCI", t2: "LIV", score: "2 - 1", status: "88'", color: "text-green-400" },
];

const EVENTS = [
  { title: "Coldplay Concert", date: "Jan 24", city: "Mumbai", price: "₹4500", bg: "from-purple-600 to-indigo-600" },
  { title: "Comic Con", date: "Feb 12", city: "Delhi", price: "₹999", bg: "from-orange-500 to-red-600" },
];

const EntertainmentHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Category>('All');

  return (
    <div className="max-w-[1600px] mx-auto pb-16 animate-fade-in bg-[#0B0F19] min-h-screen text-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800">
      
      {/* 1. Cinematic Hero Section */}
      <div className="relative h-[550px] w-full group overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=1600&q=80" 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[10s]"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent"></div>
         <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-transparent to-transparent"></div>
         
         <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-3xl z-10">
            <span className="inline-block px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded mb-4">
               Trending #1
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight tracking-tight drop-shadow-2xl">
               JAWAN
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-300 font-medium mb-6">
               <span className="text-green-400 font-bold">98% Match</span>
               <span>2024</span>
               <span className="border border-slate-500 px-1 rounded text-xs">U/A 16+</span>
               <span>Action • Thriller</span>
            </div>
            <p className="text-slate-300 text-lg mb-8 line-clamp-2 max-w-xl">
               A high-octane action thriller outlining the emotional journey of a man who is set to rectify the wrongs in the society.
            </p>
            <div className="flex gap-4">
               <button className="px-8 py-3.5 bg-white text-black rounded-xl font-bold text-lg hover:bg-slate-200 transition-all flex items-center gap-2">
                  <i className="fa-solid fa-play"></i> Watch Now
               </button>
               <button className="px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2">
                  <i className="fa-solid fa-circle-info"></i> Details
               </button>
            </div>
         </div>
      </div>

      {/* 2. Quick Launch Dock (Mandatory Apps) */}
      <div className="px-8 -mt-12 relative z-20 mb-12">
         <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl flex items-center justify-between gap-4 overflow-x-auto custom-scrollbar shadow-2xl">
            {APPS.map((app, idx) => (
               <a 
                  key={idx}
                  href={app.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 min-w-[80px] group cursor-pointer"
               >
                  <div className={`w-14 h-14 rounded-2xl ${app.bg} flex items-center justify-center text-2xl shadow-lg group-hover:-translate-y-2 transition-transform duration-300`}>
                     <i className={`fa-brands ${app.icon} ${app.color}`}></i>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">{app.name}</span>
               </a>
            ))}
         </div>
      </div>

      {/* 3. Navigation Categories */}
      <div className="px-8 mb-10 sticky top-0 z-30 bg-[#0B0F19]/90 backdrop-blur-md py-4 border-b border-white/5">
         <div className="flex gap-2">
            {CATEGORIES.map(cat => (
               <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${activeTab === cat ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30 hover:text-white'}`}
               >
                  {cat}
               </button>
            ))}
         </div>
      </div>

      <div className="px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* LEFT CONTENT */}
         <div className="lg:col-span-8 space-y-12">
            
            {/* Movies Section */}
            {(activeTab === 'All' || activeTab === 'Movies') && (
               <section>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                     <i className="fa-solid fa-film text-indigo-500"></i> Top Rated Movies
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                     {MOVIES.map((movie, idx) => (
                        <div key={idx} className="group relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer bg-slate-900 border border-white/5">
                           <img src={movie.img} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                           <div className="absolute bottom-0 left-0 p-4 w-full">
                              <h3 className="text-white font-bold leading-tight mb-1 truncate">{movie.title}</h3>
                              <div className="flex justify-between items-center text-xs text-slate-400">
                                 <span>{movie.genre}</span>
                                 <span className="text-yellow-400 font-bold"><i className="fa-solid fa-star"></i> {movie.rating}</span>
                              </div>
                              <button className="mt-3 w-full py-2 bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md rounded-lg text-xs font-bold transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                                 Watch
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
            )}

            {/* Sports Section */}
            {(activeTab === 'All' || activeTab === 'Sports') && (
               <section>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                     <i className="fa-solid fa-trophy text-yellow-500"></i> Live Sports
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {MATCHES.map((match, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
                           <div className="flex justify-between items-center mb-4">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{match.league}</span>
                              <span className="text-[10px] font-bold bg-red-600/20 text-red-500 px-2 py-0.5 rounded animate-pulse">
                                 ● {match.status}
                              </span>
                           </div>
                           <div className="flex justify-between items-center">
                              <div className="text-center">
                                 <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white font-bold mb-2 mx-auto">
                                    {match.t1}
                                 </div>
                                 <span className="text-sm font-bold text-slate-300">{match.t1}</span>
                              </div>
                              <div className="text-center">
                                 <span className={`text-2xl font-mono font-black ${match.color} block`}>{match.score}</span>
                                 <span className="text-xs text-slate-500">VS</span>
                              </div>
                              <div className="text-center">
                                 <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white font-bold mb-2 mx-auto">
                                    {match.t2}
                                 </div>
                                 <span className="text-sm font-bold text-slate-300">{match.t2}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
            )}

         </div>

         {/* RIGHT SIDEBAR */}
         <div className="lg:col-span-4 space-y-10">
            
            {/* Gaming Widget */}
            <div className="bg-[#18181b] rounded-3xl p-6 border border-purple-500/20 shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full blur-[50px]"></div>
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-white flex items-center gap-2"><i className="fa-brands fa-twitch text-purple-500"></i> Live Gaming</h3>
                     <a href="https://twitch.tv" target="_blank" rel="noreferrer" className="text-xs text-purple-400 hover:text-white font-bold">All</a>
                  </div>
                  
                  <div className="aspect-video bg-black rounded-xl mb-4 relative group cursor-pointer border border-white/10">
                     <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Stream" />
                     <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">LIVE</div>
                     <div className="absolute bottom-2 left-2 text-xs font-bold text-white">Valorant Finals</div>
                  </div>

                  <div className="space-y-2">
                     <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                        <div>
                           <p className="text-xs font-bold text-white">Shroud</p>
                           <p className="text-[10px] text-slate-400">CS:GO • 12K Watching</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                        <div>
                           <p className="text-xs font-bold text-white">Ninja</p>
                           <p className="text-[10px] text-slate-400">Fortnite • 8K Watching</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Events Ticket Widget */}
            <div>
               <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-ticket text-pink-500"></i> Upcoming Events
               </h3>
               <div className="space-y-4">
                  {EVENTS.map((evt, idx) => (
                     <div key={idx} className="relative group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                        <div className={`absolute inset-0 bg-gradient-to-r ${evt.bg} rounded-2xl blur-sm opacity-50 group-hover:opacity-80 transition-opacity`}></div>
                        <div className="relative bg-[#1e1e24] rounded-2xl border border-white/10 flex overflow-hidden">
                           <div className="p-4 flex-1 border-r border-white/10 border-dashed">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{evt.city}</span>
                              <h4 className="text-lg font-bold text-white leading-tight mb-1">{evt.title}</h4>
                              <p className="text-xs text-slate-400">{evt.date} • {evt.price}</p>
                           </div>
                           <a href="https://in.bookmyshow.com" target="_blank" rel="noreferrer" className="w-12 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors">
                              <i className="fa-solid fa-chevron-right text-white/50 group-hover:text-white"></i>
                           </a>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

         </div>
      </div>

    </div>
  );
};

export default EntertainmentHub;
