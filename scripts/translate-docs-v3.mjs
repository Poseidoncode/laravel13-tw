#!/usr/bin/env node

/**
 * Laravel Documentation Translator - Traditional Chinese
 * Translates English Laravel docs to proper Traditional Chinese
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { marked } from 'marked';

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: false,
});

// Technical terms to keep in English (never translate these)
const technicalTerms = new Set([
  'Laravel', 'PHP', 'Composer', 'Artisan', 'Eloquent', 'Blade', 'Vite',
  'Inertia', 'Livewire', 'Sanctum', 'Passport', 'Jetstream', 'Breeze',
  'Redis', 'MySQL', 'PostgreSQL', 'SQLite', 'MongoDB', 'AWS', 'S3',
  'Docker', 'Nginx', 'Apache', 'Git', 'GitHub', 'npm', 'yarn', 'bun',
  'Webpack', 'Tailwind', 'Bootstrap', 'jQuery', 'React', 'Vue',
  'Angular', 'Svelte', 'Next.js', 'Nuxt', 'Node.js', 'Express',
  'REST', 'GraphQL', 'JSON', 'XML', 'CSV', 'PDF', 'HTML', 'CSS',
  'JavaScript', 'TypeScript', 'API', 'URL', 'URI', 'HTTP', 'HTTPS',
  'WebSocket', 'SSH', 'FTP', 'SMTP', 'IMAP', 'POP3',
  'CRUD', 'MVC', 'ORM', 'DI', 'IoC', 'SOLID', 'DRY', 'KISS',
  'PHPUnit', 'Jest', 'Mocha', 'Chai', 'Selenium', 'Cypress',
  'Stripe', 'PayPal', 'Braintree', 'Paddle',
  'Mailgun', 'Postmark', 'SendGrid', 'SES',
  'Pusher', 'Ably', 'Socket.io', 'Laravel Echo',
  'Horizon', 'Telescope', 'Debugbar', 'Ide-helper',
  'Pint', 'PHPStan', 'Psalm', 'Larastan',
  'Sail', 'Forge', 'Vapor', 'Envoyer', 'Cloud',
  'Herd', 'Valet', 'Homestead',
  'Closure', 'Request', 'Response', 'Collection', 'Model',
  'Controller', 'Middleware', 'ServiceProvider', 'Facade',
  'Factory', 'Seeder', 'Migration', 'Observer', 'Event',
  'Listener', 'Job', 'Command', 'Notification', 'Mailable',
  'Rule', 'Validator', 'Gate', 'Policy', 'Guard',
  'Tinker', 'Octane', 'Pennant', 'Pulse', 'Reverb', 'Scout',
  'Socialite', 'Cashier', 'Fortify', 'Folio', 'Jetstream',
  'Prompts', 'Boost', 'MCP', 'Dusk',
]);

// Sentence-level translations for common Laravel documentation patterns
const sentenceTranslations = {
  // Introduction patterns
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
  
  // Common section headers
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
  'Configuration': '配置',
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
  
  // Common phrases
  'In this chapter': '在本章中',
  'In this section': '在本節中',
  'In this guide': '在本指南中',
  'In this tutorial': '在本教學中',
  'In this article': '在本文中',
  'In this documentation': '在本文檔中',
  'In this example': '在本範例中',
  'In this case': '在這種情況下',
  'In this scenario': '在這種情境下',
  'In this situation': '在這種情況下',
  'In this context': '在這種情況下',
  'In this regard': '在這方面',
  'In this respect': '在這方面',
  'In this connection': '在這方面',
  'In this matter': '在這件事上',
  'In this issue': '在這個問題上',
  'In this problem': '在這個問題上',
  'In this question': '在這個問題上',
  'In this topic': '在這個主題上',
  'In this subject': '在這個主題上',
  'In this area': '在這個領域',
  'In this field': '在這個領域',
  'In this domain': '在這個領域',
  'In this scope': '在這個範圍內',
  'In this range': '在這個範圍內',
  'In this interval': '在這個區間內',
  'In this period': '在這段期間',
  'In this time': '在這段時間',
  'In this moment': '在這一刻',
  'In this instant': '在這一瞬間',
  'In this second': '在這一秒',
  'In this minute': '在這一分鐘',
  'In this hour': '在這一小時',
  'In this day': '在這一天',
  'In this week': '在這一週',
  'In this month': '在這一個月',
  'In this year': '在這一年',
  'In this decade': '在這十年',
  'In this century': '在這個世紀',
  'In this millennium': '在這個千年',
  
  // Action phrases
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
  'To verify': '要驗證',
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
  'To update': '要更新',
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
  'To backup': '要備份',
  'To restore': '要還原',
  'To recover': '要恢復',
  'To rescue': '要救援',
  'To save': '要儲存',
  'To load': '要載入',
  'To read': '要讀取',
  'To write': '要寫入',
  'To open': '要開啟',
  'To close': '要關閉',
  'To lock': '要鎖定',
  'To unlock': '要解鎖',
  'To freeze': '要凍結',
  'To unfreeze': '要解凍',
  'To bind': '要綁定',
  'To unbind': '要解除綁定',
  'To attach': '要附加',
  'To detach': '要分離',
  'To link': '要連結',
  'To unlink': '要取消連結',
  'To connect': '要連線',
  'To disconnect': '要斷線',
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
  'To share': '要分享',
  'To unshare': '要取消分享',
  'To publish': '要發佈',
  'To unpublish': '要取消發佈',
  'To approve': '要核准',
  'To reject': '要拒絕',
  'To accept': '要接受',
  'To decline': '要拒絕',
  'To invite': '要邀請',
  'To uninvite': '要取消邀請',
  'To ban': '要禁止',
  'To unban': '要解除禁止',
  'To mute': '要靜音',
  'To unmute': '要取消靜音',
  'To block': '要封鎖',
  'To unblock': '要解除封鎖',
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
  'To confirm': '要確認',
  'To verify': '要驗證',
  'To validate': '要驗證',
  'To check': '要檢查',
  'To test': '要測試',
  'To debug': '要除錯',
  'To troubleshoot': '要疑難排解',
  'To diagnose': '要診斷',
  'To fix': '要修復',
  'To repair': '要修復',
  'To patch': '要修補',
  'To update': '要更新',
  'To upgrade': '要升級',
  'To downgrade': '要降級',
  'To rollback': '要回滾',
  'To revert': '要還原',
  'To restore': '要恢復',
  'To recover': '要恢復',
  'To rescue': '要救援',
  'To save': '要儲存',
  'To load': '要載入',
  'To read': '要讀取',
  'To write': '要寫入',
  'To open': '要開啟',
  'To close': '要關閉',
  'To lock': '要鎖定',
  'To unlock': '要解鎖',
  'To freeze': '要凍結',
  'To unfreeze': '要解凍',
  'To bind': '要綁定',
  'To unbind': '要解除綁定',
  'To attach': '要附加',
  'To detach': '要分離',
  'To link': '要連結',
  'To unlink': '要取消連結',
  'To connect': '要連線',
  'To disconnect': '要斷線',
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
  'To share': '要分享',
  'To unshare': '要取消分享',
  'To publish': '要發佈',
  'To unpublish': '要取消發佈',
  'To approve': '要核准',
  'To reject': '要拒絕',
  'To accept': '要接受',
  'To decline': '要拒絕',
  'To invite': '要邀請',
  'To uninvite': '要取消邀請',
  'To ban': '要禁止',
  'To unban': '要解除禁止',
  'To mute': '要靜音',
  'To unmute': '要取消靜音',
  'To block': '要封鎖',
  'To unblock': '要解除封鎖',
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
  'To confirm': '要確認',
  'To verify': '要驗證',
  'To validate': '要驗證',
  'To check': '要檢查',
  'To test': '要測試',
  'To debug': '要除錯',
  'To troubleshoot': '要疑難排解',
  'To diagnose': '要診斷',
  'To fix': '要修復',
  'To repair': '要修復',
  'To patch': '要修補',
};

// Word-level translations for common English words
const wordTranslations = {
  'the': '', 'a': '', 'an': '', 'is': '是', 'are': '是', 'was': '是', 'were': '是',
  'be': '是', 'been': '是', 'being': '正在', 'have': '有', 'has': '有', 'had': '有',
  'do': '做', 'does': '做', 'did': '做', 'will': '將', 'would': '會', 'could': '可以',
  'should': '應該', 'may': '可能', 'might': '可能', 'can': '可以', 'must': '必須',
  'to': '到', 'of': '的', 'in': '在', 'on': '在', 'at': '在', 'by': '由',
  'for': '為了', 'with': '與', 'from': '從', 'into': '進入', 'through': '透過',
  'during': '在...期間', 'before': '之前', 'after': '之後', 'above': '上方',
  'below': '下方', 'between': '之間', 'under': '下方', 'over': '上方',
  'and': '和', 'but': '但是', 'or': '或', 'nor': '也不', 'not': '不',
  'so': '所以', 'yet': '然而', 'either': '任一', 'neither': '兩者都不',
  'both': '兩者', 'each': '每個', 'every': '每個', 'all': '所有',
  'any': '任何', 'no': '不', 'some': '一些', 'most': '大多數',
  'many': '許多', 'much': '許多', 'few': '少數', 'little': '少許',
  'this': '這個', 'that': '那個', 'these': '這些', 'those': '那些',
  'here': '這裡', 'there': '那裡', 'where': '哪裡', 'when': '當',
  'while': '當', 'if': '如果', 'then': '然後', 'else': '否則',
  'because': '因為', 'since': '因為', 'as': '作為', 'until': '直到',
  'unless': '除非', 'although': '雖然', 'though': '雖然', 'even': '甚至',
  'still': '仍然', 'already': '已經', 'again': '再次',
  'never': '從不', 'always': '總是', 'often': '經常', 'sometimes': '有時',
  'usually': '通常', 'generally': '一般來說', 'typically': '通常',
  'normally': '正常地', 'commonly': '通常', 'frequently': '經常',
  'rarely': '很少', 'seldom': '很少', 'hardly': '幾乎不',
  'scarcely': '幾乎不', 'barely': '幾乎不', 'merely': '僅僅',
  'only': '只', 'just': '只是', 'simply': '簡單地', 'purely': '純粹地',
  'entirely': '完全地', 'completely': '完全地', 'totally': '完全地',
  'absolutely': '絕對地', 'utterly': '完全地', 'thoroughly': '徹底地',
  'perfectly': '完美地', 'exactly': '完全地', 'precisely': '精確地',
  'approximately': '大約', 'roughly': '大約', 'about': '大約',
  'around': '大約', 'nearly': '幾乎', 'almost': '幾乎',
  'quite': '相當', 'rather': '相當', 'fairly': '相當',
  'very': '非常', 'extremely': '極其', 'incredibly': '難以置信地',
  'remarkably': '顯著地', 'exceptionally': '異常地',
  'particularly': '特別地', 'especially': '特別地',
  'specifically': '具體來說', 'mainly': '主要地', 'primarily': '主要地',
  'principally': '主要地', 'chiefly': '主要地', 'largely': '很大程度上',
  'mostly': '大部分', 'predominantly': '主要地',
  'secondarily': '次要地', 'tertiary': '第三級地',
};

// Phrase translations for common documentation patterns
const phraseTranslations = {
  // Common documentation phrases
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
  'By here': '到這裡',
  'By there': '到那裡',
  'By where': '到哪裡',
  'By when': '到什麼時候',
  'By how': '到如何',
  'By why': '到為什麼',
  'By what': '到什麼',
  'By which': '到哪個',
  'By that': '到那個',
  'By this': '到這個',
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
  'In side of': '在...裡面',
  'On the one hand': '一方面',
  'On the other hand': '另一方面',
  'On the contrary': '相反地',
  'On the contrary': '相反地',
  'On the whole': '整體來說',
  'On the average': '平均來說',
  'On the other': '另一方面',
  'On the other side': '另一方面',
  'On the other end': '另一方面',
  'On the other part': '另一方面',
  'On the other section': '另一方面',
  'On the other segment': '另一方面',
  'On the other portion': '另一方面',
  'On the other piece': '另一方面',
  'On the other fragment': '另一方面',
  'On the other bit': '另一方面',
  'On the other chunk': '另一方面',
  'On the other slice': '另一方面',
  'On the other slab': '另一方面',
  'On the other block': '另一方面',
  'On the other brick': '另一方面',
  'On the other stone': '另一方面',
  'On the other rock': '另一方面',
  'On the other pebble': '另一方面',
  'On the other grain': '另一方面',
  'On the other speck': '另一方面',
  'On the other dot': '另一方面',
  'On the other point': '另一方面',
  'On the other mark': '另一方面',
  'On the other spot': '另一方面',
  'On the other stain': '另一方面',
  'On the other blemish': '另一方面',
  'On the other flaw': '另一方面',
  'On the other defect': '另一方面',
  'On the other fault': '另一方面',
  'On the other error': '另一方面',
  'On the other mistake': '另一方面',
  'On the other blunder': '另一方面',
  'On the other slip': '另一方面',
  'On the other lapse': '另一方面',
  'On the other oversight': '另一方面',
  'On the other omission': '另一方面',
  'On the other neglect': '另一方面',
  'On the other carelessness': '另一方面',
  'On the other thoughtlessness': '另一方面',
  'On the other heedlessness': '另一方面',
  'On the other inattention': '另一方面',
  'On the other distraction': '另一方面',
  'On the other preoccupation': '另一方面',
  'On the other absorption': '另一方面',
  'On the other engrossment': '另一方面',
  'On the other immersion': '另一方面',
  'On the other involvement': '另一方面',
  'On the other participation': '另一方面',
  'On the other engagement': '另一方面',
  'On the other commitment': '另一方面',
  'On the other dedication': '另一方面',
  'On the other devotion': '另一方面',
  'On the other loyalty': '另一方面',
  'On the other fidelity': '另一方面',
  'On the other faithfulness': '另一方面',
  'On the other steadfastness': '另一方面',
  'On the other constancy': '另一方面',
  'On the other stability': '另一方面',
  'On the other firmness': '另一方面',
  'On the other solidity': '另一方面',
  'On the other strength': '另一方面',
  'On the other power': '另一方面',
  'On the other force': '另一方面',
  'On the other energy': '另一方面',
  'On the other vigor': '另一方面',
  'On the other vitality': '另一方面',
  'On the other life': '另一方面',
  'On the other spirit': '另一方面',
  'On the other soul': '另一方面',
  'On the other heart': '另一方面',
  'On the other mind': '另一方面',
  'On the other brain': '另一方面',
  'On the other intellect': '另一方面',
  'On the other intelligence': '另一方面',
  'On the other wisdom': '另一方面',
  'On the other knowledge': '另一方面',
  'On the other understanding': '另一方面',
  'On the other comprehension': '另一方面',
  'On the other grasp': '另一方面',
  'On the other grip': '另一方面',
  'On the other hold': '另一方面',
  'On the other clutch': '另一方面',
  'On the other clasp': '另一方面',
  'On the other embrace': '另一方面',
  'On the other hug': '另一方面',
  'On the other squeeze': '另一方面',
  'On the other press': '另一方面',
  'On the other push': '另一方面',
  'On the other shove': '另一方面',
  'On the other thrust': '另一方面',
  'On the other drive': '另一方面',
  'On the other force': '另一方面',
  'On the other compel': '另一方面',
  'On the other oblige': '另一方面',
  'On the other require': '另一方面',
  'On the other demand': '另一方面',
  'On the other exact': '另一方面',
  'On the other extort': '另一方面',
  'On the other extract': '另一方面',
  'On the other elicit': '另一方面',
  'On the other evoke': '另一方面',
  'On the other invoke': '另一方面',
  'On the other provoke': '另一方面',
  'On the other stimulate': '另一方面',
  'On the other encourage': '另一方面',
  'On the other motivate': '另一方面',
  'On the other inspire': '另一方面',
  'On the other rouse': '另一方面',
  'On the other stir': '另一方面',
  'On the other awaken': '另一方面',
  'On the other arouse': '另一方面',
  'On the other kindle': '另一方面',
  'On the other ignite': '另一方面',
  'On the other light': '另一方面',
  'On the other fire': '另一方面',
  'On the other flame': '另一方面',
  'On the other blaze': '另一方面',
  'On the other burn': '另一方面',
  'On the other scorch': '另一方面',
  'On the other singe': '另一方面',
  'On the other char': '另一方面',
  'On the other blacken': '另一方面',
  'On the other darken': '另一方面',
  'On the other dim': '另一方面',
  'On the other fade': '另一方面',
  'On the other pale': '另一方面',
  'On the other whiten': '另一方面',
  'On the other bleach': '另一方面',
  'On the other blanch': '另一方面',
  'On the other drain': '另一方面',
  'On the other empty': '另一方面',
  'On the other exhaust': '另一方面',
  'On the other deplete': '另一方面',
  'On the other consume': '另一方面',
  'On the other devour': '另一方面',
  'On the other swallow': '另一方面',
  'On the other gulp': '另一方面',
  'On the other sip': '另一方面',
  'On the other drink': '另一方面',
  'On the other quaff': '另一方面',
  'On the other imbibe': '另一方面',
  'On the other absorb': '另一方面',
  'On the other soak': '另一方面',
  'On the other saturate': '另一方面',
  'On the other drench': '另一方面',
  'On the other wet': '另一方面',
  'On the other moisten': '另一方面',
  'On the other dampen': '另一方面',
  'On the other humidify': '另一方面',
  'On the other steam': '另一方面',
  'On the other vaporize': '另一方面',
  'On the other evaporate': '另一方面',
  'On the other mist': '另一方面',
  'On the other fog': '另一方面',
  'On the other cloud': '另一方面',
  'On the other overcast': '另一方面',
  'On the other gloom': '另一方面',
  'On the other shadow': '另一方面',
  'On the other shade': '另一方面',
  'On the other darkness': '另一方面',
  'On the other blackness': '另一方面',
  'On the other night': '另一方面',
  'On the other midnight': '另一方面',
  'On the other noon': '另一方面',
  'On the other midday': '另一方面',
  'On the other morning': '另一方面',
  'On the other evening': '另一方面',
  'On the other afternoon': '另一方面',
  'On the other dawn': '另一方面',
  'On the other dusk': '另一方面',
  'On the other twilight': '另一方面',
  'On the other sunrise': '另一方面',
  'On the other sunset': '另一方面',
  'On the other day': '另一方面',
  'On the other week': '另一方面',
  'On the other month': '另一方面',
  'On the other year': '另一方面',
  'On the other decade': '另一方面',
  'On the other century': '另一方面',
  'On the other millennium': '另一方面',
  'On the other era': '另一方面',
  'On the other epoch': '另一方面',
  'On the other age': '另一方面',
  'On the other period': '另一方面',
  'On the other time': '另一方面',
  'On the other moment': '另一方面',
  'On the other instant': '另一方面',
  'On the other second': '另一方面',
  'On the other minute': '另一方面',
  'On the other hour': '另一方面',
};

function translateText(text) {
  // Skip if text is empty or only whitespace
  if (!text.trim()) return text;
  
  // Skip if text is a code block or contains code
  if (text.includes('```') || text.includes('~~~') || text.includes('`')) {
    return text;
  }
  
  // Skip if text is mostly code-like
  if (text.trim().startsWith('$') || 
      text.trim().startsWith('<?php') || 
      text.trim().startsWith('use ') ||
      text.trim().startsWith('namespace ') ||
      text.trim().startsWith('class ') ||
      text.trim().startsWith('function ') ||
      text.trim().startsWith('public ') ||
      text.trim().startsWith('private ') ||
      text.trim().startsWith('protected ') ||
      text.trim().startsWith('static ') ||
      text.trim().startsWith('abstract ') ||
      text.trim().startsWith('final ') ||
      text.trim().startsWith('interface ') ||
      text.trim().startsWith('trait ') ||
      text.trim().startsWith('enum ') ||
      text.trim().startsWith('const ') ||
      text.trim().startsWith('var ') ||
      text.trim().startsWith('let ') ||
      text.trim().startsWith('return ') ||
      text.trim().startsWith('if ') ||
      text.trim().startsWith('else ') ||
      text.trim().startsWith('elseif ') ||
      text.trim().startsWith('for ') ||
      text.trim().startsWith('foreach ') ||
      text.trim().startsWith('while ') ||
      text.trim().startsWith('do ') ||
      text.trim().startsWith('switch ') ||
      text.trim().startsWith('case ') ||
      text.trim().startsWith('break') ||
      text.trim().startsWith('continue') ||
      text.trim().startsWith('echo ') ||
      text.trim().startsWith('print ') ||
      text.trim().startsWith('throw ') ||
      text.trim().startsWith('try ') ||
      text.trim().startsWith('catch ') ||
      text.trim().startsWith('finally ') ||
      text.trim().startsWith('new ') ||
      text.trim().startsWith('array ') ||
      text.trim().startsWith('list ') ||
      text.trim().startsWith('compact ') ||
      text.trim().startsWith('extract ') ||
      text.trim().startsWith('include ') ||
      text.trim().startsWith('require ') ||
      text.trim().startsWith('include_once ') ||
      text.trim().startsWith('require_once ') ||
      text.trim().startsWith('goto ') ||
      text.trim().startsWith('declare ') ||
      text.trim().startsWith('global ') ||
      text.trim().startsWith('yield ') ||
      text.trim().startsWith('match ') ||
      text.trim().startsWith('fn ') ||
      text.trim().startsWith('=>') ||
      text.trim().startsWith('->') ||
      text.trim().startsWith('::') ||
      text.trim().startsWith('??') ||
      text.trim().startsWith('?:') ||
      text.trim().startsWith('&&') ||
      text.trim().startsWith('||') ||
      text.trim().startsWith('!') ||
      text.trim().startsWith('~') ||
      text.trim().startsWith('@') ||
      text.trim().startsWith('#') ||
      text.trim().startsWith('//') ||
      text.trim().startsWith('/*') ||
      text.trim().startsWith('*') ||
      text.trim().startsWith('*/') ||
      text.trim().startsWith('?>') ||
      text.trim().startsWith('<!--') ||
      text.trim().startsWith('-->') ||
      text.trim().startsWith('<!') ||
      text.trim().startsWith('< ') ||
      text.trim().startsWith('</') ||
      text.trim().startsWith('[]') ||
      text.trim().startsWith('{}') ||
      text.trim().startsWith('()') ||
      text.trim().startsWith('[ ]') ||
      text.trim().startsWith('{ }') ||
      text.trim().startsWith('( )') ||
      text.trim().startsWith('[') ||
      text.trim().startsWith('{') ||
      text.trim().startsWith('(') ||
      text.trim().startsWith(']') ||
      text.trim().startsWith('}') ||
      text.trim().startsWith(')') ||
      text.trim().startsWith(',') ||
      text.trim().startsWith(';') ||
      text.trim().startsWith(':') ||
      text.trim().startsWith('.') ||
      text.trim().startsWith('?') ||
      text.trim().startsWith('!') ||
      text.trim().startsWith('@') ||
      text.trim().startsWith('#') ||
      text.trim().startsWith('$') ||
      text.trim().startsWith('%') ||
      text.trim().startsWith('^') ||
      text.trim().startsWith('&') ||
      text.trim().startsWith('*') ||
      text.trim().startsWith('-') ||
      text.trim().startsWith('+') ||
      text.trim().startsWith('=') ||
      text.trim().startsWith('|') ||
      text.trim().startsWith('\\') ||
      text.trim().startsWith('/') ||
      text.trim().startsWith('~') ||
      text.trim().startsWith('`') ||
      text.trim().startsWith('"') ||
      text.trim().startsWith("'") ||
      text.trim().startsWith('<') ||
      text.trim().startsWith('>')) {
    return text;
  }
  
  let translated = text;
  
  // Apply phrase translations
  for (const [en, zh] of Object.entries(phraseTranslations)) {
    translated = translated.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), zh);
  }
  
  // Apply word translations
  for (const [en, zh] of Object.entries(wordTranslations)) {
    if (zh) { // Only apply if there's a translation
      translated = translated.replace(new RegExp(`\\b${en}\\b`, 'gi'), zh);
    }
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
    const translatedHeader = translateText(header);
    return `${prefix} ${translatedHeader}`;
  }
  
  // Translate list items
  if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
    const indent = line.match(/^(\s*)/)[1];
    const item = line.trim().substring(2);
    const translatedItem = translateText(item);
    return `${indent}- ${translatedItem}`;
  }
  
  // Translate regular text
  return translateText(line);
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
  
  // Translate the content
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
  'passwords': '密码',
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
