## Context

前一階段已在本機用「HTML/CSS 模板 + Node/puppeteer 叫系統 Chrome 截圖」驗證出圖可行，字體用系統內建的 Noto Sans CJK TC Black。三個模板（純文字公告、主視覺標題、banner）都已產出與 Reference 幾乎一致的成品。

限制與現實：
- 目標是**全團隊可用、公開部署在 GitHub Pages**。GitHub Pages 只提供靜態託管，**不能跑任何後端**，因此 puppeteer 那套完全無法沿用。
- 使用者的電腦不會安裝 Noto Sans CJK TC Black，瀏覽器渲染必須自帶字體。
- 素材規格固定：IG 直式 1080×1350、Banner 3200×1200，輸出 2x。
- 品牌有兩個：看我笑話、現代問題維修中心，各有去背標準字 logo（已在 `assets/logo/`）。
- 使用者：非工程背景的行銷／設計同事，操作要直覺（拖曳、填欄位、下載）。

## Goals / Non-Goals

**Goals:**

- 純前端靜態網頁，零後端，部署 GitHub Pages 公開存取。
- 支援兩類素材：Banner 主視覺、IG 貼文（IG 先選版型公告型／主視覺型再填欄位）。
- 拖曳底圖進頁面即可套版、即時預覽。
- IG 可一次多張、拖曳決定順序，一鍵下載依序命名的 ZIP。
- 產出像素與既有模板一致（沿用同一套版型 CSS），中文字體不依賴使用者本機。
- 底圖等上傳內容只在瀏覽器端處理，不外傳。

**Non-Goals:**

- 座位圖（本次明確放棄）。
- 更換場地／可搬動元素的自由編輯器。
- 後端、帳號登入、權限、素材雲端儲存。
- 影片或動態素材、多語系介面。
- 保留本機 puppeteer 產出路徑（本次退役）。

## Decisions

### 純前端靜態架構、部署 GitHub Pages

所有邏輯在瀏覽器執行，GitHub Pages 只放 build 後的靜態檔，用 GitHub Actions 自動 build 與部署。
理由：符合「公開、人人可用、零維運後端」。替代方案 —— 自架伺服器跑 puppeteer（維運成本高、要主機）；Vercel/Netlify serverless 截圖（引入外部服務與額度，且非 GitHub Pages）。皆不採。

### 沿用模板 CSS，瀏覽器內用 html-to-image 出圖

既有 `templates/*.html` 的版型 CSS 直接搬進網頁，同時當「即時預覽畫面」與「截圖來源 DOM」。用 `html-to-image` 把該 DOM 節點 rasterize 成 PNG。
理由：一份版型兩用，前階段成果不浪費，預覽即所得。替代方案 —— 用 Canvas 手繪（中文斷行／排版要自己算，成本高）；沿用 puppeteer（不能在瀏覽器跑）。皆不採。

### Noto Sans TC 字體自 repo 內嵌（Black 900 + Medium 500）

把 Noto Sans TC 的 Black 與 Medium 兩個字重（woff2）放進 repo，用 `@font-face` 載入；截圖前確保 `document.fonts.ready`，並讓 html-to-image 內嵌字體資料，避免使用者本機無字體導致亂碼或掉字。
理由：標題用 Black、內文用 Medium，兩重覆蓋現有模板需求。self-host 避免 Google Fonts CDN 的 CORS／可用性問題。替代方案 —— 只靠系統字體（使用者端不可靠）；Google Fonts CDN（CORS 與外部依賴）。皆不採。

### 技術棧：Vite + 原生 JS + SortableJS + JSZip

用 Vite 打包；互動用原生 JS（規模不需 React）；拖曳排序用 SortableJS；打包用 JSZip；截圖用 html-to-image。
理由：輕、好維護、依賴少。替代方案 —— React/Vue（此規模過重）；無 build 的單一 HTML + CDN（相依管理與字體內嵌較亂）。皆不採。

### 底圖僅在瀏覽器記憶體處理

拖入的底圖以 `URL.createObjectURL` / DataURL 在前端使用，不上傳。
理由：隱私、零後端天然達成。無明顯替代方案需求。

### 多圖排序與 ZIP 依序命名

IG 多張以縮圖列呈現，SortableJS 拖曳排序；下載時逐張截圖並以 `01_`, `02_`… 前綴寫入 ZIP。
理由：直接滿足「下載即照順序排好」。替代方案 —— 不排序只批次輸出（不符需求）。不採。

