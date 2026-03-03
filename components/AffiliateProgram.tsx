import React, { useState } from 'react';

const AffiliateProgram: React.FC = () => {
  const [referrals, setReferrals] = useState(10);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  // Constants for calculation
  const planPrice = 49; // Average monthly plan
  const commissionPercent = 0.30;
  const monthlyEarnings = Math.round(referrals * planPrice * commissionPercent);
  const yearlyEarnings = monthlyEarnings * 12;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setJoined(true);
      setTimeout(() => setJoined(false), 3000);
      setEmail('');
    }
  };

  const handleIconMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    e.currentTarget.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
  };

  const handleIconMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translate(0px, 0px) scale(1)';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12 animate-fade-in">
      
      {/* Hero Section */}
      <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white p-10 md:p-16 text-center shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500 via-purple-500 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-bold text-amber-300 mb-2">
            <i className="fa-solid fa-star"></i> Official Partner Program
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Partner with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">OnlineMarket365</span>
          </h1>
          <p className="text-xl text-slate-300 font-medium leading-relaxed">
            Join the fastest-growing AI platform. Earn 30% recurring commission for every customer you refer.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
             <button onClick={() => document.getElementById('join-form')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-1">
               Become a Partner
             </button>
             <button className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
               Log In
             </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-8 rounded-3xl border-t-4 border-indigo-500 hover:-translate-y-1 transition-transform duration-300">
           <div 
             className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-4 magnetic-icon"
             onMouseMove={handleIconMouseMove}
             onMouseLeave={handleIconMouseLeave}
           >
             <i className="fa-solid fa-percent"></i>
           </div>
           <h3 className="text-3xl font-extrabold text-slate-800 mb-1">30%</h3>
           <p className="text-slate-500 font-medium">Recurring Commission</p>
           <p className="text-xs text-slate-400 mt-2">Earn on every renewal, forever.</p>
        </div>
        <div className="glass-panel p-8 rounded-3xl border-t-4 border-cyan-500 hover:-translate-y-1 transition-transform duration-300">
           <div 
             className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl mb-4 magnetic-icon"
             onMouseMove={handleIconMouseMove}
             onMouseLeave={handleIconMouseLeave}
           >
             <i className="fa-solid fa-cookie-bite"></i>
           </div>
           <h3 className="text-3xl font-extrabold text-slate-800 mb-1">60 Days</h3>
           <p className="text-slate-500 font-medium">Cookie Duration</p>
           <p className="text-xs text-slate-400 mt-2">Get credit even if they buy later.</p>
        </div>
        <div className="glass-panel p-8 rounded-3xl border-t-4 border-emerald-500 hover:-translate-y-1 transition-transform duration-300">
           <div 
             className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-4 magnetic-icon"
             onMouseMove={handleIconMouseMove}
             onMouseLeave={handleIconMouseLeave}
           >
             <i className="fa-solid fa-money-bill-transfer"></i>
           </div>
           <h3 className="text-3xl font-extrabold text-slate-800 mb-1">Monthly</h3>
           <p className="text-slate-500 font-medium">Fast Payouts</p>
           <p className="text-xs text-slate-400 mt-2">PayPal or Direct Deposit.</p>
        </div>
      </div>

      {/* Earnings Calculator */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-12 items-center">
         <div className="flex-1 space-y-6 w-full">
            <h2 className="text-3xl font-bold text-slate-900">Calculate Potential Earnings</h2>
            <p className="text-slate-500 text-lg">See how much you could earn by referring new users to our Pro plan.</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700">Active Referrals</label>
                <span className="text-2xl font-bold text-indigo-600">{referrals}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="500" 
                value={referrals} 
                onChange={(e) => setReferrals(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 font-bold uppercase">
                <span>1 Referral</span>
                <span>500 Referrals</span>
              </div>
            </div>
         </div>

         <div className="bg-slate-900 text-white p-8 rounded-3xl w-full md:w-96 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 blur-3xl opacity-40 -mr-10 -mt-10"></div>
            <div className="relative z-10 text-center space-y-6">
               <div>
                 <p className="text-indigo-300 font-bold uppercase tracking-wider text-xs mb-1">Monthly Earnings</p>
                 <h3 className="text-4xl font-extrabold">${monthlyEarnings.toLocaleString()}</h3>
               </div>
               <div className="w-full h-px bg-white/10"></div>
               <div>
                 <p className="text-indigo-300 font-bold uppercase tracking-wider text-xs mb-1">Yearly Potential</p>
                 <h3 className="text-3xl font-bold text-emerald-400">${yearlyEarnings.toLocaleString()}</h3>
               </div>
               <p className="text-xs text-slate-400 mt-4">*Based on avg. customer lifetime</p>
            </div>
         </div>
      </div>

      {/* How It Works */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-slate-900">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
           <div className="p-6">
              <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center text-3xl text-indigo-600 mb-6 border border-slate-100">
                <span className="font-extrabold">1</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Join Program</h3>
              <p className="text-slate-500 leading-relaxed">Sign up in minutes. Get your unique referral link and access to our marketing dashboard.</p>
           </div>
           <div className="p-6">
              <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center text-3xl text-indigo-600 mb-6 border border-slate-100">
                <span className="font-extrabold">2</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Promote</h3>
              <p className="text-slate-500 leading-relaxed">Share your link on social media, blogs, or with friends. Use our ready-made banners.</p>
           </div>
           <div className="p-6">
              <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center text-3xl text-indigo-600 mb-6 border border-slate-100">
                <span className="font-extrabold">3</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Get Paid</h3>
              <p className="text-slate-500 leading-relaxed">Earn 30% commission on every sale. Withdraw your earnings monthly.</p>
           </div>
        </div>
      </div>

      {/* Join Form */}
      <div id="join-form" className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
         <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Start Earning Today</h2>
         
         {joined ? (
            <div className="bg-green-50 text-green-700 p-6 rounded-2xl text-center border border-green-100 animate-scale-in">
               <i className="fa-solid fa-circle-check text-4xl mb-3"></i>
               <h3 className="font-bold text-lg">Application Received!</h3>
               <p>Check your email for login details.</p>
            </div>
         ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <input type="text" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Website / Social (Optional)</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" placeholder="https://..." />
              </div>
              <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
                Apply Now
              </button>
              <p className="text-xs text-center text-slate-400 mt-4">By applying, you agree to our Affiliate Terms & Conditions.</p>
            </form>
         )}
      </div>

    </div>
  );
};

export default AffiliateProgram;