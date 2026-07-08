# 看我笑話社群宣傳 — 素材產生器

全團隊用的**純前端網頁工具**：選類型 → 拖底圖 → 填字 → 下載。IG 可多張拖曳排序、打包成 ZIP。所有處理都在瀏覽器完成，底圖不會上傳。

主程式在 [`web/`](web/)。字體用內嵌的 Noto Sans TC（Black／Medium），不依賴使用者本機字體。

## 本機開發

```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm run build    # 產出 dist/（部署用）
```

## 功能

| 類型 | 說明 |
|------|------|
| Banner 主視覺 | 選品牌（看我笑話／現代問題維修中心）→ 拖底圖 → 副標＋選配黃標 → 下載（3200×1200，2x） |
| IG 貼文 | 先選版型：**公告型**（標題＋內文＋條列）或**主視覺型**（大標＋選配橘色圓 badge）→ 拖底圖 → 下載或加入清單 |
| 多張排序打包 | IG 加入清單後拖曳排序，一鍵下載 ZIP，檔名 `01_ 02_ …` 依序 |

文字支援換行（Enter）與 `**粗體**`。

## 部署（GitHub Pages）

已備妥 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)：push 到 `main` 會自動 build `web/` 並部署到 GitHub Pages。首次啟用步驟：

1. 把本資料夾推上 GitHub（公開 repo）。
2. repo Settings → Pages → Source 選 **GitHub Actions**。
3. push 後等 Actions 跑完，即得公開網址。

> 公開 repo 會一併曝光品牌 logo 與字體；Noto 為 OFL 授權可再散布。

## 說明

- `web/public/logo-*.png`：兩品牌標準字（Banner 主標用）。
- `web/src/fonts/NotoSansTC.woff2`：內嵌字體（由系統 Noto Sans TC 變體字型轉出）。
- `Reference/`：歷來成品參考。
- `templates/`、`content/`：早期本機 puppeteer 版的版型與範例內容，**已退役**，版型 CSS 現由 `web/src/styles/templates.css` 承接；保留僅供對照。
