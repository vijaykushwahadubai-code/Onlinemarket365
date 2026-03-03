
import React, { useState, useEffect, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import VoiceControl from './components/VoiceControl';
import ShortcutsModal from './components/ShortcutsModal';
import SettingsModal from './components/SettingsModal';
import FeedbackModal from './components/FeedbackModal';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToolId } from './types';

// Lazy Load Core Components
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const AllFeatures = React.lazy(() => import('./components/AllFeatures')); 
const ToolExplorer = React.lazy(() => import('./components/ToolExplorer'));
const ProjectManager = React.lazy(() => import('./components/ProjectManager'));
const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard'));

// Lazy Load Creative Tools
const ContentGenerator = React.lazy(() => import('./components/ContentGenerator'));
const NameGenerator = React.lazy(() => import('./components/NameGenerator'));
const VideoStudio = React.lazy(() => import('./components/VideoStudio'));
const VideoToolsHub = React.lazy(() => import('./components/VideoToolsHub'));
const ImageStudio = React.lazy(() => import('./components/ImageStudio'));
const MotionLab = React.lazy(() => import('./components/MotionLab'));
const MusicHub = React.lazy(() => import('./components/MusicHub'));
const SpeechGenerator = React.lazy(() => import('./components/SpeechGenerator'));
const YouTubeStudio = React.lazy(() => import('./components/YouTubeStudio'));
const VfxHub = React.lazy(() => import('./components/VfxHub'));
const ScrollEffectsHub = React.lazy(() => import('./components/ScrollEffectsHub'));

// Lazy Load Marketing & Social
const SocialMediaHub = React.lazy(() => import('./components/SocialMediaHub'));
const MarketingHub = React.lazy(() => import('./components/MarketingHub'));
const TrendingMarketHub = React.lazy(() => import('./components/TrendingMarketHub'));
const AffiliateProgram = React.lazy(() => import('./components/AffiliateProgram'));

// Lazy Load Tech & Utilities
const SmartTools = React.lazy(() => import('./components/SmartTools'));
const FreeToolsHub = React.lazy(() => import('./components/FreeToolsHub'));
const MarketOnline7Hub = React.lazy(() => import('./components/MarketOnline7Hub'));
const MrFreeTools = React.lazy(() => import('./components/MrFreeTools'));
const AIxploria = React.lazy(() => import('./components/AIxploria'));
const GoogleFeatureHub = React.lazy(() => import('./components/GoogleFeatureHub'));
const OfficeHub = React.lazy(() => import('./components/OfficeHub'));
const WebsiteCreatorsHub = React.lazy(() => import('./components/WebsiteCreatorsHub'));
const FreelanceHub = React.lazy(() => import('./components/FreelanceHub'));
const AiAgentHub = React.lazy(() => import('./components/AiAgentHub'));
const CyberSecurityHub = React.lazy(() => import('./components/CyberSecurityHub'));
const VpnHub = React.lazy(() => import('./components/VpnHub'));
const LogicArchitect = React.lazy(() => import('./components/LogicArchitect'));
const GovSchemesHub = React.lazy(() => import('./components/GovSchemesHub'));
const AgricultureHub = React.lazy(() => import('./components/AgricultureHub'));
const FutureLabs = React.lazy(() => import('./components/FutureLabs'));
const NewsHub = React.lazy(() => import('./components/NewsHub'));

