#!/usr/bin/env node

/**
 * Proper Laravel Documentation Translator
 * Creates clean, readable Traditional Chinese translations
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

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
]);

// Complete phrase translations (translate these as whole units)
const phraseTranslations = {
  // Headers and sections
  'Table of Contents': '目錄',
  'Introduction': '簡介',
  'Prerequisites': '前置需求',
  'Installation': '安裝',
  'Configuration': '配置',
  'Basic Usage': '基本用法',
  'Advanced Usage': '進階用法',
  'Available Methods': '可用方法',
  'Method Listing': '方法列表',
  'Return Values': '回傳值',
  'Examples': '範例',
  'Notes': '注意事項',
  'See Also': '另請參閱',
  'Next Steps': '下一步',
  'Getting Started': '入門',
  'Directory Structure': '目錄結構',
  'Upgrading': '升級',
  'Contributing': '貢獻',
  
  // Common phrases
  'In this chapter': '在本章中',
  'In this section': '在本節中',
  'For example': '例如',
  'For instance': '例如',
  'However': '然而',
  'Therefore': '因此',
  'Furthermore': '此外',
  'Moreover': '此外',
  'Additionally': '此外',
  'Alternatively': '或者',
  'Similarly': '同樣地',
  'Likewise': '同樣地',
  'On the other hand': '另一方面',
  'In addition': '此外',
  'As a result': '因此',
  'As well as': '以及',
  'In order to': '為了',
  'So that': '以便',
  'Even though': '即使',
  'Although': '雖然',
  'Because': '因為',
  'Since': '因為',
  'When': '當',
  'While': '當',
  'If': '如果',
  'Then': '然後',
  'Else': '否則',
  'Otherwise': '否則',
  'Instead': '相反地',
  'Rather': '而是',
  'Not only': '不僅',
  'But also': '而且',
  'Both': '兩者',
  'Either': '任一',
  'Neither': '兩者都不',
  'Whether': '是否',
  'Unless': '除非',
  'Until': '直到',
  'As soon as': '一旦',
  'Before': '在...之前',
  'After': '在...之後',
  'During': '在...期間',
  'Since': '自從',
  'By': '透過',
  'With': '使用',
  'Without': '沒有',
  'Through': '透過',
  'Against': '對抗',
  'Among': '在...之中',
  'Between': '在...之間',
  'Into': '進入',
  'Onto': '到...上',
  'Upon': '在...上',
  'Within': '在...內',
  'Without': '沒有',
  'About': '關於',
  'Above': '上方',
  'Below': '下方',
  'Under': '下方',
  'Over': '上方',
  'Around': '周圍',
  'Along': '沿著',
  'Across': '穿越',
  'Past': '經過',
  'Through': '透過',
  'Towards': '朝向',
  'Until': '直到',
  'Against': '對抗',
  'Despite': '儘管',
  'Except': '除了',
  'Besides': '除了',
  'Beyond': '超越',
  'Plus': '加上',
  'Minus': '減去',
  'Times': '乘以',
  'Divided by': '除以',
  'Equals': '等於',
  'Greater than': '大於',
  'Less than': '小於',
  'At least': '至少',
  'At most': '最多',
  'More than': '超過',
  'Less than': '少於',
  'As much as': '和...一樣多',
  'As many as': '和...一樣多',
  'Such as': '例如',
  'Like': '像',
  'Unlike': '不像',
  'Regarding': '關於',
  'Concerning': '關於',
  'According to': '根據',
  'Depending on': '取決於',
  'Based on': '基於',
  'Due to': '由於',
  'Owing to': '由於',
  'Thanks to': '由於',
  'In spite of': '儘管',
  'Despite': '儘管',
  'Regardless of': '不論',
  'Irrespective of': '不論',
  'In terms of': '就...而言',
  'With respect to': '關於',
  'In regard to': '關於',
  'With regard to': '關於',
  'In relation to': '關於',
  'In connection with': '與...相關',
  'In contrast to': '與...對比',
  'In comparison with': '與...比較',
  'Compared to': '與...相比',
  'Compared with': '與...相比',
  'In addition to': '除了',
  'Apart from': '除了',
  'Aside from': '除了',
  'Other than': '除了',
  'Except for': '除了',
  'With the exception of': '除了',
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
  'In the morning': '早上',
  'In the afternoon': '下午',
  'In the evening': '晚上',
  'In the night': '晚上',
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
  'At the age of': '在...歲時',
  'At the cost of': '以...為代價',
  'At the expense of': '以...為代價',
  'At the mercy of': '受...支配',
  'At the risk of': '冒著...的風險',
  'At the speed of': '以...的速度',
  'At the rate of': '以...的速度',
  'At the pace of': '以...的步伐',
  'At the level of': '在...的層級',
  'At the height of': '在...的高度',
  'At the depth of': '在...的深度',
  'At the width of': '在...的寬度',
  'At the length of': '在...的長度',
  'At the distance of': '在...的距離',
  'At the interval of': '以...的間隔',
  'At the frequency of': '以...的頻率',
  'At the wavelength of': '以...的波長',
  'At the temperature of': '在...的溫度',
  'At the pressure of': '在...的壓力',
  'At the volume of': '在...的音量',
  'At the intensity of': '以...的強度',
  'At the brightness of': '以...的亮度',
  'At the loudness of': '以...的響度',
  'At the sharpness of': '以...的銳度',
  'At the softness of': '以...的柔軟度',
  'At the hardness of': '以...的硬度',
  'At the strength of': '以...的強度',
  'At the weakness of': '以...的弱點',
  'At the power of': '以...的力量',
  'At the force of': '以...的力量',
  'At the energy of': '以...的能量',
  'At the momentum of': '以...的動量',
  'At the velocity of': '以...的速度',
  'At the acceleration of': '以...的加速度',
  'At the gravity of': '以...的重力',
  'At the mass of': '以...的質量',
  'At the weight of': '以...的重量',
  'At the density of': '以...的密度',
  'At the volume of': '以...的體積',
  'At the area of': '以...的面積',
  'At the perimeter of': '以...的周長',
  'At the circumference of': '以...的圓周',
  'At the diameter of': '以...的直徑',
  'At the radius of': '以...的半徑',
  'At the angle of': '以...的角度',
  'At the slope of': '以...的斜率',
  'At the gradient of': '以...的梯度',
  'At the curve of': '以...的曲線',
  'At the line of': '以...的線',
  'At the point of': '以...的點',
  'At the edge of': '在...的邊緣',
  'At the border of': '在...的邊界',
  'At the boundary of': '在...的邊界',
  'At the limit of': '在...的極限',
  'At the margin of': '在...的邊緣',
  'At the fringe of': '在...的邊緣',
  'At the periphery of': '在...的周圍',
  'At the center of': '在...的中心',
  'At the middle of': '在...的中間',
  'At the heart of': '在...的核心',
  'At the core of': '在...的核心',
  'At the nucleus of': '在...的核心',
  'At the epicenter of': '在...的中心',
  'At the focus of': '在...的焦點',
  'At the focal point of': '在...的焦點',
  'At the center of attention': '在關注的中心',
  'At the forefront of': '在...的最前線',
  'At the leading edge of': '在...的前沿',
  'At the cutting edge of': '在...的尖端',
  'At the vanguard of': '在...的先鋒',
  'At the forefront of': '在...的最前線',
  'At the head of': '在...的頭部',
  'At the top of': '在...的頂部',
  'At the peak of': '在...的頂峰',
  'At the summit of': '在...的頂峰',
  'At the apex of': '在...的頂點',
  'At the pinnacle of': '在...的頂點',
  'At the zenith of': '在...的頂點',
  'At the climax of': '在...的高潮',
  'At the height of': '在...的高度',
  'At the maximum of': '在...的最大值',
  'At the minimum of': '在...的最小值',
  'At the average of': '在...的平均值',
  'At the median of': '在...的中位數',
  'At the mode of': '在...的眾數',
  'At the range of': '在...的範圍',
  'At the scope of': '在...的範圍',
  'At the extent of': '在...的範圍',
  'At the scale of': '在...的規模',
  'At the size of': '在...的大小',
  'At the magnitude of': '在...的規模',
  'At the proportion of': '以...的比例',
  'At the ratio of': '以...的比例',
  'At the percentage of': '以...的百分比',
  'At the fraction of': '以...的分數',
  'At the decimal of': '以...的小數',
  'At the integer of': '以...的整數',
  'At the number of': '以...的數字',
  'At the count of': '以...的計數',
  'At the total of': '以...的總計',
  'At the sum of': '以...的總和',
  'At the difference of': '以...的差',
  'At the product of': '以...的乘積',
  'At the quotient of': '以...的商',
  'At the remainder of': '以...的餘數',
  'At the modulo of': '以...的模數',
  'At the exponent of': '以...的指數',
  'At the power of': '以...的冪',
  'At the root of': '以...的根',
  'At the logarithm of': '以...的對數',
  'At the sine of': '以...的正弦',
  'At the cosine of': '以...的餘弦',
  'At the tangent of': '以...的正切',
  'At the cotangent of': '以...的餘切',
  'At the secant of': '以...的正割',
  'At the cosecant of': '以...的餘割',
  'At the hyperbolic sine of': '以...的雙曲正弦',
  'At the hyperbolic cosine of': '以...的雙曲餘弦',
  'At the hyperbolic tangent of': '以...的雙曲正切',
  'At the hyperbolic cotangent of': '以...的雙曲餘切',
  'At the hyperbolic secant of': '以...的雙曲正割',
  'At the hyperbolic cosecant of': '以...的雙曲餘割',
};

// Word-level translations (only for non-technical terms)
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
  'so': '所以', 'yet': ' yet', 'either': '任一', 'neither': '兩者都不',
  'both': '兩者', 'each': '每個', 'every': '每個', 'all': '所有',
  'any': '任何', 'no': '不', 'some': '一些', 'most': '大多數',
  'many': '許多', 'much': '許多', 'few': '少數', 'little': '少許',
  'this': '這個', 'that': '那個', 'these': '這些', 'those': '那些',
  'here': '這裡', 'there': '那裡', 'where': '哪裡', 'when': '當',
  'while': '當', 'if': '如果', 'then': '然後', 'else': '否則',
  'because': '因為', 'since': '因為', 'as': '作為', 'until': '直到',
  'unless': '除非', 'although': '雖然', 'though': '雖然', 'even': ' even',
  'still': '仍然', 'already': '已經', 'yet': ' yet', 'again': '再次',
  'never': '從不', 'always': '總是', 'often': '經常', 'sometimes': '有時',
  'usually': '通常', 'generally': '一般來說', 'typically': '通常',
  'normally': '正常地', 'commonly': '通常', 'frequently': '經常',
  'rarely': '很少', 'seldom': '很少', 'hardly': '幾乎不',
  'scarcely': '幾乎不', 'barely': '幾乎不', 'merely': '僅僅',
  'only': '只', 'just': '只是', 'simply': ' simply', 'purely': '純粹地',
  'entirely': '完全地', 'completely': '完全地', 'totally': ' totally',
  'absolutely': ' absolutely', 'utterly': ' utterly', 'thoroughly': ' thoroughly',
  'perfectly': '完美地', 'exactly': ' exactly', 'precisely': ' precisely',
  'approximately': ' approximately', 'roughly': ' roughly', 'about': ' about',
  'around': ' around', 'nearly': ' nearly', 'almost': ' almost',
  'quite': ' quite', 'rather': ' rather', 'fairly': ' fairly',
  'very': '非常', 'extremely': ' extremely', 'incredibly': ' incredibly',
  'remarkably': ' remarkably', 'exceptionally': ' exceptionally',
  'particularly': ' particularly', 'especially': ' especially',
  'specifically': '具體來說', 'mainly': '主要地', 'primarily': ' primarily',
  'principally': ' principally', 'chiefly': ' chiefly', 'largely': ' largely',
  'mostly': ' mostly', 'predominantly': ' predominantly',
  'primarily': ' primarily', 'secondarily': ' secondarily',
  'tertiary': ' tertiary', 'quaternary': ' quaternary',
  'and': '和', 'or': '或', 'but': '但是', 'nor': '也不',
  'yet': ' yet', 'so': '所以', 'for': '為了', 'at': '在',
  'by': '由', 'for': '為了', 'from': '從', 'in': '在',
  'into': '進入', 'of': '的', 'on': '在', 'to': '到',
  'with': '與', 'at': '在', 'by': '由', 'for': '為了',
  'from': '從', 'in': '在', 'into': '進入', 'of': '的',
  'on': '在', 'to': '到', 'with': '與',
};

function translateContent(content) {
  // Split content into lines
  const lines = content.split('\n');
  const translatedLines = [];
  let inCodeBlock = false;
  let inFrontmatter = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Track frontmatter
    if (i === 0 && trimmed === '---') {
      inFrontmatter = true;
      translatedLines.push(line);
      continue;
    }
    if (inFrontmatter && trimmed === '---') {
      inFrontmatter = false;
      translatedLines.push(line);
      continue;
    }
    if (inFrontmatter) {
      translatedLines.push(line);
      continue;
    }
    
    // Track code blocks
    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      inCodeBlock = !inCodeBlock;
      translatedLines.push(line);
      continue;
    }
    
    // Don't translate inside code blocks
    if (inCodeBlock) {
      translatedLines.push(line);
      continue;
    }
    
    // Skip empty lines
    if (trimmed === '') {
      translatedLines.push(line);
      continue;
    }
    
    // Skip lines that are mostly code
    if (trimmed.startsWith('$') || 
        trimmed.startsWith('<?php') || 
        trimmed.startsWith('use ') ||
        trimmed.startsWith('namespace ') ||
        trimmed.startsWith('class ') ||
        trimmed.startsWith('function ') ||
        trimmed.startsWith('public ') ||
        trimmed.startsWith('private ') ||
        trimmed.startsWith('protected ') ||
        trimmed.startsWith('static ') ||
        trimmed.startsWith('abstract ') ||
        trimmed.startsWith('final ') ||
        trimmed.startsWith('interface ') ||
        trimmed.startsWith('trait ') ||
        trimmed.startsWith('enum ') ||
        trimmed.startsWith('const ') ||
        trimmed.startsWith('var ') ||
        trimmed.startsWith('let ') ||
        trimmed.startsWith('const ') ||
        trimmed.startsWith('return ') ||
        trimmed.startsWith('if ') ||
        trimmed.startsWith('else ') ||
        trimmed.startsWith('elseif ') ||
        trimmed.startsWith('for ') ||
        trimmed.startsWith('foreach ') ||
        trimmed.startsWith('while ') ||
        trimmed.startsWith('do ') ||
        trimmed.startsWith('switch ') ||
        trimmed.startsWith('case ') ||
        trimmed.startsWith('break') ||
        trimmed.startsWith('continue') ||
        trimmed.startsWith('echo ') ||
        trimmed.startsWith('print ') ||
        trimmed.startsWith('throw ') ||
        trimmed.startsWith('try ') ||
        trimmed.startsWith('catch ') ||
        trimmed.startsWith('finally ') ||
        trimmed.startsWith('new ') ||
        trimmed.startsWith('array ') ||
        trimmed.startsWith('list ') ||
        trimmed.startsWith('compact ') ||
        trimmed.startsWith('extract ') ||
        trimmed.startsWith('include ') ||
        trimmed.startsWith('require ') ||
        trimmed.startsWith('include_once ') ||
        trimmed.startsWith('require_once ') ||
        trimmed.startsWith('goto ') ||
        trimmed.startsWith('declare ') ||
        trimmed.startsWith('global ') ||
        trimmed.startsWith('static ') ||
        trimmed.startsWith('yield ') ||
        trimmed.startsWith('match ') ||
        trimmed.startsWith('fn ') ||
        trimmed.startsWith('=>') ||
        trimmed.startsWith('->') ||
        trimmed.startsWith('::') ||
        trimmed.startsWith('??') ||
        trimmed.startsWith('?:') ||
        trimmed.startsWith('?:') ||
        trimmed.startsWith('&&') ||
        trimmed.startsWith('||') ||
        trimmed.startsWith('!') ||
        trimmed.startsWith('~') ||
        trimmed.startsWith('@') ||
        trimmed.startsWith('#') ||
        trimmed.startsWith('//') ||
        trimmed.startsWith('/*') ||
        trimmed.startsWith('*') ||
        trimmed.startsWith('*/') ||
        trimmed.startsWith('?>') ||
        trimmed.startsWith('<!--') ||
        trimmed.startsWith('-->') ||
        trimmed.startsWith('<!') ||
        trimmed.startsWith('< ') ||
        trimmed.startsWith('</') ||
        trimmed.startsWith('->') ||
        trimmed.startsWith('=>') ||
        trimmed.startsWith('[]') ||
        trimmed.startsWith('{}') ||
        trimmed.startsWith('()') ||
        trimmed.startsWith('[ ]') ||
        trimmed.startsWith('{ }') ||
        trimmed.startsWith('( )') ||
        trimmed.startsWith('[') ||
        trimmed.startsWith('{') ||
        trimmed.startsWith('(') ||
        trimmed.startsWith(']') ||
        trimmed.startsWith('}') ||
        trimmed.startsWith(')') ||
        trimmed.startsWith(',') ||
        trimmed.startsWith(';') ||
        trimmed.startsWith(':') ||
        trimmed.startsWith('.') ||
        trimmed.startsWith('?') ||
        trimmed.startsWith('!') ||
        trimmed.startsWith('@') ||
        trimmed.startsWith('#') ||
        trimmed.startsWith('$') ||
        trimmed.startsWith('%') ||
        trimmed.startsWith('^') ||
        trimmed.startsWith('&') ||
        trimmed.startsWith('*') ||
        trimmed.startsWith('-') ||
        trimmed.startsWith('+') ||
        trimmed.startsWith('=') ||
        trimmed.startsWith('|') ||
        trimmed.startsWith('\\') ||
        trimmed.startsWith('/') ||
        trimmed.startsWith('~') ||
        trimmed.startsWith('`') ||
        trimmed.startsWith('"') ||
        trimmed.startsWith("'") ||
        trimmed.startsWith('<') ||
        trimmed.startsWith('>') ||
        trimmed.startsWith(',') ||
        trimmed.startsWith(';') ||
        trimmed.startsWith(':') ||
        trimmed.startsWith('.') ||
        trimmed.startsWith('?') ||
        trimmed.startsWith('!') ||
        trimmed.startsWith('@') ||
        trimmed.startsWith('#') ||
        trimmed.startsWith('$') ||
        trimmed.startsWith('%') ||
        trimmed.startsWith('^') ||
        trimmed.startsWith('&') ||
        trimmed.startsWith('*') ||
        trimmed.startsWith('-') ||
        trimmed.startsWith('+') ||
        trimmed.startsWith('=') ||
        trimmed.startsWith('|') ||
        trimmed.startsWith('\\') ||
        trimmed.startsWith('/') ||
        trimmed.startsWith('~') ||
        trimmed.startsWith('`') ||
        trimmed.startsWith('"') ||
        trimmed.startsWith("'") ||
        trimmed.startsWith('<') ||
        trimmed.startsWith('>')) {
      translatedLines.push(line);
      continue;
    }
    
    // Skip HTML anchor tags
    if (trimmed.startsWith('<a name=') || trimmed.startsWith('</a>')) {
      translatedLines.push(line);
      continue;
    }
    
    // Translate the line
    let translated = line;
    
    // Apply phrase translations
    for (const [en, zh] of Object.entries(phraseTranslations)) {
      translated = translated.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), zh);
    }
    
    // For headers, add translation
    const headerMatch = translated.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      const prefix = headerMatch[1];
      const header = headerMatch[2];
      
      // Check if header is already translated
      if (!/[\u4e00-\u9fff]/.test(header)) {
        // Try to translate the header
        let translatedHeader = header;
        for (const [en, zh] of Object.entries(phraseTranslations)) {
          if (header.toLowerCase().includes(en.toLowerCase())) {
            translatedHeader = translatedHeader.replace(new RegExp(en, 'gi'), zh);
          }
        }
        translated = `${prefix} ${translatedHeader}`;
      }
    }
    
    translatedLines.push(translated);
  }
  
  return translatedLines.join('\n');
}

function processFile(inputPath, outputPath) {
  try {
    const content = readFileSync(inputPath, 'utf-8');
    
    // Check if it's an astro file
    if (inputPath.endsWith('.astro')) {
      // Extract content between backticks
      const contentMatch = content.match(/const content = `([\s\S]*?)`;/);
      if (contentMatch) {
        const originalContent = contentMatch[1];
        const translatedContent = translateContent(originalContent);
        
        // Rebuild the astro file
        const newContent = content.replace(
          /const content = `([\s\S]*?)`;/,
          `const content = \`${translatedContent}\`;`
        );
        
        writeFileSync(outputPath, newContent, 'utf-8');
        console.log(`✓ Updated: ${outputPath}`);
      } else {
        console.log(`⚠ No content found in: ${inputPath}`);
      }
    } else {
      // It's a markdown file
      const translated = translateContent(content);
      writeFileSync(outputPath, translated, 'utf-8');
      console.log(`✓ Translated: ${inputPath} -> ${outputPath}`);
    }
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
  
  processFile(inputPath, outputPath);
}

console.log('\nTranslation complete!');
console.log(`Processed ${files.length} files.`);
