# HKTVmall Comparison Gate

Version: 0.9.0

## Product rule
HKTVmall is a comparison source, not a general discovery catalogue.

CEGO must not search, publish or surface an HKTVmall-only product merely because it exists on HKTVmall. An HKTVmall offer becomes eligible only when CEGO has a meaningful comparison candidate from another supported retailer.

## Eligibility
An HKTVmall item may enter Price Radar when at least one of these is true:

1. Exact same SKU / GTIN exists at another supported retailer.
2. Same normalized product + brand + specification exists at another supported retailer.
3. For category browsing, the item belongs to a category with comparable offers from supported retailers and the comparison is meaningful.

Examples:
- Grocery / fresh milk / snacks: compare with Wellcome, PARKnSHOP, AEON, Market Place etc.
- Skincare / masks / personal care: compare with Mannings, Watsons, Lung Fung, Sasa etc.
- Pet food: compare when another supported supermarket / retailer carries the same or meaningfully comparable product.
- Electronics / fashion / furniture that have no CEGO retailer comparison: exclude.

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
HKTVmall-only new arrivals are excluded. A new HKTVmall item can appear in New Arrival Radar only after it passes the comparison gate above.

This keeps New Arrival Radar focused on products that CEGO can actually compare rather than becoming a general HKTVmall catalogue.

## UX
Show HKTVmall as additional merchant offers under an already comparable product. If multiple HKTVmall merchants sell the item, show each merchant separately and provide the exact merchant/product link when available.
