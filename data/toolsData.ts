
import { AiTool, ExternalTool, WebsiteResource, EarningPlatform, DatingPlatform } from '../types';

export const TOOL_CATEGORIES = [
  'Coding', 'Web Dev', 'DevOps', 'Data Science', 'Cloud', 'Cyber Security',
  'Marketing', 'Business', 'Freelance', 'Writing', 'Productivity', 'Design', 
  'Social Media', 'Education', 'Lifestyle', 'Finance', 
  'HR & Legal', 'App Development', 'Utilities', 'Mr. Freetools'
];

export const ALL_TOOLS: AiTool[] = [
  // --- EXISTING MARKETING & CORE ---
  {
    id: 'mkt-1',
    title: 'Ad Copy Generator',
    description: 'Create compelling ad copy for Facebook, Google, and Instagram ads.',
    category: 'Marketing',
    icon: 'fa-bullhorn',
    promptTemplate: 'Write 3 variations of ad copy for {{product}} targeting {{audience}}. Focus on {{benefits}}.',
    inputs: [
      { key: 'product', label: 'Product Name', placeholder: 'e.g. Smart Coffee Maker' },
      { key: 'audience', label: 'Target Audience', placeholder: 'e.g. Remote Workers' },
      { key: 'benefits', label: 'Key Benefits', placeholder: 'e.g. Saves time, tastes great' }
    ]
  },
  {
    id: 'mkt-2',
    title: 'SEO Meta Generator',
    description: 'Generate SEO-optimized meta titles and descriptions.',
    category: 'Marketing',
    icon: 'fa-magnifying-glass',
    promptTemplate: 'Generate 3 SEO meta title and description pairs for a page about {{topic}}. Keywords: {{keywords}}.',
    inputs: [
      { key: 'topic', label: 'Page Topic', placeholder: 'e.g. Best Hiking Boots' },
      { key: 'keywords', label: 'Keywords', placeholder: 'e.g. hiking, waterproof, boots' }
    ]
  },
  {
    id: 'write-1',
    title: 'Blog Post Outline',
    description: 'Create a structured outline for a blog post.',
    category: 'Writing',
    icon: 'fa-pen-nib',
    promptTemplate: 'Create a detailed blog post outline for the topic: {{topic}}. Include H2 and H3 headings.',
    inputs: [
      { key: 'topic', label: 'Blog Topic', placeholder: 'e.g. The Future of AI' }
    ]
  },

  // --- CODING: GENERAL & LANGUAGES ---
  {
    id: 'code-gen-1',
    title: 'Code Converter',
    description: 'Convert code from one language to another.',
    category: 'Coding',
    icon: 'fa-arrow-right-arrow-left',
    promptTemplate: 'Convert this {{from}} code to {{to}}:\n```\n{{code}}\n```\nExplain key changes.',
    inputs: [
      { key: 'from', label: 'Source Language', placeholder: 'e.g. Python' },
      { key: 'to', label: 'Target Language', placeholder: 'e.g. JavaScript' },
      { key: 'code', label: 'Code Snippet', placeholder: 'Paste code here...' }
    ]
  },
  {
    id: 'code-gen-2',
    title: 'Code Refactor',
    description: 'Optimize and clean up messy code.',
    category: 'Coding',
    icon: 'fa-broom',
    promptTemplate: 'Refactor this {{lang}} code for better readability, performance, and best practices:\n```\n{{code}}\n```',
    inputs: [
      { key: 'lang', label: 'Language', placeholder: 'e.g. TypeScript' },
      { key: 'code', label: 'Code Snippet', placeholder: 'Paste code here...' }
    ]
  },
  {
    id: 'code-gen-3',
    title: 'Bug Fixer',
    description: 'Find and fix bugs in your code.',
    category: 'Coding',
    icon: 'fa-bug',
    promptTemplate: 'Find the bug in this {{lang}} code and provide a fixed version with explanation:\n```\n{{code}}\n```\nError message (optional): {{error}}',
    inputs: [
      { key: 'lang', label: 'Language', placeholder: 'e.g. Python' },
      { key: 'code', label: 'Code', placeholder: 'Paste code...' },
      { key: 'error', label: 'Error Message', placeholder: 'Paste error trace...' }
    ]
  },
  {
    id: 'code-gen-4',
    title: 'Regex Builder',
    description: 'Generate complex Regular Expressions.',
    category: 'Coding',
    icon: 'fa-asterisk',
    promptTemplate: 'Write a Regex pattern to match: {{requirement}}. Provide test cases.',
    inputs: [
      { key: 'requirement', label: 'Requirement', placeholder: 'e.g. Extract emails from text' }
    ]
  },
  {
    id: 'code-gen-5',
    title: 'Unit Test Writer',
    description: 'Generate unit tests for your functions.',
    category: 'Coding',
    icon: 'fa-vial',
    promptTemplate: 'Write unit tests using {{framework}} for this code:\n```\n{{code}}\n```',
    inputs: [
      { key: 'framework', label: 'Testing Framework', placeholder: 'e.g. Jest, PyTest' },
      { key: 'code', label: 'Function Code', placeholder: 'Paste code...' }
    ]
  },
  {
    id: 'code-doc-1',
    title: 'Docstring Gen',
    description: 'Generate documentation for functions.',
    category: 'Coding',
    icon: 'fa-file-lines',
    promptTemplate: 'Generate standard {{style}} documentation/docstrings for this code:\n```\n{{code}}\n```',
    inputs: [
      { key: 'style', label: 'Doc Style', placeholder: 'e.g. JSDoc, Python Docstring' },
      { key: 'code', label: 'Code', placeholder: 'Paste function...' }
    ]
  },

  // --- WEB DEVELOPMENT ---
  {
    id: 'web-1',
    title: 'React Component',
    description: 'Generate modern React components.',
    category: 'Web Dev',
    icon: 'fa-brands fa-react',
    promptTemplate: 'Write a functional React component using {{style}} styling. Component: {{name}}. Logic: {{logic}}.',
    inputs: [
      { key: 'name', label: 'Component Name', placeholder: 'e.g. UserCard' },
      { key: 'logic', label: 'Functionality', placeholder: 'e.g. Displays user avatar and bio' },
      { key: 'style', label: 'Styling Library', placeholder: 'e.g. Tailwind CSS' }
    ]
  },
  {
    id: 'web-2',
    title: 'HTML/CSS Boilerplate',
    description: 'Create semantic HTML layouts.',
    category: 'Web Dev',
    icon: 'fa-brands fa-html5',
    promptTemplate: 'Generate a semantic HTML5 layout for a {{page}}. Include CSS for {{style}}.',
    inputs: [
      { key: 'page', label: 'Page Type', placeholder: 'e.g. Landing Page' },
      { key: 'style', label: 'Visual Style', placeholder: 'e.g. Dark Mode, Minimalist' }
    ]
  },
  {
    id: 'web-3',
    title: 'Tailwind Class Gen',
    description: 'Get Tailwind classes from description.',
    category: 'Web Dev',
    icon: 'fa-wind',
    promptTemplate: 'Provide Tailwind CSS classes for an element that looks like: {{desc}}.',
    inputs: [
      { key: 'desc', label: 'Visual Description', placeholder: 'e.g. A blue rounded button with shadow' }
    ]
  },
  {
    id: 'web-4',
    title: 'REST API Endpoint',
    description: 'Generate API route handlers.',
    category: 'Web Dev',
    icon: 'fa-server',
    promptTemplate: 'Write a {{framework}} API endpoint to handle {{method}} requests for {{resource}}.',
    inputs: [
      { key: 'framework', label: 'Framework', placeholder: 'e.g. Express.js, FastAPI' },
      { key: 'method', label: 'HTTP Method', placeholder: 'e.g. POST' },
      { key: 'resource', label: 'Resource', placeholder: 'e.g. User Login' }
    ]
  },

  // --- DEVOPS & CLOUD ---
  {
    id: 'devops-1',
    title: 'Docker File Gen',
    description: 'Create optimized Dockerfiles.',
    category: 'DevOps',
    icon: 'fa-brands fa-docker',
    promptTemplate: 'Write a Dockerfile for a {{lang}} application. Requirements: {{reqs}}.',
    inputs: [
      { key: 'lang', label: 'Language/Stack', placeholder: 'e.g. Node.js 18' },
      { key: 'reqs', label: 'Requirements', placeholder: 'e.g. Multi-stage build, expose port 3000' }
    ]
  },
  {
    id: 'devops-2',
    title: 'Kubernetes YAML',
    description: 'Generate K8s manifests.',
    category: 'DevOps',
    icon: 'fa-dharmachakra',
    promptTemplate: 'Generate a Kubernetes {{kind}} manifest for {{app}}. Details: {{details}}.',
    inputs: [
      { key: 'kind', label: 'Kind', placeholder: 'e.g. Deployment, Service' },
      { key: 'app', label: 'App Name', placeholder: 'e.g. frontend-app' },
      { key: 'details', label: 'Specs', placeholder: 'e.g. 3 replicas, port 80' }
    ]
  },
  {
    id: 'devops-3',
    title: 'Nginx Config',
    description: 'Create Nginx server blocks.',
    category: 'DevOps',
    icon: 'fa-network-wired',
    promptTemplate: 'Write an Nginx configuration for {{scenario}}.',
    inputs: [
      { key: 'scenario', label: 'Scenario', placeholder: 'e.g. Reverse proxy to localhost:3000 with SSL' }
    ]
  },
  {
    id: 'devops-4',
    title: 'AWS CLI Helper',
    description: 'Generate AWS CLI commands.',
    category: 'Cloud',
    icon: 'fa-brands fa-aws',
    promptTemplate: 'Provide the AWS CLI command to {{action}}.',
    inputs: [
      { key: 'action', label: 'Action', placeholder: 'e.g. List all S3 buckets larger than 1GB' }
    ]
  },

  // --- DATA SCIENCE & DB ---
  {
    id: 'data-1',
    title: 'SQL Query Builder',
    description: 'Generate complex SQL queries.',
    category: 'Data Science',
    icon: 'fa-database',
    promptTemplate: 'Write a SQL query to {{task}} for tables: {{tables}}.',
    inputs: [
      { key: 'task', label: 'Task', placeholder: 'e.g. Calculate monthly active users' },
      { key: 'tables', label: 'Table Schema', placeholder: 'e.g. users(id, date), logins(user_id, time)' }
    ]
  },
  {
    id: 'data-2',
    title: 'Python Pandas Helper',
    description: 'Manipulate dataframes with Pandas.',
    category: 'Data Science',
    icon: 'fa-table',
    promptTemplate: 'Write Python Pandas code to {{task}} given a dataframe `df`.',
    inputs: [
      { key: 'task', label: 'Task', placeholder: 'e.g. Group by "category" and calculate mean "price"' }
    ]
  },
  {
    id: 'data-3',
    title: 'Mongo Aggregation',
    description: 'Create MongoDB aggregation pipelines.',
    category: 'Data Science',
    icon: 'fa-leaf',
    promptTemplate: 'Write a MongoDB aggregation pipeline to {{task}}.',
    inputs: [
      { key: 'task', label: 'Task', placeholder: 'e.g. Filter active users and sum their orders' }
    ]
  },

  // --- CYBER SECURITY ---
  {
    id: 'sec-1',
    title: 'Code Audit',
    description: 'Check code for security vulnerabilities.',
    category: 'Cyber Security',
    icon: 'fa-shield-halved',
    promptTemplate: 'Analyze this code for security vulnerabilities (e.g. XSS, Injection) and suggest fixes:\n```\n{{code}}\n```',
    inputs: [
      { key: 'code', label: 'Code Snippet', placeholder: 'Paste code here...' }
    ]
  },
  {
    id: 'sec-2',
    title: 'Password Gen',
    description: 'Generate secure passwords.',
    category: 'Cyber Security',
    icon: 'fa-key',
    promptTemplate: 'Generate 5 strong, random passwords containing {{reqs}}.',
    inputs: [
      { key: 'reqs', label: 'Requirements', placeholder: 'e.g. 16 chars, symbols, numbers' }
    ]
  },

  // --- UTILITIES (Mr. Freetools) ---
  {
    id: 'util-1',
    title: 'Cron Expression',
    description: 'Human readable to Cron format.',
    category: 'Mr. Freetools',
    icon: 'fa-clock',
    promptTemplate: 'Convert this schedule to a Cron expression: "{{schedule}}".',
    inputs: [{ key: 'schedule', label: 'Schedule', placeholder: 'e.g. Every Monday at 3 AM' }]
  },
  {
    id: 'util-2',
    title: 'JSON to TS',
    description: 'JSON object to TypeScript Interface.',
    category: 'Mr. Freetools',
    icon: 'fa-file-code',
    promptTemplate: 'Convert this JSON to a TypeScript Interface named {{name}}:\n```\n{{json}}\n```',
    inputs: [
      { key: 'name', label: 'Interface Name', placeholder: 'e.g. UserData' },
      { key: 'json', label: 'JSON', placeholder: 'Paste JSON...' }
    ]
  },
  {
    id: 'util-3',
    title: 'Git Command',
    description: 'Find the right Git command.',
    category: 'Mr. Freetools',
    icon: 'fa-code-branch',
    promptTemplate: 'What is the Git command to {{action}}?',
    inputs: [
      { key: 'action', label: 'Action', placeholder: 'e.g. Undo last commit but keep changes' }
    ]
  },
  {
    id: 'util-4',
    title: 'Excel Formula',
    description: 'Natural language to Excel formula.',
    category: 'Mr. Freetools',
    icon: 'fa-file-excel',
    promptTemplate: 'Write an Excel formula to {{task}}.',
    inputs: [
      { key: 'task', label: 'Task', placeholder: 'e.g. Sum column A if column B is "Pending"' }
    ]
  },
  {
    id: 'util-5',
    title: 'Lorem Ipsum Gen',
    description: 'Generate placeholder text.',
    category: 'Mr. Freetools',
    icon: 'fa-align-justify',
    promptTemplate: 'Generate {{count}} paragraphs of Lorem Ipsum text.',
    inputs: [
      { key: 'count', label: 'Paragraphs', placeholder: 'e.g. 3' }
    ]
  },

  // --- LANGUAGE SPECIFIC ---
  { id: 'lang-1', title: 'Python Script', description: 'Generate Python automation scripts.', category: 'Coding', icon: 'fa-brands fa-python', promptTemplate: 'Write a Python script to {{task}}.', inputs: [{ key: 'task', label: 'Task', placeholder: 'e.g. Scrape a website' }] },
  { id: 'lang-2', title: 'Java Class', description: 'Create Java boilerplate.', category: 'Coding', icon: 'fa-brands fa-java', promptTemplate: 'Write a Java class for {{desc}}.', inputs: [{ key: 'desc', label: 'Description', placeholder: 'e.g. A BankAccount with deposit/withdraw' }] },
  { id: 'lang-3', title: 'C++ Pointer', description: 'Explain C++ pointer logic.', category: 'Coding', icon: 'fa-c', promptTemplate: 'Explain how pointers work in this C++ context: {{context}}.', inputs: [{ key: 'context', label: 'Context', placeholder: 'e.g. Linked List' }] },
  { id: 'lang-4', title: 'Go Routine', description: 'Go concurrency helper.', category: 'Coding', icon: 'fa-brands fa-golang', promptTemplate: 'Write a Go program using Goroutines to {{task}}.', inputs: [{ key: 'task', label: 'Task', placeholder: 'e.g. Fetch multiple URLs' }] },
  { id: 'lang-5', title: 'Rust Helper', description: 'Rust borrow checker help.', category: 'Coding', icon: 'fa-gear', promptTemplate: 'Explain Rust ownership and borrowing for: {{topic}}.', inputs: [{ key: 'topic', label: 'Topic', placeholder: 'e.g. String vs &str' }] },
  { id: 'lang-6', title: 'SwiftUI View', description: 'iOS UI generation.', category: 'App Development', icon: 'fa-brands fa-apple', promptTemplate: 'Write a SwiftUI view for {{view}}.', inputs: [{ key: 'view', label: 'View Name', placeholder: 'e.g. Settings Screen' }] },
  { id: 'lang-7', title: 'Flutter Widget', description: 'Cross-platform UI.', category: 'App Development', icon: 'fa-mobile-screen', promptTemplate: 'Create a Flutter widget for {{widget}}.', inputs: [{ key: 'widget', label: 'Widget', placeholder: 'e.g. Custom Button' }] },
  
  // --- BUSINESS & PRODUCTIVITY ---
  { id: 'biz-1', title: 'Startup Idea', category: 'Business', icon: 'fa-lightbulb', description: 'Generate startup ideas.', promptTemplate: 'Give me 3 startup ideas for {{industry}}.', inputs: [{ key: 'industry', label: 'Industry', placeholder: 'e.g. EdTech' }] },
  { id: 'prod-1', title: 'Meeting Summary', category: 'Productivity', icon: 'fa-list-check', description: 'Summarize meeting notes.', promptTemplate: 'Summarize these notes: {{notes}}', inputs: [{ key: 'notes', label: 'Notes', placeholder: 'Paste notes...' }] },
  { id: 'prod-2', title: 'Email Drafter', category: 'Productivity', icon: 'fa-envelope', description: 'Write professional emails.', promptTemplate: 'Draft an email to {{to}} about {{subject}}.', inputs: [{ key: 'to', label: 'Recipient', placeholder: 'e.g. Boss' }, { key: 'subject', label: 'Subject', placeholder: 'e.g. Leave Request' }] },
];

