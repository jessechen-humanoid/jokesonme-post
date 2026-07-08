## Why

團隊每次做素材都要自己找底圖、重打常見的公告文字（購票／退票流程等）。這些底圖與文字其實是可重複使用的：實拍照分品牌固定幾張、常用資訊是固定的幾個主題。把它們變成介面上可直接選取的預設，能大幅加快出圖、也讓文案一致。

## What Changes

- **預設底圖選擇器**：依品牌（看我笑話／現代問題維修中心）列出預設實拍照縮圖，點一下即設為當前底圖；與拖曳上傳共用同一個底圖 slot，Banner 與 IG 皆適用。
- **常用資訊庫**：把常用資訊做成「主題 → 一或多張投影片」的內建資料。每張投影片帶（標題／內文）文字＋一張對應的 App 操作截圖。使用者選一個主題，就把該主題的投影片附加到 IG 貼文清單，套用使用者當下選定的底圖；之後可逐張換底圖、排序、打包 ZIP。
- **公告型版型新增選配截圖**：公告型（announcement）在文字下方新增一個選配的截圖卡片區（圓角、置中）。沒有截圖時維持現在的純文字公告外觀。
- App 截圖由既有 `Reference/常用資訊/` 各圖裁切出乾淨的 UI 區域，存成獨立素材隨 app 打包；底圖永遠由使用者自選，不使用常用資訊原圖當底圖。

## Non-Goals (optional)

## Capabilities

### New Capabilities

- `preset-backgrounds`: 依品牌的預設底圖縮圖選擇器，點選即設為當前底圖（Banner 與 IG 共用）
- `common-info-library`: 常用資訊主題庫；每主題含一或多張投影片（文字＋App 截圖），選取後附加到 IG 貼文清單並套用使用者選定的底圖

### Modified Capabilities

- `ig-post-composer`: 公告型版型新增選配的截圖卡片區（文字下方、圓角置中），供常用資訊投影片放置 App 截圖

## Impact

- Affected specs: preset-backgrounds、common-info-library、ig-post-composer
- Affected code:
  - New: web/public/presets/（依品牌的預設底圖）、web/public/shots/（裁切出的 App 截圖）、web/src/presets.js（預設底圖與常用資訊主題資料）
  - Modified: web/src/templates.js（公告型加截圖 slot、buildCanvas）、web/src/styles/templates.css（截圖卡片樣式）、web/src/main.js（預設底圖選擇器、常用資訊選單、附加投影片邏輯）
  - Removed: （無）
