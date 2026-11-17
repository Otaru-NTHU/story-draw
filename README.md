# 故事抽籤系統 — 架設說明（約 20 分鐘）

三個頁面：
- `index.html` 學生（手機）：註冊／登入 → 填七個元素 → 看自己被抽到什麼 → 寫作品名與大綱 → 看自己的 AI 評分
- `board.html` 投影板：籤筒進度 → 抽籤表（暱稱 × 七項，逐格翻出）→ 前三名揭曉
- `admin.html` 老師後台：切階段、逐項抽籤、補抽、AI 評分（Gemini 或匯出給 Claude）、揭曉前三名、下載 CSV

## 1. Firebase 專案
1. https://console.firebase.google.com 建立專案（或用既有的）。
2. **Authentication** → 登入方式 → 啟用「電子郵件／密碼」。
3. Authentication → 使用者 → 新增使用者：老師帳號（Email = `firebase-config.js` 的 `TEACHER_EMAIL`）。
4. **Firestore Database** → 建立資料庫（正式模式，地區 asia-east1）。
5. Firestore → 規則 → 貼上 `firestore.rules` 全文（把裡面的老師 Email 改成你的）→ 發布。
6. 專案設定 → 一般 → 你的應用程式 → 新增「網頁」應用 → 把 `firebaseConfig` 物件貼進 `firebase-config.js`。

## 2. 放上網
任一靜態主機都行，三個檔案 + `style.css` + `common.js` + `firebase-config.js` 放同一層。

**Firebase Hosting（建議）**
```
npm i -g firebase-tools
firebase login
cd story-draw
firebase init hosting   # public 目錄填 .  ；single-page app 選 N
firebase deploy
```
會得到 `https://<專案>.web.app/`。

**或** 丟到 otaru.tw 的任一子目錄、GitHub Pages、Netlify Drop 都可以。
Firebase 需要把那個網域加進 Authentication → 設定 → 授權網域。

## 3. 上課流程（後台怎麼按）
| 時間 | 老師在 admin.html | 學生手機 | 投影板 |
|:--|:--|:--|:--|
| 開場 | 階段＝填元素；投影板登入老師帳號、全螢幕 | 掃 QR → 註冊（學號、姓名、暱稱、Email、密碼） | 顯示「已填 n / N」與暱稱 chips |
| 帶填 | 一題一題講，示範怎麼填 | 填七項，按「儲存元素」→ chip 變綠 | 綠色越來越多 |
| 抽籤 | 勾「鎖定元素」→ 依序按 1.主角 … 7.手段（每項：投影板轉 3 秒 → 全班同時翻出） | 自己的格子轉動後定住 | 整張表逐格翻出 |
| 遲到者 | 讓他填完元素 → 按「補抽缺漏」 | 一次拿到七項 | 多一列 |
| 寫大綱 | 階段＝寫大綱 | 填作品名＋大綱，送出 | 表上多「作品名」欄、已交人數 |
| 評分 | 填 Gemini API key → 「評分所有未評的」（約 1 秒/人） | 階段變「看評分」後看到自己的分數與評語 | 「AI 評分中」 |
| 揭曉 | 「計算前三名，揭曉第 3 名」→「第 2 名」→「第 1 名」 | 顯示「請看螢幕」 | 從第 3 名疊到第 1 名 |

Gemini API key：https://aistudio.google.com/apikey 免費申請。沒有 key 就按「匯出待評 JSON」丟給 Claude，拿回 JSON 再「匯入評分 JSON」。

## 4. 已知限制
- 「發送結果給同學」目前靠帳號：學生用 Email＋密碼隨時能登入看自己的題目、大綱、評分；忘記密碼可寄重設信（Firebase 內建）。要主動寄結果信需另接 SendGrid／EmailJS，之後再加。
- 評分只有本人與老師看得到（Firestore 規則保證）。前三名公開的是暱稱、元素、作品名、大綱、分數與一句評分依據。
- 改 `SESSION_ID` 就是全新一場，舊資料仍在 Firestore。
