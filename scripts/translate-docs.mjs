#!/usr/bin/env node

/**
 * Laravel Documentation Translator
 * Translates English Laravel docs to Traditional Chinese
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Comprehensive translation dictionary
const translations = {
  // Navigation & Structure
  'Introduction': '簡介',
  'Table of Contents': '目錄',
  'Prerequisites': '前置需求',
  'Installation': '安裝',
  'Configuration': '配置',
  'Directory Structure': '目錄結構',
  'Getting Started': '入門',
  'Next Steps': '下一步',
  'Upgrading': '升級',
  'Contributing': '貢獻',
  
  // Core Concepts
  'Routing': '路由',
  'Middleware': '中介層',
  'CSRF Protection': 'CSRF 保護',
  'Controllers': '控制器',
  'Requests': '請求',
  'Responses': '回應',
  'Views': '視圖',
  'Templates': '範本',
  'Blade Templates': 'Blade 範本',
  'Components': '元件',
  'URL Generation': 'URL 生成',
  'Session': '會話',
  'Validation': '驗證',
  'Error Handling': '錯誤處理',
  'Logging': '日誌記錄',
  
  // Database
  'Database': '資料庫',
  'Getting Started': '入門',
  'Query Builder': '查詢建構器',
  'Pagination': '分頁',
  'Migrations': '資料庫遷移',
  'Seeding': '資料填充',
  'Redis': 'Redis',
  'MongoDB': 'MongoDB',
  
  // Eloquent ORM
  'Eloquent ORM': 'Eloquent ORM',
  'Eloquent: Getting Started': 'Eloquent：入門',
  'Eloquent: Relationships': 'Eloquent：關聯',
  'Eloquent: Collections': 'Eloquent：集合',
  'Eloquent: Mutators / Casts': 'Eloquent：修改器 / 轉換器',
  'Eloquent: API Resources': 'Eloquent：API 資源',
  'Eloquent: Serialization': 'Eloquent：序列化',
  'Eloquent: Factories': 'Eloquent：工廠',
  
  // Security
  'Authentication': '認證',
  'Authorization': '授權',
  'Email Verification': '電子郵件驗證',
  'Encryption': '加密',
  'Hashing': '雜湊',
  'Password Reset': '密碼重設',
  
  // Frontend
  'Frontend': '前端',
  'Vite': 'Vite',
  'Starter Kits': '入門套件',
  'Breeze': 'Breeze',
  'Jetstream': 'Jetstream',
  'Inertia': 'Inertia',
  'Livewire': 'Livewire',
  
  // Testing
  'Testing': '測試',
  'HTTP Tests': 'HTTP 測試',
  'Console Tests': '控制台測試',
  'Browser Tests': '瀏覽器測試',
  'Database Testing': '資料庫測試',
  'Mocking': '模擬',
  
  // Services
  'Mail': '郵件',
  'Notifications': '通知',
  'Events': '事件',
  'Broadcasting': '廣播',
  'Cache': '快取',
  'Queues': '佇列',
  'Task Scheduling': '任務排程',
  'Strings': '字串',
  
  // API
  'API Authentication': 'API 認證',
  'Sanctum': 'Sanctum',
  'Passport': 'Passport',
  
  // Common Terms
  'Laravel': 'Laravel',
  'PHP': 'PHP',
  'Composer': 'Composer',
  'Artisan': 'Artisan',
  'Eloquent': 'Eloquent',
  'Facade': 'Facade',
  'Service Provider': '服務提供者',
  'Service Container': '服務容器',
  'Contract': '契約',
  'Facades': 'Facades',
  'Contracts': '契約',
  
  // Actions
  'Creating': '建立',
  'Installing': '安裝',
  'Configuring': '配置',
  'Using': '使用',
  'Deploying': '部署',
  'Testing': '測試',
  'Debugging': '除錯',
  'Optimizing': '最佳化',
  'Caching': '快取',
  'Logging': '日誌記錄',
  
  // Technical Terms
  'Dependencies': '依賴',
  'Dependency Injection': '依賴注入',
  'Inversion of Control': '控制反轉',
  'Service Container': '服務容器',
  'Service Provider': '服務提供者',
  'Repository': '儲存庫',
  'Factory': '工廠',
  'Observer': '觀察者',
  'Event': '事件',
  'Listener': '監聽器',
  'Job': '任務',
  'Command': '命令',
  'Migration': '遷移',
  'Seeder': '填充器',
  'Model': '模型',
  'Controller': '控制器',
  'View': '視圖',
  'Route': '路由',
  'Middleware': '中介層',
  'Request': '請求',
  'Response': '回應',
  'Validation': '驗證',
  'Exception': '例外',
  'Handler': '處理器',
  'Provider': '提供者',
  'Facades': 'Facades',
  
  // Database Terms
  'Database': '資料庫',
  'Table': '資料表',
  'Column': '欄位',
  'Row': '資料列',
  'Index': '索引',
  'Foreign Key': '外鍵',
  'Primary Key': '主鍵',
  'Query': '查詢',
  'Schema': '結構',
  'Connection': '連線',
  'Driver': '驅動程式',
  
  // Configuration Terms
  'Environment': '環境',
  'Configuration': '配置',
  'Settings': '設定',
  'Options': '選項',
  'Parameters': '參數',
  'Variables': '變數',
  
  // Common Phrases
  'Getting Started': '入門',
  'Prerequisites': '前置需求',
  'Installation': '安裝',
  'Configuration': '配置',
  'Basic Usage': '基本用法',
  'Advanced Usage': '進階用法',
  'Best Practices': '最佳實踐',
  'Common Issues': '常見問題',
  'Troubleshooting': '疑難排解',
  'See Also': '另請參閱',
  'Related': '相關',
  'Example': '範例',
  'Examples': '範例',
  'Note': '注意',
  'Warning': '警告',
  'Tip': '提示',
  'Important': '重要',
  
  // File Operations
  'File': '檔案',
  'Files': '檔案',
  'Directory': '目錄',
  'Path': '路徑',
  'Upload': '上傳',
  'Download': '下載',
  'Storage': '儲存',
  
  // HTTP Terms
  'HTTP': 'HTTP',
  'Request': '請求',
  'Response': '回應',
  'Header': '標頭',
  'Body': '主體',
  'Status Code': '狀態碼',
  'Method': '方法',
  'GET': 'GET',
  'POST': 'POST',
  'PUT': 'PUT',
  'DELETE': 'DELETE',
  'PATCH': 'PATCH',
  
  // Authentication Terms
  'Authentication': '認證',
  'Authorization': '授權',
  'Login': '登入',
  'Logout': '登出',
  'Register': '註冊',
  'Password': '密碼',
  'Token': '權杖',
  'Session': '會話',
  'Cookie': 'Cookie',
  'Guard': '守衛',
  'Provider': '提供者',
  
  // Testing Terms
  'Test': '測試',
  'Tests': '測試',
  'Assertion': '斷言',
  'Mock': '模擬',
  'Stub': '樁',
  'Fake': '偽造',
  'Feature Test': '功能測試',
  'Unit Test': '單元測試',
  'Browser Test': '瀏覽器測試',
  
  // Queue Terms
  'Queue': '佇列',
  'Job': '任務',
  'Worker': '工作者',
  'Driver': '驅動程式',
  'Connection': '連線',
  'Failed Jobs': '失敗任務',
  'Retry': '重試',
  
  // Cache Terms
  'Cache': '快取',
  'Store': '儲存',
  'Driver': '驅動程式',
  'Tag': '標籤',
  'Flush': '清除',
  'Remember': '記住',
  'TTL': 'TTL',
  
  // Mail Terms
  'Mail': '郵件',
  'Mailable': '可郵寄',
  'Markdown': 'Markdown',
  'Template': '範本',
  'Attachment': '附件',
  'Queue': '佇列',
  
  // Notification Terms
  'Notification': '通知',
  'Channel': '頻道',
  'SMS': '簡訊',
  'Email': '電子郵件',
  'Slack': 'Slack',
  'Database': '資料庫',
  
  // Event Terms
  'Event': '事件',
  'Listener': '監聽器',
  'Subscriber': '訂閱者',
  'Dispatch': '派發',
  'Handle': '處理',
  
  // Broadcasting Terms
  'Broadcasting': '廣播',
  'Channel': '頻道',
  'Presence Channel': '存在頻道',
  'Private Channel': '私人頻道',
  'Public Channel': '公開頻道',
  'WebSocket': 'WebSocket',
  'Echo': 'Echo',
  
  // Task Scheduling
  'Task Scheduling': '任務排程',
  'Schedule': '排程',
  'Cron': 'Cron',
  'Command': '命令',
  'Frequency': '頻率',
  
  // Strings
  'String': '字串',
  'Strings': '字串',
  'Plural': '複數',
  'Singular': '單數',
  'Slug': 'Slug',
  'Title': '標題',
  'Upper': '大寫',
  'Lower': '小寫',
  'Camel': '駝峰式',
  'Snake': '蛇式',
  'Kebab': '串式',
  'Studly': '首字大寫',
  
  // Collections
  'Collection': '集合',
  'Collections': '集合',
  'Filter': '篩選',
  'Map': '映射',
  'Reduce': '歸約',
  'Sort': '排序',
  'Unique': '唯一',
  'First': '第一個',
  'Last': '最後一個',
  'Count': '計數',
  'Sum': '總和',
  'Average': '平均',
  'Min': '最小',
  'Max': '最大',
  
  // Pagination
  'Pagination': '分頁',
  'Page': '頁面',
  'PerPage': '每頁',
  'Total': '總數',
  'Links': '連結',
  'Previous': '上一頁',
  'Next': '下一頁',
  
  // Validation
  'Validation': '驗證',
  'Rule': '規則',
  'Rules': '規則',
  'Attribute': '屬性',
  'Message': '訊息',
  'Custom': '自訂',
  'Required': '必填',
  'Email': '電子郵件',
  'Unique': '唯一',
  'Exists': '存在',
  'Confirmed': '確認',
  'Min': '最小',
  'Max': '最大',
  'Between': '之間',
  'In': '在其中',
  'Not In': '不在其中',
  'Regex': '正規表達式',
  'Date': '日期',
  'Before': '之前',
  'After': '之後',
  'Image': '圖片',
  'File': '檔案',
  'MIME': 'MIME',
  'Size': '大小',
  'Dimensions': '尺寸',
  
  // Error Handling
  'Error': '錯誤',
  'Exception': '例外',
  'Handler': '處理器',
  'Report': '報告',
  'Render': '渲染',
  'Debug': '除錯',
  'Log': '日誌',
  'Stack Trace': '堆疊追蹤',
  
  // Logging
  'Logging': '日誌記錄',
  'Channel': '頻道',
  'Stack': '堆疊',
  'Driver': '驅動程式',
  'Level': '等級',
  'Emergency': '緊急',
  'Alert': '警報',
  'Critical': '嚴重',
  'Error': '錯誤',
  'Warning': '警告',
  'Notice': '通知',
  'Info': '資訊',
  'Debug': '除錯',
};

// Technical terms to keep in English
const keepEnglish = [
  'Laravel', 'PHP', 'Composer', 'Artisan', 'Eloquent', 'Blade', 'Vite',
  'Inertia', 'Livewire', 'Sanctum', 'Passport', 'Jetstream', 'Breeze',
  'Redis', 'MySQL', 'PostgreSQL', 'SQLite', 'MongoDB', 'AWS', 'S3',
  'Docker', 'Nginx', 'Apache', 'Git', 'GitHub', 'npm', 'yarn', 'bun',
  'Webpack', 'Vite', 'Tailwind', 'Bootstrap', 'jQuery', 'React', 'Vue',
  'Angular', 'Svelte', 'Next.js', 'Nuxt', 'Node.js', 'Express',
  'REST', 'GraphQL', 'JSON', 'XML', 'CSV', 'PDF', 'HTML', 'CSS',
  'JavaScript', 'TypeScript', 'API', 'URL', 'URI', 'HTTP', 'HTTPS',
  'WebSocket', 'SSH', 'FTP', 'SMTP', 'IMAP', 'POP3',
  'CRUD', 'MVC', 'ORM', 'DI', 'IoC', 'SOLID', 'DRY', 'KISS',
  'PHPUnit', 'Jest', 'Mocha', 'Chai', 'Selenium', 'Cypress',
  'Travis', 'CircleCI', 'GitHub Actions', 'GitLab CI',
  'Stripe', 'PayPal', 'Braintree', 'Paddle',
  'Mailgun', 'Postmark', 'SendGrid', 'SES', 'SMTP',
  'Pusher', 'Ably', 'Socket.io', 'Laravel Echo',
  'Horizon', 'Telescope', 'Debugbar', 'Ide-helper',
  'Pint', 'PHPStan', 'Psalm', 'Larastan',
  'Sail', 'Forge', 'Vapor', 'Envoyer', 'Cloud',
  'Herd', 'Valet', 'Homestead', 'Sail',
];

// Section headers to translate
const sectionHeaders = {
  'Table of Contents': '目錄',
  'Introduction': '簡介',
  'Prerequisites': '前置需求',
  'Installation': '安裝',
  'Configuration': '配置',
  'Basic Usage': '基本用法',
  'Advanced Usage': '進階用法',
  'Available Methods': '可用方法',
  'Method Listing': '方法列表',
  'Parameters': '參數',
  'Return Values': '回傳值',
  'Examples': '範例',
  'Notes': '注意事項',
  'See Also': '另請參閱',
};

function translateLine(line) {
  // Skip code blocks
  if (line.trim().startsWith('```') || line.trim().startsWith('~~~')) {
    return line;
  }
  
  // Skip lines that are mostly code
  if (line.trim().startsWith('$') || line.trim().startsWith('<?php') || line.trim().startsWith('use ')) {
    return line;
  }
  
  // Skip lines with HTML tags
  if (line.includes('<a name=') || line.includes('</a>')) {
    return line;
  }
  
  // Skip empty lines
  if (line.trim() === '') {
    return line;
  }
  
  let translated = line;
  
  // Translate section headers (## Header)
  const headerMatch = translated.match(/^(#{1,6})\s+(.+)$/);
  if (headerMatch) {
    const prefix = headerMatch[1];
    let header = headerMatch[2];
    
    // Check if we have a direct translation
    if (sectionHeaders[header]) {
      return `${prefix} ${sectionHeaders[header]}`;
    }
    
    // Try to translate the header
    for (const [en, zh] of Object.entries(translations)) {
      if (header.toLowerCase() === en.toLowerCase()) {
        header = zh;
        break;
      }
    }
    
    return `${prefix} ${header}`;
  }
  
  // Translate list items
  if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
    const indent = line.match(/^(\s*)/)[1];
    let item = line.trim().substring(2);
    
    // Translate the item
    for (const [en, zh] of Object.entries(translations)) {
      // Use word boundary matching
      const regex = new RegExp(`\\b${en}\\b`, 'gi');
      item = item.replace(regex, zh);
    }
    
    return `${indent}- ${item}`;
  }
  
  // Translate regular text
  for (const [en, zh] of Object.entries(translations)) {
    // Use word boundary matching for short terms
    if (en.length <= 3) {
      const regex = new RegExp(`\\b${en}\\b`, 'g');
      translated = translated.replace(regex, zh);
    } else {
      // For longer terms, use case-insensitive matching
      const regex = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      translated = translated.replace(regex, zh);
    }
  }
  
  return translated;
}

function translateContent(content) {
  const lines = content.split('\n');
  const translatedLines = [];
  let inCodeBlock = false;
  
  for (const line of lines) {
    // Track code blocks
    if (line.trim().startsWith('```') || line.trim().startsWith('~~~')) {
      inCodeBlock = !inCodeBlock;
      translatedLines.push(line);
      continue;
    }
    
    // Don't translate inside code blocks
    if (inCodeBlock) {
      translatedLines.push(line);
      continue;
    }
    
    // Translate the line
    translatedLines.push(translateLine(line));
  }
  
  return translatedLines.join('\n');
}

function processFile(inputPath, outputPath) {
  try {
    const content = readFileSync(inputPath, 'utf-8');
    const translated = translateContent(content);
    writeFileSync(outputPath, translated, 'utf-8');
    console.log(`✓ Translated: ${inputPath} -> ${outputPath}`);
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
  }
}

// Main execution
const docsDir = join(process.cwd(), 'docs-original', 'laravel-docs');
const outputDir = join(process.cwd(), 'src', 'pages', 'docs');

// Get all markdown files
const files = readdirSync(docsDir).filter(f => f.endsWith('.md'));

console.log(`Found ${files.length} documentation files to translate...`);

// Process each file
for (const file of files) {
  const inputPath = join(docsDir, file);
  const outputPath = join(outputDir, file.replace('.md', '.astro'));
  
  // Check if output file exists
  try {
    const existingContent = readFileSync(outputPath, 'utf-8');
    
    // Extract the content between backticks
    const contentMatch = existingContent.match(/const content = `([\s\S]*?)`;/);
    if (contentMatch) {
      const originalContent = contentMatch[1];
      const translatedContent = translateContent(originalContent);
      
      // Rebuild the astro file
      const newContent = existingContent.replace(
        /const content = `([\s\S]*?)`;/,
        `const content = \`${translatedContent}\`;`
      );
      
      writeFileSync(outputPath, newContent, 'utf-8');
      console.log(`✓ Updated: ${outputPath}`);
    }
  } catch (error) {
    // File doesn't exist, create it from scratch
    const content = readFileSync(inputPath, 'utf-8');
    const translated = translateContent(content);
    
    // Create astro file
    const astroContent = `---
import DocsLayout from '../../layouts/DocsLayout.astro';

const content = \`${translated}\`;
---

<DocsLayout title="文件" currentPath="${file.replace('.md', '')}">
  <div class="prose prose-invert max-w-none" set:html={content}></div>
</DocsLayout>
`;
    
    writeFileSync(outputPath, astroContent, 'utf-8');
    console.log(`✓ Created: ${outputPath}`);
  }
}

console.log('\nTranslation complete!');
console.log(`Processed ${files.length} files.`);
