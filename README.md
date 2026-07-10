# Laravel 13.x 繁體中文文檔

> 完整的 Laravel 13.x 框架文檔繁體中文翻譯，使用 Astro 7 + Tailwind CSS v4 建構的現代化靜態網站。

## 📚 專案概述

這是一個社群驅動的專案，旨在將 Laravel 13.x 官方文檔完整翻譯成繁體中文，幫助繁體中文開發者更輕鬆地學習和使用 Laravel 框架。

## 🚀 技術棧

- **框架**: [Astro 7](https://astro.build/) - 高效能靜態網站生成器
- **樣式**: [Tailwind CSS v4](https://tailwindcss.com/) - 實用優先的 CSS 框架
- **搜尋**: [Pagefind](https://pagefind.app/) - 靜態網站搜尋引擎，支援中文
- **內容**: MDX - 支援在 Markdown 中使用 React 元件
- **部署**: 靜態網站 - 可部署到任何靜態託管服務

## 📁 專案結構

```
laravel13-tw/
├── src/
│   ├── components/          # Astro 元件
│   │   ├── Search.astro     # 搜尋元件 (Pagefind)
│   │   └── Sidebar.astro    # 側邊欄導航元件
│   ├── content/             # 內容目錄
│   │   └── docs/            # 文檔內容（翻譯後）
│   ├── layouts/             # 版面配置
│   │   ├── Layout.astro     # 主版面配置
│   │   └── DocsLayout.astro # 文檔版面配置
│   ├── pages/               # 頁面路由
│   │   ├── index.astro      # 首頁
│   │   └── docs/            # 文檔頁面（105 個頁面）
│   ├── styles/              # 樣式檔案
│   │   └── global.css       # 全域樣式
│   └── utils/               # 工具函式
├── scripts/                 # 工具腳本
│   ├── fetch-docs.mjs       # 抓取原始文檔
│   ├── generate-pages.mjs   # 生成文檔頁面
│   └── translate-docs.mjs   # 翻譯工具
├── public/                  # 靜態資源
│   ├── images/              # 圖片
│   └── fonts/               # 字型
├── docs-original/           # 原始英文文檔（git ignored）
└── package.json
```

## 🛠️ 開發指南

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

開發伺服器將在 http://localhost:4321 啟動。

### 建構生產版本

```bash
npm run build
```

建構過程會自動執行以下步驟：
1. Astro 建構靜態頁面
2. Pagefind 建立搜尋索引

### 預覽生產版本

```bash
npm run preview
```

## 🔍 搜尋功能

本專案使用 [Pagefind](https://pagefind.app/) 提供全文搜尋功能。

### 特色

- ✅ 支援繁體中文搜尋
- ✅ 完全靜態，無需外部 API
- ✅ 鍵盤快捷鍵支援 (⌘K 開啟)
- ✅ 即時搜尋結果
- ✅ 離線可用

### 使用方式

1. 點選頁面頂部的搜尋框
2. 或使用快捷鍵 `⌘K` (Mac) / `Ctrl+K` (Windows/Linux)
3. 輸入關鍵字搜尋
4. 使用方向鍵導航結果
5. 按 Enter 開啟選中的結果

### 建構搜尋索引

搜尋索引會在 `npm run build` 時自動建立。如需單獨重建索引：

```bash
npm run build:search
```

## 📝 翻譯指南

### 翻譯流程

1. **抓取原始文檔**
   ```bash
   node scripts/fetch-docs.mjs
   ```

2. **生成頁面結構**
   ```bash
   node scripts/generate-pages.mjs
   ```

3. **翻譯內容**
   - 從 `docs-original/laravel-docs/` 複製原始內容
   - 翻譯成繁體中文
   - 更新 `src/pages/docs/` 中的對應頁面

4. **更新狀態**
   - 更新 frontmatter 中的 `translated` 欄位為 `true`
   - 更新 `title` 為繁體中文標題

### 翻譯規範

#### 術語統一

| 英文 | 繁體中文 | 說明 |
|------|----------|------|
| Eloquent | Eloquent | 保留原文 |
| Blade | Blade | 保留原文 |
| Artisan | Artisan | 保留原文 |
| Middleware | 中介層 | |
| Controller | 控制器 | |
| Route | 路由 | |
| Request | 請求 | |
| Response | 回應 | |
| View | 視圖 | |
| Model | 模型 | |
| Migration | 遷移 | |
| Seeder | 填充 | |
| Factory | 工廠 | |
| Queue | 佇列 | |
| Job | 任務 | |
| Event | 事件 | |
| Listener | 監聽器 | |
| Service Provider | 服務提供者 | |
| Service Container | 服務容器 | |
| Dependency Injection | 依賴注入 | |
| Interface | 介面 | |
| Trait | 特徵 | |
| Contract | 合約 | |
| Database | 資料庫 | |
| Query Builder | 查詢建構器 | |
| Table | 資料表 | |
| Column | 欄位 | |
| Authentication | 認證 | |
| Authorization | 授權 | |
| Gate | 閘道 | |
| Policy | 政策 | |
| Test | 測試 | |
| Assertion | 斷言 | |
| Mock | 模擬 | |
| Configuration | 配置 | |
| Environment | 環境 | |
| Cache | 快取 | |
| Package | 套件 | |
| Helper | 輔助函式 | |
| Collection | 集合 | |

#### 程式碼區塊

- 保留原始程式碼不翻譯
- 翻譯程式碼區塊的說明文字
- 註解可以翻譯成繁體中文

#### 連結

- 保留原始 Laravel 文檔連結
- 內部連結使用繁體中文版本的路徑
- 外部連結保持原樣

## 📋 文檔清單

### 開始使用
- [x] 安裝 (installation)
- [ ] 配置 (configuration)
- [ ] 目錄結構 (structure)
- [ ] 前端 (frontend)
- [ ] 入門套件 (starter-kits)
- [ ] 部署 (deployment)

### 核心概念
- [ ] 請求生命週期 (lifecycle)
- [ ] 服務容器 (container)
- [ ] 服務提供者 (providers)
- [ ] Facades

### 路由與請求
- [ ] 路由 (routing)
- [ ] 中介層 (middleware)
- [ ] CSRF 保護 (csrf)
- [ ] 控制器 (controllers)
- [ ] HTTP 請求 (requests)
- [ ] HTTP 回應 (responses)

### 前端與視圖
- [ ] 視圖 (views)
- [ ] Blade 模板 (blade)
- [ ] 資源打包 (vite)
- [ ] URL 生成 (urls)

### 應用功能
- [ ] Session
- [ ] 驗證 (validation)
- [ ] 錯誤處理 (errors)
- [ ] 日誌 (logging)
- [ ] Artisan 命令列 (artisan)

### 資料庫
- [ ] 資料庫入門 (database)
- [ ] 查詢建構器 (queries)
- [ ] 遷移 (migrations)
- [ ] 填充 (seeding)
- [ ] Redis

### Eloquent ORM
- [ ] Eloquent 入門 (eloquent)
- [ ] Eloquent 關聯 (eloquent-relationships)
- [ ] Eloquent 集合 (eloquent-collections)
- [ ] Eloquent 修改器 (eloquent-mutators)
- [ ] Eloquent API 資源 (eloquent-resources)
- [ ] Eloquent 序列化 (eloquent-serialization)
- [ ] Eloquent 工廠 (eloquent-factories)

### 套件開發
- [ ] 套件開發 (packages)
- [ ] 擴展包 (billing)
- [ ] Cashier (Paddle)
- [ ] Envoy
- [ ] Fortify
- [ ] Folio
- [ ] Homestead
- [ ] Horizon
- [ ] Mix
- [ ] Octane
- [ ] Passport
- [ ] Pennant
- [ ] Pint
- [ ] Precognition
- [ ] Pulse
- [ ] Sail
- [ ] Sanctum
- [ ] Scout
- [ ] Socialite
- [ ] Telescope
- [ ] Valet

### 認證與安全
- [ ] 認證 (authentication)
- [ ] 授權 (authorization)
- [ ] 電子郵件驗證 (verification)
- [ ] 密碼重設 (passwords)
- [ ] 加密 (encryption)
- [ ] 雜湊 (hashing)
- [ ] 速率限制 (rate-limiting)

### 進階功能
- [ ] 廣播 (broadcasting)
- [ ] 快取 (cache)
- [ ] 集合 (collections)
- [ ] 並行 (concurrency)
- [ ] 事件 (events)
- [ ] 檔案系統 (filesystem)
- [ ] 輔助函式 (helpers)
- [ ] HTTP 客戶端 (http-client)
- [ ] 本地化 (localization)
- [ ] 郵件 (mail)
- [ ] 通知 (notifications)
- [ ] 分頁 (pagination)
- [ ] 佇列 (queues)
- [ ] 排程 (scheduling)
- [ ] 搜尋 (search)

### 測試
- [ ] 測試入門 (testing)
- [ ] HTTP 測試 (http-tests)
- [ ] 控制台測試 (console-tests)
- [ ] 資料庫測試 (database-testing)
- [ ] Mocking

### AI 與 Agentic 開發
- [ ] Laravel 與 AI (ai)
- [ ] AI SDK (ai-sdk)
- [ ] MCP (mcp)
- [ ] Boost (boost)
- [ ] Prompts (prompts)

### 其他
- [ ] 發布說明 (releases)
- [ ] 升級指南 (upgrade)
- [ ] 貢獻指南 (contributions)
- [ ] 文件說明 (documentation)
- [ ] 合約 (contracts)
- [ ] 上下文 (context)
- [ ] Laravel Cloud (cloud)
- [ ] MongoDB (mongodb)
- [ ] Processes (processes)
- [ ] 字串輔助 (strings)

## 🤝 貢獻指南

歡迎社群貢獻！請遵循以下步驟：

1. Fork 本專案
2. 建立特性分支 (`git checkout -b feature/translate-xxx`)
3. 提交更改 (`git commit -m '翻譯 xxx 文檔'`)
4. 推送到分支 (`git push origin feature/translate-xxx`)
5. 建立 Pull Request

### 翻譯貢獻規範

- 確保翻譯準確且符合繁體中文用語習慣
- 保留原始程式碼區塊不變
- 翻譯所有說明文字和註解
- 遵循上述術語統一規範
- 測試翻譯後的頁面顯示正確

## 📄 授權條款

本專案基於 [MIT 授權條款](LICENSE) 開源。

原始 Laravel 文檔由 Laravel 官方維護，遵循 [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/)。

## 🙏 致謝

感謝所有貢獻者和 Laravel 社群的支持！

## 📞 聯絡方式

如有任何問題或建議，歡迎透過以下方式聯絡：

- GitHub Issues
- Pull Requests

---

**注意**: 這是一個社群維護的翻譯專案，並非 Laravel 官方產品。如需最新官方文檔，請訪問 [laravel.com](https://laravel.com/docs/13.x)。
