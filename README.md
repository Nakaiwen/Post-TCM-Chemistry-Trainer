# 後中醫生物學練習器 — PWA 版

這是可安裝、可離線使用的漸進式網頁應用程式（PWA）。安裝後會像一般 App 一樣出現在手機主畫面或桌面，且作答紀錄、錯題、SRS 複習排程都會保存在裝置上。

## 檔案結構（請整包一起部署，勿拆散）

```
index.html             ← 主程式（630 題題庫 + 全部功能）
manifest.json          ← App 設定（名稱、圖示、主題色）
service-worker.js      ← 離線快取
icons/                 ← App 圖示
  icon-192.png
  icon-512.png
  icon-maskable-512.png
  apple-touch-icon.png
  favicon-32.png
  favicon.ico
```

## 重要：PWA 一定要「用網址（https）開啟」才能安裝與離線

Service Worker 在 `file://`（直接雙擊開檔）下**無法運作**。要讓它成為可安裝的 PWA，必須透過 http(s) 提供。以下任選一種：

### 方法 A：免費託管（最推薦，手機也能裝）

把整個資料夾上傳到任一靜態網站服務，會得到一個 https 網址：

- **GitHub Pages**：建一個 repo → 上傳這些檔案 → Settings → Pages → 選 branch → 取得 `https://你的帳號.github.io/repo/` 網址。
- **Netlify Drop**：到 app.netlify.com/drop，直接把整個資料夾拖進去，立刻得到 https 網址。
- **Cloudflare Pages / Vercel**：流程類似，上傳即得網址。

拿到網址後：
- **iPhone（Safari）**：開網址 → 分享鈕 → 「加入主畫面」。
- **Android / 桌面 Chrome**：開網址 → 網址列會出現「安裝」圖示，或首頁會出現「📲 安裝到主畫面」按鈕。

### 方法 B：本機測試（電腦上跑，不需上網）

在這個資料夾裡開終端機，擇一執行：

```bash
# Python（多數電腦內建）
python3 -m http.server 8000

# 或 Node
npx serve .
```

然後用瀏覽器開 `http://localhost:8000`。localhost 視為安全來源，SW 與安裝都能運作。

## 更新 App 內容時

若日後我幫你更新題庫或功能，請務必：
1. 換掉 `index.html`（及有變動的檔案）。
2. 打開 `service-worker.js`，把 `CACHE_VERSION` 改成新版號（例如 `biotrainer-v116-1`）。

否則使用者的瀏覽器會繼續沿用舊快取，看不到新內容。

## 資料保存說明

- 所有紀錄存在該裝置該瀏覽器的 localStorage，**不會上傳雲端**。
- 換裝置或換瀏覽器不會自動同步；可用 App 內「學習報告 → 匯出資料 / 匯入資料」搬移。
- 清除瀏覽器資料會一併清掉紀錄，搬家前記得先匯出。

## 學習曲線記錄

- App 每天開啟時會在背景記錄一筆「學習快照」（日期、已作答數、總正確率、各章節正確率、模考平均、待複習數），同一天只保留最新一筆，最多保存兩年。
- 這些快照會一起寫進「匯出資料」的 JSON（欄位名 `snapshots`），所以你的備份檔天生就帶著一條可重建的學習曲線。
- 匯入時會一併還原；清除紀錄時會一併清掉。
- 目前 App 內尚未把這條曲線畫成圖表；資料已在累積，日後若要視覺化（折線圖）隨時可加。
