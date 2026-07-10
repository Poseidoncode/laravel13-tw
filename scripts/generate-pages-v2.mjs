#!/usr/bin/env node

/**
 * Script to generate all documentation pages with proper Astro syntax
 * Uses set:html for code examples to avoid curly brace issues
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const PAGES_DIR = './src/pages/docs';

// Complete documentation structure
const documentationStructure = [
  { title: '安裝', slug: 'installation', category: '開始使用', originalSlug: 'installation' },
  { title: '配置', slug: 'configuration', category: '開始使用', originalSlug: 'configuration' },
  { title: '目錄結構', slug: 'structure', category: '開始使用', originalSlug: 'structure' },
  { title: '前端', slug: 'frontend', category: '開始使用', originalSlug: 'frontend' },
  { title: '入門套件', slug: 'starter-kits', category: '開始使用', originalSlug: 'starter-kits' },
  { title: '部署', slug: 'deployment', category: '開始使用', originalSlug: 'deployment' },
  { title: '請求生命週期', slug: 'lifecycle', category: '核心概念', originalSlug: 'lifecycle' },
  { title: '服務容器', slug: 'container', category: '核心概念', originalSlug: 'container' },
  { title: '服務提供者', slug: 'providers', category: '核心概念', originalSlug: 'providers' },
  { title: 'Facades', slug: 'facades', category: '核心概念', originalSlug: 'facades' },
  { title: '路由', slug: 'routing', category: '路由與請求', originalSlug: 'routing' },
  { title: '中介層', slug: 'middleware', category: '路由與請求', originalSlug: 'middleware' },
  { title: 'CSRF 保護', slug: 'csrf', category: '路由與請求', originalSlug: 'csrf' },
  { title: '控制器', slug: 'controllers', category: '路由與請求', originalSlug: 'controllers' },
  { title: 'HTTP 請求', slug: 'requests', category: '路由與請求', originalSlug: 'requests' },
  { title: 'HTTP 回應', slug: 'responses', category: '路由與請求', originalSlug: 'responses' },
  { title: '視圖', slug: 'views', category: '前端與視圖', originalSlug: 'views' },
  { title: 'Blade 模板', slug: 'blade', category: '前端與視圖', originalSlug: 'blade' },
  { title: '資源打包 (Vite)', slug: 'vite', category: '前端與視圖', originalSlug: 'vite' },
  { title: 'URL 生成', slug: 'urls', category: '前端與視圖', originalSlug: 'urls' },
  { title: 'Session', slug: 'session', category: '應用功能', originalSlug: 'session' },
  { title: '驗證', slug: 'validation', category: '應用功能', originalSlug: 'validation' },
  { title: '錯誤處理', slug: 'errors', category: '應用功能', originalSlug: 'errors' },
  { title: '日誌', slug: 'logging', category: '應用功能', originalSlug: 'logging' },
  { title: 'Artisan 命令列', slug: 'artisan', category: '應用功能', originalSlug: 'artisan' },
  { title: '資料庫入門', slug: 'database', category: '資料庫', originalSlug: 'database' },
  { title: '查詢建構器', slug: 'queries', category: '資料庫', originalSlug: 'queries' },
  { title: '遷移', slug: 'migrations', category: '資料庫', originalSlug: 'migrations' },
  { title: '填充', slug: 'seeding', category: '資料庫', originalSlug: 'seeding' },
  { title: 'Redis', slug: 'redis', category: '資料庫', originalSlug: 'redis' },
  { title: 'Eloquent 入門', slug: 'eloquent', category: 'Eloquent ORM', originalSlug: 'eloquent' },
  { title: 'Eloquent 關聯', slug: 'eloquent-relationships', category: 'Eloquent ORM', originalSlug: 'eloquent-relationships' },
  { title: 'Eloquent 集合', slug: 'eloquent-collections', category: 'Eloquent ORM', originalSlug: 'eloquent-collections' },
  { title: 'Eloquent 修改器', slug: 'eloquent-mutators', category: 'Eloquent ORM', originalSlug: 'eloquent-mutators' },
  { title: 'Eloquent API 資源', slug: 'eloquent-resources', category: 'Eloquent ORM', originalSlug: 'eloquent-resources' },
  { title: 'Eloquent 序列化', slug: 'eloquent-serialization', category: 'Eloquent ORM', originalSlug: 'eloquent-serialization' },
  { title: 'Eloquent 工廠', slug: 'eloquent-factories', category: 'Eloquent ORM', originalSlug: 'eloquent-factories' },
  { title: '套件開發', slug: 'packages', category: '套件開發', originalSlug: 'packages' },
  { title: '擴展包', slug: 'billing', category: '套件開發', originalSlug: 'billing' },
  { title: 'Cashier (Paddle)', slug: 'cashier-paddle', category: '套件開發', originalSlug: 'cashier-paddle' },
  { title: 'Envoy', slug: 'envoy', category: '套件開發', originalSlug: 'envoy' },
  { title: 'Fortify', slug: 'fortify', category: '套件開發', originalSlug: 'fortify' },
  { title: 'Folio', slug: 'folio', category: '套件開發', originalSlug: 'folio' },
  { title: 'Homestead', slug: 'homestead', category: '套件開發', originalSlug: 'homestead' },
  { title: 'Horizon', slug: 'horizon', category: '套件開發', originalSlug: 'horizon' },
  { title: 'Mix', slug: 'mix', category: '套件開發', originalSlug: 'mix' },
  { title: 'Octane', slug: 'octane', category: '套件開發', originalSlug: 'octane' },
  { title: 'Passport', slug: 'passport', category: '套件開發', originalSlug: 'passport' },
  { title: 'Pennant', slug: 'pennant', category: '套件開發', originalSlug: 'pennant' },
  { title: 'Pint', slug: 'pint', category: '套件開發', originalSlug: 'pint' },
  { title: 'Precognition', slug: 'precognition', category: '套件開發', originalSlug: 'precognition' },
  { title: 'Pulse', slug: 'pulse', category: '套件開發', originalSlug: 'pulse' },
  { title: 'Sail', slug: 'sail', category: '套件開發', originalSlug: 'sail' },
  { title: 'Sanctum', slug: 'sanctum', category: '套件開發', originalSlug: 'sanctum' },
  { title: 'Scout', slug: 'scout', category: '套件開發', originalSlug: 'scout' },
  { title: 'Socialite', slug: 'socialite', category: '套件開發', originalSlug: 'socialite' },
  { title: 'Telescope', slug: 'telescope', category: '套件開發', originalSlug: 'telescope' },
  { title: 'Valet', slug: 'valet', category: '套件開發', originalSlug: 'valet' },
  { title: '認證', slug: 'authentication', category: '認證與安全', originalSlug: 'authentication' },
  { title: '授權', slug: 'authorization', category: '認證與安全', originalSlug: 'authorization' },
  { title: '電子郵件驗證', slug: 'verification', category: '認證與安全', originalSlug: 'verification' },
  { title: '密碼重設', slug: 'passwords', category: '認證與安全', originalSlug: 'passwords' },
  { title: '加密', slug: 'encryption', category: '認證與安全', originalSlug: 'encryption' },
  { title: '雜湊', slug: 'hashing', category: '認證與安全', originalSlug: 'hashing' },
  { title: '速率限制', slug: 'rate-limiting', category: '認證與安全', originalSlug: 'rate-limiting' },
  { title: '廣播', slug: 'broadcasting', category: '進階功能', originalSlug: 'broadcasting' },
  { title: '快取', slug: 'cache', category: '進階功能', originalSlug: 'cache' },
  { title: '集合', slug: 'collections', category: '進階功能', originalSlug: 'collections' },
  { title: '並行', slug: 'concurrency', category: '進階功能', originalSlug: 'concurrency' },
  { title: '事件', slug: 'events', category: '進階功能', originalSlug: 'events' },
  { title: '檔案系統', slug: 'filesystem', category: '進階功能', originalSlug: 'filesystem' },
  { title: '輔助函式', slug: 'helpers', category: '進階功能', originalSlug: 'helpers' },
  { title: 'HTTP 客戶端', slug: 'http-client', category: '進階功能', originalSlug: 'http-client' },
  { title: '本地化', slug: 'localization', category: '進階功能', originalSlug: 'localization' },
  { title: '郵件', slug: 'mail', category: '進階功能', originalSlug: 'mail' },
  { title: '通知', slug: 'notifications', category: '進階功能', originalSlug: 'notifications' },
  { title: '分頁', slug: 'pagination', category: '進階功能', originalSlug: 'pagination' },
  { title: '佇列', slug: 'queues', category: '進階功能', originalSlug: 'queues' },
  { title: '排程', slug: 'scheduling', category: '進階功能', originalSlug: 'scheduling' },
  { title: '搜尋', slug: 'search', category: '進階功能', originalSlug: 'search' },
  { title: '測試入門', slug: 'testing', category: '測試', originalSlug: 'testing' },
  { title: 'HTTP 測試', slug: 'http-tests', category: '測試', originalSlug: 'http-tests' },
  { title: '控制台測試', slug: 'console-tests', category: '測試', originalSlug: 'console-tests' },
  { title: '資料庫測試', slug: 'database-testing', category: '測試', originalSlug: 'database-testing' },
  { title: 'Mocking', slug: 'mocking', category: '測試', originalSlug: 'mocking' },
  { title: 'Laravel 與 AI', slug: 'ai', category: 'AI 與 Agentic 開發', originalSlug: 'ai' },
  { title: 'AI SDK', slug: 'ai-sdk', category: 'AI 與 Agentic 開發', originalSlug: 'ai-sdk' },
  { title: 'MCP', slug: 'mcp', category: 'AI 與 Agentic 開發', originalSlug: 'mcp' },
  { title: 'Boost', slug: 'boost', category: 'AI 與 Agentic 開發', originalSlug: 'boost' },
  { title: 'Prompts', slug: 'prompts', category: 'AI 與 Agentic 開發', originalSlug: 'prompts' },
  { title: '發布說明', slug: 'releases', category: '其他', originalSlug: 'releases' },
  { title: '升級指南', slug: 'upgrade', category: '其他', originalSlug: 'upgrade' },
  { title: '貢獻指南', slug: 'contributions', category: '其他', originalSlug: 'contributions' },
  { title: '文件說明', slug: 'documentation', category: '其他', originalSlug: 'documentation' },
  { title: '合約', slug: 'contracts', category: '其他', originalSlug: 'contracts' },
  { title: '上下文', slug: 'context', category: '其他', originalSlug: 'context' },
  { title: 'Laravel Cloud', slug: 'cloud', category: '其他', originalSlug: 'cloud' },
  { title: 'MongoDB', slug: 'mongodb', category: '其他', originalSlug: 'mongodb' },
  { title: 'Processes', slug: 'processes', category: '其他', originalSlug: 'processes' },
  { title: '字串輔助', slug: 'strings', category: '其他', originalSlug: 'strings' },
];

function generatePage(doc) {
  const content = `---
import DocsLayout from '../../layouts/DocsLayout.astro';
---

<DocsLayout title="${doc.title}" currentPath="${doc.slug}">
  <div class="mb-8">
    <nav class="text-sm text-text-secondary mb-4">
      <a href="/" class="hover:text-accent">首頁</a>
      <span class="mx-2">/</span>
      <span>${doc.category}</span>
      <span class="mx-2">/</span>
      <span>${doc.title}</span>
    </nav>
    
    <h1 class="text-4xl font-bold mb-4">${doc.title}</h1>
    
    <div class="bg-bg-secondary border border-border rounded-lg p-4 mb-6">
      <p class="text-text-secondary">
        📝 此頁面正在翻譯中。如需查看原始文件，請訪問 
        <a href="https://laravel.com/docs/13.x/${doc.originalSlug}" class="text-accent" target="_blank" rel="noopener">
          Laravel 官方文檔
        </a>
      </p>
    </div>
  </div>

  <div class="prose prose-invert max-w-none">
    <p>此頁面內容正在翻譯中，請稍後再來查看。</p>
    
    <h2>相關資源</h2>
    <ul>
      <li><a href="https://laravel.com/docs/13.x/${doc.originalSlug}" target="_blank" rel="noopener">原始英文文件</a></li>
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
    
    const content = generatePage(doc);
    writeFileSync(filePath, content);
    console.log(`✅ 已生成: ${doc.slug}.astro`);
    generatedCount++;
  }
  
  console.log(`\n✨ 生成完成！共生成 ${generatedCount} 個頁面`);
}

main();
