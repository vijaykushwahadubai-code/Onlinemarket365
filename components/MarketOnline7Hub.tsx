import React, { useState } from 'react';
import { motion } from 'motion/react';

const CATEGORIES = [
  'All',
  'Web Generators',
  'SEO & Analysis',
  'Calculators',
  'Converters',
  'Social Media',
  'Affiliate Programs'
];

const MARKET_TOOLS = [
  // Web Generators
  { name: 'Website Converter Tool', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/website-converter-tool-marketonline7.html', icon: 'fa-code' },
  { name: 'Procedural Texture Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/procedural-texture-generator-tool.html', icon: 'fa-image' },
  { name: 'Website Pattern Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/website-pattern-generator-tool.html', icon: 'fa-chess-board' },
  { name: 'CSS Keyframes Animation Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/css-keyfremes-animation-generator-tool.html', icon: 'fa-film' },
  { name: 'Gradient Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/gradient-generator-tool-marketonline7.html', icon: 'fa-palette' },
  { name: 'Slider Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/slider-generator-tool-marketonline7.html', icon: 'fa-sliders' },
  { name: 'Website Tooltip Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/website-tooltip-generator-tool.html', icon: 'fa-comment-dots' },
  { name: 'Parallax Scroller Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/parallax-scroller-generator-tool.html', icon: 'fa-arrows-up-down' },
  { name: 'Tab Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/tab-generator-tool-marketonline7.html', icon: 'fa-folder' },
  { name: 'Accordion Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/accordion-generator-tool-marketonline7.html', icon: 'fa-list' },
  { name: 'Carousel Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/carousel-generator-tool-marketonline7.html', icon: 'fa-images' },
  { name: 'Ribbon Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/ribbon-generator-tool-marketonline7.html', icon: 'fa-ribbon' },
  { name: 'Website Background Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/website-background-generator-tool.html', icon: 'fa-fill-drip' },
  { name: 'Website Badge Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/website-badge-generator-tool.html', icon: 'fa-id-badge' },
  { name: 'Website Popup Builder', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/website-popup-builder-tool-marketonline7.html', icon: 'fa-window-restore' },
  { name: 'Countdown Timer Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/countdown-timer-generator-tool.html', icon: 'fa-stopwatch' },
  { name: 'Live Chat Widget Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/live-chat-widget-generator-tool.html', icon: 'fa-comments' },
  { name: 'Contact Form Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/10/contact-form-generator-tool.html', icon: 'fa-envelope-open-text' },
  { name: 'Pricing Table Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/09/pricing-table-generator-tool.html', icon: 'fa-table-list' },
  { name: 'Timeline Generator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/09/timeline-generator-tool-marketonline7.html', icon: 'fa-timeline' },
  { name: 'Website Theme Customizer', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/09/website-theme-customizer-tool.html', icon: 'fa-brush' },
  { name: 'Website Footer Builder', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/09/website-footer-builder-tool.html', icon: 'fa-shoe-prints' },
  { name: 'Website Layout Builder', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/09/website-layout-builder-tool.html', icon: 'fa-border-all' },
  { name: 'Website Sidebar Builder', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/09/website-sidebar-builder-tool.html', icon: 'fa-columns' },
  { name: 'Website Header Builder', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/09/website-header-builder-tool.html', icon: 'fa-heading' },
  { name: 'Website Color Scheme Tool', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/09/website-color-scheme-tool-marketonline7.html', icon: 'fa-swatchbook' },
  { name: 'Coming Soon Page Builder', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/09/coming-soon-page-builder-create.html', icon: 'fa-hourglass-half' },
  { name: 'Website Form Builder', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/09/advanced-website-form-builder-tool.html', icon: 'fa-wpforms' },
  { name: 'Website Quiz Maker', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/09/website-quiz-maker-tool-professional.html', icon: 'fa-clipboard-question' },
  { name: 'Website Poll Creator', category: 'Web Generators', url: 'https://www.marketonline7.com/2025/09/advanced-website-poll-creator-tool.html', icon: 'fa-square-poll-vertical' },

  // SEO & Analysis
  { name: 'AI Code Optimizer', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/10/ai-code-optimizer-tool-marketonline7.html', icon: 'fa-laptop-code' },
  { name: 'Code Validator', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/10/code-validator-tool-marketonline7.html', icon: 'fa-check-double' },
  { name: 'Website SEO Tracker', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/website-seo-tracker-marketonline7.html', icon: 'fa-chart-line' },
  { name: 'Website Performance Tracking', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/website-performance-tracking-tool.html', icon: 'fa-gauge-high' },
  { name: 'Alexa Rank Checker', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/alexa-rank-checker-tool-marketonline7.html', icon: 'fa-ranking-star' },
  { name: 'Website Traffic Analyzer', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/website-traffic-analyzer-tool.html', icon: 'fa-chart-pie' },
  { name: 'AI Meta Title/Description Gen', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/ai-meta-title-discriptiontag-generator.html', icon: 'fa-tags' },
  { name: 'Keyword Usage Tool', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/keyword-usage-tool-marketonline7.html', icon: 'fa-key' },
  { name: 'Website Error Log Analyzer', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/website-error-log-analyzer-tool.html', icon: 'fa-triangle-exclamation' },
  { name: 'Website Heatmap Generator', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/website-heatmap-generator-tool.html', icon: 'fa-fire' },
  { name: 'Website Health Analytics', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/website-health-analytics-dashboard-tool.html', icon: 'fa-heart-pulse' },
  { name: 'Website Uptime Monitor', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/website-uptime-monitor-professional.html', icon: 'fa-clock' },
  { name: 'Website Security Scanner', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/advanced-website-security-scanner-tool.html', icon: 'fa-shield-halved' },
  { name: 'Website Vulnerability Scanner', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/advanced-website-vulnerability-scanner.html', icon: 'fa-bug' },
  { name: 'Google Discover Analyzer', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/350-google-discover-analyzer-test.html', icon: 'fa-google' },
  { name: 'Broken Link Finder', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/advanced-broken-link-finder-tool.html', icon: 'fa-link-slash' },
  { name: 'SEO Analysis Tool Meta Master', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/advanced-seo-analysis-tool-meta-master.html', icon: 'fa-magnifying-glass-chart' },
  { name: 'External Link Checker', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/10-external-link-checker-tool-analyze.html', icon: 'fa-arrow-up-right-from-square' },
  { name: 'Inbound Link Analysis', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/10-inbound-link-analysis-checker-tool.html', icon: 'fa-arrow-right-to-bracket' },
  { name: 'Keyword Cloud Generator', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/advanced-keyword-cloud-generator-create.html', icon: 'fa-cloud' },
  { name: 'Internal Link Checker', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/350-internal-link-checker-tool-analyze.html', icon: 'fa-link' },
  { name: 'HTML Page Size Test Tool', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/15-advanced-html-page-size-test-tool.html', icon: 'fa-file-code' },
  { name: 'Responsive Image Testing', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/advanced-responsive-image-testing-tool.html', icon: 'fa-mobile-screen' },
  { name: 'Image Alt Text Analysis', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/advanced-image-alt-text-analysis.html', icon: 'fa-image' },
  { name: 'CSS Caching Analysis', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/advanced-css-caching-analysis.html', icon: 'fa-css3-alt' },
  { name: 'Search Console Error Testing', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/advanced-search-console-error-testing.html', icon: 'fa-google' },
  { name: 'JavaScript Caching Analysis', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/advanced-javascript-caching-analysis.html', icon: 'fa-js' },
  { name: 'Image Caching Analysis', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/advanced-image-caching-analysis.html', icon: 'fa-images' },
  { name: 'JavaScript Error Testing', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/advanced-javascript-error-testing-tool.html', icon: 'fa-bug' },
  { name: 'Website Speed Test', category: 'SEO & Analysis', url: 'https://www.marketonline7.com/2025/09/advanced-website-speed-test-performance.html', icon: 'fa-gauge-high' },

  // Calculators
  { name: 'Shipping Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/09/shipping-calculator-tool-marketonline7.html', icon: 'fa-truck-fast' },
  { name: 'Website Discount Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/09/website-discount-calculator-tool.html', icon: 'fa-percent' },
  { name: 'SIP Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/08/advanced-sip-calculator-mutual-fund.html', icon: 'fa-chart-line' },
  { name: 'Pregnancy Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/08/advanced-pregnancy-calculator-track.html', icon: 'fa-baby' },
  { name: 'PPF Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/08/advanced-ppf-calculator-plan-your.html', icon: 'fa-piggy-bank' },
  { name: 'RD Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/08/advanced-rd-calculator-calculator.html', icon: 'fa-money-bill-trend-up' },
  { name: 'FD Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/08/advanced-fd-calculator-calculator-fixed.html', icon: 'fa-vault' },
  { name: 'Labour Cost Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/08/advanced-labour-cost-calculator.html', icon: 'fa-helmet-safety' },
  { name: 'Brick Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/08/advanced-brick-calculator-tool-accurate.html', icon: 'fa-cubes' },
  { name: 'Steels Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/08/advanced-steels-calculator-pro-steel.html', icon: 'fa-bars-staggered' },
  { name: 'EMI Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/08/advanced-emi-calculator-calculator.html', icon: 'fa-calculator' },
  { name: 'National Pension System Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/08/national-pension-system-calculator.html', icon: 'fa-building-columns' },
  { name: 'GST Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/08/advanced-gst-calculator-calculator.html', icon: 'fa-file-invoice-dollar' },
  { name: 'Land Survey Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-advanced-land-survey-calculator.html', icon: 'fa-map' },
  { name: 'HVAC Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-online-advanced-hvac-calculator.html', icon: 'fa-fan' },
  { name: 'Plumbing Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-online-advanced-plumbing.html', icon: 'fa-wrench' },
  { name: 'Electrical Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-online-advanced-electrical.html', icon: 'fa-bolt' },
  { name: 'Beam Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-online-advanced-beam-calculator.html', icon: 'fa-ruler-horizontal' },
  { name: 'Flooring Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-online-advanced-flooring.html', icon: 'fa-layer-group' },
  { name: 'Tile Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-advanced-tile-calculator-tool-2025.html', icon: 'fa-border-all' },
  { name: 'Paint Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-advanced-paint-calculator-tool.html', icon: 'fa-paint-roller' },
  { name: 'Staircase Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-advanced-staircase-calculator-tool.html', icon: 'fa-stairs' },
  { name: 'Concrete Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-advanced-concrete-calculator-tool.html', icon: 'fa-truck-pickup' },
  { name: 'Roof Pitch Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-advanced-roof-pitch-calculator.html', icon: 'fa-house-chimney' },
  { name: 'Material Estimator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-advanced-material-estimator.html', icon: 'fa-boxes-stacked' },
  { name: 'Volume Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-advanced-valume-calculator-2025.html', icon: 'fa-cube' },
  { name: 'Area Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-advanced-area-calculator-2025.html', icon: 'fa-vector-square' },
  { name: 'GPA Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-gpa-calculator-2025-instantly.html', icon: 'fa-graduation-cap' },
  { name: 'Tax Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/free-tax-calculator-tools-2025-accurate.html', icon: 'fa-file-invoice' },
  { name: 'Investment Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/100-free-online-advanced-investment.html', icon: 'fa-money-bill-trend-up' },
  { name: 'Retirement Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/100-free-online-advanced-retirement.html', icon: 'fa-person-cane' },
  { name: 'Date Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/100-free-online-date-calculator-tool.html', icon: 'fa-calendar-days' },
  { name: 'Percentage Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/100-free-online-advanced-percentage.html', icon: 'fa-percent' },
  { name: 'Tip Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/100-free-online-advanced-tip-calculator.html', icon: 'fa-coins' },
  { name: 'Age Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/100-free-online-advanced-age-calculator.html', icon: 'fa-cake-candles' },
  { name: 'Calorie Counter', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/100-free-online-calorie-counter-tool.html', icon: 'fa-fire-burner' },
  { name: 'BMI Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/100-free-bmi-calculator-tool-understand.html', icon: 'fa-weight-scale' },
  { name: 'Loan Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/100-free-loan-calculator-tool-estimate.html', icon: 'fa-hand-holding-dollar' },
  { name: 'Mortgage Calculator', category: 'Calculators', url: 'https://www.marketonline7.com/2025/06/100-free-mortgage-calculator-tool-2025.html', icon: 'fa-house-user' },

  // Converters
  { name: 'Text to Speech Converter', category: 'Converters', url: 'https://www.marketonline7.com/2025/09/advanced-text-to-speech-converter-tool_01766090132.html', icon: 'fa-volume-high' },
  { name: 'Speech to Text Converter', category: 'Converters', url: 'https://www.marketonline7.com/2025/09/advanced-speech-to-text-converter.html', icon: 'fa-microphone' },
  { name: 'Web Image Converter', category: 'Converters', url: 'https://www.marketonline7.com/2025/09/advanced-web-image-converter-convert.html', icon: 'fa-image' },
  { name: 'Text to Video Converter', category: 'Converters', url: 'https://www.marketonline7.com/2025/07/text-to-video-converter-tool-2025.html', icon: 'fa-video' },
  { name: 'PDF to HTML Converter', category: 'Converters', url: 'https://www.marketonline7.com/2025/06/free-online-advanced-pdf-to-html.html', icon: 'fa-file-code' },
  { name: 'PDF to PowerPoint', category: 'Converters', url: 'https://www.marketonline7.com/2025/06/free-advanced-pdf-to-powerpoint.html', icon: 'fa-file-powerpoint' },
  { name: 'PDF to JPG Converter', category: 'Converters', url: 'https://www.marketonline7.com/2025/06/free-advanced-pdf-to-jpg-converter-tool.html', icon: 'fa-file-image' },
  { name: 'PDF to Excel Converter', category: 'Converters', url: 'https://www.marketonline7.com/2025/06/free-advanced-pdf-to-excel-converter.html', icon: 'fa-file-excel' },
  { name: 'PDF to Word Converter', category: 'Converters', url: 'https://www.marketonline7.com/2025/06/free-advanced-pdf-to-word-converter.html', icon: 'fa-file-word' },
  { name: 'Unit Converter', category: 'Converters', url: 'https://www.marketonline7.com/2025/06/100-free-online-advanced-unit-converter.html', icon: 'fa-ruler' },
  { name: 'Currency Converter', category: 'Converters', url: 'https://www.marketonline7.com/2025/06/100-free-currency-converter-tool-live.html', icon: 'fa-money-bill-transfer' },

  // Social Media
  { name: 'Follow Button Generator', category: 'Social Media', url: 'https://www.marketonline7.com/2025/09/follow-button-generator-tool-custom.html', icon: 'fa-user-plus' },
  { name: 'Social Share Buttons', category: 'Social Media', url: 'https://www.marketonline7.com/2025/09/social-share-buttons-generator-tool.html', icon: 'fa-share-nodes' },
  { name: 'Social Media Feed Manager', category: 'Social Media', url: 'https://www.marketonline7.com/2025/09/social-media-feed-manager-tool-schedule.html', icon: 'fa-rss' },
  { name: 'Social Media Bio Generator', category: 'Social Media', url: 'https://www.marketonline7.com/2025/09/social-media-bio-generator-tool.html', icon: 'fa-address-card' },
  { name: 'Social Media Watermark Tool', category: 'Social Media', url: 'https://www.marketonline7.com/2025/09/social-media-watermark-tool.html', icon: 'fa-stamp' },
  { name: 'Twitter Video Downloader', category: 'Social Media', url: 'https://www.marketonline7.com/2025/09/twitter-video-downloader-tool.html', icon: 'fa-twitter' },
  { name: 'YouTube Hashtags Generator', category: 'Social Media', url: 'https://www.marketonline7.com/2025/09/youtube-hashtags-generator-tool-create.html', icon: 'fa-hashtag' },
  { name: 'Facebook Integration Tool', category: 'Social Media', url: 'https://www.marketonline7.com/2025/09/website-facebook-integration-tool.html', icon: 'fa-facebook' },
  { name: 'YouTube Integration Tool', category: 'Social Media', url: 'https://www.marketonline7.com/2025/09/advanced-youtube-integration-tool.html', icon: 'fa-youtube' },
  { name: 'Twitter Integration Tool', category: 'Social Media', url: 'https://www.marketonline7.com/2025/09/website-twitter-integration-tool.html', icon: 'fa-twitter' },
  { name: 'LinkedIn Integration Tool', category: 'Social Media', url: 'https://www.marketonline7.com/2025/09/website-linkedin-integration-tool.html', icon: 'fa-linkedin' },
  { name: 'Instagram Integration Tool', category: 'Social Media', url: 'https://www.marketonline7.com/2025/09/website-instgram-integration-tool.html', icon: 'fa-instagram' },
  { name: 'Pinterest Integration Tool', category: 'Social Media', url: 'https://www.marketonline7.com/2025/09/website-pinterest-integration-tool.html', icon: 'fa-pinterest' },
  { name: 'Social Media Analytics Tool', category: 'Social Media', url: 'https://www.marketonline7.com/2025/08/advanced-social-media-analytics-tool.html', icon: 'fa-chart-simple' },
  { name: 'Social Media Image Resizer', category: 'Social Media', url: 'https://www.marketonline7.com/2025/08/advanced-social-media-image-resizer.html', icon: 'fa-crop-simple' },
  { name: 'YouTube Playlist Analyzer', category: 'Social Media', url: 'https://www.marketonline7.com/2025/08/youtube-playlist-analyzer-tool-2025-get.html', icon: 'fa-list-ol' },
  { name: 'YouTube Subscribe Counter', category: 'Social Media', url: 'https://www.marketonline7.com/2025/08/youtube-subscribe-counter-tool-2025.html', icon: 'fa-users' },
  { name: 'YouTube Channel Analyzer', category: 'Social Media', url: 'https://www.marketonline7.com/2025/08/advanced-youtube-channel-analyzer-tool.html', icon: 'fa-chart-bar' },
  { name: 'YouTube SEO Generator', category: 'Social Media', url: 'https://www.marketonline7.com/2025/08/youtube-seo-generator-tool-2025.html', icon: 'fa-magnifying-glass' },
  { name: 'YouTube Trend Search', category: 'Social Media', url: 'https://www.marketonline7.com/2025/07/youtube-trend-search-generator-tool.html', icon: 'fa-arrow-trend-up' },
  { name: 'YouTube Tag Extractor', category: 'Social Media', url: 'https://www.marketonline7.com/2025/07/youtube-tag-extractor-generator-tool.html', icon: 'fa-tags' },
  { name: 'Facebook Video Downloader', category: 'Social Media', url: 'https://www.marketonline7.com/2025/07/facebook-video-downloader-2025-hd.html', icon: 'fa-facebook' },
  { name: 'YouTube Video Downloader', category: 'Social Media', url: 'https://www.marketonline7.com/2025/07/youtube-video-downloader-2025-4k-hdmp3.html', icon: 'fa-youtube' },
  { name: 'Free Reel Video Downloader', category: 'Social Media', url: 'https://www.marketonline7.com/2025/07/free-reel-video-downloader-2025.html', icon: 'fa-mobile-screen' },
  { name: 'Social Media Scheduler', category: 'Social Media', url: 'https://www.marketonline7.com/2025/07/free-advanced-social-media-scheduler.html', icon: 'fa-calendar-check' },

  // Affiliate Programs
  { name: 'Shopify Affiliate', category: 'Affiliate Programs', url: 'https://www.marketonline7.com/2025/09/advanced-affiliate-program-generator.html', icon: 'fa-shopify' },
  { name: 'Semrush Affiliate', category: 'Affiliate Programs', url: 'https://www.marketonline7.com/2025/09/advanced-affiliate-program-generator.html', icon: 'fa-chart-line' },
  { name: 'Amazon Associates', category: 'Affiliate Programs', url: 'https://www.marketonline7.com/2025/09/advanced-affiliate-program-generator.html', icon: 'fa-amazon' },
  { name: 'Hostinger Affiliate', category: 'Affiliate Programs', url: 'https://www.marketonline7.com/2025/09/advanced-affiliate-program-generator.html', icon: 'fa-server' },
  { name: 'Canva Affiliate', category: 'Affiliate Programs', url: 'https://www.marketonline7.com/2025/09/advanced-affiliate-program-generator.html', icon: 'fa-paintbrush' },
  { name: 'Adsterra Referral', category: 'Affiliate Programs', url: 'https://www.marketonline7.com/2025/09/advanced-affiliate-program-generator.html', icon: 'fa-ad' },
];

export default function MarketOnline7Hub() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleIconMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    e.currentTarget.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
  };

  const handleIconMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translate(0px, 0px) scale(1)';
  };

  const filteredTools = MARKET_TOOLS.filter(tool => {
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6">
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow-md">MarketOnline7 Hub</h1>
          <p className="text-slate-300 mt-2">
            Explore 200+ Premium Web Tools, Generators, Calculators, and SEO Utilities from MarketOnline7.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-slate-400 backdrop-blur-md transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all backdrop-blur-md border ${
              activeCategory === category
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool, index) => (
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel p-6 group flex flex-col h-full animate-float"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all shadow-lg magnetic-icon"
                onMouseMove={handleIconMouseMove}
                onMouseLeave={handleIconMouseLeave}
              >
                <i className={`fa-solid ${tool.icon} text-xl`}></i>
              </div>
              <div>
                <h3 className="font-bold text-white line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors">
                  {tool.name}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2 block bg-white/5 inline-block px-2 py-1 rounded">
                  {tool.category}
                </span>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">MarketOnline7</span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <i className="fa-solid fa-arrow-up-right-from-square text-sm"></i>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16 glass-panel">
          <i className="fa-solid fa-magnifying-glass text-5xl text-slate-500 mb-4 animate-pulse"></i>
          <h3 className="text-xl font-bold text-white">No tools found</h3>
          <p className="text-slate-400 mt-2">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
}
