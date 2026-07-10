#!/usr/bin/env node

/**
 * Enhanced Translation Script for Laravel 13.x Documentation
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const DOCS_ORIGINAL = './docs-original/laravel-docs';
const PAGES_DIR = './src/pages/docs';

// Common phrase translations
const PHRASE_TRANSLATIONS = {
  'Introduction': '簡介',
  'Getting Started': '入門',
  'Prerequisites': '前置條件',
  'Installation': '安裝',
  'Configuration': '配置',
  'Basic Usage': '基本用法',
  'Advanced Usage': '進階用法',
  'Available Methods': '可用方法',
  'Method Reference': '方法參考',
  'Parameters': '參數',
  'Return Values': '回傳值',
  'Examples': '範例',
  'Usage': '使用方式',
  'Customization': '自訂',
  'Troubleshooting': '疑難排解',
  'Common Issues': '常見問題',
  'Best Practices': '最佳實踐',
  'Security': '安全性',
  'Performance': '效能',
  'Caching': '快取',
  'Debugging': '除錯',
  'Testing': '測試',
  'Deployment': '部署',
  'Production': '生產環境',
  'Development': '開發環境',
  'Local Development': '本機開發',
  'Environment Variables': '環境變數',
  'Additional Information': '額外資訊',
  'See Also': '另請參閱',
  'Next Steps': '下一步',
  'Related Topics': '相關主題',
  'Table of Contents': '目錄',
  'In this section,': '在本節中，',
  'This section covers': '本節涵蓋',
  'For example:': '例如：',
  'For example,': '例如，',
  'Note:': '注意：',
  'Warning:': '警告：',
  'Tip:': '提示：',
  'Important:': '重要：',
  'See the': '請參閱',
  'documentation for more information.': '文件以獲取更多資訊。',
  'for more information.': '以獲取更多資訊。',
  'Refer to the': '請參考',
  'Check out the': '請查看',
  'You may also be interested in': '您可能也有興趣了解',
  'As you can see,': '如您所見，',
  'In this example,': '在這個範例中，',
  'The following example demonstrates': '以下範例展示',
  'Here is an example of': '這是一個',
  'To get started,': '要開始，',
  'First,': '首先，',
  'Next,': '接下來，',
  'Finally,': '最後，',
  'However,': '然而，',
  'Therefore,': '因此，',
  'Additionally,': '此外，',
  'Furthermore,': '此外，',
  'Moreover,': '而且，',
  'On the other hand,': '另一方面，',
  'In contrast,': '相對地，',
  'Similarly,': '同樣地，',
  'As a result,': '因此，',
  'As mentioned above,': '如上所述，',
  'As shown below,': '如下所示，',
  'In summary,': '總結來說，',
  'To summarize,': '總結來說，',
  'To learn more about': '要了解更多關於',
  'For more information, see': '更多資訊，請參閱',
  'Please refer to': '請參考',
  'You can find more information in the': '您可以在',
  'documentation.': '文件中找到更多資訊。',
  'To create a new': '要建立一個新的',
  'To install': '要安裝',
  'To configure': '要配置',
  'To use': '要使用',
  'To enable': '要啟用',
  'To disable': '要停用',
  'To update': '要更新',
  'To delete': '要刪除',
  'To remove': '要移除',
  'To add': '要新增',
  'To modify': '要修改',
  'To change': '要更改',
  'To set': '要設定',
  'To get': '要取得',
  'To retrieve': '要檢索',
  'To fetch': '要擷取',
  'To save': '要儲存',
  'To store': '要儲存',
  'To run': '要執行',
  'To execute': '要執行',
  'To publish': '要發布',
  'To migrate': '要遷移',
  'To seed': '要填充',
  'To test': '要測試',
  'To deploy': '要部署',
  'To debug': '要除錯',
  'To cache': '要快取',
  'To clear': '要清除',
  'To reset': '要重設',
  'To refresh': '要重新整理',
  'To validate': '要驗證',
  'To authorize': '要授權',
  'To authenticate': '要認證',
  'To generate': '要生成',
  'To compile': '要編譯',
  'To build': '要建構',
  'To serve': '要提供服務',
  'To listen': '要監聽',
  'To connect': '要連線',
  'To disconnect': '要斷線',
  'To start': '要啟動',
  'To stop': '要停止',
  'To restart': '要重新啟動',
  'To check': '要檢查',
  'To verify': '要驗證',
  'To confirm': '要確認',
  'To ensure': '要確保',
  'To make sure': '要確保',
  'You can': '您可以',
  'You should': '您應該',
  'You must': '您必須',
  'You need to': '您需要',
  'You may': '您可以',
  'You might': '您可能',
  'It is recommended': '建議',
  'It is important': '重要的是',
  'It is possible': '可能',
  'It is necessary': '有必要',
  'This will': '這將',
  'This allows': '這允許',
  'This enables': '這啟用',
  'This prevents': '這防止',
  'This ensures': '這確保',
  'This method': '此方法',
  'This function': '此函式',
  'This property': '此屬性',
  'This class': '此類別',
  'This file': '此檔案',
  'This directory': '此目錄',
  'This configuration': '此配置',
  'This setting': '此設定',
  'This option': '此選項',
  'This feature': '此功能',
  'This package': '此套件',
  'This service': '此服務',
  'This component': '此元件',
  'The following': '以下',
  'The above': '以上',
  'The default': '預設',
  'By default': '預設情況下',
  'In this case': '在這種情況下',
  'In this example': '在這個範例中',
  'In the example above': '在上面的範例中',
  'In the example below': '在下面的範例中',
  'The result will be': '結果將是',
  'The output will be': '輸出將是',
  'The response will be': '回應將是',
  'This is useful for': '這對於',
  'This is helpful for': '這對於',
  'This is particularly useful': '這特別有用',
  'This is especially useful': '這特別有用',
  'This is important because': '這很重要，因為',
  'This is necessary because': '這是必要的，因為',
  'Please note that': '請注意',
  'Keep in mind that': '請記住',
  'Remember that': '請記住',
  'Be aware that': '請注意',
  'Make sure that': '請確保',
  'Ensure that': '請確保',
  'It should be noted that': '應該注意的是',
  'It is worth noting that': '值得注意的是',
  'It is important to note that': '重要的是要注意',
  'The key thing to remember is': '需要記住的關鍵是',
  'The most important thing': '最重要的事情',
  'The first thing': '第一件事',
  'The next step': '下一步',
  'The last step': '最後一步',
  'Here are the steps': '以下是步驟',
  'Follow these steps': '請按照以下步驟',
};

// Term translations
const TERM_MAP = {
  'Eloquent': 'Eloquent',
  'Blade': 'Blade',
  'Artisan': 'Artisan',
  'Facade': 'Facade',
  'Facades': 'Facades',
  'Middleware': '中介層',
  'Controller': '控制器',
  'Controllers': '控制器',
  'Route': '路由',
  'Routes': '路由',
  'Routing': '路由',
  'Request': '請求',
  'Requests': '請求',
  'Response': '回應',
  'Responses': '回應',
  'View': '視圖',
  'Views': '視圖',
  'Model': '模型',
  'Models': '模型',
  'Migration': '遷移',
  'Migrations': '遷移',
  'Seeder': '填充',
  'Seeders': '填充',
  'Seeding': '填充',
  'Factory': '工廠',
  'Factories': '工廠',
  'Queue': '佇列',
  'Queues': '佇列',
  'Job': '任務',
  'Jobs': '任務',
  'Event': '事件',
  'Events': '事件',
  'Listener': '監聽器',
  'Listeners': '監聽器',
  'Service Provider': '服務提供者',
  'Service Providers': '服務提供者',
  'Service Container': '服務容器',
  'Dependency Injection': '依賴注入',
  'Interface': '介面',
  'Interfaces': '介面',
  'Trait': '特徵',
  'Traits': '特徵',
  'Contract': '合約',
  'Contracts': '合約',
  'Database': '資料庫',
  'Query Builder': '查詢建構器',
  'Table': '資料表',
  'Tables': '資料表',
  'Column': '欄位',
  'Columns': '欄位',
  'Row': '資料列',
  'Rows': '資料列',
  'Index': '索引',
  'Indexes': '索引',
  'Foreign Key': '外鍵',
  'Primary Key': '主鍵',
  'Relationship': '關聯',
  'Relationships': '關聯',
  'Authentication': '認證',
  'Authorization': '授權',
  'Gate': '閘道',
  'Gates': '閘道',
  'Policy': '政策',
  'Policies': '政策',
  'Guard': '守衛',
  'Guards': '守衛',
  'Password': '密碼',
  'Passwords': '密碼',
  'Token': '權杖',
  'Tokens': '權杖',
  'Test': '測試',
  'Tests': '測試',
  'Testing': '測試',
  'Assertion': '斷言',
  'Assertions': '斷言',
  'Mock': '模擬',
  'Mocking': '模擬',
  'Feature Test': '功能測試',
  'Unit Test': '單元測試',
  'Configuration': '配置',
  'Environment': '環境',
  'Cache': '快取',
  'Caching': '快取',
  'Session': 'Session',
  'Cookie': 'Cookie',
  'Frontend': '前端',
  'Backend': '後端',
  'Asset': '資源',
  'Assets': '資源',
  'Package': '套件',
  'Packages': '套件',
  'Extension': '擴展',
  'Extensions': '擴展',
  'Helper': '輔助函式',
  'Helpers': '輔助函式',
  'Collection': '集合',
  'Collections': '集合',
  'Notification': '通知',
  'Notifications': '通知',
  'Mail': '郵件',
  'Email': '電子郵件',
  'Storage': '儲存',
  'Filesystem': '檔案系統',
  'File': '檔案',
  'Files': '檔案',
  'Broadcasting': '廣播',
  'Server': '伺服器',
  'Client': '用戶端',
  'Browser': '瀏覽器',
  'Application': '應用程式',
  'Framework': '框架',
  'Library': '函式庫',
  'Dependency': '依賴',
  'Dependencies': '依賴',
  'Version': '版本',
  'Update': '更新',
  'Upgrade': '升級',
  'Install': '安裝',
  'Uninstall': '解除安裝',
  'Setup': '設定',
  'Initialize': '初始化',
  'Create': '建立',
  'Delete': '刪除',
  'Remove': '移除',
  'Add': '新增',
  'Edit': '編輯',
  'Modify': '修改',
  'Change': '更改',
  'Save': '儲存',
  'Load': '載入',
  'Fetch': '擷取',
  'Send': '傳送',
  'Receive': '接收',
  'Process': '處理',
  'Handle': '處理',
  'Execute': '執行',
  'Run': '執行',
  'Start': '啟動',
  'Stop': '停止',
  'Restart': '重新啟動',
  'Enable': '啟用',
  'Disable': '停用',
  'Connect': '連線',
  'Disconnect': '斷線',
  'Register': '註冊',
  'Login': '登入',
  'Logout': '登出',
  'Authenticate': '認證',
  'Authorize': '授權',
  'Validate': '驗證',
  'Verify': '驗證',
  'Check': '檢查',
  'Debug': '除錯',
  'Log': '記錄',
  'Error': '錯誤',
  'Warning': '警告',
  'Info': '資訊',
  'Success': '成功',
  'Failure': '失敗',
  'Exception': '例外',
  'Handler': '處理器',
  'Manager': '管理器',
  'Service': '服務',
  'Provider': '提供者',
  'Container': '容器',
  'Resolver': '解析器',
  'Builder': '建構器',
  'Query': '查詢',
  'Result': '結果',
  'Header': '標頭',
  'Body': '主體',
  'Status': '狀態',
  'Code': '程式碼',
  'Message': '訊息',
  'Data': '資料',
  'Value': '值',
  'Key': '鍵',
  'Item': '項目',
  'List': '清單',
  'Array': '陣列',
  'Object': '物件',
  'String': '字串',
  'Number': '數字',
  'Boolean': '布林',
  'Integer': '整數',
  'Float': '浮點數',
  'Date': '日期',
  'Time': '時間',
  'Timestamp': '時間戳',
  'DateTime': '日期時間',
  'Period': '期間',
  'Duration': '持續時間',
  'Interval': '間隔',
  'Schedule': '排程',
  'Task': '任務',
  'Command': '命令',
  'Argument': '引數',
  'Option': '選項',
  'Flag': '標誌',
  'Parameter': '參數',
  'Input': '輸入',
  'Output': '輸出',
  'Console': '控制台',
  'Terminal': '終端機',
  'Shell': 'Shell',
  'Bash': 'Bash',
  'Windows': 'Windows',
  'macOS': 'macOS',
  'Linux': 'Linux',
  'Ubuntu': 'Ubuntu',
  'Debian': 'Debian',
  'CentOS': 'CentOS',
  'Alpine': 'Alpine',
  'Nginx': 'Nginx',
  'Apache': 'Apache',
  'Caddy': 'Caddy',
  'Docker': 'Docker',
  'Git': 'Git',
  'GitHub': 'GitHub',
  'CLI': 'CLI',
  'UI': 'UI',
  'UX': 'UX',
  'REST': 'REST',
  'RESTful': 'RESTful',
  'Cloud': '雲端',
  'Security': '安全性',
  'Encryption': '加密',
  'Hash': '雜湊',
  'Rate Limiting': '速率限制',
  'Throttling': '節流',
  'Brute Force': '暴力破解',
  'CSRF': 'CSRF',
  'XSS': 'XSS',
  'SQL Injection': 'SQL 注入',
  'CORS': 'CORS',
};

/**
 * Translate a line of text
 */
