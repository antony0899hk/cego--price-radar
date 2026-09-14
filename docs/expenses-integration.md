# C•E•GO Price Radar × My Expenses integration

## Goal
Use confirmed purchase records from My Expenses to estimate when frequently purchased goods are likely to run out, then surface a restock reminder only when it is useful.

## Core loop
1. User records a purchase in My Expenses.
2. If the expense can be matched to a known Price Radar item/category, record a confirmed purchase date.
3. Recalculate the next expected restock window using the user's own purchase interval history.
4. Before the expected run-out window, Price Radar checks current prices/promotions.
5. Notify only when one of these is true:
   - likely to run out soon;
   - worthwhile promotion appears before the usual restock date;
   - same-brand alternative is meaningfully cheaper;
   - current price reaches the user's target price.
6. Once a new purchase is confirmed, reset the cycle from that date.

## Purchase evidence priority
1. Exact item/barcode match from receipt or expense detail.
2. Exact product name/brand match.
3. Category match confirmed by user.
4. Manual "已買" button in Price Radar.

Do not assume every supermarket expense means the tracked item was bought.

## Suggested data model
```json
{
  "itemId": "milk-kowloon-dairy-946ml",
  "name": "鮮奶",
  "brand": "九龍維記",
  "barcode": "",
  "lastPurchasedAt": "2026-09-14",
  "purchaseSource": "expenses|receipt|manual",
  "purchaseHistory": [
    "2026-08-31",
    "2026-09-07",
    "2026-09-14"
  ],
  "estimatedCycleDays": 7,
  "remindBeforeDays": 2,
  "targetPrice": null,
  "autoLearn": true
}
```

## Learning rule
- Fewer than 2 confirmed purchases: use a user-selected default cycle.
- 2–4 purchases: use median interval rather than average to reduce one-off distortion.
- 5+ purchases: use a recency-weighted median/typical range.
- Ignore implausible intervals and bulk-buy anomalies when detected.
- User can always override the learned cycle.

## Reminder examples
- `🥛 你通常約 7 日買一次鮮奶，上次買係 6 日前。差唔多要補貨。`
- `🏷️ 你常買嘅牙膏未到補貨期，但今日有買一送一；要唔要提早入貨？`
- `🧻 廁紙預計 3 日內要補貨，百佳今日比你常見價低 18%。`

## Guardrails
- Fresh/short shelf-life goods (fresh milk, bread, yogurt) should not encourage excessive stockpiling merely because of a promotion.
- Snack reminders should favor user's usual brands/items and meaningful discounts, not generic category spam.
- No reminder if confidence in the matched purchase is low.
- A user should be able to mute an item, skip this cycle, or mark "仲有好多".

## Future integration path
Phase 1: manual `已買` in Price Radar + stored cycle.
Phase 2: import/share purchase events from My Expenses.
Phase 3: receipt scan / merchant-item matching and automatic confirmation.
Phase 4: full closed loop: purchase → consumption estimate → price check → timely restock alert → purchase confirmation.
