## 1. 專案骨架與技術棧

- [x] 1.1 建立 `web/` 的 Vite 專案骨架，`npm run dev` 可啟動、`npm run build` 產出可部署靜態檔 —— 落實「技術棧：Vite + 原生 JS + SortableJS + JSZip」與「純前端靜態架構、部署 GitHub Pages」。驗收：本機 build 成功並在瀏覽器開啟空白首頁無錯誤。
- [x] 1.2 安裝並確認 `html-to-image`、`sortablejs`、`jszip` 可正常 import 使用。驗收：一支臨時頁面各呼叫一次三個套件皆不報錯（console 無錯誤）。

## 2. 版型與字體移植

- [x] 2.1 將既有 `templates/純文字公告.html`、`templates/主視覺標題.html`、`templates/banner.html` 的版型 CSS 移入網頁，作為即時預覽與截圖來源 —— 落實「沿用模板 CSS，瀏覽器內用 html-to-image 出圖」。驗收：三種版型以固定範例資料靜態渲染，與 Reference 版位／字級／留白人工比對一致。
- [x] 2.2 內嵌 Noto Sans TC 的 Black 900 與 Medium 500（woff2）並以 `@font-face` 載入 —— 落實「Noto Sans TC 字體自 repo 內嵌（Black 900 + Medium 500）」。驗收：DevTools 確認標題以 900、內文以 500 的 Noto Sans TC 呈現。

## 3. 瀏覽器出圖引擎（image-rasterization）

- [x] 3.1 實作 In-browser DOM to PNG rendering：把預覽 DOM 節點在瀏覽器 rasterize 成 PNG，且與畫面一致。驗收：匯出一張與螢幕預覽逐處比對一致。
- [x] 3.2 達成 Embedded fonts independent of the user's machine：截圖時內嵌字體資料。驗收：在未安裝 Noto 字體的他人機器匯出含中文素材，PNG 無亂碼、無 fallback 字體。
- [x] 3.3 達成 Wait for fonts before capture：截圖前確保字體就緒。驗收：字體尚未載入時觸發匯出會等待後才截圖，不產生掉字圖。
- [x] 3.4 達成 Exact output dimensions at 2x：依版型基準 ×2 輸出。驗收：IG 匯出為 2160×2700、Banner 匯出為 6400×2400。
- [x] 3.5 達成 Guard against empty background：未提供底圖時阻擋匯出並提示。驗收：無底圖時按匯出出現提示且不產圖。

## 4. Banner 編輯（banner-composer）

- [x] 4.1 實作 Banner brand selection：選看我笑話／現代問題維修中心切換主標標準字 logo。驗收：切換品牌，預覽主標 logo 隨之更換。
- [x] 4.2 實作 Banner background image，並落實「底圖僅在瀏覽器記憶體處理」：拖曳底圖套用、不上傳伺服器。驗收：拖圖後預覽 cover 3200×1200，且 Network 面板無任何上傳請求。
- [x] 4.3 實作 Banner text fields：副標與選配黃色標籤欄位。驗收：填入副標與標籤顯示於預覽；標籤留空時輸出不含標籤。
- [x] 4.4 實作 Banner output dimensions：Banner 以 3200×1200 基準 2x 輸出。驗收：匯出 PNG 為 6400×2400。

## 5. IG 貼文編輯（ig-post-composer）

- [x] 5.1 實作 IG post template selection：先選公告型／主視覺型再顯示對應欄位。驗收：切換版型時欄位集合正確切換。
- [x] 5.2 實作 IG post background image：拖曳底圖套用。驗收：拖圖後預覽 cover 1080×1350。
- [x] 5.3 實作 Announcement template content：公告型的置中標題、內文與選配條列。驗收：提供條列時顯示編號清單、未提供時輸出不含清單。
- [x] 5.4 實作 Key-visual template content：主視覺型的置中標題與選配橘色圓 badge（內容自由、可多行）。驗收：badge 有內容時顯示、留空時輸出不含 badge。
- [x] 5.5 實作 IG post output dimensions：IG 以 1080×1350 基準 2x 輸出。驗收：單張匯出 PNG 為 2160×2700。

## 6. 多圖排序與打包（batch-packaging）

- [x] 6.1 實作 Multiple IG posts in one session：多張 IG 以縮圖列呈現。驗收：建立三張後見到三個縮圖依序排列。
- [x] 6.2 實作 Drag to reorder：拖曳縮圖改變順序。驗收：把第三張拖到第一位後清單順序更新。
- [x] 6.3 實作 Ordered ZIP download 並落實「多圖排序與 ZIP 依序命名」：一鍵下載含各張 PNG 的 ZIP、檔名帶補零序號前綴對應順序。驗收：三張排序後 ZIP 內含 `01_`、`02_`、`03_` 檔名且對應使用者順序。
- [x] 6.4 實作 Single-asset direct download：單張（Banner 或單一 IG）直接下載 PNG。驗收：匯出單張時下載一個 PNG、不產生 ZIP。

## 7. 部署與退役

- [x] 7.1 設定 GitHub Actions 自動 build 並部署到 GitHub Pages（公開）—— 對應「純前端靜態架構、部署 GitHub Pages」。驗收：公開網址可由他人瀏覽器開啟並完整操作出圖。（已完成：public repo `jessechen-humanoid/jokesonme-post`、Pages source=GitHub Actions、build+deploy 成功，公開網址 https://jessechen-humanoid.github.io/jokesonme-post/ 實測載入、字體內嵌、預覽正常。）
- [x] 7.2 執行「退役本機 puppeteer 產出路徑」：移除 `render.mjs` 與 `puppeteer-core` 依賴，README 改指向網頁工具。驗收：`package.json` 不再含 `puppeteer-core`、`render.mjs` 已移除、README 更新完成（內容審查）。
