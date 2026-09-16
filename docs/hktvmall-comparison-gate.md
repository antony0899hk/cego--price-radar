# HKTVmall Comparison Gate

Version: 0.9.0

## Anchor-retailer rule
HKTVmall is allowed in Price Radar and New Arrival Radar, but its searchable / publishable universe is intentionally limited to everyday consumer goods represented by four anchor retailers:

1. Wellcome 惠康
2. PARKnSHOP 百佳
3. Mannings 萬寧
4. Watsons 屈臣氏

CEGO does NOT mirror the full HKTVmall catalogue. The four anchors define the useful retail universe; HKTVmall only extends comparison and discovery inside that universe.

## Core scope
Prioritise these families:

- Food & grocery: fresh food, dairy, drinks, snacks, rice/noodles/oil, sauces, canned/frozen food, breakfast, coffee/tea.
- Household supplies: tissue, cleaning, laundry, kitchen consumables, storage/disposable household goods, batteries and other ordinary supermarket household consumables.
- Personal care & beauty: oral care, shampoo/body care, skincare, masks, feminine care and ordinary drugstore personal-care products.
- Pet care: pet food, litter and ordinary pet consumables where the product type exists at an anchor retailer.
- Everyday living: practical repeat-purchase or household-use products carried by the anchors.
- Travel essentials: travel-size toiletries, disposable underwear/socks/towels, travel bottles, simple bags/accessories, insect repellent and similar practical travel consumables carried by an anchor retailer.

Travel is an extension of daily-life retail, not a gateway to the whole travel/lifestyle marketplace.

## Explicit exclusions
Do not search or publish HKTVmall-only catalogue areas merely because HKTVmall carries them, including:

- general fashion / normal clothing;
- large electronics and appliances;
- furniture and home furnishing catalogue;
- unrelated gadgets, collectibles and specialist marketplace goods;
- other categories with no meaningful connection to the four anchor retailers' everyday-consumer universe.

Example: disposable travel underwear is eligible; a normal T-shirt is not.

## Eligibility
An HKTVmall item may enter CEGO when both are true:

1. Its product type belongs to the everyday / household / personal-care / pet / travel-essential universe represented by at least one anchor retailer; and
2. CEGO can provide useful price, promotion, new-arrival or shopping context without becoming a general HKTVmall catalogue.

Preferred comparison levels:
- exact same SKU / GTIN;
- same normalized product + brand + specification;
- same meaningful product type for category browsing when exact SKU is unavailable.

## Marketplace handling
HKTVmall offers must retain merchant identity. Same product sold by Merchant A/B/C is not collapsed into one HKTVmall price.

Store fields where available:
- merchantId / merchantName
- skuId / GTIN
- product name / brand / specification
- pack quantity
- price / promotion
- normalized unit price
- exact product URL
- firstSeenAt / lastSeenAt

## New-arrival rule
HKTVmall DOES participate in New Arrival Radar, but only inside the scoped universe above.

A new snack, milk, mask, shampoo, pet-food item, cleaning product or disposable travel item may qualify. A new fashion shirt, TV or sofa does not qualify merely because it is newly listed on HKTVmall.

`firstSeenAt` means CEGO first detected the HKTVmall listing. It must not be presented as the manufacturer's official launch date unless an official source confirms that.

## Search-performance rule
The scope gate is applied BEFORE broad HKTVmall discovery wherever technically possible. CEGO should generate category/product candidates from the anchor-retailer universe first, then query/match HKTVmall. This prevents irrelevant HKTVmall catalogue areas from consuming search capacity or polluting results.

## UX
Show HKTVmall marketplace offers only inside eligible CEGO categories. If multiple HKTVmall merchants sell an item, show each merchant separately and provide the exact merchant/product link when available.

For New Arrival Radar, label HKTVmall records as `HKTVmall 新上架 / CEGO 首次發現` unless an official launch source supports the stronger `新品上市` wording.
