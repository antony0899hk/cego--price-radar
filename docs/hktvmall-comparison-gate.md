# HKTVmall Comparison Gate

Version: 0.9.0

## Anchor-retailer rule
HKTVmall is allowed in Price Radar and New Arrival Radar, but its searchable / publishable product universe is defined by four anchor retailers only:

1. Wellcome 惠康
2. PARKnSHOP 百佳
3. Mannings 萬寧
4. Watsons 屈臣氏

CEGO first builds the eligible category / product universe from these four retailers. HKTVmall is then searched only for products or product types that fall inside that universe.

This is intentionally stricter than using every CEGO-supported retailer as a gate.

## What this means
- Grocery, drinks, snacks, milk, frozen food, household goods etc. are eligible when they are product types carried by Wellcome / PARKnSHOP.
- Skincare, masks, oral care, shampoo, health / personal-care products etc. are eligible when they are product types carried by Mannings / Watsons.
- Pet food / pet supplies are eligible if the product type is carried by at least one of the four anchor retailers.
- Disposable / travel underwear is eligible because it is sold by anchor retailers.
- General fashion clothing is excluded merely because HKTVmall sells it. If the product type is not carried by any of the four anchor retailers, CEGO does not search or publish it from HKTVmall.
- The same exclusion applies to unrelated electronics, furniture and other HKTVmall-only catalogue areas unless a future anchor-retailer rule explicitly brings that product type into scope.

The gate is category / product-type based first, then exact SKU / brand / specification matching is used for comparison quality.

## Eligibility
An HKTVmall item may enter CEGO when both are true:

1. Its product type is inside the four-anchor-retailer universe; and
2. CEGO can present a useful comparison or discovery context without turning Price Radar into a general HKTVmall catalogue.

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
HKTVmall DOES participate in New Arrival Radar.

However, HKTVmall New Arrival Radar is limited to the product universe established by Wellcome, PARKnSHOP, Mannings and Watsons. A newly listed HKTVmall product outside those four retailers' product types is ignored rather than surfaced as a CEGO new arrival.

Therefore:
- a new snack, milk, face mask, shampoo, pet-food item or disposable underwear may qualify when its product type exists at an anchor retailer;
- a normal fashion shirt does not qualify just because it is newly listed on HKTVmall.

`firstSeenAt` means CEGO first detected the HKTVmall listing. It must not be presented as the manufacturer's official launch date unless an official source confirms that.

## UX
Show HKTVmall as marketplace offers inside eligible CEGO product categories. If multiple HKTVmall merchants sell the item, show each merchant separately and provide the exact merchant/product link when available.

For New Arrival Radar, label HKTVmall records as `HKTVmall 新上架 / CEGO 首次發現` unless an official launch source supports the stronger `新品上市` wording.
