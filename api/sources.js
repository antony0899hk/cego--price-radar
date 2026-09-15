const sources=[
 {id:'consumer-council',name:'消委會格價資訊通',type:'structured-price',status:'live',retailers:['惠康','百佳','Market Place','屈臣氏','萬寧','AEON','大昌食品','莎莎','龍豐'],url:'https://online-price-watch.consumer.org.hk/opw/',dataUrl:'https://online-price-watch.consumer.org.hk/opw/opendata/pricewatch.json',note:'每日公開價格資料；網上價可能與個別實體分店不同。'},
 {id:'wellcome',name:'惠康',type:'official-promotion',status:'live',url:'https://www.wellcome.com.hk/',promoUrl:'https://www.wellcome.com.hk/en/d/UYotKNFg7BGJ.html',note:'官方推廣／Weekly Ads；只在可核實時用作優惠證據。'},
 {id:'parknshop',name:'百佳',type:'official-retailer',status:'live',url:'https://www.parknshop.com/',note:'價格比較目前以消委會公開資料為主。'},
 {id:'mannings',name:'萬寧',type:'official-promotion',status:'live',url:'https://www.mannings.com.hk/',promoUrl:'https://www.mannings.com.hk/zh-hant/eCoupons',note:'官方網店／eCoupon 優惠；會員或 App 條件會保留。'},
 {id:'watsons',name:'屈臣氏',type:'official-promotion',status:'live',url:'https://www.watsons.com.hk/',promoUrl:'https://www.watsons.com.hk/zh-hk/promo-promotion',note:'官方網店優惠；會員、網店限定及買多件條件會保留。'},
 {id:'bestmart360',name:'優品360',type:'official-promotion',status:'promo-only',url:'https://www.bestmart360.com/',promoUrl:'https://www.bestmart360.com/promo',note:'已接官方香港推廣頁；未有穩定逐件結構化價格資料前，不會假扮即時格價。'},
 {id:'759',name:'759阿信屋',type:'official-promotion',status:'promo-only',url:'https://www.759store.com/',promoUrl:'https://www.759store.com/promotion.php',note:'已接官方 Promotion 入口；現時多為圖片式優惠，未有可靠逐件結構化價格時只作優惠證據。'},
 {id:'7eleven',name:'7-Eleven',type:'official-promotion',status:'promo-only',url:'https://www.7-eleven.com.hk/zh',promoUrl:'https://www.7-eleven.com.hk/zh/Promotions/Saver-Combos',extraPromoUrls:['https://www.7-eleven.com.hk/zh/Promotions/10-Picks','https://www.7-eleven.com.hk/zh/creditcardpromotions','https://www.7-eleven.com.hk/zh/yuu-Rewards/yuu-stamp-promotion'],note:'已接官方便利店優惠來源，包括至抵配、一口價、付款及 yuu 優惠；店舖價格以個別分店為準時會保留該限制。'},
 {id:'circlek',name:'OK便利店',type:'official-promotion',status:'promo-only',url:'https://www.circlek.hk/hk/',promoUrl:'https://www.circlek.hk/hk/hotpicks/deals',extraPromoUrls:['https://www.circlek.hk/highlights/'],note:'已接官方 Hot Picks／好抵呀及最新推廣來源；未有可靠逐件結構化價格時只作優惠證據。'},
 {id:'aeon',name:'AEON',type:'structured-price',status:'live',url:'https://www.aeonstores.com.hk/',note:'價格比較由消委會公開資料提供；官方活動頁可作額外優惠證據。'},
 {id:'lungfung',name:'龍豐',type:'structured-price',status:'live',url:'https://www.lungfung.hk/',note:'價格比較由消委會公開資料提供。'},
 {id:'sasa',name:'莎莎',type:'structured-price',status:'live',url:'https://www.sasa.com.hk/',note:'價格比較由消委會公開資料提供。'}
];
export default function handler(req,res){res.status(200).json({updatedAt:new Date().toISOString(),sources,livePriceRetailers:['惠康','百佳','Market Place','屈臣氏','萬寧','AEON','大昌食品','莎莎','龍豐'],promoOnlyRetailers:['優品360','759阿信屋','7-Eleven','OK便利店'],rule:'未有可核實逐件價格時，不把推廣頁當成即時貨架價。'});}
