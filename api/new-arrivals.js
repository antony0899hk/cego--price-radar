import fs from 'fs';import path from 'path';
const FILE=path.join(process.cwd(),'data','new-arrivals.json');
const STORE_CODE={'惠康':'WELLCOME','百佳':'PARKNSHOP','萬寧':'MANNINGS','屈臣氏':'WATSONS','Market Place':'JASONS','AEON':'AEON','大昌食品':'DCHFOOD','莎莎':'SASA','龍豐':'LUNGFUNG'};
function enrich(x){
  const store=(x.stores||[]).find(s=>STORE_CODE[s])||'';
  const sc=STORE_CODE[store]||'';
  return {...x,
    imageUrl:sc&&x.code?`https://online-price-watch.consumer.org.hk/opw/photoRedirect/${encodeURIComponent(x.code)}/${sc}/51`:null,
    imageSource:sc?'消費者委員會格價資訊通':null,
    productUrl:x.code?`https://online-price-watch.consumer.org.hk/opw/product/${encodeURIComponent(x.code)}?lang=zh-Hant`:null
  };
}
export default function handler(req,res){let data={updatedAt:null,results:[]};try{data=JSON.parse(fs.readFileSync(FILE,'utf8'))}catch{}res.setHeader('Cache-Control','s-maxage=900, stale-while-revalidate=1800');res.status(200).json({...data,version:'0.10.6',results:(data.results||[]).map(enrich),rule:'CEGO 首次發現代表 CEGO 第一次在四大生活商戶商品資料中見到該商品，不等於品牌官方上市日期。商品圖片直接引用格價資訊通公開貨品圖片入口；沒有可用圖片時前端會自動隱藏。'})}