function translateLine(line) {
  let translated = line;
  
  // Don't translate code blocks or empty lines
  if (translated.trim() === '' || translated.trim().startsWith('```') || translated.trim().startsWith('    ')) {
    return translated;
  }
  
  // Translate common phrases
  for (const [en, zh] of Object.entries(PHRASE_TRANSLATIONS)) {
    translated = translated.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), zh);
  }
  
  // Translate terms
  for (const [en, zh] of Object.entries(TERM_MAP)) {
    if (en !== zh) {
      const termRegex = new RegExp('\\b' + en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
      translated = translated.replace(termRegex, zh);
    }
  }
  
  return translated;
}

/**
 * Translate markdown content
 */
function translateMarkdown(content) {
  const lines = content.split('\n');
  const translatedLines = [];
  let inCodeBlock = false;
  
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      translatedLines.push(line);
      continue;
    }
    
    if (inCodeBlock) {
      translatedLines.push(line);
      continue;
    }
    
    translatedLines.push(translateLine(line));
  }
  
  return translatedLines.join('\n');
}

// Category mapping
const CATEGORY_MAP = {
  'installation': '開始使用',
  'configuration': '開始使用',
  'structure': '開始使用',
  'frontend': '開始使用',
  'starter-kits': '開始使用',
  'deployment': '開始使用',
  'lifecycle': '核心概念',
  'container': '核心概念',
  'providers': '核心概念',
  'facades': '核心概念',
  'routing': '路由與請求',
  'middleware': '路由與請求',
  'csrf': '路由與請求',
  'controllers': '路由與請求',
  'requests': '路由與請求',
  'responses': '路由與請求',
  'views': '前端與視圖',
  'blade': '前端與視圖',
  'vite': '前端與視圖',
  'urls': '前端與視圖',
  'session': '應用功能',
  'validation': '應用功能',
  'errors': '應用功能',
  'logging': '應用功能',
  'artisan': '應用功能',
  'database': '資料庫',
  'queries': '資料庫',
  'migrations': '資料庫',
  'seeding': '資料庫',
  'redis': '資料庫',
  'eloquent': 'Eloquent ORM',
  'eloquent-relationships': 'Eloquent ORM',
  'eloquent-collections': 'Eloquent ORM',
  'eloquent-mutators': 'Eloquent ORM',
  'eloquent-resources': 'Eloquent ORM',
  'eloquent-serialization': 'Eloquent ORM',
  'eloquent-factories': 'Eloquent ORM',
  'packages': '套件開發',
  'billing': '套件開發',
  'cashier-paddle': '套件開發',
  'envoy': '套件開發',
  'fortify': '套件開發',
  'folio': '套件開發',
  'homestead': '套件開發',
  'horizon': '套件開發',
  'mix': '套件開發',
  'octane': '套件開發',
  'passport': '套件開發',
  'pennant': '套件開發',
  'pint': '套件開發',
  'precognition': '套件開發',
  'pulse': '套件開發',
  'sail': '套件開發',
  'sanctum': '套件開發',
  'scout': '套件開發',
  'socialite': '套件開發',
  'telescope': '套件開發',
  'valet': '套件開發',
  'authentication': '認證與安全',
  'authorization': '認證與安全',
  'verification': '認證與安全',
  'passwords': '認證與安全',
  'encryption': '認證與安全',
  'hashing': '認證與安全',
  'rate-limiting': '認證與安全',
  'broadcasting': '進階功能',
  'cache': '進階功能',
  'collections': '進階功能',
  'concurrency': '進階功能',
  'events': '進階功能',
  'filesystem': '進階功能',
  'helpers': '進階功能',
  'http-client': '進階功能',
  'localization': '進階功能',
  'mail': '進階功能',
  'notifications': '進階功能',
  'pagination': '進階功能',
  'queues': '進階功能',
  'scheduling': '進階功能',
  'search': '進階功能',
  'testing': '測試',
  'http-tests': '測試',
  'console-tests': '測試',
  'database-testing': '測試',
  'mocking': '測試',
  'ai': 'AI 與 Agentic 開發',
  'ai-sdk': 'AI 與 Agentic 開發',
  'mcp': 'AI 與 Agentic 開發',
  'boost': 'AI 與 Agentic 開發',
  'prompts': 'AI 與 Agentic 開發',
  'releases': '其他',
  'upgrade': '其他',
  'contributions': '其他',
  'documentation': '其他',
  'contracts': '其他',
  'context': '其他',
  'cloud': '其他',
  'mongodb': '其他',
  'processes': '其他',
  'strings': '其他',
};