export const EXTERNAL_TOOLS: ExternalTool[] = [
  // AI & LLM
  { name: 'ChatGPT', company: 'OpenAI', category: 'LLM', description: 'Conversational AI model.', url: 'https://chat.openai.com', icon: 'fa-robot', color: 'bg-emerald-600' },
  { name: 'Claude', company: 'Anthropic', category: 'LLM', description: 'Helpful and harmless AI.', url: 'https://claude.ai', icon: 'fa-brain', color: 'bg-orange-500' },
  { name: 'Bard / Gemini', company: 'Google', category: 'LLM', description: 'Google\'s multimodal AI.', url: 'https://gemini.google.com', icon: 'fa-brands fa-google', color: 'bg-blue-500' },
  { name: 'Perplexity', company: 'Perplexity', category: 'LLM', description: 'AI Search Engine.', url: 'https://www.perplexity.ai', icon: 'fa-search', color: 'bg-teal-600' },
  
  // Coding & Dev
  { name: 'GitHub', company: 'Microsoft', category: 'Coding', description: 'Code hosting platform.', url: 'https://github.com', icon: 'fa-brands fa-github', color: 'bg-slate-800' },
  { name: 'Stack Overflow', company: 'Stack Exchange', category: 'Coding', description: 'Developer community.', url: 'https://stackoverflow.com', icon: 'fa-layer-group', color: 'bg-orange-600' },
  { name: 'Replit', company: 'Replit', category: 'Coding', description: 'Online IDE.', url: 'https://replit.com', icon: 'fa-code', color: 'bg-blue-600' },
  { name: 'CodePen', company: 'CodePen', category: 'Web Dev', description: 'Social dev environment.', url: 'https://codepen.io', icon: 'fa-brands fa-codepen', color: 'bg-black' },
  { name: 'Vercel', company: 'Vercel', category: 'Web Dev', description: 'Frontend deployment.', url: 'https://vercel.com', icon: 'fa-triangle-exclamation', color: 'bg-black' },
  { name: 'Supabase', company: 'Supabase', category: 'Backend', description: 'Open source Firebase alternative.', url: 'https://supabase.com', icon: 'fa-database', color: 'bg-emerald-500' },
  { name: 'Postman', company: 'Postman', category: 'API', description: 'API platform.', url: 'https://www.postman.com', icon: 'fa-paper-plane', color: 'bg-orange-500' },
  { name: 'Docker', company: 'Docker', category: 'DevOps', description: 'Containerization platform.', url: 'https://www.docker.com', icon: 'fa-brands fa-docker', color: 'bg-blue-500' },
  
  // Design & Media
  { name: 'Midjourney', company: 'Midjourney', category: 'Image', description: 'AI Art Generator.', url: 'https://www.midjourney.com', icon: 'fa-palette', color: 'bg-indigo-600' },
  { name: 'Canva', company: 'Canva', category: 'Design', description: 'Graphic design tool.', url: 'https://www.canva.com', icon: 'fa-paintbrush', color: 'bg-cyan-500' },
  { name: 'Figma', company: 'Figma', category: 'Design', description: 'Interface design tool.', url: 'https://www.figma.com', icon: 'fa-brands fa-figma', color: 'bg-purple-600' },
  { name: 'Runway', company: 'Runway', category: 'Video', description: 'AI Video tools.', url: 'https://runwayml.com', icon: 'fa-video', color: 'bg-yellow-600' },
  
  // Productivity
  { name: 'Notion', company: 'Notion', category: 'Productivity', description: 'All-in-one workspace.', url: 'https://www.notion.so', icon: 'fa-file-lines', color: 'bg-slate-900' },
  { name: 'Trello', company: 'Atlassian', category: 'Productivity', description: 'Kanban project management.', url: 'https://trello.com', icon: 'fa-list-check', color: 'bg-blue-400' },
  { name: 'Slack', company: 'Salesforce', category: 'Communication', description: 'Team messaging.', url: 'https://slack.com', icon: 'fa-brands fa-slack', color: 'bg-purple-800' },
];

