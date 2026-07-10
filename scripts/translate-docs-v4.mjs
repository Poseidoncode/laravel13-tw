#!/usr/bin/env node

/**
 * Laravel Documentation Translator - Traditional Chinese (Simplified)
 * Focuses on translating headers and key phrases
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { marked } from 'marked';

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: false,
});

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
  'http-client': 'HTTP 客戶端',
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

// Common header translations
const headerTranslations = {
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
  'Basic Usage': '基本用法',
  'Advanced Usage': '進階用法',
  'Available Methods': '可用方法',
  'Method Listing': '方法列表',
  'Return Values': '回傳值',
  'Examples': '範例',
  'Notes': '注意事項',
  'See Also': '另請參閱',
  'Summary': '摘要',
  'Overview': '概述',
  'Background': '背景',
  'Requirements': '需求',
  'Dependencies': '依賴',
  'Setup': '設定',
  'Customization': '自訂',
  'Options': '選項',
  'Parameters': '參數',
  'Properties': '屬性',
  'Methods': '方法',
  'Events': '事件',
  'Hooks': '鉤子',
  'Callbacks': '回呼',
  'Handlers': '處理器',
  'Listeners': '監聽器',
  'Subscribers': '訂閱者',
  'Dispatchers': '派發器',
  'Providers': '提供者',
  'Facades': 'Facades',
  'Contracts': '契約',
  'Interfaces': '介面',
  'Traits': '特徵',
  'Classes': '類別',
  'Objects': '物件',
  'Arrays': '陣列',
  'Strings': '字串',
  'Numbers': '數字',
  'Booleans': '布林值',
  'Null': '空值',
  'Mixed': '混合',
  'Void': '無回傳值',
  'Callable': '可呼叫',
  'Iterable': '可迭代',
  'Generator': '產生器',
  'Iterator': '迭代器',
  'ArrayAccess': '陣列存取',
  'Countable': '可計數',
  'JsonSerializable': 'JSON 可序列化',
  'Stringable': '可字串化',
  'Meet Laravel': '認識 Laravel',
  'Why Laravel?': '為什麼選擇 Laravel？',
  'A Progressive Framework': '漸進式框架',
  'A Scalable Framework': '可擴展框架',
  'An Agent Ready Framework': 'AI 代理就緒框架',
  'A Community Framework': '社群框架',
  'Creating a Laravel Application': '建立 Laravel 應用程式',
  'Getting Started Using AI': '使用 AI 入門',
  'Installing PHP and the Laravel Installer': '安裝 PHP 和 Laravel 安裝器',
  'Creating an Application': '建立應用程式',
  'Initial Configuration': '初始配置',
  'Environment Based Configuration': '基於環境的配置',
  'Databases and Migrations': '資料庫和遷移',
  'Directory Configuration': '目錄配置',
  'Installation Using Herd': '使用 Herd 安裝',
  'Herd on macOS': 'macOS 上的 Herd',
  'Herd on Windows': 'Windows 上的 Herd',
  'IDE Support': 'IDE 支援',
  'Laravel and AI': 'Laravel 和 AI',
  'Installing Laravel Boost': '安裝 Laravel Boost',
  'Laravel the Full Stack Framework': 'Laravel 全端框架',
  'Laravel the API Backend': 'Laravel API 後端',
  'Why Laravel for AI Development?': '為什麼選擇 Laravel 進行 AI 開發？',
  'Laravel Boost': 'Laravel Boost',
  'Installation': '安裝',
  'Available Tools': '可用工具',
  'AI Guidelines': 'AI 指南',
  'Agent Skills': '代理技能',
  'Documentation Search': '文件搜尋',
  'Agents Integration': '代理整合',
  'Adding Custom AI Guidelines': '新增自訂 AI 指南',
  'Routing': '路由',
  'Basic Routing': '基本路由',
  'The Default Route Files': '預設路由檔案',
  'Redirect Routes': '重定向路由',
  'View Routes': '視圖路由',
  'Listing Your Routes': '列出您的路由',
  'Routing Customization': '路由自訂',
  'Route Parameters': '路由參數',
  'Required Parameters': '必要參數',
  'Optional Parameters': '可選參數',
  'Regular Expression Constraints': '正規表達式約束',
  'Named Routes': '命名路由',
  'Route Groups': '路由群組',
  'Middleware': '中介層',
  'Controllers': '控制器',
  'Subdomain Routing': '子網域路由',
  'Route Prefixes': '路由前綴',
  'Route Name Prefixes': '路由名稱前綴',
  'Route Model Binding': '路由模型綁定',
  'Implicit Binding': '隱式綁定',
  'Implicit Enum Binding': '隱式列舉綁定',
  'Explicit Binding': '顯式綁定',
  'Fallback Routes': '備用路由',
  'Route Caching': '路由快取',
};

// Common phrase translations
const phraseTranslations = {
  'All of the': '所有',
  'In order to': '為了',
  'As well as': '以及',
  'As well': '也',
  'In addition to': '除了',
  'In addition': '此外',
  'Furthermore': '此外',
  'Moreover': '此外',
  'Additionally': '此外',
  'However': '然而',
  'Therefore': '因此',
  'Thus': '因此',
  'Hence': '因此',
  'Consequently': '因此',
  'As a result': '因此',
  'For example': '例如',
  'For instance': '例如',
  'Such as': '例如',
  'Like': '像',
  'Unlike': '不像',
  'Similarly': '同樣地',
  'Likewise': '同樣地',
  'On the other hand': '另一方面',
  'In contrast': '相比之下',
  'In comparison': '相比之下',
  'Compared to': '與...相比',
  'Compared with': '與...相比',
  'In terms of': '就...而言',
  'With respect to': '關於',
  'In regard to': '關於',
  'With regard to': '關於',
  'In relation to': '關於',
  'In connection with': '與...相關',
  'In the case of': '在...的情況下',
  'In the event of': '在...的情況下',
  'In the absence of': '在沒有...的情況下',
  'In the presence of': '在有...的情況下',
  'In the light of': '根據',
  'In the face of': '面對',
  'In the wake of': '在...之後',
  'In the course of': '在...的過程中',
  'In the middle of': '在...的中間',
  'In the end': '最後',
  'In the beginning': '一開始',
  'In the first place': '首先',
  'In the second place': '其次',
  'In the last place': '最後',
  'In the long run': '長期來看',
  'In the short run': '短期來看',
  'In the meantime': '同時',
  'In the meanwhile': '同時',
  'In the past': '過去',
  'In the future': '未來',
  'In the present': '現在',
  'At the moment': '目前',
  'At the same time': '同時',
  'At the end': '在結束時',
  'At the beginning': '在一開始',
  'At the top': '在頂部',
  'At the bottom': '在底部',
  'At the back': '在後面',
  'At the front': '在前面',
  'At the side': '在旁邊',
  'At the center': '在中心',
  'At the edge': '在邊緣',
  'At the corner': '在角落',
  'At the intersection': '在交叉點',
  'At the junction': '在連接點',
  'At the crossing': '在交叉處',
  'At the meeting point': '在交會點',
  'At the point': '在這一點',
  'At this point': '在這一點',
  'At that point': '在那一點',
  'At which point': '在這一點',
  'At what point': '在什麼時候',
  'At some point': '在某個時候',
  'At any point': '在任何時候',
  'At no point': '在任何時候都不',
  'At every point': '在每一點',
  'At all points': '在所有點',
  'At the time': '當時',
  'At that time': '在那時',
  'At this time': '此時',
  'At what time': '在什麼時候',
  'At some time': '在某個時候',
  'At any time': '在任何時候',
  'At no time': '在任何時候都不',
  'At all times': '隨時',
  'By default': '預設',
  'By the way': '順便一提',
  'By accident': '意外地',
  'By mistake': '錯誤地',
  'By design': '設計上',
  'By chance': '偶然',
  'By nature': '本質上',
  'By definition': '根據定義',
  'By contrast': '相比之下',
  'By comparison': '比較起來',
  'By far': '到目前為止',
  'By now': '到現在',
  'By then': '到那時',
  'For example': '例如',
  'For instance': '例如',
  'For now': '目前',
  'For then': '到那時',
  'For here': '到這裡',
  'For there': '到那裡',
  'For where': '到哪裡',
  'For when': '到什麼時候',
  'For how': '到如何',
  'For why': '到為什麼',
  'For what': '到什麼',
  'For which': '到哪個',
  'For that': '到那個',
  'For this': '到這個',
  'From now on': '從現在開始',
  'From then on': '從那時開始',
  'From here on': '從這裡開始',
  'From there on': '從那裡開始',
  'From where': '從哪裡',
  'From when': '從什麼時候',
  'From how': '從如何',
  'From why': '從為什麼',
  'From what': '從什麼',
  'From which': '從哪個',
  'From that': '從那個',
  'From this': '從這個',
  'In order to': '為了',
  'In order that': '以便',
  'In case': '以防',
  'In case of': '在...的情況下',
  'In time': '及時',
  'In fact': '事實上',
  'In deed': '實際上',
  'In practice': '在實踐中',
  'In theory': '在理論上',
  'In general': '一般來說',
  'In particular': '特別是',
  'In specific': '具體來說',
  'In detail': '詳細地',
  'In brief': '簡而言之',
  'In short': '簡而言之',
  'In summary': '總之',
  'In conclusion': '總之',
  'In closing': '最後',
  'In opening': '一開始',
  'In beginning': '一開始',
  'In end': '最後',
  'In middle': '在中間',
  'In between': '在中間',
  'In front': '在前面',
  'In back': '在後面',
  'In side': '在裡面',
  'In side of': '在...裡面',
  'On the one hand': '一方面',
  'On the other hand': '另一方面',
  'On the contrary': '相反地',
  'On the whole': '整體來說',
  'On the average': '平均來說',
  'To get started': '要開始',
  'To begin': '要開始',
  'To start': '要開始',
  'To install': '要安裝',
  'To configure': '要配置',
  'To set up': '要設定',
  'To create': '要建立',
  'To build': '要建構',
  'To develop': '要開發',
  'To implement': '要實作',
  'To deploy': '要部署',
  'To test': '要測試',
  'To debug': '要除錯',
  'To optimize': '要最佳化',
  'To cache': '要快取',
  'To log': '要記錄',
  'To monitor': '要監控',
  'To track': '要追蹤',
  'To trace': '要追蹤',
  'To profile': '要分析',
  'To benchmark': '要基準測試',
  'To load': '要載入',
  'To unload': '要卸載',
  'To reload': '要重新載入',
  'To refresh': '要重新整理',
  'To update': '要更新',
  'To upgrade': '要升級',
  'To downgrade': '要降級',
  'To rollback': '要回滾',
  'To revert': '要還原',
  'To restore': '要恢復',
  'To backup': '要備份',
  'To migrate': '要遷移',
  'To seed': '要填充',
  'To publish': '要發佈',
  'To share': '要分享',
  'To export': '要匯出',
  'To import': '要匯入',
  'To sync': '要同步',
  'To connect': '要連線',
  'To disconnect': '要斷線',
  'To authenticate': '要認證',
  'To authorize': '要授權',
  'To validate': '要驗證',
  'To verify': '要驗證',
  'To confirm': '要確認',
  'To approve': '要核准',
  'To reject': '要拒絕',
  'To deny': '要拒絕',
  'To block': '要封鎖',
  'To unblock': '要解除封鎖',
  'To ban': '要禁止',
  'To unban': '要解除禁止',
  'To lock': '要鎖定',
  'To unlock': '要解鎖',
  'To encrypt': '要加密',
  'To decrypt': '要解密',
  'To hash': '要雜湊',
  'To sign': '要簽署',
  'To send': '要傳送',
  'To receive': '要接收',
  'To dispatch': '要派發',
  'To handle': '要處理',
  'To process': '要處理',
  'To execute': '要執行',
  'To run': '要執行',
  'To stop': '要停止',
  'To pause': '要暫停',
  'To resume': '要繼續',
  'To restart': '要重新啟動',
  'To reset': '要重設',
  'To clear': '要清除',
  'To flush': '要清除',
  'To purge': '要清除',
  'To delete': '要刪除',
  'To remove': '要移除',
  'To destroy': '要銷毀',
  'To drop': '要刪除',
  'To truncate': '要截斷',
  'To append': '要附加',
  'To prepend': '要前置',
  'To insert': '要插入',
  'To modify': '要修改',
  'To change': '要變更',
  'To alter': '要修改',
  'To transform': '要轉換',
  'To convert': '要轉換',
  'To cast': '要轉型',
  'To format': '要格式化',
  'To parse': '要解析',
  'To serialize': '要序列化',
  'To deserialize': '要反序列化',
  'To encode': '要編碼',
  'To decode': '要解碼',
  'To compress': '要壓縮',
  'To decompress': '要解壓縮',
  'To zip': '要壓縮',
  'To unzip': '要解壓縮',
  'To archive': '要封存',
  'To unarchive': '要解封存',
  'To save': '要儲存',
  'To read': '要讀取',
  'To write': '要寫入',
  'To open': '要開啟',
  'To close': '要關閉',
  'To bind': '要綁定',
  'To unbind': '要解除綁定',
  'To attach': '要附加',
  'To detach': '要分離',
  'To link': '要連結',
  'To unlink': '要取消連結',
  'To join': '要加入',
  'To leave': '要離開',
  'To enter': '要進入',
  'To exit': '要離開',
  'To login': '要登入',
  'To logout': '要登出',
  'To sign in': '要登入',
  'To sign out': '要登出',
  'To sign up': '要註冊',
  'To register': '要註冊',
  'To unregister': '要取消註冊',
  'To subscribe': '要訂閱',
  'To unsubscribe': '要取消訂閱',
  'To follow': '要追蹤',
  'To unfollow': '要取消追蹤',
  'To like': '要按讚',
  'To unlike': '要取消按讚',
  'To publish': '要發佈',
  'To unpublish': '要取消發佈',
  'To invite': '要邀請',
  'To uninvite': '要取消邀請',
  'To mute': '要靜音',
  'To unmute': '要取消靜音',
  'To report': '要檢舉',
  'To flag': '要標記',
  'To unflag': '要取消標記',
  'To mark': '要標記',
  'To unmark': '要取消標記',
  'To tag': '要標籤',
  'To untag': '要取消標籤',
  'To label': '要標籤',
  'To unlabel': '要取消標籤',
  'To categorize': '要分類',
  'To uncategorize': '要取消分類',
  'To organize': '要組織',
  'To reorganize': '要重新組織',
  'To sort': '要排序',
  'To unsort': '要取消排序',
  'To filter': '要篩選',
  'To unfilter': '要取消篩選',
  'To search': '要搜尋',
  'To find': '要尋找',
  'To locate': '要定位',
  'To discover': '要發現',
  'To detect': '要偵測',
  'To identify': '要識別',
  'To recognize': '要辨識',
  'To acknowledge': '要確認',
  'To check': '要檢查',
  'To troubleshoot': '要疑難排解',
  'To diagnose': '要診斷',
  'To fix': '要修復',
  'To repair': '要修復',
  'To patch': '要修補',
};

function translateHeader(header) {
  // Check if we have a direct translation
  if (headerTranslations[header]) {
    return headerTranslations[header];
  }
  
  // Try to translate the header using phrase translations
  let translated = header;
  for (const [en, zh] of Object.entries(phraseTranslations)) {
    translated = translated.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), zh);
  }
  
  return translated;
}

function translateLine(line) {
  // Skip empty lines
  if (!line.trim()) return line;
  
  // Skip code blocks
  if (line.trim().startsWith('```') || line.trim().startsWith('~~~')) {
    return line;
  }
  
  // Skip HTML anchor tags
  if (line.trim().startsWith('<a name=') || line.trim().startsWith('</a>')) {
    return line;
  }
  
  // Skip lines that are mostly code
  if (line.trim().startsWith('$') || 
      line.trim().startsWith('<?php') || 
      line.trim().startsWith('use ') ||
      line.trim().startsWith('namespace ') ||
      line.trim().startsWith('class ') ||
      line.trim().startsWith('function ') ||
      line.trim().startsWith('public ') ||
      line.trim().startsWith('private ') ||
      line.trim().startsWith('protected ') ||
      line.trim().startsWith('static ') ||
      line.trim().startsWith('abstract ') ||
      line.trim().startsWith('final ') ||
      line.trim().startsWith('interface ') ||
      line.trim().startsWith('trait ') ||
      line.trim().startsWith('enum ') ||
      line.trim().startsWith('const ') ||
      line.trim().startsWith('var ') ||
      line.trim().startsWith('let ') ||
      line.trim().startsWith('return ') ||
      line.trim().startsWith('if ') ||
      line.trim().startsWith('else ') ||
      line.trim().startsWith('elseif ') ||
      line.trim().startsWith('for ') ||
      line.trim().startsWith('foreach ') ||
      line.trim().startsWith('while ') ||
      line.trim().startsWith('do ') ||
      line.trim().startsWith('switch ') ||
      line.trim().startsWith('case ') ||
      line.trim().startsWith('break') ||
      line.trim().startsWith('continue') ||
      line.trim().startsWith('echo ') ||
      line.trim().startsWith('print ') ||
      line.trim().startsWith('throw ') ||
      line.trim().startsWith('try ') ||
      line.trim().startsWith('catch ') ||
      line.trim().startsWith('finally ') ||
      line.trim().startsWith('new ') ||
      line.trim().startsWith('array ') ||
      line.trim().startsWith('list ') ||
      line.trim().startsWith('compact ') ||
      line.trim().startsWith('extract ') ||
      line.trim().startsWith('include ') ||
      line.trim().startsWith('require ') ||
      line.trim().startsWith('include_once ') ||
      line.trim().startsWith('require_once ') ||
      line.trim().startsWith('goto ') ||
      line.trim().startsWith('declare ') ||
      line.trim().startsWith('global ') ||
      line.trim().startsWith('yield ') ||
      line.trim().startsWith('match ') ||
      line.trim().startsWith('fn ') ||
      line.trim().startsWith('=>') ||
      line.trim().startsWith('->') ||
      line.trim().startsWith('::') ||
      line.trim().startsWith('??') ||
      line.trim().startsWith('?:') ||
      line.trim().startsWith('&&') ||
      line.trim().startsWith('||') ||
      line.trim().startsWith('!') ||
      line.trim().startsWith('~') ||
      line.trim().startsWith('@') ||
      line.trim().startsWith('#') ||
      line.trim().startsWith('//') ||
      line.trim().startsWith('/*') ||
      line.trim().startsWith('*') ||
      line.trim().startsWith('*/') ||
      line.trim().startsWith('?>') ||
      line.trim().startsWith('<!--') ||
      line.trim().startsWith('-->') ||
      line.trim().startsWith('<!') ||
      line.trim().startsWith('< ') ||
      line.trim().startsWith('</') ||
      line.trim().startsWith('[]') ||
      line.trim().startsWith('{}') ||
      line.trim().startsWith('()') ||
      line.trim().startsWith('[ ]') ||
      line.trim().startsWith('{ }') ||
      line.trim().startsWith('( )') ||
      line.trim().startsWith('[') ||
      line.trim().startsWith('{') ||
      line.trim().startsWith('(') ||
      line.trim().startsWith(']') ||
      line.trim().startsWith('}') ||
      line.trim().startsWith(')') ||
      line.trim().startsWith(',') ||
      line.trim().startsWith(';') ||
      line.trim().startsWith(':') ||
      line.trim().startsWith('.') ||
      line.trim().startsWith('?') ||
      line.trim().startsWith('!') ||
      line.trim().startsWith('@') ||
      line.trim().startsWith('#') ||
      line.trim().startsWith('$') ||
      line.trim().startsWith('%') ||
      line.trim().startsWith('^') ||
      line.trim().startsWith('&') ||
      line.trim().startsWith('*') ||
      line.trim().startsWith('-') ||
      line.trim().startsWith('+') ||
      line.trim().startsWith('=') ||
      line.trim().startsWith('|') ||
      line.trim().startsWith('\\') ||
      line.trim().startsWith('/') ||
      line.trim().startsWith('~') ||
      line.trim().startsWith('`') ||
      line.trim().startsWith('"') ||
      line.trim().startsWith("'") ||
      line.trim().startsWith('<') ||
      line.trim().startsWith('>')) {
    return line;
  }
  
  // Translate headers
  const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
  if (headerMatch) {
    const prefix = headerMatch[1];
    const header = headerMatch[2];
    const translatedHeader = translateHeader(header);
    return `${prefix} ${translatedHeader}`;
  }
  
  // Translate list items
  if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
    const indent = line.match(/^(\s*)/)[1];
    const item = line.trim().substring(2);
    
    // Try to translate the item using phrase translations
    let translatedItem = item;
    for (const [en, zh] of Object.entries(phraseTranslations)) {
      translatedItem = translatedItem.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), zh);
    }
    
    return `${indent}- ${translatedItem}`;
  }
  
  // Translate regular text using phrase translations
  let translated = line;
  for (const [en, zh] of Object.entries(phraseTranslations)) {
    translated = translated.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), zh);
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

function escapeForTemplateLiteral(str) {
  // Escape backslashes first, then backticks, then ${} sequences
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

function createAstroFile(markdownContent, slug) {
  const title = pageTitles[slug] || slug;
  
  // Translate the content BEFORE converting to HTML
  const translatedContent = translateContent(markdownContent);
  
  // Convert markdown to HTML
  const htmlContent = marked.parse(translatedContent);
  
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
