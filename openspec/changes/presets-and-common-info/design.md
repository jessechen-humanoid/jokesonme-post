## Context

素材產生器（`web/`）目前底圖只能拖曳／點選上傳，文字全靠手打。實務上實拍照分品牌就那幾張、常用公告（購票／退票流程）也是固定幾則且原圖裡嵌有 App 操作截圖。`Reference/預設圖片/`（依品牌分資料夾）與 `Reference/常用資訊/`（12 張公告圖，多為公告型：暗底＋大標＋內文，部分下半部嵌 App 截圖）是這次的來源素材。

現有可複用機制：底圖統一經 `acceptFile`→縮圖→設為 `data.image`；IG 已有多圖清單（carousel）＋拖曳排序＋ZIP 打包；公告型（gonggao）版型有 title／intro／list。

## Goals / Non-Goals

**Goals:**

- 依品牌列出預設底圖縮圖，點選即設為當前底圖（Banner 與 IG 共用底圖 slot）。
- 常用資訊做成「主題→一或多張投影片」，選取後把投影片附加到 IG 清單，套用使用者當下選定的底圖。
- 每張常用資訊投影片可帶一張 App 截圖，顯示在文字下方的圓角卡片區。
- 底圖永遠由使用者自選；常用資訊只帶文字＋截圖，不把原圖當底圖。

**Non-Goals:**

- 不做主視覺型的截圖卡片（截圖只用於公告型）。
- 不在執行時讀 `Reference/`；資料在建置時內建。
- 不做預設資料的線上編輯介面（改文字＝改內建資料檔）。
- 不重現原圖裡截圖以外的裝飾（只裁 App UI 區域）。

## Decisions

### 預設底圖複用既有底圖 slot

預設底圖在建置時裁／縮好放進 `web/public/presets/<brand>/`，介面顯示縮圖；點選即把 `data.image` 設為該檔的 URL（同一個底圖 slot，與拖曳上傳等價）。底圖以 `<img>` 承載，URL 為同源，html2canvas 以 `useCORS` 可正常截圖。
理由：不另造底圖來源路徑；預設圖是同源檔案，免經 dataURL。替代方案：把預設圖轉 dataURL 內嵌——無必要且變肥。

### 常用資訊做成「主題→投影片」資料並附加到 IG 清單

新增 `web/src/presets.js` 匯出 `COMMON_INFO`：陣列，每元素為主題 `{ id, label, slides: [...] }`，每張投影片 `{ title, intro, list?, shot }`（`shot` 為 App 截圖檔 URL 或空）。選一個主題→把每張投影片轉成一則 IG 貼文 `{ kind: "gonggao", data: { title, intro, list, image, shot } }` 推入 `state.posts`；`image` 取使用者當下選定的 IG 底圖（沒有則留空，之後可補）。
理由：直接重用既有 carousel／排序／ZIP；主題可含多步驟。替代方案：單則、無多步驟——無法涵蓋購票／退票多步驟流程。

### 公告型新增選配截圖卡片區

公告型版型在文字（title／intro／list）下方新增選配的截圖區：`data.shot` 有值時渲染一張 `<img>`（圓角、置中、寬度約畫布 78%、含陰影）；無值時完全不出現，維持現狀。與 list 互斥使用為常態但不強制。
理由：對齊 reference（暗底照片＋上方大標＋下方手機 UI 卡片）。替代方案：另開新版型——與公告型高度重疊，徒增維護。

### App 截圖裁切成獨立素材、隨 app 打包

從 `Reference/常用資訊/` 各圖裁出乾淨的 App UI 區域，輸出為 `web/public/shots/<topic>-<n>.png`。`presets.js` 以 URL 引用。
理由：符合「只放文字＋截圖、底圖自選」；截圖與底圖分離。替代方案：整張原圖當底圖——即被否決的做法。

### 底圖與文字／截圖正交

常用資訊只設定文字與截圖，不碰底圖；底圖一律由使用者透過拖曳或預設底圖選擇器決定。
理由：符合使用者明確要求（底圖自訂）。

## Implementation Contract

**可觀察行為**：
1. Banner 與 IG 控制區出現「預設底圖」縮圖列；點任一縮圖，預覽底圖即更新為該圖（等同上傳）。Banner 顯示當前品牌的預設圖；IG 顯示兩個品牌的預設圖。
2. IG 控制區出現「常用資訊」選單；選一個主題並按加入，該主題的每張投影片（文字＋截圖）依序附加到 IG 貼文清單，底圖套用使用者當下選定的 IG 底圖。
3. 公告型預覽／輸出中，`shot` 有值時在文字下方顯示圓角截圖卡片；無值時不顯示，外觀同現狀。

**資料介面（`web/src/presets.js`）**：
- `PRESET_BG`：`{ kwxh: string[], mprc: string[] }`，值為 `web/public/presets/...` 的 URL。
- `COMMON_INFO`：`Array<{ id: string, label: string, slides: Array<{ title: string, intro: string, list?: string[], shot?: string }> }>`。

**版型欄位（公告型擴充）**：`data.shot`（字串 URL，選配）。既有 `title`／`intro`／`list` 不變。

**輸出契約**：含截圖的公告型輸出仍為 1080×1350 基準、2x（2160×2700）；截圖卡片為畫布內元素，一併被 html2canvas 截入。

**失敗模式**：`shot` 圖載入失敗→該卡片不顯示，其餘照常（不阻擋輸出）；主題無投影片→加入不產生任何貼文。

**驗收條件**：
- 點預設底圖縮圖後，`state` 的對應底圖被設為該 URL 且預覽更新。
- 選「常用資訊」某主題加入後，`state.posts` 新增筆數＝該主題投影片數，每筆 `kind==="gonggao"` 且含對應 `title`／`shot`。
- 一則帶 `shot` 的公告型匯出 PNG 為 2160×2700，且圖中可見截圖卡片。
- 一則不帶 `shot` 的公告型輸出與現狀一致（無多餘卡片）。

**範圍邊界**：
- 範圍內：預設底圖選擇器、常用資訊主題庫與附加、公告型截圖卡片、截圖素材裁切、`presets.js` 資料。
- 範圍外：主視覺型截圖、Banner 的常用資訊、線上編輯預設、執行時讀 `Reference/`。

## Risks / Trade-offs

- [截圖裁切是人工、且各圖 UI 區域大小不一] → 逐張裁乾淨、統一以卡片寬度呈現；卡片高度自適應。
- [常用資訊原圖為 carousel 多張、標題可能重複] → 以「主題」聚合，同主題多步驟為多張投影片，標題可重複屬正常。
- [預設底圖同源 URL 於 html2canvas 需可載入] → 同源＋`useCORS`；建置時確認 `web/public/presets/` 隨 build 進 dist。
- [截圖卡片與長內文同時出現可能超出畫布] → 常用資訊文案由資料控制長度；卡片區高度以剩餘空間為主、必要時縮圖。