export const IMAGE_EDITING_SOFTWARE = [
  { name: 'Adobe Photoshop', type: 'Professional', url: 'https://www.adobe.com/products/photoshop.html', color: 'bg-blue-900', icon: 'fa-image', description: 'Industry standard for photo editing and design.' },
  { name: 'Canva', type: 'Design', url: 'https://www.canva.com', color: 'bg-cyan-500', icon: 'fa-paintbrush', description: 'Easy to use design tool for social media and more.' },
  { name: 'Figma', type: 'UI/UX', url: 'https://www.figma.com', color: 'bg-purple-600', icon: 'fa-pen-ruler', description: 'Collaborative interface design tool.' },
  { name: 'GIMP', type: 'Free / Open Source', url: 'https://www.gimp.org', color: 'bg-slate-600', icon: 'fa-layer-group', description: 'Free and open source image editor.' },
  { name: 'Krita', type: 'Painting', url: 'https://krita.org', color: 'bg-pink-500', icon: 'fa-paint-brush', description: 'Professional open source painting program.' },
  { name: 'Inkscape', type: 'Vector', url: 'https://inkscape.org', color: 'bg-slate-800', icon: 'fa-bezier-curve', description: 'Free and open source vector graphics editor.' },
];

export const VIDEO_EDITING_RESOURCES = [
  { name: 'Wondershare Filmora', category: 'Software', url: 'https://filmora.wondershare.com', color: 'bg-teal-500', icon: 'fa-film', description: 'Easy-to-use video editor with AI tools.', badge: 'AI Powered', tutorial: 'https://filmora.wondershare.com/guide/' },
  { name: 'KineMaster', category: 'Mobile App', url: 'https://kinemaster.com', color: 'bg-red-500', icon: 'fa-mobile-screen-button', description: 'Professional mobile video editing.', badge: 'Editor Choice' },
  { name: 'CapCut', category: 'Mobile App', url: 'https://www.capcut.com', color: 'bg-black', icon: 'fa-scissors', description: 'All-in-one video editor for TikTok.', badge: 'Popular', tutorial: 'https://www.capcut.com/resource' },
  { name: 'DaVinci Resolve', category: 'Software', url: 'https://www.blackmagicdesign.com/products/davinciresolve', color: 'bg-blue-600', icon: 'fa-palette', description: 'Color correction and non-linear video editing.', badge: 'Free Version' },
  { name: 'Adobe Premiere Pro', category: 'Software', url: 'https://www.adobe.com/products/premiere.html', color: 'bg-purple-800', icon: 'fa-film', description: 'Leading video editing software.', badge: 'Pro' },
  { name: 'OBS Studio', category: 'Open Source', url: 'https://obsproject.com', color: 'bg-slate-800', icon: 'fa-video', description: 'Free software for video recording and streaming.', badge: 'Streaming' },
];