### 退役本機 puppeteer 產出路徑

移除 `render.mjs` 與 `puppeteer-core` 依賴，網頁工具成為唯一產出管道；版型 CSS 保留沿用。
理由：避免兩套並存分岔。內容 JSON（`content/*.json`）的欄位語意轉為網頁表單欄位。

## Implementation Contract

**可觀察行為**：使用者開啟公開網址後，能：
1. 選素材類型：Banner 或 IG 貼文。
2. Banner：選品牌（看我笑話／現代問題維修中心）→ 拖入底圖 → 填標題／副標／選配標籤 → 見即時預覽 → 下載單張 PNG（3200×1200，2x）。
3. IG：先選版型（公告型／主視覺型）→ 依版型填欄位 → 拖入底圖 → 即時預覽；可新增多張、拖曳排序 → 下載 ZIP。

**版型與欄位（介面契約）**：
- Banner：`brand`（看我笑話｜現代問題維修中心）、`background`（圖）、`subtitle`、`tag`（選配黃標）；主標用該品牌標準字 logo。輸出 3200×1200。
- IG／公告型：`background`、`title`、`intro`（＝細節內文）、`list[]`（選配條列）。輸出 1080×1350。
- IG／主視覺型：`background`、`title`、`badge`（選配橘色圓，內容自由，可空）。輸出 1080×1350。
- 文字支援換行；粗體語法沿用既有模板做法。

**輸出契約**：
- 單張輸出：PNG，尺寸＝該版型基準 × 2（retina）。
- 多張輸出：ZIP，內含 PNG，檔名 `01_<slug>.png`、`02_…`，序號＝使用者排序。

**失敗模式**：
- 未放底圖就下載 → 阻擋並提示（不產生空圖）。
- 字體未就緒 → 等待 `document.fonts.ready` 後才截圖（不得在字體未載入時輸出）。
- 圖片過大 → 前端可接受，記憶體處理；不設硬性上傳限制。

**驗收條件**：
- 部署後的公開網址可在他人瀏覽器（無 Noto 字體之機器）正確顯示中文並輸出無亂碼 PNG。
- 產出的 Banner／IG 與既有 `templates/*` 版型視覺一致（版位、字級、留白相符）。
- 多張 IG 下載的 ZIP 內檔名序號與使用者拖曳順序一致。
- 兩個品牌各能產出對應 logo 的 Banner。

**範圍邊界**：
- 範圍內：Banner + IG 兩類、兩種 IG 版型、拖曳底圖、排序、ZIP、GitHub Pages 部署、字體內嵌、puppeteer 退役。
- 範圍外：座位圖、換場地、後端／登入、影片、素材雲端保存。

## Risks / Trade-offs

- [html-to-image 對某些 CSS（濾鏡、陰影、混合模式）還原度或效能不一致] → 先做最小驗證（截一張含中文與陰影的圖比對），版型 CSS 若有不相容處改用相容寫法。
- [Noto 字體檔案大、拖慢首次載入] → 只帶 Black + Medium 兩重、用 woff2；可評估 subset 但保留全字集以支援任意中文輸入。
- [大尺寸 2x（3200×1200＝6400×2400）截圖在低階裝置記憶體吃緊] → 逐張截圖釋放、必要時提示；桌機為主要使用情境。
- [品牌 logo 放進公開 repo 曝光] → 屬可接受範圍；Noto 為 OFL 授權可再散布。
- [退役 puppeteer 後失去本機批次] → 若日後需要再議；目前需求由網頁覆蓋。

## Migration Plan

1. 在 `看我笑話社群宣傳/web/` 建 Vite 專案，移入版型 CSS 與字體。
2. 完成 Banner／IG 編輯與出圖、排序、ZIP。
3. 設定 GitHub Actions 部署 GitHub Pages（公開）。
4. 驗收（他人機器實測）通過後，移除 `render.mjs` 與 `puppeteer-core`。
- Rollback：保留 git 歷史；若網頁版有阻斷性問題，可暫時還原 puppeteer 腳本應急。

## Open Questions

- 首次載入速度是否需要對字體做 subset？（先全字集，量測後再決定）
- ZIP 內檔名 slug 規則（用標題？流水號＋日期？）—— 實作時定一個簡單預設即可。
