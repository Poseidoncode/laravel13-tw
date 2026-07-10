#!/usr/bin/env node
/**
 * Fix mainland China terminology to Taiwan usage across all .astro files.
 * 
 * Changes:
 *   信息 → 資訊
 *   數組 → 陣列
 *   緩存 → 快取
 *   回調 → 回呼
 *   點擊 → 點選
 *   創建 → 建立
 *   構建 → 建立
 *   組件 → 元件
 *   用戶端 → 客戶端 (when used as "client component")
 *   通過 → 透過 (in "via" context, not "pass test" context)
 *   用戶 → 使用者
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC_DIR = join(import.meta.dirname, '..', 'src');

// Stats tracking
const stats = {};

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      if (entry !== 'node_modules' && !entry.startsWith('.')) {
        files.push(...walkDir(fullPath));
      }
    } else if (extname(fullPath) === '.astro') {
      files.push(fullPath);
    }
  }
  return files;
}

function countOccurrences(content, pattern) {
  return (content.match(new RegExp(pattern, 'g')) || []).length;
}

const replacementRules = [
  // Simple global replacements (safe for all contexts)
  { 
    name: '信息 → 資訊',
    test: /信息/g, 
    replace: () => '資訊',
    safe: true,
  },
  { 
    name: '數組 → 陣列',
    test: /數組/g, 
    replace: () => '陣列',
    safe: true,
  },
  { 
    name: '緩存 → 快取',
    test: /緩存/g, 
    replace: () => '快取',
    safe: true,
  },
  { 
    name: '回調 → 回呼',
    test: /回調/g, 
    replace: () => '回呼',
    safe: true,
  },
  { 
    name: '點擊 → 點選',
    test: /點擊/g, 
    replace: () => '點選',
    safe: true,
  },
  { 
    name: '創建 → 建立',
    test: /創建/g, 
    replace: () => '建立',
    safe: true,
  },
  { 
    name: '構建 → 建立',
    test: /構建/g, 
    replace: () => '建立',
    safe: true,
  },
  { 
    name: '組件 → 元件',
    test: /組件/g, 
    replace: () => '元件',
    safe: true,
  },
  {
    name: '用戶端 → 客戶端',
    test: /用戶端/g,
    replace: () => '客戶端',
    safe: true,
  },
  // 通過 → 透過: only when NOT followed by test/check/validation context words
  {
    name: '通過 → 透過 (via context)',
    // Don't replace 通過 when followed by 測試, 驗證, 檢查, 認證, 安全, 審查, 審核, 審計
    // or when it's part of "通過" meaning "pass" e.g. 通過/不通過
    test: /(通過)(?!\s*(?:測試|驗證|檢查|認證|安全|審[查計]|審|了|的時|的[請要]|方式|路線|的門|。|，))([^。，]*?)/g,
    replace: () => '透過',
    condition: (match) => {
      // Skip if match is followed by test/check words (pass context)
      const rest = match.substring(2);
      if (/^\s*(測試|驗證|檢查|認證|安全|審[查計])/.test(rest)) return false;
      if (/^\s*(了|的時|的[請要]|方式|路線|的門|。|，)/.test(rest)) return false;
      return true; // Replace (via context)
    },
    safe: false, // Requires context check
  },
  // 用戶 → 使用者
  { 
    name: '用戶 → 使用者',
    test: /用戶/g, 
    replace: () => '使用者',
    safe: true,
  },
];

const files = walkDir(SRC_DIR);
console.log(`Found ${files.length} .astro files\n`);

let totalChanges = 0;
const fileReports = [];

for (const filePath of files) {
  const relativePath = filePath.replace(SRC_DIR + '/', '');
  let content = readFileSync(filePath, 'utf-8');
  let original = content;
  let fileChanges = 0;
  const fileRuleResults = [];

  for (const rule of replacementRules) {
    // Count occurrences
    const count = countOccurrences(content, rule.test.source);
    if (count === 0) continue;

    if (rule.safe) {
      // Simple global replacement
      const before = content;
      content = content.replace(rule.test, rule.replace);
      const actualChanges = countOccurrences(before, rule.test.source) - countOccurrences(content, rule.test.source);
      if (actualChanges > 0) {
        fileRuleResults.push(`${rule.name}: ${actualChanges}`);
        fileChanges += actualChanges;
      }
    } else if (rule.name === '通過 → 透過 (via context)') {
      // Need to be smarter about 通過
      // Replace 通過 with 透過 only when it means "via/by means of"
      // Keep 通過 when it means "pass (a test/check)"
      
      // Strategy: Replace 通過 followed by non-test words
      // The safe_pattern matches 通過 NOT followed by test/check words
      // Use a two-pass approach
      let changed = false;
      
      // First pass: find all 通過 instances and check context
      const matches = content.matchAll(/通過/g);
      let positions = [];
      for (const m of matches) {
        positions.push(m.index);
      }
      
      // Process from end to start to preserve positions
      const nonPassIndices = [];
      for (const pos of positions) {
        const restOfLine = content.substring(pos + 2, pos + 20);
        // Check if it's a "pass" context
        const isPassContext = /^\s*(?:測試|驗證|檢查|認證|安全|審[查計]|了|的時\b)/.test(restOfLine) ||
                             /^\s*(?:了|的[請要時]|方式|路線|的門)/.test(restOfLine);
        
        if (!isPassContext && 
            // Also check if this is part of typical "via" patterns
            (restOfLine.includes(' ') || restOfLine.startsWith('\u3000') || 
             /^[^。，；！？\n)]{0,30}/.test(c => !c))) {
          nonPassIndices.push(pos);
        }
      }
      
      // Apply replacements from end to start
      if (nonPassIndices.length > 0) {
        const chars = content.split('');
        for (let i = nonPassIndices.length - 1; i >= 0; i--) {
          const idx = nonPassIndices[i];
          // Check context more carefully
          const beforeChar = idx > 0 ? content[idx - 1] : '';
          const afterContext = content.substring(idx + 2, idx + 12);
          
          // Skip if it's in the "pass" context
          const skip = /^\s*(?:測試|驗證|檢查|認證|安全|審[查計])/.test(afterContext) ||
                       /^\s*(?:了|的時\b|方式|路線)/.test(afterContext) ||
                       // Skip 通過 used as noun (e.g., "通過" meaning passage)
                       (beforeChar.match(/[的之是]/) && /^\s*了/.test(afterContext));
          
          if (!skip) {
            chars[idx] = '透';
            // Keep the second character as '過'
            changed = true;
          }
        }
        
        if (changed) {
          content = chars.join('');
          // Count actual changes
          // (We'll count the difference)
        }
      }
      
      if (changed) {
        const newCount = countOccurrences(content, '通過');
        const diff = count - newCount;
        if (diff > 0) {
          fileRuleResults.push(`${rule.name}: ${diff}`);
          fileChanges += diff;
        }
      }
    }
  }

  if (fileChanges > 0) {
    writeFileSync(filePath, content, 'utf-8');
    totalChanges += fileChanges;
    fileReports.push(`${relativePath}: ${fileChanges} changes [${fileRuleResults.join(', ')}]`);
  }
}

// Print summary
console.log('=== Replacement Summary ===\n');

// Collect per-rule stats
const ruleStats = {};
for (const rule of replacementRules) {
  ruleStats[rule.name] = { found: 0, changed: 0 };
}

// Re-scan all files for remaining mainland terms
console.log('=== Remaining mainland terms (if any) ===\n');
const checkTerms = {
  '信息(?!\u606f\u606f)': '資訊',
  '數組': '陣列',
  '緩存': '快取',
  '回調': '回呼',
  '點擊': '點選',
  '創建': '建立',
  '構建': '建立',
  '組件(?!\u4ef6)': '元件',
  '用戶端': '客戶端',
};

let remainingIssues = false;
for (const [pattern, replacement] of Object.entries(checkTerms)) {
  const re = new RegExp(pattern, 'g');
  for (const filePath of files) {
    const content = readFileSync(filePath, 'utf-8');
    const matches = content.match(re);
    if (matches) {
      const relativePath = filePath.replace(SRC_DIR + '/', '');
      console.log(`  ${relativePath}: ${matches.length}x "${pattern}" (should be "${replacement}")`);
      remainingIssues = true;
    }
  }
}

// Also check for remaining 通過 in "via" context
let viaCount = 0;
let passCount = 0;
for (const filePath of files) {
  const content = readFileSync(filePath, 'utf-8');
  const matches = content.matchAll(/通過/g);
  for (const m of matches) {
    const afterContext = content.substring(m.index + 2, m.index + 15);
    if (/^\s*(?:測試|驗證|檢查|認證|安全|審[查計])/.test(afterContext)) {
      passCount++;
    } else if (!/^\s*(?:了|的時\b|方式|路線)/.test(afterContext)) {
      viaCount++;
    }
  }
}
if (viaCount > 0) {
  console.log(`  [注意] 還有 ${viaCount} 個「通過」(via 語意) 可能仍需要改為「透過」`);
}
if (passCount > 0) {
  console.log(`  [保留] ${passCount} 個「通過」(通過測試/驗證語意) 保留不變`);
}

console.log(`\n=== Final Statistics ===`);
console.log(`Total files changed: ${fileReports.length}`);
console.log(`Total replacements: ${totalChanges}`);

if (fileReports.length > 0) {
  console.log('\n=== Files changed ===');
  for (const report of fileReports) {
    console.log(`  ${report}`);
  }
}

if (!remainingIssues) {
  console.log('\n✅ All mainland China terms have been fixed!');
} else {
  console.log('\n⚠️  Some terms may still need manual review (see above).');
}
