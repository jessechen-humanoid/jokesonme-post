## Why

使用者上傳的底圖在下載 PNG 後比例變形（直式照片被壓扁、橫式照片被拉窄），跟網頁預覽不一致。原因是預覽用 CSS object-fit: cover（只裁切不變形），但匯出走 html2canvas 1.4.1 重繪，該函式庫不支援 object-fit，會把原圖直接拉伸塞滿元素框。照片比例與版面比例差越多，變形越嚴重。

## What Changes

- 匯出前置處理：在 rasterize 匯出路徑中，把底圖依 cover 邏輯（等比放大、置中裁切）預先裁成畫布比例，再交給 html2canvas，使匯出的 PNG 與預覽一致。
- 三種版型（banner 3200×1200、公告 1080×1350、主視覺 1080×1350）共用同一條匯出路徑，一併修正。
- 預覽行為不變（CSS object-fit: cover 本來就正確）。

## Non-Goals

- 不改 makeBg／預覽的 DOM 結構與 CSS（預覽沒有問題，避免擴大改動面）。
- 不在上傳階段裁切（同一張圖可能同時用在不同比例的版型，上傳時裁會壞掉另一個版型）。
- 不更換 rasterize 函式庫（html-to-image 已知在真實 Chrome 會卡死，先前已排除）。
- 不改成 contain（留邊）模式；行為維持 cover（滿版裁切）。
- 不處理 shot 截圖卡片的比例（其 CSS 為自適應高度，無變形問題）。

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `image-rasterization`: 新增需求——匯出的 PNG 中，底圖 SHALL 維持原始長寬比（以 cover 方式裁切），不得拉伸變形；匯出結果須與預覽的裁切構圖一致。

## Impact

- Affected specs: `image-rasterization`（新增一條 requirement）
- Affected code:
  - Modified: web/src/rasterize.js（匯出前把 .bgimg 換成已依 cover 裁切、與畫布同比例的圖）
  - New: （無）
  - Removed: （無）
