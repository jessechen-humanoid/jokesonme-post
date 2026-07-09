## 1. 底圖上傳保留透明度（Banner background image／IG post background image）

- [x] 1.1 實作 Banner background image 與 IG post background image 的透明度保留：修改 `web/src/main.js` 的 `downscale`／`acceptFile`，來源為 PNG（或帶 alpha）的圖片，縮圖輸出改用 `toDataURL("image/png")`，不再一律轉 JPEG——完成後拖入去背 PNG，預覽與匯出的透明處疊在版型底色上顯示，不得出現黑底。驗證：`npm run dev` 後在 Banner 與 IG 兩個分頁各拖入一張含透明區域的 PNG，肉眼確認預覽透明區透出版型背景；匯出 PNG 開啟後同樣透明。
- [x] 1.2 未超過 `MAX_EDGE` 的圖片不重新編碼，直接沿用 `readFileAsDataURL` 的原始 dataURL——完成後小尺寸圖片不經 canvas 重編碼、無世代損失。驗證：以 DEV console 比對上傳前後 dataURL：小圖（長邊 ≤ MAX_EDGE）的 image 值與原始讀入值一致；超過 MAX_EDGE 的 JPEG 照片仍被縮小（維持既有 JPEG 0.92 行為）。

## 2. resize 只重算縮放（不重建預覽）

- [x] 2.1 將 `window` 的 `resize` 監聽從整頁 `renderPreview` 改為僅對既有預覽 canvas 節點重算縮放（呼叫 `fitCanvas` 邏輯），並以 `requestAnimationFrame` 節流——完成後連續拖動視窗大小時，預覽即時跟隨縮放且不重建 DOM、不重新解碼底圖。驗證：`npm run dev` 拖動視窗，預覽平順跟隨；DevTools Elements 面板確認 resize 過程中預覽節點未被替換（node 參照不變）；切換分頁與換圖後 resize 行為仍正確。

## 3. 空白貼文判斷補 outro（Blank current post is replaced when adding a topic）

- [x] 3.1 實作 Blank current post is replaced when adding a topic 的空白判斷：`isEmptyPost` 增加 `!p.outro` 條件——完成後只填結尾段落的貼文視為有內容，「帶入常用資訊」時保留該貼文並在其後附加主題投影片；標題／內文／條列／outro／badge／截圖全空的貼文仍會被移除。驗證：`npm run dev` 手動操作兩個案例——（a）只填 outro 再帶入常用資訊，原貼文保留；（b）全空貼文帶入常用資訊，原貼文被移除且選中第一張新貼文。

## 4. 整體回歸驗證

- [x] 4.1 `npm run build` 成功產出 `web/dist/`，且以 preview 快速走過三條主流程（Banner 下載、IG 單張下載、IG 多張 ZIP）皆正常——驗證：build 無錯誤；三種匯出各成功產出檔案並可開啟。
