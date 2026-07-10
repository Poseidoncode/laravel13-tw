#!/usr/bin/env node

/**
 * Clean Laravel Documentation Generator
 * Restores original English content with clean structure
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

function processFile(inputPath, outputPath) {
  try {
    const content = readFileSync(inputPath, 'utf-8');
    
    // Create a clean astro file with original English content
    const astroContent = `---
import DocsLayout from '../../layouts/DocsLayout.astro';

const content = \`${content}\`;
---

<DocsLayout title="Documentation" currentPath="${inputPath.split('/').pop().replace('.md', '')}">
  <div class="prose prose-invert max-w-none" set:html={content}></div>
</DocsLayout>
`;
    
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