export const VIDEO_CONVERSION_TOOLS = [
  { name: 'CloudConvert', category: 'Online', url: 'https://cloudconvert.com', color: 'bg-slate-600', icon: 'fa-cloud-arrow-up', description: 'Convert anything to anything.' },
  { name: 'HandBrake', category: 'Desktop', url: 'https://handbrake.fr', color: 'bg-orange-500', icon: 'fa-repeat', description: 'Open source video transcoder.' },
  { name: 'FFmpeg', category: 'CLI', url: 'https://ffmpeg.org', color: 'bg-black', icon: 'fa-terminal', description: 'A complete, cross-platform solution to record and convert.' },
];

export const VIDEO_COMPRESSION_TOOLS = [
  { name: 'VideoSmall', category: 'Online', url: 'https://videosmall.com', color: 'bg-indigo-500', icon: 'fa-compress', description: 'Reduce video size online for free.' },
  { name: 'Compressor.io', category: 'Online', url: 'https://compressor.io', color: 'bg-purple-600', icon: 'fa-down-left-and-up-right-to-center', description: 'Optimize and compress images and videos.' },
  { name: 'HandBrake', category: 'Desktop', url: 'https://handbrake.fr', color: 'bg-orange-500', icon: 'fa-repeat', description: 'Use H.265 (HEVC) codec to reduce size.' },
];

