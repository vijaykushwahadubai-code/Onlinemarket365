
import React, { useState, useMemo } from 'react';
import { ToolId } from '../types';
import { MAIN_NAV, CREATIVE_NAV, TOOLS_NAV, LIFESTYLE_NAV, FOOTER_NAV } from '../data/navigation';

interface AllFeaturesProps {
  onNavigate: (tool: ToolId) => void;
}

type CategoryTab = 'All' | 'Core' | 'Creative' | 'Tools' | 'Lifestyle' | 'Info';

const ITEMS_PER_PAGE = 12;

const AllFeatures: React.FC<AllFeaturesProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Flatten and tag all items. 
  const allItems = useMemo(() => {
    return [
      ...MAIN_NAV.map(i => ({ ...i, category: 'Core' })),
      ...CREATIVE_NAV.map(i => ({ ...i, category: 'Creative' })),
      ...TOOLS_NAV.map(i => ({ ...i, category: 'Tools' })),
      ...LIFESTYLE_NAV.map(i => ({ ...i, category: 'Lifestyle' })),
      ...FOOTER_NAV.map(i => ({ ...i, category: 'Info' })),
    ];
  }, []);

  // Filter items based on tab and search
  const filteredItems = useMemo(() => {
    let items = allItems;

    if (activeTab !== 'All') {
      items = items.filter(item => item.category === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.label.toLowerCase().includes(q) || 
        (item.desc && item.desc.toLowerCase().includes(q))
      );
    }

    return items;
  }, [allItems, activeTab, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (tab: CategoryTab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to page 1 on tab switch
  };

  const getTabIcon = (tab: CategoryTab) => {
    switch (tab) {
      case 'All': return 'fa-layer-group';
      case 'Core': return 'fa-cube';
      case 'Creative': return 'fa-wand-magic-sparkles';
      case 'Tools': return 'fa-toolbox';
      case 'Lifestyle': return 'fa-mug-hot';
      case 'Info': return 'fa-circle-info';
      default: return 'fa-circle';
    }
  };

  return (
    <div className="max-w-full mx-auto pb-12 animate-fade-in space-y-8 px-4 md:px-8 p-6 rounded-[3rem] border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)] bg-[#0B0F19]/50 backdrop-blur-sm">
      
      {/* Hero Header */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-center text-white relative overflow-hidden shadow-2xl border border-slate-800">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">App Library</h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed mb-8">
               Browse our complete ecosystem of AI agents, creative suites, and productivity tools.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto">
               <input 
                  type="text" 
                  placeholder="Search apps..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 shadow-lg font-medium"
               />
               <i className="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
            </div>
         </div>
      </div>

      {/* Tabs Navigation (Page by Page Category) */}
      <div className="flex flex-wrap justify-center gap-2 sticky top-4 z-20 bg-slate-50/90 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-sm w-fit mx-auto">
        {(['All', 'Core', 'Creative', 'Tools', 'Lifestyle', 'Info'] as CategoryTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`
              px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2
              ${activeTab === tab 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:text-indigo-600 hover:bg-white'}
            `}
          >
            <i className={`fa-solid ${getTabIcon(tab)}`}></i>
            {tab}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      <div className="min-h-[400px]">
        {paginatedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col h-full relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-2xl transition-colors shadow-sm">
                    <i className={item.icon}></i>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                    {item.category}
                  </span>
                </div>
                
                <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors relative z-10">{item.label}</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1 relative z-10">{item.desc}</p>
                
                <div className="mt-auto flex items-center text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 relative z-10">
                   Open App <i className="fa-solid fa-arrow-right ml-2"></i>
                </div>

                {/* Decorative Hover Blob */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors"></div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
             <i className="fa-solid fa-ghost text-4xl text-slate-300 mb-4"></i>
             <p className="text-slate-500 font-medium">No apps found matching "{searchQuery}"</p>
             <button onClick={() => setSearchQuery('')} className="mt-4 text-indigo-600 font-bold hover:underline">Clear Search</button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
           <button 
             onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
             disabled={currentPage === 1}
             className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
           >
             <i className="fa-solid fa-chevron-left"></i>
           </button>
           
           <span className="text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
             Page {currentPage} of {totalPages}
           </span>

           <button 
             onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
             disabled={currentPage === totalPages}
             className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
           >
             <i className="fa-solid fa-chevron-right"></i>
           </button>
        </div>
      )}

    </div>
  );
};

export default AllFeatures;
