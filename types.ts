
export enum ToolId {
  DASHBOARD = 'DASHBOARD',
  ALL_FEATURES = 'ALL_FEATURES',
  GROWTH_BLUEPRINT = 'GROWTH_BLUEPRINT',
  TRENDING_HUB = 'TRENDING_HUB',
  MR_FREETOOLS = 'MR_FREETOOLS',
  LOGIC_ARCHITECT = 'LOGIC_ARCHITECT',
  COPYWRITER = 'COPYWRITER',
  NAME_GENERATOR = 'NAME_GENERATOR',
  
  // Merged Image Tools
  IMAGE_STUDIO = 'IMAGE_STUDIO',
  
  // Merged Video Tools
  VIDEO_STUDIO = 'VIDEO_STUDIO',
  
  MOTION_LAB = 'MOTION_LAB',
  MUSIC_HUB = 'MUSIC_HUB',
  SPEECH_GEN = 'SPEECH_GEN',
  SOCIAL_MEDIA_HUB = 'SOCIAL_MEDIA_HUB',
  MARKETING_HUB = 'MARKETING_HUB',
  CYBER_CAFE = 'CYBER_CAFE',
  CHAT = 'CHAT',
  TOOL_EXPLORER = 'TOOL_EXPLORER',
  FREE_TOOLS = 'FREE_TOOLS',
  EARNING_HUB = 'EARNING_HUB',
  DATING_HUB = 'DATING_HUB',
  GAME_HUB = 'GAME_HUB',
  ENTERTAINMENT_HUB = 'ENTERTAINMENT_HUB',
  NEWS_HUB = 'NEWS_HUB',
  
  // Merged Utilities
  SMART_TOOLS = 'SMART_TOOLS',
  
  AIXPLORIA = 'AIXPLORIA',
  GOOGLE_HUB = 'GOOGLE_HUB',
  YOUTUBE_STUDIO = 'YOUTUBE_STUDIO',
  CYBER_GUARD = 'CYBER_GUARD',
  VPN_HUB = 'VPN_HUB',
  OFFICE_HUB = 'OFFICE_HUB',
  WEBSITE_HUB = 'WEBSITE_HUB',
  FREELANCE_HUB = 'FREELANCE_HUB',
  AI_AGENT_HUB = 'AI_AGENT_HUB',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  ANALYTICS = 'ANALYTICS',
  VFX_HUB = 'VFX_HUB',
  VIDEO_EDITING_HUB = 'VIDEO_EDITING_HUB',
  EDUCATION_HUB = 'EDUCATION_HUB',
  FITNESS_HUB = 'FITNESS_HUB',
  AFFILIATE = 'AFFILIATE',
  CONTACT = 'CONTACT',
  GOV_SCHEMES = 'GOV_SCHEMES',
  AGRICULTURE_HUB = 'AGRICULTURE_HUB',
  FUTURE_LABS = 'FUTURE_LABS',
  SCROLL_HUB = 'SCROLL_HUB',
  MARKETONLINE7_HUB = 'MARKETONLINE7_HUB',
}

export interface NavItem {
  id: ToolId;
  label: string;
  icon: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  createdAt: Date;
}

export interface GeneratedVideo {
  url: string;
  prompt: string;
  createdAt: Date;
  aspectRatio: string;
}

export interface AiTool {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  promptTemplate: string;
  inputs: {
    key: string;
    label: string;
    placeholder: string;
  }[];
}

export interface ExternalTool {
  name: string;
  company: string;
  category: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  badge?: string;
}

export interface WebsiteResource {
  name: string;
  type: 'Builder' | 'Hosting' | 'Free Hosting' | 'Learning' | 'Domain' | 'Commerce' | 'Analytics' | 'Design';
  description: string;
  url: string;
  icon: string;
  color: string;
  features: string[];
}

export interface EarningPlatform {
  name: string;
  category: 'Read' | 'Watch' | 'Listen' | 'Play' | 'All';
  url: string;
  description: string;
  icon: string;
  color: string;
  payout: string;
  badge?: string;
}

export interface DatingPlatform {
  name: string;
  category: 'App' | 'Website' | 'Niche' | 'LGBTQ+';
  url: string;
  description: string;
  icon: string;
  color: string;
  badge?: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}