export const VIDEO_ENHANCEMENT_TOOLS = [
  { name: 'Topaz Video AI', type: 'Software', url: 'https://www.topazlabs.com/topaz-video-ai', color: 'bg-blue-600', icon: 'fa-wand-magic-sparkles', description: 'AI upscaling and frame interpolation.' },
  { name: 'Runway', type: 'Web App', url: 'https://runwayml.com', color: 'bg-pink-600', icon: 'fa-cloud', description: 'Creative suite with AI video tools.' },
  { name: 'HitPaw Video Enhancer', type: 'Software', url: 'https://www.hitpaw.com/video-enhancer.html', color: 'bg-purple-600', icon: 'fa-film', description: 'AI video upscaler.' },
];

export const VFX_SOFTWARE = [
  { name: 'Blender', type: '3D Suite', description: 'Free and open source 3D creation suite.', url: 'https://www.blender.org', icon: 'fa-cube', color: 'bg-orange-500', badge: 'Free' },
  { name: 'After Effects', type: 'Compositing', description: 'Visual effects and motion graphics.', url: 'https://www.adobe.com/products/aftereffects.html', icon: 'fa-layer-group', color: 'bg-purple-900', badge: 'Standard' },
  { name: 'Unreal Engine', type: 'Real-time', description: 'Advanced real-time 3D creation tool.', url: 'https://www.unrealengine.com', icon: 'fa-ghost', color: 'bg-slate-900' },
  { name: 'Houdini', type: 'Procedural', description: 'Powerful procedural generation and VFX simulation.', url: 'https://www.sidefx.com', icon: 'fa-network-wired', color: 'bg-orange-600' },
  { name: 'Autodesk Maya', type: 'Animation', description: 'Industry standard for 3D animation and modeling.', url: 'https://www.autodesk.com/products/maya/overview', icon: 'fa-cubes', color: 'bg-teal-600' },
  { name: 'Nuke', type: 'Compositing', description: 'Node-based compositing for film and television.', url: 'https://www.foundry.com/products/nuke-family/nuke', icon: 'fa-circle-nodes', color: 'bg-yellow-500' },
];

