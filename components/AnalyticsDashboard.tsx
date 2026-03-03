
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TimeRange = '7d' | '30d' | '90d';
type MetricType = 'revenue' | 'conversion' | 'visitors';

const DATA_SETS = {
  '7d': [
    { name: 'Mon', revenue: 4200, conversion: 2.1, visitors: 2100 },
    { name: 'Tue', revenue: 3800, conversion: 2.4, visitors: 1800 },
    { name: 'Wed', revenue: 5100, conversion: 2.8, visitors: 2600 },
    { name: 'Thu', revenue: 4800, conversion: 2.6, visitors: 2400 },
    { name: 'Fri', revenue: 6200, conversion: 3.2, visitors: 3100 },
    { name: 'Sat', revenue: 7400, conversion: 3.5, visitors: 3800 },
    { name: 'Sun', revenue: 6900, conversion: 3.1, visitors: 3400 },
  ],
  '30d': Array.from({ length: 15 }, (_, i) => ({
    name: `Day ${i * 2 + 1}`,
    revenue: Math.floor(Math.random() * 5000) + 3000,
    conversion: (Math.random() * 2 + 1.5).toFixed(1),
    visitors: Math.floor(Math.random() * 2000) + 1500,
  })),
  '90d': [
    { name: 'Jan', revenue: 45000, conversion: 2.4, visitors: 22000 },
    { name: 'Feb', revenue: 52000, conversion: 2.8, visitors: 28000 },
    { name: 'Mar', revenue: 49000, conversion: 2.6, visitors: 25000 },
    { name: 'Apr', revenue: 61000, conversion: 3.1, visitors: 33000 },
    { name: 'May', revenue: 58000, conversion: 2.9, visitors: 31000 },
    { name: 'Jun', revenue: 72000, conversion: 3.6, visitors: 41000 },
  ]
};

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [metric, setMetric] = useState<MetricType>('revenue');
  const [category, setCategory] = useState('E-commerce');
  
  // Real-time simulated metrics
  const [liveMetrics, setLiveMetrics] = useState({
    revenue: 12450,
    conversion: 3.2,
    visitors: 45200,
    agentsActive: 8
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        revenue: prev.revenue + Math.floor(Math.random() * 50),
        conversion: +(prev.conversion + (Math.random() * 0.1 - 0.05)).toFixed(2),
        visitors: prev.visitors + Math.floor(Math.random() * 10),
        agentsActive: prev.agentsActive
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getMetricColor = (m: MetricType) => {
    if (m === 'revenue') return '#10b981'; // emerald-500
    if (m === 'conversion') return '#3b82f6'; // blue-500
    return '#a855f7'; // purple-500
  };

  const getMetricLabel = (m: MetricType) => {
    if (m === 'revenue') return 'Revenue ($)';
    if (m === 'conversion') return 'Conversion Rate (%)';
    return 'Active Visitors';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-white text-xs">
          <p className="font-bold mb-1">{label}</p>
          <p style={{ color: payload[0].color }}>
            {getMetricLabel(metric)}: {metric === 'revenue' ? '$' : ''}{payload[0].value}{metric === 'conversion' ? '%' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-8 pb-12">
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
         <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Analytics Command</h2>
            <p className="text-slate-500">Real-time insights across your digital empire.</p>
         </div>
         <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            {['E-commerce', 'Marketing', 'Freelance'].map(cat => (
               <button
                 key={cat}
                 onClick={() => setCategory(cat)}
                 className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${category === cat ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
               >
                 {cat}
               </button>
            ))}
         </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Revenue Card */}
         <div 
            onClick={() => setMetric('revenue')}
            className={`bg-white p-6 rounded-3xl border shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all cursor-pointer ${metric === 'revenue' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-100'}`}
         >
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Revenue</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">${liveMetrics.revenue.toLocaleString()}</h3>
               </div>
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${metric === 'revenue' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                  <i className="fa-solid fa-sack-dollar"></i>
               </div>
            </div>
            <div className="text-xs font-bold text-emerald-500 flex items-center gap-1">
               <i className="fa-solid fa-arrow-trend-up"></i> +12.5% <span className="text-slate-300 font-medium">vs last week</span>
            </div>
         </div>

         {/* Conversion Card */}
         <div 
            onClick={() => setMetric('conversion')}
            className={`bg-white p-6 rounded-3xl border shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all cursor-pointer ${metric === 'conversion' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-100'}`}
         >
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Conversion Rate</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{liveMetrics.conversion}%</h3>
               </div>
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${metric === 'conversion' ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                  <i className="fa-solid fa-bolt"></i>
               </div>
            </div>
            <div className="text-xs font-bold text-blue-500 flex items-center gap-1">
               <i className="fa-solid fa-arrow-trend-up"></i> +0.8% <span className="text-slate-300 font-medium">vs last week</span>
            </div>
         </div>

         {/* Visitors Card */}
         <div 
            onClick={() => setMetric('visitors')}
            className={`bg-white p-6 rounded-3xl border shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all cursor-pointer ${metric === 'visitors' ? 'border-purple-500 ring-2 ring-purple-500/10' : 'border-slate-100'}`}
         >
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Active Visitors</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{liveMetrics.visitors.toLocaleString()}</h3>
               </div>
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${metric === 'visitors' ? 'bg-purple-100 text-purple-600' : 'bg-slate-50 text-slate-400'}`}>
                  <i className="fa-solid fa-users"></i>
               </div>
            </div>
            <div className="text-xs font-bold text-purple-500 flex items-center gap-1">
               <i className="fa-solid fa-eye"></i> Live <span className="text-slate-300 font-medium">now</span>
            </div>
         </div>

         {/* AI Agents Card */}
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">AI Agent ROI</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">45x</h3>
               </div>
               <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg"><i className="fa-solid fa-robot"></i></div>
            </div>
            <div className="text-xs font-bold text-orange-500 flex items-center gap-1">
               <i className="fa-solid fa-check"></i> {liveMetrics.agentsActive} Agents Active
            </div>
         </div>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm h-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
               <div>
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                     <span className={`w-3 h-3 rounded-full ${metric === 'revenue' ? 'bg-emerald-500' : metric === 'conversion' ? 'bg-blue-500' : 'bg-purple-500'}`}></span>
                     Performance Trend
                  </h3>
                  <p className="text-sm text-slate-500">{getMetricLabel(metric)} Analysis</p>
               </div>
               
               <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                  {(['7d', '30d', '90d'] as TimeRange[]).map(range => (
                     <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === range ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '3 Months'}
                     </button>
                  ))}
               </div>
            </div>
            
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={DATA_SETS[timeRange]}>
                     <defs>
                        <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor={getMetricColor(metric)} stopOpacity={0.2}/>
                           <stop offset="95%" stopColor={getMetricColor(metric)} stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12}} 
                        dy={10}
                     />
                     <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12}} 
                        dx={-10}
                     />
                     <Tooltip content={<CustomTooltip />} cursor={{ stroke: getMetricColor(metric), strokeWidth: 2 }} />
                     <Area 
                        type="monotone" 
                        dataKey={metric} 
                        stroke={getMetricColor(metric)} 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorMetric)" 
                        animationDuration={1500}
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2rem] p-8 text-white shadow-xl flex flex-col justify-between">
            <div>
               <h3 className="font-bold text-lg mb-2">Campaign Profitability</h3>
               <p className="text-slate-400 text-sm mb-6">Top performing campaigns.</p>
               
               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between text-xs font-bold mb-2">
                        <span>Summer Sale</span>
                        <span className="text-green-400">92% ROI</span>
                     </div>
                     <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div></div>
                  </div>
                  <div>
                     <div className="flex justify-between text-xs font-bold mb-2">
                        <span>New Product Launch</span>
                        <span className="text-blue-400">78% ROI</span>
                     </div>
                     <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: '78%'}}></div></div>
                  </div>
                  <div>
                     <div className="flex justify-between text-xs font-bold mb-2">
                        <span>Retargeting Ads</span>
                        <span className="text-purple-400">64% ROI</span>
                     </div>
                     <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full" style={{width: '64%'}}></div></div>
                  </div>
               </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-slate-300">Total Spend</span>
                  <span className="text-lg font-mono font-bold">$8,450</span>
               </div>
               <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                  View Full Report <i className="fa-solid fa-arrow-right"></i>
               </button>
            </div>
         </div>
      </div>

    </div>
  );
};

export default AnalyticsDashboard;