// Title mapping
const TITLE_MAP = {
  'installation': '安裝',
  'configuration': '配置',
  'structure': '目錄結構',
  'frontend': '前端',
  'starter-kits': '入門套件',
  'deployment': '部署',
  'lifecycle': '請求生命週期',
  'container': '服務容器',
  'providers': '服務提供者',
  'facades': 'Facades',
  'routing': '路由',
  'middleware': '中介層',
  'csrf': 'CSRF 保護',
  'controllers': '控制器',
  'requests': 'HTTP 請求',
  'responses': 'HTTP 回應',
  'views': '視圖',
  'blade': 'Blade 模板',
  'vite': '資源打包 (Vite)',
  'urls': 'URL 生成',
  'session': 'Session',
  'validation': '驗證',
  'errors': '錯誤處理',
  'logging': '日誌',
  'artisan': 'Artisan 命令列',
  'database': '資料庫入門',
  'queries': '查詢建構器',
  'migrations': '遷移',
  'seeding': '填充',
  'redis': 'Redis',
  'eloquent': 'Eloquent 入門',
  'eloquent-relationships': 'Eloquent 關聯',
  'eloquent-collections': 'Eloquent 集合',
  'eloquent-mutators': 'Eloquent 修改器',
  'eloquent-resources': 'Eloquent API 資源',
  'eloquent-serialization': 'Eloquent 序列化',
  'eloquent-factories': 'Eloquent 工廠',
  'packages': '套件開發',
  'billing': '擴展包',
  'cashier-paddle': 'Cashier (Paddle)',
  'envoy': 'Envoy',
  'fortify': 'Fortify',
  'folio': 'Folio',
  'homestead': 'Homestead',
  'horizon': 'Horizon',
  'mix': 'Mix',
  'octane': 'Octane',
  'passport': 'Passport',
  'pennant': 'Pennant',
  'pint': 'Pint',
  'precognition': 'Precognition',
  'pulse': 'Pulse',
  'sail': 'Sail',
  'sanctum': 'Sanctum',
  'scout': 'Scout',
  'socialite': 'Socialite',
  'telescope': 'Telescope',
  'valet': 'Valet',
  'authentication': '認證',
  'authorization': '授權',
  'verification': '電子郵件驗證',
  'passwords': '密碼重設',
  'encryption': '加密',
  'hashing': '雜湊',
  'rate-limiting': '速率限制',
  'broadcasting': '廣播',
  'cache': '快取',
  'collections': '集合',
  'concurrency': '並行',
  'events': '事件',
  'filesystem': '檔案系統',
  'helpers': '輔助函式',
  'http-client': 'HTTP 用戶端',
  'localization': '本地化',
  'mail': '郵件',
  'notifications': '通知',
  'pagination': '分頁',
  'queues': '佇列',
  'scheduling': '排程',
  'search': '搜尋',
  'testing': '測試入門',
  'http-tests': 'HTTP 測試',
  'console-tests': '控制台測試',
  'database-testing': '資料庫測試',
  'mocking': 'Mocking',
  'ai': 'Laravel 與 AI',
  'ai-sdk': 'AI SDK',
  'mcp': 'MCP',
  'boost': 'Boost',
  'prompts': 'Prompts',
  'releases': '發布說明',
  'upgrade': '升級指南',
  'contributions': '貢獻指南',
  'documentation': '文件說明',
  'contracts': '合約',
  'context': '上下文',
  'cloud': 'Laravel Cloud',
  'mongodb': 'MongoDB',
  'processes': 'Processes',
  'strings': '字串輔助',
};

