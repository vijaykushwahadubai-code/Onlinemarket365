
import React, { useState } from 'react';

const FormTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-2 align-middle">
    <i className="fa-solid fa-circle-info text-slate-400 hover:text-indigo-600 cursor-help transition-colors text-sm" aria-label="More info"></i>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-slate-900 text-white text-xs font-medium leading-relaxed rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:-translate-y-2 z-50 text-center pointer-events-none border border-slate-800">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-8 border-transparent border-t-slate-900"></div>
    </div>
  </div>
);

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation Logic
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill out all fields before sending.');
      return;
    }

    // Basic Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    
    // Simulate form submission
    setTimeout(() => setSent(true), 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="text-center py-8">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Contact & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Owner Info</span>
        </h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">
          Get in touch with the team behind OnlineMarket365. We are here to help you succeed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border border-white/50">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-envelope-open-text text-indigo-600"></i> Send a Message
          </h3>
          
          {sent ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-green-50 rounded-2xl border border-green-100 animate-scale-in">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mb-4">
                 <i className="fa-solid fa-check"></i>
               </div>
               <h4 className="text-xl font-bold text-slate-800 mb-2">Message Sent!</h4>
               <p className="text-slate-600">Thank you for contacting us. We will get back to you shortly.</p>
               <button 
                 onClick={() => { setSent(false); setFormData({name: '', email: '', message: ''}); }}
                 className="mt-6 text-sm font-bold text-green-700 hover:text-green-800 underline"
               >
                 Send another message
               </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Your Name
                  <FormTooltip text="Enter your full name so we know who to address in our response." />
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => {
                    setFormData({...formData, name: e.target.value});
                    if (error) setError('');
                  }}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Email Address
                  <FormTooltip text="We'll send our reply to this email. Your address is safe with us." />
                </label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => {
                    setFormData({...formData, email: e.target.value});
                    if (error) setError('');
                  }}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Message
                  <FormTooltip text="Please provide detailed information about your inquiry or feedback." />
                </label>
                <textarea 
                  rows={4}
                  required
                  value={formData.message}
                  onChange={e => {
                    setFormData({...formData, message: e.target.value});
                    if (error) setError('');
                  }}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 flex items-center gap-2 animate-fade-in">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {error}
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Owner Info & Socials */}
        <div className="space-y-8">
           {/* Owner Card */}
           <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full -mr-20 -mt-20 blur-3xl opacity-30"></div>
             <div className="relative z-10">
               <h3 className="text-2xl font-bold mb-4">About the Owner</h3>
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
                   <i className="fa-solid fa-user-tie"></i>
                 </div>
                 <div>
                   <h4 className="text-xl font-bold">OnlineMarket365</h4>
                   <p className="text-indigo-300">Premier Digital Solutions</p>
                 </div>
               </div>
               <p className="text-slate-300 leading-relaxed mb-6">
                 OnlineMarket365 is a leading provider of AI-driven tools tailored for freelancers, entrepreneurs, and businesses. We aim to democratize access to advanced technology, making learning, e-commerce, and digital creation accessible to everyone.
               </p>
               <div className="flex flex-wrap gap-3">
                 <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">Est. 2024</span>
                 <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">San Francisco, CA</span>
                 <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">Tech & AI</span>
               </div>
             </div>
           </div>

           {/* Social Media Links */}
           <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border border-white/50">
             <h3 className="text-xl font-bold text-slate-800 mb-6">Follow Us</h3>
             <div className="grid grid-cols-2 gap-4">
               <a href="#" className="flex items-center gap-3 p-4 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all group">
                 <i className="fa-brands fa-facebook text-2xl"></i>
                 <span className="font-bold">Facebook</span>
               </a>
               <a href="#" className="flex items-center gap-3 p-4 rounded-xl bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all group">
                 <i className="fa-brands fa-twitter text-2xl"></i>
                 <span className="font-bold">Twitter</span>
               </a>
               <a href="#" className="flex items-center gap-3 p-4 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all group">
                 <i className="fa-brands fa-linkedin text-2xl"></i>
                 <span className="font-bold">LinkedIn</span>
               </a>
               <a href="#" className="flex items-center gap-3 p-4 rounded-xl bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-all group">
                 <i className="fa-brands fa-instagram text-2xl"></i>
                 <span className="font-bold">Instagram</span>
               </a>
             </div>
             
             <div className="mt-6 pt-6 border-t border-slate-100">
               <div className="flex items-center gap-3 text-slate-600 mb-2">
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                   <i className="fa-solid fa-envelope"></i>
                 </div>
                 <span className="font-medium">support@onlinemarket365.com</span>
               </div>
               <div className="flex items-center gap-3 text-slate-600">
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                   <i className="fa-solid fa-globe"></i>
                 </div>
                 <span className="font-medium">www.onlinemarket365.com</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
