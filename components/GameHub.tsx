
import React, { useState } from 'react';

const GAMES = [
  {
    id: 'subway',
    title: 'Subway Surfers',
    developer: 'Sybo',
    category: 'Action',
    url: 'https://poki.com/en/g/subway-surfers',
    image: 'https://images.unsplash.com/photo-1565514020176-db792379d32c?auto=format&fit=crop&w=600&q=80', // Street vibe
    icon: 'fa-train-subway',
    color: 'bg-blue-600',
    description: 'Dash as fast as you can! Dodge the oncoming trains.',
    badge: 'Popular'
  },
  {
    id: 'ludo',
    title: 'Ludo Hero',
    developer: 'MarketJS',
    category: 'Board',
    url: 'https://poki.com/en/g/ludo-hero',
    image: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd90d?auto=format&fit=crop&w=600&q=80', // Dice
    icon: 'fa-dice',
    color: 'bg-yellow-500',
    description: 'A modern version of the royal game of Pachisi.',
    badge: 'Multiplayer'
  },
  {
    id: 'temple',
    title: 'Temple Run 2',
    developer: 'Imangi',
    category: 'Runner',
    url: 'https://poki.com/en/g/temple-run-2',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', // Adventure
    icon: 'fa-person-running',
    color: 'bg-emerald-600',
    description: 'Navigate perilous cliffs, zip lines, mines, and forests.',
    badge: 'Classic'
  },
  {
    id: 'chess',
    title: 'Master Chess',
    developer: 'Codethislab',
    category: 'Strategy',
    url: 'https://poki.com/en/g/master-chess',
    image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80', // Chess
    icon: 'fa-chess',
    color: 'bg-slate-700',
    description: 'Think fast and checkmate your opponent.'
  },
  {
    id: 'stickman',
    title: 'Stickman Hook',
    developer: 'Madbox',
    category: 'Arcade',
    url: 'https://poki.com/en/g/stickman-hook',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80', // Arcade/Tech
    icon: 'fa-person-falling',
    color: 'bg-red-500',
    description: 'Swing through the levels like a spider.'
  },
  {
    id: 'candy',
    title: 'Candy Rain 5',
    developer: 'Softgames',
    category: 'Puzzle',
    url: 'https://poki.com/en/g/candy-rain-5',
    image: 'https://images.unsplash.com/photo-1582053433976-25c00369fc93?auto=format&fit=crop&w=600&q=80', // Candy
    icon: 'fa-candy-cane',
    color: 'bg-pink-500',
    description: 'Match candies in this sweet puzzle adventure.'
  }
];

const GameHub: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filteredGames = GAMES.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || g.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 animate-fade-in">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white p-10 md:p-14 text-center shadow-2xl border border-indigo-900">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-20 -mt-20 animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-indigo-300 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-gamepad"></i> Arcade Zone
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               Play & Relax
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
               Take a break from work. Enjoy our curated collection of casual web games, from runners to brain teasers.
            </p>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row justify-center gap-4 max-w-2xl mx-auto">
               <div className="relative flex-1">
                  <input 
                     type="text" 
                     placeholder="Search games..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-slate-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                  <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
               </div>
               <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white font-bold outline-none focus:bg-white/20 cursor-pointer"
               >
                  <option value="All" className="text-slate-900">All Categories</option>
                  <option value="Action" className="text-slate-900">Action</option>
                  <option value="Board" className="text-slate-900">Board</option>
                  <option value="Runner" className="text-slate-900">Runner</option>
                  <option value="Strategy" className="text-slate-900">Strategy</option>
                  <option value="Puzzle" className="text-slate-900">Puzzle</option>
               </select>
            </div>
         </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredGames.map((game, idx) => (
            <div key={idx} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
               <div className="h-48 overflow-hidden relative">
                  <img src={game.image} alt={game.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60"></div>
                  
                  {game.badge && (
                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-900 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm uppercase tracking-wide">
                        {game.badge}
                     </div>
                  )}

                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                     <div className={`w-10 h-10 rounded-xl ${game.color} flex items-center justify-center text-white text-lg shadow-lg`}>
                        <i className={`fa-solid ${game.icon}`}></i>
                     </div>
                     <div>
                        <h3 className="text-white font-bold text-lg leading-tight shadow-black drop-shadow-md">{game.title}</h3>
                        <p className="text-white/80 text-xs font-medium">{game.developer}</p>
                     </div>
                  </div>
               </div>
               
               <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{game.category}</span>
                     <div className="flex text-yellow-400 text-xs gap-0.5">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star-half-stroke"></i>
                     </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                     {game.description}
                  </p>
                  <a 
                     href={game.url} 
                     target="_blank" 
                     rel="noreferrer"
                     className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-center hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 group/btn"
                  >
                     Play Now <i className="fa-solid fa-play text-xs group-hover/btn:translate-x-1 transition-transform"></i>
                  </a>
               </div>
            </div>
         ))}
      </div>

      {filteredGames.length === 0 && (
         <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <i className="fa-solid fa-ghost text-4xl text-slate-300 mb-4"></i>
            <p className="text-slate-500 font-medium">No games found in this category.</p>
            <button onClick={() => {setSearch(''); setCategory('All');}} className="mt-4 text-indigo-600 font-bold hover:underline">View All Games</button>
         </div>
      )}

    </div>
  );
};

export default GameHub;
