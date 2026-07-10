#!/usr/bin/env node

/**
 * Laravel Documentation - Clean Bilingual Generator v4
 * Converts markdown to HTML properly
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { marked } from 'marked';

// Page titles in Traditional Chinese
const pageTitles = {
  'installation': '安裝',
  'configuration': '配置',
  'directory-structure': '目錄結構',
  'frontend': '前端',
  'routing': '路由',
  'middleware': '中介層',
  'csrf-protection': 'CSRF 保護',
  'controllers': '控制器',
  'requests': '請求',
  'responses': '回應',
  'views': '視圖',
  'blade': 'Blade 範本',
  'url-generation': 'URL 生成',
  'session': '會話',
  'validation': '驗證',
  'error-handling': '錯誤處理',
  'logging': '日誌記錄',
  'database': '資料庫',
  'queries': '查詢',
  'pagination': '分頁',
  'migrations': '資料庫遷移',
  'seeding': '資料填充',
  'redis': 'Redis',
  'mongodb': 'MongoDB',
  'eloquent': 'Eloquent 入門',
  'eloquent-relationships': 'Eloquent 關聯',
  'eloquent-collections': 'Eloquent 集合',
  'eloquent-mutators': 'Eloquent 修改器',
  'eloquent-resources': 'Eloquent API 資源',
  'eloquent-serialization': 'Eloquent 序列化',
  'eloquent-factories': 'Eloquent 工廠',
  'authentication': '認證',
  'authorization': '授權',
  'email-verification': '電子郵件驗證',
  'encryption': '加密',
  'hashing': '雜湊',
  'password-reset': '密碼重設',
  'starter-kits': '入門套件',
  'vite': 'Vite',
  'breeze': 'Breeze',
  'jetstream': 'Jetstream',
  'inertia': 'Inertia',
  'livewire': 'Livewire',
  'testing': '測試入門',
  'http-tests': 'HTTP 測試',
  'console-tests': '控制台測試',
  'browser-tests': '瀏覽器測試',
  'database-testing': '資料庫測試',
  'mocking': '模擬',
  'mail': '郵件',
  'notifications': '通知',
  'events': '事件',
  'broadcasting': '廣播',
  'cache': '快取',
  'queues': '佇列',
  'task-scheduling': '任務排程',
  'strings': '字串',
  'collections': '集合',
  'api-authentication': 'API 認證',
  'sanctum': 'Sanctum',
  'passport': 'Passport',
  'billing': '帳單',
  'cashier-paddle': 'Cashier Paddle',
  'ai': 'AI 開發',
  'ai-sdk': 'AI SDK',
  'artisan': 'Artisan 命令',
  'container': '服務容器',
  'contracts': '契約',
  'context': '上下文',
  'concurrency': '並發',
  'contributions': '貢獻',
  'deployment': '部署',
  'envoy': 'Envoy',
  'forge': 'Forge',
  'horizon': 'Horizon',
  'octane': 'Octane',
  'pennant': 'Pennant',
  'pint': 'Pint',
  'precognition': '預知',
  'pulse': 'Pulse',
  'reverb': 'Reverb',
  'sail': 'Sail',
  'scout': 'Scout',
  'socialite': 'Socialite',
  'telescope': 'Telescope',
  'valet': 'Valet',
  'vapor': 'Vapor',
  'csrf': 'CSRF 保護',
  'documentation': '文件',
  'dusk': 'Dusk',
  'errors': '錯誤處理',
  'facades': 'Facades',
  'filesystem': '檔案系統',
  'folio': 'Folio',
  'fortify': 'Fortify',
  'helpers': '輔助函式',
  'homestead': 'Homestead',
  'http-client': 'HTTP 用戶端',
  'license': '授權條款',
  'lifecycle': '生命週期',
  'localization': '本地化',
  'mcp': 'MCP',
  'mix': 'Mix',
  'packages': '套件',
  'passwords': '密碼',
  'processes': '程序',
  'prompts': '提示',
  'providers': '服務提供者',
  'rate-limiting': '速率限制',
  'readme': 'Readme',
  'releases': '版本發布',
  'scheduling': '排程',
  'search': '搜尋',
  'structure': '目錄結構',
  'upgrade': '升級',
  'urls': 'URL',
  'verification': '驗證',
};

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: false,
});

function escapeForTemplateLiteral(str) {
  // Escape backslashes first, then backticks, then ${} sequences
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

function createAstroFile(markdownContent, slug) {
  const title = pageTitles[slug] || slug;
  
  // Convert markdown to HTML
  const htmlContent = marked.parse(markdownContent);
  
  // Escape for template literal
  const escapedContent = escapeForTemplateLiteral(htmlContent);
  
  return `---
import DocsLayout from '../../layouts/DocsLayout.astro';

const content = \`${escapedContent}\`;
---

<DocsLayout title="${title}" currentPath="${slug}">
  <div class="mb-8">
    <nav class="text-sm text-text-secondary mb-4">
      <a href="/" class="hover:text-accent">首頁</a>
      <span class="mx-2">/</span>
      <span>文件</span>
      <span class="mx-2">/</span>
      <span>${title}</span>
    </nav>
    
    <h1 class="text-4xl font-bold mb-4">${title}</h1>
    
    <div class="bg-bg-secondary border border-border rounded-lg p-4 mb-6">
      <p class="text-text-secondary">
        📝 本文翻譯自 Laravel 官方文檔。
        <a href="https://laravel.com/docs/13.x/${slug}" class="text-accent" target="_blank" rel="noopener">
          查看原始英文版本
        </a>
      </p>
    </div>
  </div>

  <div class="prose prose-invert max-w-none" set:html={content}></div>
</DocsLayout>
`;
}

function processFile(inputPath, outputPath) {
  try {
    const content = readFileSync(inputPath, 'utf-8');
    const slug = basename(inputPath, '.md');
    
    const astroContent = createAstroFile(content, slug);
    writeFileSync(outputPath, astroContent, 'utf-8');
    console.log(`✓ Created: ${outputPath}`);
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
  }
}

// Main execution
const docsDir = join(process.cwd(), 'docs-original', 'laravel-docs');
const outputDir = join(process.cwd(), 'src', 'pages', 'docs');

// Get all markdown files
const files = readdirSync(docsDir).filter(f => f.endsWith('.md'));

console.log(`Found ${files.length} documentation files...`);

// Process each file
for (const file of files) {
  const inputPath = join(docsDir, file);
  const outputPath = join(outputDir, file.replace('.md', '.astro'));
  
  processFile(inputPath, outputPath);
}

console.log('\nDone!');
console.log(`Processed ${files.length} files.`);
