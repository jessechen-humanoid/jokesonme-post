## Why

Code review 發現素材產生器有三個會影響產出品質或體感的既有行為問題：（1）上傳去背 PNG 會被強制轉成 JPEG 而失去透明度（透明處變黑底），設計師會直接產出錯誤素材；（2）視窗 resize 時整個預覽 canvas DOM 全量重建並重新解碼底圖，拖動視窗明顯卡頓；（3）「帶入常用資訊」時，只填了結尾段落（outro）的貼文會被誤判為空白而被靜默刪除。三項都是小範圍修正，一併處理。

## What Changes

- 上傳圖片的縮圖處理（downscale）依來源格式保留透明度：PNG 來源輸出 PNG，不做不必要的 JPEG 重編碼；未超過最大邊長（MAX_EDGE）的圖片不再重新編碼，直接沿用原始資料。
- 視窗 resize 事件不再整頁重建預覽：改為只對既有 canvas 節點重算縮放（fitCanvas），並以 requestAnimationFrame 節流，避免連續觸發時的重複運算。
- 空白貼文判斷（isEmptyPost）補上 outro 欄位：只填結尾段落的貼文視為有內容，「帶入常用資訊」時不再被移除。

## Non-Goals

- 不重做 IG 貼文縮圖機制（postCard 每張建全尺寸 canvas 再縮小）：目前單次貼文數量有限，體感可接受，等實際卡頓再議。
- 不處理鍵盤無障礙（tabs／dropzone 鍵盤操作）與圖片 alt 補全：內部工具以滑鼠操作為主，另案處理。
- 不改變 JPEG 來源照片的既有壓縮行為（超過最大邊長的 JPEG 照片仍縮小並以 JPEG 0.92 輸出）。
- 不引入新依賴、不改動匯出（rasterize／zip）流程。

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `banner-composer`: 底圖上傳需求增加透明度保留條款——含透明度的 PNG 底圖經處理後仍保留透明度，不得被壓成不透明底色。
- `ig-post-composer`: 底圖上傳需求增加透明度保留條款——含透明度的 PNG 底圖經處理後仍保留透明度，不得被壓成不透明底色。
- `common-info-library`: 「帶入常用資訊時移除當前空白貼文」的行為補上明確定義——僅在標題、內文、條列、結尾段落、badge、截圖全部為空時才視為空白貼文；此行為原先未入 spec，本次一併補上。

## Impact

- Affected specs: `banner-composer`／`ig-post-composer`（底圖上傳）、`common-info-library`（空白貼文替換）
- Affected code:
  - Modified: `web/src/main.js`（downscale 與 acceptFile 的格式判斷、resize 監聽改 fitCanvas＋rAF 節流、isEmptyPost 補 outro）
  - New: （無）
  - Removed: （無）
