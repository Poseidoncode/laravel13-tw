#!/usr/bin/env node

/**
 * Script to generate all documentation pages from the sidebar structure
 * This creates placeholder pages that can be translated
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const PAGES_DIR = './src/pages/docs';

// Complete documentation structure from sidebar
const documentationStructure = [
  // Getting Started
  { title: '安裝', slug: 'installation', category: 'getting-started' },
  { title: '配置', slug: 'configuration', category: 'getting-started' },
  { title: '目錄結構', slug: 'structure', category: 'getting-started' },
  { title: '前端', slug: 'frontend', category: 'getting-started' },
  { title: '入門套件', slug: 'starter-kits', category: 'getting-started' },
  { title: '部署', slug: 'deployment', category: 'getting-started' },
  
  // Core Concepts
  { title: '請求生命週期', slug: 'lifecycle', category: 'core-concepts' },
  { title: '服務容器', slug: 'container', category: 'core-concepts' },
  { title: '服務提供者', slug: 'providers', category: 'core-concepts' },
  { title: 'Facades', slug: 'facades', category: 'core-concepts' },
  
  // Routing & Requests
  { title: '路由', slug: 'routing', category: 'routing' },
  { title: '中介層', slug: 'middleware', category: 'routing' },
  { title: 'CSRF 保護', slug: 'csrf', category: 'routing' },
  { title: '控制器', slug: 'controllers', category: 'routing' },
  { title: 'HTTP 請求', slug: 'requests', category: 'routing' },
  { title: 'HTTP 回應', slug: 'responses', category: 'routing' },
  
  // Frontend & Views
  { title: '視圖', slug: 'views', category: 'frontend' },
  { title: 'Blade 模板', slug: 'blade', category: 'frontend' },
  { title: '資源打包 (Vite)', slug: 'vite', category: 'frontend' },
  { title: 'URL 生成', slug: 'urls', category: 'frontend' },
  
  // Application Features
  { title: 'Session', slug: 'session', category: 'application' },
  { title: '驗證', slug: 'validation', category: 'application' },
  { title: '錯誤處理', slug: 'errors', category: 'application' },
  { title: '日誌', slug: 'logging', category: 'application' },
  { title: 'Artisan 命令列', slug: 'artisan', category: 'application' },
  
  // Database
  { title: '資料庫入門', slug: 'database', category: 'database' },
  { title: '查詢建構器', slug: 'queries', category: 'database' },
  { title: '遷移', slug: 'migrations', category: 'database' },
  { title: '填充', slug: 'seeding', category: 'database' },
  { title: 'Redis', slug: 'redis', category: 'database' },
  
  // Eloquent ORM
  { title: 'Eloquent 入門', slug: 'eloquent', category: 'eloquent' },
  { title: 'Eloquent 關聯', slug: 'eloquent-relationships', category: 'eloquent' },
  { title: 'Eloquent 集合', slug: 'eloquent-collections', category: 'eloquent' },
  { title: 'Eloquent 修改器', slug: 'eloquent-mutators', category: 'eloquent' },
  { title: 'Eloquent API 資源', slug: 'eloquent-resources', category: 'eloquent' },
  { title: 'Eloquent 序列化', slug: 'eloquent-serialization', category: 'eloquent' },
  { title: 'Eloquent 工廠', slug: 'eloquent-factories', category: 'eloquent' },
  
  // Packages
  { title: '套件開發', slug: 'packages', category: 'packages' },
  { title: '擴展包', slug: 'billing', category: 'packages' },
  { title: 'Cashier (Paddle)', slug: 'cashier-paddle', category: 'packages' },
  { title: 'Envoy', slug: 'envoy', category: 'packages' },
  { title: 'Fortify', slug: 'fortify', category: 'packages' },
  { title: 'Folio', slug: 'folio', category: 'packages' },
  { title: 'Homestead', slug: 'homestead', category: 'packages' },
  { title: 'Horizon', slug: 'horizon', category: 'packages' },
  { title: 'Mix', slug: 'mix', category: 'packages' },
  { title: 'Octane', slug: 'octane', category: 'packages' },
  { title: 'Passport', slug: 'passport', category: 'packages' },
  { title: 'Pennant', slug: 'pennant', category: 'packages' },
  { title: 'Pint', slug: 'pint', category: 'packages' },
  { title: 'Precognition', slug: 'precognition', category: 'packages' },
  { title: 'Pulse', slug: 'pulse', category: 'packages' },
  { title: 'Sail', slug: 'sail', category: 'packages' },
  { title: 'Sanctum', slug: 'sanctum', category: 'packages' },
  { title: 'Scout', slug: 'scout', category: 'packages' },
  { title: 'Socialite', slug: 'socialite', category: 'packages' },
  { title: 'Telescope', slug: 'telescope', category: 'packages' },
  { title: 'Valet', slug: 'valet', category: 'packages' },
  
  // Authentication & Security
  { title: '認證', slug: 'authentication', category: 'auth' },
  { title: '授權', slug: 'authorization', category: 'auth' },
  { title: '電子郵件驗證', slug: 'verification', category: 'auth' },
  { title: '密碼重設', slug: 'passwords', category: 'auth' },
  { title: '加密', slug: 'encryption', category: 'auth' },
  { title: '雜湊', slug: 'hashing', category: 'auth' },
  { title: '速率限制', slug: 'rate-limiting', category: 'auth' },
  
  // Advanced Features
  { title: '廣播', slug: 'broadcasting', category: 'advanced' },
  { title: '快取', slug: 'cache', category: 'advanced' },
  { title: '集合', slug: 'collections', category: 'advanced' },
  { title: '並行', slug: 'concurrency', category: 'advanced' },
  { title: '事件', slug: 'events', category: 'advanced' },
  { title: '檔案系統', slug: 'filesystem', category: 'advanced' },
  { title: '輔助函式', slug: 'helpers', category: 'advanced' },
  { title: 'HTTP 用戶端', slug: 'http-client', category: 'advanced' },
  { title: '本地化', slug: 'localization', category: 'advanced' },
  { title: '郵件', slug: 'mail', category: 'advanced' },
  { title: '通知', slug: 'notifications', category: 'advanced' },
  { title: '分頁', slug: 'pagination', category: 'advanced' },
  { title: '佇列', slug: 'queues', category: 'advanced' },
  { title: '排程', slug: 'scheduling', category: 'advanced' },
  { title: '搜尋', slug: 'search', category: 'advanced' },
  
  // Testing
  { title: '測試入門', slug: 'testing', category: 'testing' },
  { title: 'HTTP 測試', slug: 'http-tests', category: 'testing' },
  { title: '控制台測試', slug: 'console-tests', category: 'testing' },
  { title: '資料庫測試', slug: 'database-testing', category: 'testing' },
  { title: 'Mocking', slug: 'mocking', category: 'testing' },
  
  // AI & Agentic Development
  { title: 'Laravel 與 AI', slug: 'ai', category: 'ai' },
  { title: 'AI SDK', slug: 'ai-sdk', category: 'ai' },
  { title: 'MCP', slug: 'mcp', category: 'ai' },
  { title: 'Boost', slug: 'boost', category: 'ai' },
  { title: 'Prompts', slug: 'prompts', category: 'ai' },
  
  // Other
  { title: '發布說明', slug: 'releases', category: 'other' },
  { title: '升級指南', slug: 'upgrade', category: 'other' },
  { title: '貢獻指南', slug: 'contributions', category: 'other' },
  { title: '文件說明', slug: 'documentation', category: 'other' },
  { title: '合約', slug: 'contracts', category: 'other' },
  { title: '上下文', slug: 'context', category: 'other' },
  { title: 'Laravel Cloud', slug: 'cloud', category: 'other' },
  { title: 'MongoDB', slug: 'mongodb', category: 'other' },
  { title: 'Processes', slug: 'processes', category: 'other' },
  { title: '字串輔助', slug: 'strings', category: 'other' },
];

function generatePage(doc) {
  const content = `---
import DocsLayout from '../../layouts/DocsLayout.astro';

<DocsLayout title="${doc.title}" currentPath="${doc.slug}">
  <div class="mb-8">
    <nav class="text-sm text-text-secondary mb-4">
      <a href="/" class="hover:text-accent">首頁</a>
      <span class="mx-2">/</span>
      <span>${doc.title}</span>
    </nav>
    
    <h1 class="text-4xl font-bold mb-4">${doc.title}</h1>
    
    <div class="bg-bg-secondary border border-border rounded-lg p-4 mb-6">
      <p class="text-text-secondary">
        📝 此頁面正在翻譯中。如需查看原始文件，請訪問 
        <a href="https://laravel.com/docs/13.x/${doc.slug}" class="text-accent" target="_blank" rel="noopener">
          Laravel 官方文檔
        </a>
      </p>
    </div>
  </div>

  <div class="prose prose-invert max-w-none">
    <p>此頁面內容正在翻譯中，請稍後再來查看。</p>
    
    <h2>相關資源</h2>
    <ul>
      <li><a href="https://laravel.com/docs/13.x/${doc.slug}" target="_blank" rel="noopener">原始英文文件</a></li>
      <li><a href="https://github.com/laravel/framework" target="_blank" rel="noopener">Laravel GitHub 儲存庫</a></li>
    </ul>
  </div>
</DocsLayout>
`;

  return content;
}

function main() {
  console.log('🚀 開始生成文檔頁面...\n');
  
  if (!existsSync(PAGES_DIR)) {
    mkdirSync(PAGES_DIR, { recursive: true });
  }
  
  let generatedCount = 0;
  
  for (const doc of documentationStructure) {
    const filePath = join(PAGES_DIR, `${doc.slug}.astro`);
    
    // Skip if file already exists (like installation.astro)
    if (existsSync(filePath)) {
      console.log(`⏭️  跳過已存在: ${doc.slug}`);
      continue;
    }
    
    const content = generatePage(doc);
    writeFileSync(filePath, content);
    console.log(`✅ 已生成: ${doc.slug}.astro`);
    generatedCount++;
  }
  
  console.log(`\n✨ 生成完成！共生成 ${generatedCount} 個頁面`);
  console.log(`📁 頁面位置: ${PAGES_DIR}`);
  console.log('\n📋 下一步:');
  console.log('1. 翻譯每個頁面的內容');
  console.log('2. 從 Laravel GitHub 複製原始內容並翻譯');
  console.log('3. 執行 npm run dev 預覽網站');
}

main();
