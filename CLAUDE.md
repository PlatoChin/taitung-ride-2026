# taitung-ride-2026 維運說明

海龍重機旅遊（台東・羅東 3 日，2026/11/14~11/16）的靜態行程網站，用 GitHub Pages 發布（`main` 分支，根目錄有 `.nojekyll`）。

## 檔案結構
| 路徑 | 用途 |
|---|---|
| `index.html` | 總行程：概覽、Day 1~3 景點卡片、旅途相簿、騎車前檢查清單 |
| `spots/<slug>.html` | 每個景點一頁：時間、遊玩重點、店家與費用、騎士小提醒、Google 地圖按鈕 |
| `style.css` | 全站樣式（含深色模式、可愛風裝飾、天氣卡、相簿區塊） |
| `weather.js` | 用 Open-Meteo（免金鑰）抓各景點抵達時刻的天氣；座標在 `P` 物件，以 slug 為 key |
| `images/<slug>.jpg` | 景點照片（Wikimedia Commons），出處記在 `images/credits.json` |
| `images/deco/*.svg` | 插圖：吉祥物、段落圖示、天氣圖示、分隔線 |
| `ops/sync-to-gcs.sh` | 把網站、CLAUDE.md、SKILL 備份到 Google Cloud Storage |
| `.claude/skills/update-itinerary/SKILL.md` | 修改行程的標準步驟 |

## 慣例
- 文字用繁體中文，標點沿用現有寫法（半形冒號、括號）。
- 景點 slug 用小寫英文加連字號，`index.html` 卡片、`spots/` 檔名、`weather.js` 的 `P`、`images/` 檔名四處要一致。
- 時間寫「約 HH:MM ・ N 分」，`weather.js` 會從卡片文字抓 HH:MM 推算天氣時段。
- 沒照片的景點用 `images/deco/` 的 SVG 插圖，`<img>` 加 class `illus`。
- 照片一定要記出處（作者、授權、來源連結），寫在景點頁 figcaption 和 `credits.json`。
- 價格、營業時間標注「參考」並請騎士以現場為準。

## 雲端空間（GCP 專案 `caude-project-514509`）
| 位置 | 用途 |
|---|---|
| `gs://caude-project-514509-claude/projects/taitung-ride-2026/` | 網站檔案備份 |
| `gs://caude-project-514509-claude/skills/` | SKILL 檔 |
| `gs://caude-project-514509-claude/docs/` | .md 維運文件 |
| `gs://taitung-ride-2026-album/` | 旅途照片（day1-1114 / day2-1115 / day3-1116） |

Google 雲端硬碟另有共用相簿資料夾，連結在 `index.html` 的「旅途相簿」區塊。