export const THREE_D_TOOLS = [
  { name: 'Blender', type: '3D Suite', url: 'https://www.blender.org', icon: 'fa-cube', color: 'bg-orange-500', description: 'Free and open source 3D creation suite. Supports the entirety of the 3D pipeline.', badge: 'Free' },
  { name: 'Cinema 4D', type: 'MoGraph', url: 'https://www.maxon.net/en/cinema-4d', icon: 'fa-cubes-stacked', color: 'bg-blue-600', description: 'Professional 3D modeling, animation, simulation and rendering software solution.' },
  { name: 'Autodesk Maya', type: 'Animation', url: 'https://www.autodesk.com/products/maya/overview', icon: 'fa-dragon', color: 'bg-teal-600', description: 'Powerful 3D animation and visual effects software for film, TV, and games.' },
  { name: 'ZBrush', type: 'Sculpting', url: 'https://www.maxon.net/en/zbrush', icon: 'fa-paintbrush', color: 'bg-slate-700', description: 'The industry standard for digital sculpting and painting.' },
  { name: '3ds Max', type: 'Modeling', url: 'https://www.autodesk.com/products/3ds-max/overview', icon: 'fa-building', color: 'bg-yellow-600', description: '3D modeling, rendering, and animation software for design visualization.' },
];

export const VFX_LEARNING = [
  { name: 'Video Copilot', topic: 'After Effects', url: 'https://www.videocopilot.net', icon: 'fa-jet-fighter' },
  { name: 'Blender Guru', topic: 'Blender', url: 'https://www.blenderguru.com', icon: 'fa-donut' },
  { name: 'ActionVFX', topic: 'Stock Assets', url: 'https://www.actionvfx.com', icon: 'fa-fire' },
];