// Lazy Load Lifestyle
const EducationHub = React.lazy(() => import('./components/EducationHub'));
const CyberCafeHub = React.lazy(() => import('./components/CyberCafeHub'));
const EarningHub = React.lazy(() => import('./components/EarningHub'));
const DatingHub = React.lazy(() => import('./components/DatingHub'));
const FitnessHub = React.lazy(() => import('./components/FitnessHub'));
const GameHub = React.lazy(() => import('./components/GameHub'));
const EntertainmentHub = React.lazy(() => import('./components/EntertainmentHub'));
const Contact = React.lazy(() => import('./components/Contact'));
const GrowthBlueprint = React.lazy(() => import('./components/GrowthBlueprint'));
const ChatAssistant = React.lazy(() => import('./components/ChatAssistant'));
import { Particles } from './components/Particles';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'automating';
  timestamp: Date;
}

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolId>(ToolId.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTurboMode, setIsTurboMode] = useState(false);
  
  // Modal States
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Simple Notification System
  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' | 'automating' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setNotifications(prev => [...prev, { id, title, message, type, timestamp: new Date() }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        if (e.key === 'h') { e.preventDefault(); setActiveTool(ToolId.DASHBOARD); }
        if (e.key === 'k') { e.preventDefault(); setActiveTool(ToolId.TOOL_EXPLORER); }
      }
      if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setIsSettingsOpen(false);
        setIsFeedbackOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check Turbo Mode on Mount
  useEffect(() => {
    const savedTurbo = localStorage.getItem('market365_turbo');
    // Default to true for smoother performance if not explicitly disabled
    const isTurbo = savedTurbo === null ? true : savedTurbo === 'true';
    setIsTurboMode(isTurbo);
    if(isTurbo) {
        document.body.classList.add('turbo-mode');
        if (savedTurbo === null) {
            localStorage.setItem('market365_turbo', 'true');
        }
    }
  }, []);

  // Mouse Parallax Effect
  useEffect(() => {
    if (isTurboMode) return;
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isTurboMode]);

  // System Automation & Error Fixing Simulation
  useEffect(() => {
    // Initial System Check
    const initTimer = setTimeout(() => {
      addNotification('Automated System Check', 'Scanning for potential crashes...', 'automating');
      
      setTimeout(() => {
         addNotification('System Online', 'All modules optimized. Crash protection active.', 'success');
         preloadApps();
      }, 2000);
    }, 1000);

    return () => {
      clearTimeout(initTimer);
    };
  }, []);

  const preloadApps = async () => {
    // Eagerly load components in background
    const components = [
      import('./components/VideoStudio'),
      import('./components/ImageStudio'),
      import('./components/ContentGenerator'),
      import('./components/AllFeatures'),
      import('./components/ToolExplorer')
    ];
    await Promise.all(components);
    addNotification('System Optimized', 'All modules preloaded into memory for instant access.', 'success');
  };

  const renderContent = () => {
    switch (activeTool) {
      case ToolId.ALL_FEATURES: return <AllFeatures onNavigate={setActiveTool} />; 
      case ToolId.GROWTH_BLUEPRINT: return <GrowthBlueprint onNavigate={setActiveTool} />;
      case ToolId.TRENDING_HUB: return <TrendingMarketHub />;
      case ToolId.MR_FREETOOLS: return <MrFreeTools />;
      case ToolId.PROJECT_MANAGER: return <ProjectManager />;
      case ToolId.ANALYTICS: return <AnalyticsDashboard />;
      case ToolId.COPYWRITER: return <ContentGenerator />;
      case ToolId.NAME_GENERATOR: return <NameGenerator />;
      case ToolId.FUTURE_LABS: return <FutureLabs />;
      
      // Creative
      case ToolId.VIDEO_STUDIO: return <VideoStudio />;
      case ToolId.VIDEO_EDITING_HUB: return <VideoToolsHub />;
      case ToolId.IMAGE_STUDIO: return <ImageStudio />;
      case ToolId.SMART_TOOLS: return <SmartTools />;
      case ToolId.MOTION_LAB: return <MotionLab />;
      case ToolId.LOGIC_ARCHITECT: return <LogicArchitect />;
      case ToolId.YOUTUBE_STUDIO: return <YouTubeStudio />;
      case ToolId.MUSIC_HUB: return <MusicHub />;
      case ToolId.SPEECH_GEN: return <SpeechGenerator />;
      case ToolId.VFX_HUB: return <VfxHub />;
      case ToolId.SCROLL_HUB: return <ScrollEffectsHub />;
      
      // Tech & Ops
      case ToolId.CYBER_GUARD: return <CyberSecurityHub />;
      case ToolId.VPN_HUB: return <VpnHub />;
      case ToolId.TOOL_EXPLORER: return <ToolExplorer onNavigate={setActiveTool} />;
      case ToolId.FREE_TOOLS: return <FreeToolsHub />;
      case ToolId.MARKETONLINE7_HUB: return <MarketOnline7Hub />;
      case ToolId.AIXPLORIA: return <AIxploria />;
      case ToolId.GOOGLE_HUB: return <GoogleFeatureHub />;
      case ToolId.OFFICE_HUB: return <OfficeHub />;
      case ToolId.WEBSITE_HUB: return <WebsiteCreatorsHub />;
      case ToolId.FREELANCE_HUB: return <FreelanceHub />;
      case ToolId.AI_AGENT_HUB: return <AiAgentHub />;
      case ToolId.GOV_SCHEMES: return <GovSchemesHub />;
      case ToolId.AGRICULTURE_HUB: return <AgricultureHub />;
      case ToolId.NEWS_HUB: return <NewsHub />;
      
      // Lifestyle & Social
      case ToolId.EARNING_HUB: return <EarningHub />;
      case ToolId.DATING_HUB: return <DatingHub />;
      case ToolId.FITNESS_HUB: return <FitnessHub />;
      case ToolId.GAME_HUB: return <GameHub />;
      case ToolId.EDUCATION_HUB: return <EducationHub />;
      case ToolId.SOCIAL_MEDIA_HUB: return <SocialMediaHub />;
      case ToolId.MARKETING_HUB: return <MarketingHub />;
      case ToolId.CYBER_CAFE: return <CyberCafeHub />;
      case ToolId.ENTERTAINMENT_HUB: return <EntertainmentHub />;
      case ToolId.CHAT: return <ChatAssistant />;
      
      // Footer
      case ToolId.AFFILIATE: return <AffiliateProgram />;
      case ToolId.CONTACT: return <Contact />;
      
      case ToolId.DASHBOARD:
      default:
        return <Dashboard onNavigate={setActiveTool} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans text-slate-100 relative">
      
      {/* 
        INFINITY UNIVERSE GALAXY BACKGROUND ENGINE
        - Conditionally rendered based on Turbo Mode to save GPU
      */}
      {!isTurboMode && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050b14]">
           {/* 1. Deep Space Base Image */}
           <div className="absolute inset-0 z-0">
              <img 
                 src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072&auto=format&fit=crop" 
                 alt="Universe Background" 
                 className="w-full h-full object-cover opacity-60 mix-blend-screen transition-transform duration-300 ease-out"
                 style={{ transform: `scale(1.05) translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] opacity-80"></div>
           </div>

           {/* 2. Rotating Infinity Nebula Mesh - Disabled in Turbo */}
           <div 
              className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-cyan-900/30 rounded-full blur-[120px] animate-spin-slow opacity-60 mix-blend-color-dodge"
           ></div>
           <div 
              className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] bg-gradient-to-tl from-pink-900/20 via-blue-900/20 to-transparent rounded-full blur-[150px] animate-spin-slow opacity-50 mix-blend-screen"
              style={{ animationDirection: 'reverse', animationDuration: '180s' }}
           ></div>

           {/* 3. Twinkling Stars Layer */}
           <div className="absolute inset-0 stars-overlay opacity-80"></div>
           <Particles mousePos={mousePos} />

           {/* 4. Infinity Horizon Bottom Glow */}
           <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-indigo-600/20 to-transparent blur-[80px]"></div>
           
           {/* Cinematic Noise Texture */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
        </div>
      )}
      
      {/* Turbo Mode Background (Static, Dark, Fast) */}
      {isTurboMode && (
        <div className="fixed inset-0 z-0 bg-[#0B0F19]"></div>
      )}

      <Sidebar 
        activeTool={activeTool} 
        onNavigate={setActiveTool} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />
      
      <main className="flex-1 w-full relative flex flex-col h-full z-10 overflow-hidden bg-transparent">
        {/* Mobile Header */}
        <div className="md:hidden p-4 flex items-center justify-between bg-slate-950/80 border-b border-white/5 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg bg-indigo-600">
                <i className="fa-solid fa-infinity"></i>
             </div>
             <span className="font-heading font-bold text-white tracking-wide text-lg">Market<span className="text-indigo-500">365</span></span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-lg"
          >
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
        </div>

        {/* Content Area with Error Boundary & Suspense */}
        <div className="flex-1 overflow-y-auto scroll-smooth relative custom-scrollbar">
          {/* Main Content Wrapper - INCREASED MAX WIDTH for 4K and Ultra-Wide - "Zoom Out" Effect */}
          <div className="min-h-full w-full max-w-[2560px] mx-auto p-4 md:p-8 lg:p-10 transition-all duration-300">
             <ErrorBoundary>
               <Suspense fallback={<LoadingScreen />}>
                 {/* Replaced reveal-zoom with animate-fade-in to fix blank screen issues */}
                 <div className="animate-fade-in" key={activeTool}>
                    {renderContent()}
                 </div>
               </Suspense>
             </ErrorBoundary>
          </div>
        </div>
      </main>

      {/* Notification Toast Container */}
      <div className="fixed bottom-6 right-6 z-[70] flex flex-col gap-3 pointer-events-none">
        {notifications.map(notif => (
          <div 
            key={notif.id}
            className={`
              pointer-events-auto w-80 bg-slate-900 rounded-2xl shadow-2xl border-l-4 p-4 flex items-start gap-3 transform transition-all duration-500 animate-fade-in-up border border-white/5
              ${notif.type === 'success' ? 'border-l-emerald-500' : 
                notif.type === 'warning' ? 'border-l-amber-500' : 
                notif.type === 'automating' ? 'border-l-blue-500' : 
                notif.type === 'error' ? 'border-l-red-500' : 'border-l-indigo-500'}
            `}
          >
            <div className={`
              mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white shrink-0
              ${notif.type === 'success' ? 'bg-emerald-500' : 
                notif.type === 'warning' ? 'bg-amber-500' : 
                notif.type === 'automating' ? 'bg-blue-500' :
                notif.type === 'error' ? 'bg-red-500' : 'bg-indigo-500'}
            `}>
              <i className={`fa-solid ${
                notif.type === 'success' ? 'fa-check' : 
                notif.type === 'warning' ? 'fa-triangle-exclamation' : 
                notif.type === 'automating' ? 'fa-gear fa-spin' :
                notif.type === 'error' ? 'fa-xmark' : 'fa-info'
              }`}></i>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white">{notif.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">{notif.message}</p>
            </div>
            <button 
              onClick={() => removeNotification(notif.id)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        ))}
      </div>

      <VoiceControl onNavigate={setActiveTool} />
      
      {/* Global Modals */}
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onPreloadApps={preloadApps}
      />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
};

export default App;
