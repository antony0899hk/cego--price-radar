# C•E•GO Price Radar

核心問題：我要買嘅日用品，今日邊度抵？我差唔多要補貨時，附近邊間店一次過買最值得？

## 現時流程
搜尋貨品 → 比較價格／promotion → ❤️ 常買／補貨 → 同品牌優惠 → 📍附近分店 → 🧺成籃格價。

## 已完成 prototype
- `index.html`：多源搜尋、Consumer Council Open Data、快捷搜尋、常買／補貨、優惠提示。
- `branch-radar.html`：GPS 附近分店地圖、500m/1km/2km/5km、距離排行、常買優惠命中、Google Maps 導航。
- `data/pricewatch.json`：由 GitHub Actions 每日同步 Consumer Council 官方 Open Data。
- `api/search.js`：部署到支援 serverless 的環境時可直接提供搜尋 API。

## 分店 Radar 原則
分店地圖會分清楚「連鎖店網上／公開優惠」與「指定分店已確認優惠」。未有 branch-level 證據時，不會將網店價扮成某一間分店實價。排行會逐步加入：常買貨品命中數、預計節省、距離、一次買齊程度、優惠到期時間。

## My Expenses 整合方向
My Expenses／單據可以確認實際購買日期及貨品；Price Radar 用購買週期估算差不多用完的時間，再配合當日優惠，只在「快要補貨＋值得買」時優先提醒。

## 下一階段
- 將分店 Radar 正式接入主頁
- Promotion Engine：買一送一、第2件折扣、多件價、會員價、贈品
- 成籃格價：最平拆單／一店買齊／附近最抵
- 條碼掃描
- 分店級優惠來源與可信度標籤

Repo 名目前保留 `cego--price-radar`（雙橫線）。
