# C•E•GO Price Radar × My Expenses integration

## Goal
Keep Price Radar and My Expenses as two independent apps, but let them exchange only the minimum useful purchase/restock signals needed to build a closed loop.

The intended loop is:

**purchase recorded → purchase date confirmed → restock cycle updated → likely run-out window estimated → current price/promotion checked → useful reminder shown → new purchase resets the cycle**

## Why the apps should stay separate
- A bug or redesign in one app should not break the other.
- Each app keeps its own purpose and data model.
- Communication happens through a small shared contract/API rather than direct database coupling.
- The user can disconnect the integration at any time and both apps still work.

## Data Price Radar needs from My Expenses
Only send item-level purchase confirmation when confidence is high enough:
- purchaseDate
- merchant
- amount
- currency
- category/subcategory
- item name when known
- brand when known
- barcode/GTIN when known
- quantity when known
- source: manual / receipt scan / imported expense
- confidence score

A supermarket total by itself is never proof that a tracked item was purchased.

## Data My Expenses may receive from Price Radar
- normalized product id
- product / brand / specification
- retailer
- expected price or promo price
- purchase intent date
- favourite / restock state
- optional source link for the observed promotion

This lets My Expenses prefill an item when the user goes from a Radar recommendation to an actual purchase.

## V1 communication contract
Use a simple purchase event format:

```json
{
  "type": "purchase.confirmed",
  "productId": "gtin-or-normalized-id",
  "productName": "維記鮮奶 946ml",
  "brand": "維記",
  "purchaseDate": "2026-09-14",
  "merchant": "Wellcome",
  "quantity": 1,
  "amount": 29.9,
  "currency": "HKD",
  "confidence": 0.98,
  "source": "receipt-scan"
}
```

## Matching priority
1. Exact barcode / GTIN match.
2. Exact product + specification match.
3. Brand + product name + pack size match.
4. Category match confirmed by user.
5. Manual `已買` confirmation in Price Radar.

Low-confidence matches must not silently reset the restock cycle.

## Restock learning rule
- Fewer than 2 confirmed purchases: use a user-selected/default cycle.
- 2–4 confirmed purchases: use median interval.
- 5+ confirmed purchases: use a recent weighted typical range.
- Ignore obvious bulk-buy or duplicate anomalies.
- User can mark `仲有好多`, `今次唔使買`, or override the cycle.

## Reminder logic
Notify only when useful, for example:
- likely to run out soon;
- worthwhile promotion appears close to the normal restock date;
- same-brand alternative is meaningfully cheaper;
- target price is reached;
- a nearby branch has several tracked items on worthwhile promotion at once.

Fresh/short shelf-life goods should not encourage excessive stockpiling merely because of a discount.

## Recommended architecture
### Phase 1 — explicit handoff
- Shared JSON event schema.
- `已買` / `記錄到 My Expenses` buttons.
- Deep-link handoff between the two web apps.
- Local-only data remains inside each app.

### Phase 2 — real two-way sync
- Lightweight shared backend/API keyed to the same user.
- My Expenses sends purchase-confirmed events.
- Price Radar sends purchase-intent/product metadata.
- Each app stores its own full data; shared service stores only integration events and IDs.

### Phase 3 — receipt/item automation
- Receipt scan identifies item-level purchases.
- Barcode/product normalization improves matching.
- High-confidence purchases update Price Radar automatically.
- Ambiguous matches are queued for one-tap confirmation.

## Privacy/minimization rule
Price Radar does not need access to the user's full expense history. It should receive only the purchase-confirmation fields required for restock logic. My Expenses remains the source of truth for the full financial record.

## Target UX
Example:

`🥛 維記鮮奶 946ml｜上次 9/14 買｜平時約 6–7 日補貨｜預計差唔多用晒｜附近 1km 有 2 間店做優惠`

The user should not have to manually maintain two separate purchase histories.