/**
 * Generate Astro page from translated content
 */
function generateAstroPage(slug, title, category, translatedContent) {
  const escapedContent = translatedContent
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
  
  return `---
import DocsLayout from '../../layouts/DocsLayout.astro';

const content = \`${escapedContent}\`;
---

<DocsLayout title="${title}" currentPath="${slug}">
  <div class="mb-8">
    <nav class="text-sm text-text-secondary mb-4">
      <a href="/" class="hover:text-accent">首頁</a>
      <span class="mx-2">/</span>
      <span>${category}</span>
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

/**
 * Process a single documentation file
 */
function processFile(filename) {
  const slug = basename(filename, '.md');
  const originalPath = join(DOCS_ORIGINAL, filename);
  const outputPath = join(PAGES_DIR, `${slug}.astro`);
  
  if (!existsSync(originalPath)) {
    console.log(`⚠️  原始檔案不存在: ${filename}`);
    return false;
  }
  
  const content = readFileSync(originalPath, 'utf-8');
  const translatedContent = translateMarkdown(content);
  
  const title = TITLE_MAP[slug] || slug;
  const category = CATEGORY_MAP[slug] || '其他';
  
  const astroContent = generateAstroPage(slug, title, category, translatedContent);
  
  writeFileSync(outputPath, astroContent);
  console.log(`✅ 已翻譯: ${slug}`);
  
  return true;
}

/**
 * Main function
 */
function main() {
  console.log('🚀 開始增強翻譯 Laravel 文檔...\n');
  
  if (!existsSync(DOCS_ORIGINAL)) {
    console.log('❌ 原始文檔目錄不存在');
    process.exit(1);
  }
  
  const files = readdirSync(DOCS_ORIGINAL).filter(f => f.endsWith('.md'));
  let successCount = 0;
  let failCount = 0;
  
  for (const file of files) {
    try {
      if (processFile(file)) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (error) {
      console.log(`❌ 翻譯失敗: ${file} - ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n✨ 增強翻譯完成！`);
  console.log(`✅ 成功: ${successCount} 個檔案`);
  console.log(`❌ 失敗: ${failCount} 個檔案`);
}

main();
