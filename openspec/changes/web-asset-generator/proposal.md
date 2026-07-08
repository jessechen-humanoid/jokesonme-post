## Why

看我笑話工作室目前的社群素材（Banner、IG 貼文）靠免費版 Figma 手工排版，效率低且無法讓全團隊共用。前一階段已用 HTML/CSS 模板 + 本機 puppeteer 截圖驗證可行，但 puppeteer 需在特定 Mac 上執行、有系統字體依賴，無法讓全團隊使用。本變更把這套能力搬進**純前端網頁**，部署到 GitHub Pages 公開，讓所有同事在瀏覽器裡就能產出成套素材。

## What Changes

- 新增一個純前端靜態網頁工具（Vite + 原生 JS），部署到 GitHub Pages 公開存取。
- **Banner 活動主視覺**：使用者選品牌（看我笑話／現代問題維修中心）、拖曳底圖、填標題與細節，即時預覽並輸出。
- **IG 貼文**：使用者先選版型（公告型／主視覺型），再填該版型對應欄位（標題、內文＝細節、選配 badge），拖曳底圖，即時預覽並輸出。
- **瀏覽器內出圖**：沿用既有 `templates/*.html` 的版型 CSS 當即時預覽與截圖對象，用 html-to-image 在瀏覽器把 DOM rasterize 成精準尺寸 PNG（1080×1350 / 3200×1200，2x）。字體 Noto Sans TC（Black 900 + Medium 500）自 repo 內嵌，截圖時一併嵌入，不依賴使用者本機字體。
- **多圖排序與打包**：IG 一次可做多張，使用者拖曳決定順序，一鍵下載 ZIP，檔名依序加 `01_ 02_ …` 前綴。
- 底圖等使用者上傳內容只在瀏覽器記憶體處理，不上傳任何伺服器。
- **BREAKING**：退役本機 puppeteer 版（`render.mjs` + `puppeteer-core`），改由網頁工具作為唯一產出管道；版型 CSS 保留並沿用。

## Non-Goals (optional)

## Capabilities

### New Capabilities

- `banner-composer`: Banner 主視覺的品牌選擇、底圖拖曳、文字輸入與即時預覽
- `ig-post-composer`: IG 貼文的版型選擇（公告型／主視覺型）、對應欄位輸入、底圖拖曳與即時預覽
- `image-rasterization`: 在瀏覽器內把預覽 DOM 轉成精準尺寸 PNG，含 Noto 字體內嵌
- `batch-packaging`: 多張素材的拖曳排序與 ZIP 打包下載（檔名依序）

### Modified Capabilities

(none)

## Impact

- Affected code:
  - 新增：`看我笑話社群宣傳/web/`（Vite 專案：index.html、原生 JS 模組、`html-to-image`／`SortableJS`／`JSZip`）
  - 新增：GitHub Actions workflow（build → 部署 GitHub Pages）
  - 沿用：既有 `templates/純文字公告.html`、`templates/主視覺標題.html`、`templates/banner.html` 的版型 CSS
  - 移入 repo：Noto Sans TC 字體（Black／Medium，woff2）
  - 退役：`render.mjs`、`puppeteer-core` 依賴
- Dependencies: 新增前端依賴 `vite`、`html-to-image`、`sortablejs`、`jszip`；移除 `puppeteer-core`
- 部署：GitHub Pages（公開）。品牌 logo 與字體會存在公開 repo（Noto 為 OFL 授權可再散布；品牌 logo 為公開曝光，屬可接受範圍）
