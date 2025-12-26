import { Smartphone, Megaphone, Globe, Code, Files } from 'lucide-react';

export const SCENARIOS = [
  { id: 'app-store', title: 'App Store & ASO', icon: Smartphone, description: 'Optimized for Play Store & App Store with character limits.', color: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200', hoverBorder: 'hover:border-blue-500' },
  { id: 'marketing', title: 'Marketing & Social', icon: Megaphone, description: 'Persuasive tone for ads and social media posts.', color: 'bg-purple-50', textColor: 'text-purple-600', borderColor: 'border-purple-200', hoverBorder: 'hover:border-purple-500' },
  { id: 'website-seo', title: 'Website & SEO', icon: Globe, description: 'Preserves HTML tags and protects keywords.', color: 'bg-green-50', textColor: 'text-green-600', borderColor: 'border-green-200', hoverBorder: 'hover:border-green-500' },
  { id: 'dev-strings', title: 'Software Strings', icon: Code, description: 'Handles variables and key-value pairs.', color: 'bg-slate-50', textColor: 'text-slate-600', borderColor: 'border-slate-200', hoverBorder: 'hover:border-slate-500' },
  { id: 'general', title: 'General / Bulk', icon: Files, description: 'Large documents without specific constraints.', color: 'bg-orange-50', textColor: 'text-orange-600', borderColor: 'border-orange-200', hoverBorder: 'hover:border-orange-500' }
];

export const COMMON_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Russian' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'zh-CN', name: 'Chinese Simplified' },
  { code: 'zh-TW', name: 'Chinese Traditional' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'th', name: 'Thai' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'pt-BR', name: 'Brazilian Portuguese' },
  { code: 'es', name: 'Spanish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'it', name: 'Italian' },
  { code: 'vi', name: 'Vietnamese' }
];

export const LANGUAGES = COMMON_LANGUAGES;

export const TABLE_FORMATS = [
  { id: 'simple', name: 'Simple Table', description: 'Clean table with columns' },
  { id: 'formatted', name: 'Formatted (Key-Value)', description: 'iOS/Android format with quotes' }
];

export const DOWNLOAD_FORMATS = [
  { id: 'csv', name: 'CSV', extension: '.csv' },
  { id: 'excel', name: 'Excel', extension: '.xlsx' },
  { id: 'json', name: 'JSON', extension: '.json' },
  { id: 'xml', name: 'XML', extension: '.xml' },
  { id: 'strings', name: 'iOS Strings', extension: '.strings' },
  { id: 'android', name: 'Android XML', extension: '.xml' }
];
