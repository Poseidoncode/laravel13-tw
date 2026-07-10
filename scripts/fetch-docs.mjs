#!/usr/bin/env node

/**
 * Script to fetch Laravel 13.x documentation from GitHub
 * and save it locally for translation
 */

import { execSync } from 'child_process';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DOCS_REPO = 'https://github.com/laravel/docs.git';
const DOCS_BRANCH = '13.x';
const OUTPUT_DIR = './docs-original';
const DOCS_DIR = join(OUTPUT_DIR, 'laravel-docs');

// List of all documentation files to fetch
const DOC_FILES = [
  // Getting Started
  'installation.md',
  'configuration.md',
  'structure.md',
  'frontend.md',
  'starter-kits.md',
  'deployment.md',
  
  // Core Concepts
  'lifecycle.md',
  'container.md',
  'providers.md',
  'facades.md',
  
  // Routing & Requests
  'routing.md',
  'middleware.md',
  'csrf.md',
  'controllers.md',
  'requests.md',
  'responses.md',
  
  // Frontend & Views
  'views.md',
  'blade.md',
  'vite.md',
  'urls.md',
  
  // Application Features
  'session.md',
  'validation.md',
  'errors.md',
  'logging.md',
  'artisan.md',
  
  // Database
  'database.md',
  'queries.md',
  'migrations.md',
  'seeding.md',
  'redis.md',
  
  // Eloquent ORM
  'eloquent.md',
  'eloquent-relationships.md',
  'eloquent-collections.md',
  'eloquent-mutators.md',
  'eloquent-resources.md',
  'eloquent-serialization.md',
  'eloquent-factories.md',
  
  // Packages
  'packages.md',
  'billing.md',
  'cashier-paddle.md',
  'envoy.md',
  'fortify.md',
  'folio.md',
  'homestead.md',
  'horizon.md',
  'mix.md',
  'octane.md',
  'passport.md',
  'pennant.md',
  'pint.md',
  'precognition.md',
  'pulse.md',
  'sail.md',
  'sanctum.md',
  'scout.md',
  'socialite.md',
  'telescope.md',
  'valet.md',
  
  // Authentication & Security
  'authentication.md',
  'authorization.md',
  'verification.md',
  'passwords.md',
  'encryption.md',
  'hashing.md',
  'rate-limiting.md',
  
  // Advanced Features
  'broadcasting.md',
  'cache.md',
  'collections.md',
  'concurrency.md',
  'events.md',
  'filesystem.md',
  'helpers.md',
  'http-client.md',
  'localization.md',
  'mail.md',
  'notifications.md',
  'pagination.md',
  'queues.md',
  'scheduling.md',
  'search.md',
  
  // Testing
  'testing.md',
  'http-tests.md',
  'console-tests.md',
  'database-testing.md',
  'mocking.md',
  
  // AI & Agentic Development
  'ai.md',
  'ai-sdk.md',
  'mcp.md',
  'boost.md',
  'prompts.md',
  
  // Other
  'releases.md',
  'upgrade.md',
  'contributions.md',
  'documentation.md',
  'contracts.md',
  'context.md',
  'mongodb.md',
  'processes.md',
  'strings.md',
];

async function fetchDocs() {
  console.log('🚀 開始抓取 Laravel 13.x 文檔...');
  
  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Clone or update the repository
  if (!existsSync(DOCS_DIR)) {
    console.log('📦 正在複製 Laravel 文檔倉庫...');
    execSync(`git clone --depth 1 --branch ${DOCS_BRANCH} ${DOCS_REPO} ${DOCS_DIR}`, {
      stdio: 'inherit',
    });
  } else {
    console.log('🔄 正在更新文檔...');
    execSync(`cd ${DOCS_DIR} && git pull`, {
      stdio: 'inherit',
    });
  }
  
  console.log('✅ 文檔抓取完成！');
  console.log(`📁 文檔位置: ${DOCS_DIR}`);
  
  // Count files
  let fetchedCount = 0;
  for (const file of DOC_FILES) {
    const filePath = join(DOCS_DIR, file);
    if (existsSync(filePath)) {
      fetchedCount++;
    }
  }
  
  console.log(`📄 共找到 ${fetchedCount}/${DOC_FILES.length} 個文檔檔案`);
}

fetchDocs().catch(console.error);