export const WEBSITE_RESOURCES: WebsiteResource[] = [
  { name: 'WordPress', type: 'Builder', description: 'Most popular CMS globally.', url: 'https://wordpress.org', icon: 'fa-brands fa-wordpress', color: 'bg-blue-700', features: ['Open Source', 'Plugins', 'Themes'] },
  { name: 'Wix', type: 'Builder', description: 'Drag and drop website builder.', url: 'https://wix.com', icon: 'fa-brands fa-wix', color: 'bg-yellow-500', features: ['Easy', 'Templates', 'All-in-one'] },
  { name: 'Hostinger', type: 'Hosting', description: 'Affordable web hosting.', url: 'https://hostinger.com', icon: 'fa-server', color: 'bg-purple-600', features: ['Cheap', 'Fast', 'Support'] },
  { name: 'DigitalOcean', type: 'Hosting', description: 'Cloud computing for developers.', url: 'https://www.digitalocean.com', icon: 'fa-cloud', color: 'bg-blue-500', features: ['VPS', 'Scalable', 'Developer'] },
  { name: 'Shopify', type: 'Commerce', description: 'E-commerce platform.', url: 'https://shopify.com', icon: 'fa-brands fa-shopify', color: 'bg-green-600', features: ['Store', 'Payments', 'POS'] },
];

export const FREELANCE_PLATFORMS = [
  { name: 'Upwork', url: 'https://www.upwork.com', color: 'bg-green-600', icon: 'fa-handshake', description: 'Connects businesses with independent professionals.' },
  { name: 'Fiverr', url: 'https://www.fiverr.com', color: 'bg-green-500', icon: 'fa-file-invoice-dollar', description: 'Freelance services marketplace.' },
  { name: 'Toptal', url: 'https://www.toptal.com', color: 'bg-blue-700', icon: 'fa-award', description: 'Hire the top 3% of freelance talent.' },
  { name: 'Freelancer', url: 'https://www.freelancer.com', color: 'bg-blue-500', icon: 'fa-laptop', description: 'Hire freelancers for your work.' },
];

export const EDUCATION_PLATFORMS = [
  { name: 'LearnVern', type: 'Free Courses', description: 'Free online courses in Hindi and other Indian languages with certificates.', url: 'https://www.learnvern.com', icon: 'fa-language', color: 'bg-green-600', badge: 'Free' },
  { name: 'Coursera', type: 'University Courses', description: 'Courses from top universities.', url: 'https://www.coursera.org', icon: 'fa-university', color: 'bg-blue-600' },
  { name: 'Udemy', type: 'Marketplace', description: 'Online courses on anything.', url: 'https://www.udemy.com', icon: 'fa-chalkboard-user', color: 'bg-purple-600' },
  { name: 'edX', type: 'University Courses', description: 'Free online courses from leading institutions.', url: 'https://www.edx.org', icon: 'fa-school', color: 'bg-slate-700' },
  { name: 'Simplilearn', type: 'Bootcamp', description: 'Online Bootcamp & Certification.', url: 'https://www.simplilearn.com', icon: 'fa-graduation-cap', color: 'bg-blue-700' },
  { name: 'FreeCodeCamp', type: 'Coding', description: 'Learn to code for free.', url: 'https://www.freecodecamp.org', icon: 'fa-brands fa-free-code-camp', color: 'bg-slate-900' },
];

export const SIMPLILEARN_COURSES = [
  { category: 'Data Science', courses: ['Data Scientist Master', 'Data Analyst', 'Big Data Engineer'] },
  { category: 'AI & ML', courses: ['AI Engineer', 'Machine Learning', 'Deep Learning'] },
  { category: 'Cloud', courses: ['AWS Architect', 'Azure Administrator', 'DevOps Engineer'] },
  { category: 'Cyber Security', courses: ['Cyber Security Expert', 'Ethical Hacker', 'CISSP'] },
];

export const SOCIAL_MEDIA_PLATFORMS = [
  { name: 'Instagram', category: 'Visual', description: 'Photo and video sharing.', url: 'https://instagram.com', icon: 'fa-brands fa-instagram', color: 'bg-pink-600' },
  { name: 'TikTok', category: 'Video', description: 'Short-form video.', url: 'https://tiktok.com', icon: 'fa-brands fa-tiktok', color: 'bg-black' },
  { name: 'Twitter / X', category: 'Microblogging', description: 'Real-time updates.', url: 'https://twitter.com', icon: 'fa-brands fa-x-twitter', color: 'bg-black' },
  { name: 'LinkedIn', category: 'Professional', description: 'Networking and careers.', url: 'https://linkedin.com', icon: 'fa-brands fa-linkedin', color: 'bg-blue-700' },
  { name: 'YouTube', category: 'Video', description: 'Video sharing.', url: 'https://youtube.com', icon: 'fa-brands fa-youtube', color: 'bg-red-600' },
];

export const MOCK_SOCIAL_POSTS = [
  { id: 1, platform: 'Instagram', handle: '@creative_studio', date: '2h ago', content: 'Just launched our new summer collection! ☀️ #summer', likes: 1240, comments: 45, shares: 12, icon: 'fa-brands fa-instagram', color: 'text-pink-600', bgColor: 'bg-pink-100' },
  { id: 2, platform: 'Twitter / X', handle: '@tech_guru', date: '5h ago', content: 'AI is changing the game for developers. 🤖', likes: 540, comments: 120, shares: 89, icon: 'fa-brands fa-x-twitter', color: 'text-black', bgColor: 'bg-slate-200' },
];

