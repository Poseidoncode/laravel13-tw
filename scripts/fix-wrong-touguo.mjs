#!/usr/bin/env node
/**
 * Revert "透過" back to "通過" in "pass test/check" contexts.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC_DIR = join(import.meta.dirname, '..', 'src');

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

const files = walkDir(SRC_DIR);
let totalFixes = 0;

// Pattern 1: 透過...真值測試 → 通過...真值測試
const truthTestPattern = /透過([^。，；！？\n]*)(真值測試|真理測試)/g;
// Pattern 2: 未透過...認證/驗證/檢查 (pass context) → 未通過
const passCheckPattern = /未透過([^。，；！？\n]{0,10})(身份驗證|驗證|認證|檢查|測試)/g;
// Pattern 3: 是否透過 in validation context → 是否通過
const validationPattern = /是否透過([^。，；！？\n]{0,20}驗證)/g;
// Pattern 4: 已透過身份驗證/認證 → 已通過身份驗證/認證 (wait, this could be "via" too...)
// Actually "已透過身份驗證" = "has passed authentication" which should be "已通過"
// But "透過身份驗證供應商" = "via identity provider" which is "透過"
// Pattern 5: 透過了 → 通過了 (in pass context)
// Pattern 6: 未透過...驗證規則 → 未通過
const validationRulePattern = /未透過([^。，；！？\n]{0,20})驗證規則/g;

let changes = [];

for (const filePath of files) {
  const content = readFileSync(filePath, 'utf-8');
  let modified = content;
  let fileChanged = false;

  // Fix 1: 透過...真值測試 → 通過...真值測試
  modified = modified.replace(truthTestPattern, (match) => {
    return '通過' + match.substring(2);
  });
  
  // Fix 2: 未透過...驗證/檢查/認證 (in pass context) → 未通過
  // Be careful: "未透過身份驗證" → "未通過身份驗證" (did not pass auth)
  // But "未透過 Composer 安裝" → keep "透過" (not via composer)
  modified = modified.replace(passCheckPattern, (match) => {
    return '未通過' + match.substring(3);
  });

  // Fix 3: 是否透過 in validation context
  modified = modified.replace(validationPattern, (match) => {
    return '是否通過' + match.substring(3);
  });

  // Fix 4: 已透過 (when followed by auth-related words in "pass" context)
  // "已透過身份驗證" → "已通過身份驗證"
  modified = modified.replace(/已透過(身份驗證|認證)/g, (match) => {
    return '已通過' + match.substring(3);
  });

  // Fix 5: 未透過請求 (did not pass request) → limited scope
  // Actually let me also check: 未透過服務提供者 (not via service provider) - keep 透過
  // This is tricky. Let me only fix the known wrong patterns.

  if (modified !== content) {
    writeFileSync(filePath, modified, 'utf-8');
    fileChanged = true;
    // Count changes
    for (let i = 0; i < content.length; i++) {
      if (content[i] !== modified[i]) {
        totalFixes++;
      }
    }
  }
}

console.log(`Fixed ${totalFixes} incorrect "透過→通過" reversions across files\n`);

// Verify remaining
console.log('=== Remaining issues to check manually ===\n');

// Check for remaining "透過" that might be "通過" in pass contexts
let suspicious = 0;
for (const filePath of files) {
  const content = readFileSync(filePath, 'utf-8');
  const relativePath = filePath.replace(SRC_DIR + '/', '');
  
  // Check for 透過 in suspect pass-test contexts
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check for 透過 followed by test/check words (but not verb/action words)
    const m = line.match(/透過(未通過|通過|檢查|測試|驗證|認證|了)/);
    if (m) {
      console.log(`  ${relativePath}:${i+1}: ${line.trim().substring(0, 100)}`);
      suspicious++;
    }
  }
}

console.log(`\n${suspicious} potential issues remaining.`);
console.log('\nDone!');
