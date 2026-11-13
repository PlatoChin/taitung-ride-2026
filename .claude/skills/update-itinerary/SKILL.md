---
name: update-itinerary
description: 修改海龍重機旅遊網站的行程。新增、刪除或調整景點、時間、住宿、店家與費用資訊時使用。涵蓋 index.html 卡片、spots/ 景點頁、weather.js 座標、images/ 照片與出處。
---

# 更新行程

## 新增景點
1. 決定 slug（小寫英文加連字號，例如 `fuli-straw`）。
2. 複製一個相近的 `spots/*.html` 成 `spots/<slug>.html`，改 `<title>`、`h1`、`.sub`（Day・日期・預計時間・停留）、內文各區塊、Google 地圖連結（`https://www.google.com/maps/search/?api=1&query=<URL 編碼地址>`）。
3. 在 `index.html` 對應的 `.day` 區塊依時間順序插入卡片：
   ```html
   <a class="card spot" href="spots/<slug>.html"><img class="thumb" src="images/<slug>.jpg" alt="<名稱>" loading="lazy"><div class="txt"><b><名稱></b><br><span>約 HH:MM ・ N 分</span></div></a>
   ```
   沒照片就用插圖：`<img class="thumb illus" src="images/deco/<插圖>.svg" alt="<名稱>(可愛插圖)">`。
4. 在 `weather.js` 的 `P` 加上 `'<slug>':[緯度,經度]`。
5. 有照片的話放到 `images/<slug>.jpg`，從 Wikimedia Commons 找可商用授權，並把 title/artist/license/page 寫進 `images/credits.json` 和景點頁 figcaption。

## 調整時間
- 改卡片的「約 HH:MM」，同步改景點頁 `.sub`。
- 改完檢查後面景點時間是否合理、天黑（11 月約 17:00）前是否過蘇花。
- 必要時更新 `index.html` 概覽的距離與該天 `.sub` 說明。

## 換住宿
- 更新住宿景點頁的地址、入住時間、付款方式、停車資訊、價格（標注參考），以及 `index.html` 概覽中的住宿名稱。

## 收尾
1. 用瀏覽器開 `index.html` 檢查：卡片連結、圖片、天氣卡有沒有出現、手機寬度排版。
2. commit 訊息用繁體中文一句話說明改了什麼。
3. 執行 `ops/sync-to-gcs.sh` 把最新版備份到雲端。