export const MARKETING_SOFTWARE = [
  { name: 'HubSpot', category: 'CRM', description: 'Inbound marketing software.', url: 'https://www.hubspot.com', icon: 'fa-brands fa-hubspot', color: 'bg-orange-500' },
  { name: 'Mailchimp', category: 'Email', description: 'Marketing platform.', url: 'https://mailchimp.com', icon: 'fa-brands fa-mailchimp', color: 'bg-yellow-500' },
  { name: 'Semrush', category: 'SEO', description: 'Online visibility management.', url: 'https://www.semrush.com', icon: 'fa-magnifying-glass-chart', color: 'bg-orange-600' },
];

export const ECOMMERCE_PLATFORMS = [
  { name: 'Shopify', category: 'Platform', description: 'E-commerce platform.', url: 'https://shopify.com', icon: 'fa-brands fa-shopify', color: 'bg-green-600' },
  { name: 'WooCommerce', category: 'Plugin', description: 'WordPress e-commerce.', url: 'https://woocommerce.com', icon: 'fa-brands fa-wordpress', color: 'bg-purple-600' },
];

export const BROWSERS_AND_ENGINES = [
  { name: 'Google Chrome', type: 'Browser', description: 'Fast, secure browser.', url: 'https://www.google.com/chrome', icon: 'fa-brands fa-chrome', color: 'bg-blue-500' },
  { name: 'Firefox', type: 'Browser', description: 'Open source web browser.', url: 'https://www.mozilla.org/firefox', icon: 'fa-brands fa-firefox-browser', color: 'bg-orange-500' },
  { name: 'Brave', type: 'Browser', description: 'Privacy-focused browser.', url: 'https://brave.com', icon: 'fa-shield-halved', color: 'bg-orange-600' },
  { name: 'Google', type: 'Search Engine', description: 'Search the world\'s information.', url: 'https://google.com', icon: 'fa-brands fa-google', color: 'bg-blue-500' },
  { name: 'DuckDuckGo', type: 'Search Engine', description: 'Privacy, simplified.', url: 'https://duckduckgo.com', icon: 'fa-duck', color: 'bg-orange-500' },
];

export const FINANCIAL_PLATFORMS = [
  { name: 'TradingView', category: 'Charts', url: 'https://www.tradingview.com', icon: 'fa-chart-line', color: 'bg-black', description: 'Advanced charting platform.' },
  { name: 'Yahoo Finance', category: 'News', url: 'https://finance.yahoo.com', icon: 'fa-brands fa-yahoo', color: 'bg-purple-600', description: 'Financial news and data.' },
  { name: 'CoinMarketCap', category: 'Crypto', url: 'https://coinmarketcap.com', icon: 'fa-coins', color: 'bg-blue-600', description: 'Crypto rankings.' },
  { name: 'Binance', category: 'Exchange', url: 'https://www.binance.com', icon: 'fa-bitcoin-sign', color: 'bg-yellow-500', description: 'Crypto exchange.' },
];

export const EARNING_PLATFORMS: EarningPlatform[] = [
  { name: 'OnlineMarket7', category: 'All', url: 'https://onlinemarket7.com', icon: 'fa-store', color: 'bg-indigo-600', payout: 'Bank Transfer / UPI', description: 'Digital marketplace and earning platform.', badge: 'New' },
  { name: 'Swagbucks', category: 'Watch', url: 'https://www.swagbucks.com', icon: 'fa-coins', color: 'bg-cyan-600', payout: 'PayPal / Gift Cards', description: 'Earn points for tasks.', badge: 'Popular' },
  { name: 'Upwork', category: 'Play', url: 'https://www.upwork.com', icon: 'fa-briefcase', color: 'bg-green-600', payout: 'Bank Transfer', description: 'Freelance marketplace.', badge: 'Pro' },
];

export const DATING_PLATFORMS: DatingPlatform[] = [
  { name: 'Tinder', category: 'App', url: 'https://tinder.com', icon: 'fa-fire', color: 'bg-pink-600', description: 'Swipe right to match.', badge: 'Popular' },
  { name: 'Bumble', category: 'App', url: 'https://bumble.com', icon: 'fa-bee', color: 'bg-yellow-500', description: 'Women make the first move.' },
];

export const FITNESS_RESOURCES = [
  { name: 'MyFitnessPal', category: 'Nutrition', url: 'https://www.myfitnesspal.com', icon: 'fa-apple-whole', color: 'bg-blue-600', description: 'Track calories.' },
  { name: 'Strava', category: 'Running', url: 'https://www.strava.com', icon: 'fa-person-biking', color: 'bg-orange-600', description: 'Track runs and rides.' },
];

export const VPN_PROVIDERS = [
  { name: 'NordVPN', url: 'https://nordvpn.com', icon: 'fa-shield-halved', color: 'bg-blue-600', description: 'Fast and secure VPN.' },
  { name: 'ExpressVPN', url: 'https://www.expressvpn.com', icon: 'fa-rocket', color: 'bg-red-600', description: 'High-speed VPN.' },
];
