## 1. 素材準備

- [x] 1.1 從 `Reference/常用資訊/` 各圖裁出乾淨的 App UI 區域，輸出為 `web/public/shots/<topic>-<n>.png` —— 落實「App 截圖裁切成獨立素材、隨 app 打包」。驗收：每個常用資訊主題的每張投影片都有對應且裁乾淨的截圖 PNG（人工檢視）。
- [x] 1.2 將 `Reference/預設圖片/看我笑話` 與 `Reference/預設圖片/現代問題維修中心` 的照片縮圖後複製進 `web/public/presets/<brand>/`。驗收：兩品牌各有預設底圖檔，`npm run build` 後可在 `web/dist` 找到。

## 2. 預設資料檔

- [x] 2.1 建立 `web/src/presets.js`，匯出 `PRESET_BG`（依品牌底圖 URL 陣列）與 `COMMON_INFO`（主題→投影片，投影片含 title／intro／list?／shot?）—— 落實「常用資訊做成「主題→投影片」資料並附加到 IG 清單」的資料面。驗收：import 後結構符合 design 的資料介面，`shot` 指向 `web/public/shots/` 既有檔。

## 3. 公告型截圖卡片

- [x] 3.1 為公告型版型實作選配截圖卡片（實作 Announcement template content 的 shot 欄位）—— 落實「公告型新增選配截圖卡片區」。驗收：`data.shot` 有值時預覽在文字下方顯示圓角置中卡片、無值時不顯示且外觀與現狀一致。

## 4. 預設底圖選擇器

- [x] 4.1 於 Banner 與 IG 控制區加入預設底圖縮圖列並點選即設為當前底圖（實作 Per-brand preset background picker 與 Selecting a preset sets the base image）—— 落實「預設底圖複用既有底圖 slot」。驗收：Banner 顯示當前品牌預設圖、IG 顯示兩品牌預設圖；點任一縮圖後預覽底圖更新為該圖。

## 5. 常用資訊選單與附加

- [x] 5.1 於 IG 控制區加入常用資訊選單，選主題並加入時把投影片依序附加到 IG 貼文清單（實作 Common info topic library 與 Adding a topic appends its slides to the IG list）—— 落實「常用資訊做成「主題→投影片」資料並附加到 IG 清單」。驗收：加入後 `state.posts` 新增筆數＝該主題投影片數，每筆 `kind==="gonggao"` 且帶對應 title 與 shot。
- [x] 5.2 讓附加的投影片套用使用者當下選定的 IG 底圖、不使用常用資訊原圖（實作 Base image stays user-chosen for added slides）—— 落實「底圖與文字／截圖正交」。驗收：先選一張底圖再加入主題，新增各筆的 `image` 皆為該底圖。

## 6. 驗證與部署

- [x] 6.1 於乾淨瀏覽器實測匯出：帶截圖的公告型輸出為 2160×2700 且圖中可見截圖卡片；不帶截圖者與現狀一致（驗證 Announcement template content）。驗收：實際匯出比對兩種情況。
- [x] 6.2 `npm run build` 確認 `web/public/presets/`、`web/public/shots/` 進 `dist`，push 觸發 GitHub Pages 部署。驗收：公開網址可選預設底圖、選常用資訊主題加入並成功出圖。
