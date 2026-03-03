
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { SOCIAL_MEDIA_PLATFORMS, MOCK_SOCIAL_POSTS } from '../data/toolsData';

type PostType = 'caption' | 'thread' | 'script' | 'hashtags' | 'bio' | 'youtube_script' | 'omni_channel';
type ToneType = 'Professional' | 'Casual' | 'Witty' | 'Viral' | 'Inspirational';

const SocialMediaHub: React.FC = () => {
  const [postType, setPostType] = useState<PostType>('caption');
  const [platform, setPlatform] = useState('Instagram');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<ToneType>('Viral');
  const [videoLength, setVideoLength] = useState('10 minutes');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedFilter, setFeedFilter] = useState('All');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setOutput('');

    let prompt = '';
    const systemInstruction = "You are a world-class social media strategist and copywriter.";

    switch (postType) {
      case 'caption':
        prompt = `Write an engaging ${platform} caption about: "${topic}". Tone: ${tone}. Include emojis and relevant hashtags.`;
        break;
      case 'thread':
        prompt = `Write a viral Twitter/X thread (5-7 tweets) about: "${topic}". Tone: ${tone}. Hook the reader in the first tweet.`;
        break;
      case 'script':
        prompt = `Write a 60-second video script for ${platform} (TikTok/Reels/Shorts) about: "${topic}". Include visual cues and spoken audio. Tone: ${tone}.`;
        break;
      case 'hashtags':
        prompt = `Generate a list of 30 high-performing hashtags for a ${platform} post about: "${topic}". Group them by reach (High, Medium, Niche).`;
        break;
      case 'bio':
        prompt = `Write 3 optimized bio options for a ${platform} profile based on this info: "${topic}". Use emojis and keep it within character limits.`;
        break;
      case 'youtube_script':
        prompt = `Write a comprehensive YouTube video script about: "${topic}". 
        Target Video Length: ${videoLength}. 
        Tone: ${tone}.
        Structure:
        1. Hook/Intro (Grab attention immediately)
        2. Main Content (Broken down into clear sections/points)
        3. Engagement (When to ask for likes/subs)
        4. Outro & Call to Action.
        Include visual cues/b-roll suggestions where appropriate.`;
        break;
      case 'omni_channel':
        prompt = `Repurpose the topic "${topic}" into 3 different formats for an Omni-Channel campaign.
        1. [Instagram/TikTok Reel Script]: 30 seconds, visual, hooky.
        2. [LinkedIn Post]: Professional yet engaging, focusing on value/insight.
        3. [Twitter Thread]: 3-5 punchy tweets.
        Tone: ${tone}. Label each section clearly.`;
        break;
    }

    try {
      const result = await generateText(prompt, systemInstruction);
      setOutput(result);
    } catch (e) {
      setOutput("Error generating content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = MOCK_SOCIAL_POSTS.filter(post => 
    feedFilter === 'All' || post.platform === feedFilter
  );

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-16">
      
      {/* Hero Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-pink-600 to-purple-700 text-white p-10 md:p-14 text-center shadow-2xl border border-pink-500">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
         
         <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-pink-100 uppercase tracking-widest mb-6">
               <i className="fa-solid fa-share-nodes"></i> Connect & Grow
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
               Social Media Hub
            </h1>
            <p className="text-lg md:text-xl text-pink-100 font-medium leading-relaxed max-w-2xl mx-auto">
               Your command center for social growth. Generate viral content, repurpose for omni-channel, and explore every platform.
            </p>
         </div>
      </div>

      {/* AI Strategist Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm h-full">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                 <i className="fa-solid fa-robot text-pink-600"></i> AI Strategist
              </h2>
              
              <div className="space-y-5">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Platform</label>
                    <div className="flex flex-wrap gap-2">
                       {['Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'YouTube', 'Facebook'].map(p => (
                          <button 
                             key={p}
                             onClick={() => setPlatform(p)}
                             className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border ${platform === p ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                          >
                             {p}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Content Type</label>
                    <select 
                       value={postType}
                       onChange={(e) => setPostType(e.target.value as PostType)}
                       className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-pink-500 outline-none text-sm font-bold text-slate-700"
                    >
                       <option value="caption">Post Caption</option>
                       <option value="omni_channel">Omni-Channel (Repurpose)</option>
                       <option value="thread">Viral Thread</option>
                       <option value="script">Short Video Script (Reels/TikTok)</option>
                       <option value="youtube_script">YouTube Long Script</option>
                       <option value="hashtags">Hashtag Generator</option>
                       <option value="bio">Profile Bio</option>
                    </select>
                 </div>

                 {postType === 'youtube_script' && (
                   <div className="animate-fade-in">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Video Length</label>
                      <input 
                        type="text" 
                        value={videoLength} 
                        onChange={(e) => setVideoLength(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-pink-500 outline-none text-sm font-bold text-slate-700"
                        placeholder="e.g. 10 minutes"
                      />
                   </div>
                 )}

                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Tone</label>
                    <div className="grid grid-cols-3 gap-2">
                       {['Professional', 'Casual', 'Witty', 'Viral', 'Inspirational'].map(t => (
                          <button 
                             key={t}
                             onClick={() => setTone(t as ToneType)}
                             className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all border ${tone === t ? 'bg-pink-50 text-pink-600 border-pink-200' : 'bg-white text-slate-500 border-slate-200'}`}
                          >
                             {t}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Input/Output */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                 {postType === 'omni_channel' ? 'Topic or Existing Content to Repurpose:' : 'What is your post about?'}
              </label>
              <div className="relative">
                 <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all h-32 resize-none text-slate-700 placeholder:text-slate-400"
                    placeholder="e.g. Launching my new coffee brand, Summer sale announcement, 5 tips for productivity..."
                 />
                 <div className="mt-4 flex justify-end">
                    <button 
                       onClick={handleGenerate}
                       disabled={loading || !topic.trim()}
                       className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700 hover:-translate-y-0.5 shadow-pink-500/30'}`}
                    >
                       {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                       {postType === 'omni_channel' ? 'Repurpose Content' : 'Generate Content'}
                    </button>
                 </div>
              </div>
           </div>

           {output && (
              <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100 animate-fade-in-up">
                 <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                    <h3 className="font-bold text-lg text-slate-800">Generated Result</h3>
                    <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs font-bold text-pink-600 hover:text-pink-800 bg-pink-50 px-3 py-1.5 rounded-lg"><i className="fa-regular fa-copy mr-1"></i> Copy</button>
                 </div>
                 <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-600 leading-relaxed">
                    {output}
                 </div>
              </div>
           )}
        </div>
      </section>

      {/* Live Feed & Analytics Section */}
      <section>
         {/* Connected Accounts Bar */}
         <div className="mb-8">
            <div className="flex items-center justify-between mb-4 px-2">
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Connected Channels</h3>
               <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  <i className="fa-solid fa-plus"></i> Connect New
               </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
               {['Instagram', 'Twitter', 'LinkedIn', 'YouTube', 'Facebook'].map((p, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                     <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm ${p === 'Instagram' ? 'bg-pink-600' : p === 'Twitter' ? 'bg-black' : p === 'LinkedIn' ? 'bg-blue-700' : p === 'Facebook' ? 'bg-blue-600' : 'bg-red-600'}`}>
                           <i className={`fa-brands fa-${p === 'Twitter' ? 'x-twitter' : p.toLowerCase()}`}></i>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-slate-800">{p}</p>
                        <p className="text-[9px] text-green-600 font-bold">Syncing...</p>
                     </div>
                  </div>
               ))}
               <button className="bg-slate-50 p-3 rounded-xl border border-dashed border-slate-300 flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-all">
                  <i className="fa-solid fa-plus"></i> <span className="text-xs font-bold">Add</span>
               </button>
            </div>
         </div>

         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-2">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center text-lg shadow-lg shadow-pink-500/20">
                  <i className="fa-solid fa-bolt"></i>
               </div>
               <div>
                  <h2 className="text-3xl font-bold text-slate-900">Recent Activity Feed</h2>
                  <p className="text-slate-500 text-sm">Monitor your latest posts and engagement metrics.</p>
               </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
               {['All', 'Instagram', 'Twitter / X', 'LinkedIn', 'YouTube', 'Facebook'].map((filter) => (
                  <button
                     key={filter}
                     onClick={() => setFeedFilter(filter)}
                     className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                        feedFilter === filter 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700'
                     }`}
                  >
                     {filter}
                  </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
               <div key={post.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col animate-fade-in-up">
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${post.bgColor} ${post.color}`}>
                           <i className={`fa-brands ${post.icon.replace('fa-brands ', '')} ${post.icon}`}></i>
                        </div>
                        <div>
                           <h4 className="font-bold text-sm text-slate-900">{post.handle}</h4>
                           <span className="text-xs text-slate-400 font-medium">{post.date}</span>
                        </div>
                     </div>
                     <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${post.likes > 1000 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {post.likes > 1000 ? 'High Impact' : 'Growing'}
                     </span>
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                     {post.content}
                  </p>
                  
                  {/* Calculated Engagement Rate (Mock) */}
                  <div className="mb-4">
                     <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">
                        <span>Engagement Score</span>
                        <span>{((post.likes + post.comments) / 100).toFixed(1)}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500" style={{ width: `${Math.min(((post.likes + post.comments) / 50), 100)}%` }}></div>
                     </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-4 text-xs font-bold text-slate-500">
                     <div className="flex items-center gap-1 hover:text-pink-500 transition-colors cursor-pointer" title="Likes">
                        <i className="fa-regular fa-heart text-sm"></i>
                        <span>{post.likes.toLocaleString()}</span>
                     </div>
                     <div className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer" title="Comments">
                        <i className="fa-regular fa-comment text-sm"></i>
                        <span>{post.comments.toLocaleString()}</span>
                     </div>
                     <div className="flex items-center gap-1 hover:text-green-500 transition-colors cursor-pointer" title="Shares">
                        <i className="fa-solid fa-share-nodes text-sm"></i>
                        <span>{post.shares.toLocaleString()}</span>
                     </div>
                     <button className="text-indigo-600 hover:text-indigo-800" title="Boost Post">
                        <i className="fa-solid fa-rocket"></i>
                     </button>
                  </div>
               </div>
            ))}
            
            {filteredPosts.length === 0 && (
               <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">No recent activity found for this platform.</p>
               </div>
            )}
         </div>
      </section>

      {/* Platform Directory */}
      <section>
         <div className="flex items-center gap-3 mb-8 px-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg">
               <i className="fa-solid fa-globe"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Platform Directory</h2>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SOCIAL_MEDIA_PLATFORMS.map((plat, idx) => (
               <a 
                 key={idx}
                 href={plat.url}
                 target="_blank"
                 rel="noreferrer"
                 className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
               >
                  <div className={`w-14 h-14 rounded-2xl ${plat.color} flex items-center justify-center text-white text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                     <i className={`fa-brands ${plat.icon}`}></i>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                     {plat.name}
                     <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                  </h3>
                  
                  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-3 w-fit">
                     {plat.category}
                  </span>
                  
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                     {plat.description}
                  </p>
               </a>
            ))}
         </div>
      </section>

    </div>
  );
};

export default SocialMediaHub;
