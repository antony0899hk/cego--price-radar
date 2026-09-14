# C•E•GO Price Radar — 常買／補貨提醒（Must-have）

此功能列為 Price Radar 核心功能，不是 optional enhancement。

## 目標
使用者將平時經常購買的貨品加入「常買」後，系統同時處理：
1. 補貨時間：差不多需要再買時提醒。
2. 價格機會：未到補貨日，但出現值得買的優惠時提醒。
3. 同品牌替代：指定 SKU 無優惠，但同品牌／同系列有明顯優惠時提示。
4. 避免 spam：沒有補貨需要、沒有明顯優惠就不通知。

## V0.5 資料模型
```js
{
  id,
  name,              // e.g. 鮮奶
  brand,             // optional
  barcode,           // optional; exact SKU when known
  intervalDays,      // e.g. 5 / 7 / 14 / 30
  lastBoughtAt,      // optional
  nextDueAt,         // calculated
  targetPrice,       // optional
  quantity,          // optional
  flexibility: 'exact' | 'same-series' | 'same-brand' | 'category',
  reminderEnabled: true
}
```

## Reminder score
通知條件不只看日期。初版：
- 已到／接近補貨期：+3
- 價格 <= 目標價：+3
- 有明顯 Promotion（買一送一／第二件折扣／多件價）：+2
- 同品牌替代品有優惠：+1
- 距離補貨期太遠而且只是普通價格：不通知

score >= 3 才進入提醒區；真正 push notification 上線後沿用同一規則。

## 常買快捷貨架
首頁顯示使用者自己的常買項目，而不是只靠固定分類：
`🥛 鮮奶  🍫 零食  ☕ 咖啡  🧻 廁紙  ＋新增`

點一下：直接搜尋該貨品／SKU；長按或編輯：設定購買週期、品牌、目標價、替代彈性。

## 鮮奶／高頻消耗品
高頻、短保存期貨品不應因為大減價就鼓勵過量囤貨。提醒優先看「接近補貨期 + 優惠」。

## 零食／非必要消耗品
預設較低通知優先度；主要在常買品牌有明顯優惠時提示，避免每日促銷 spam。

## 實作階段
- V0.5: 常買快捷貨架 + intervalDays + lastBoughtAt + due badge + app 內提醒。
- V0.6: Promotion parser 接入 reminder score。
- V0.7: Web Push / PWA notification（需部署端排程及 notification permission），App 不開亦可收到。
- Later: 由購買紀錄估算週期，但保留手動修改。
