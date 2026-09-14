const DATA_URL='https://online-price-watch.consumer.org.hk/opw/opendata/pricewatch.json';
const STORE={WELLCOME:'惠康',PARKNSHOP:'百佳',JASONS:'Market Place',MARKETPLACE:'Market Place',WATSONS:'屈臣氏',MANNINGS:'萬寧',AEON:'AEON',DCHFOOD:'大昌食品',SASA:'莎莎',LUNGFUNG:'龍豐'};
const ALIASES={
 '牙刷':['牙刷','toothbrush','tooth brush'],
 '牙膏':['牙膏','toothpaste'],
 '衛生巾':['衛生巾','衞生巾','sanitary pad','sanitary napkin','feminine hygiene'],
 '衞生巾':['衛生巾','衞生巾','sanitary pad','sanitary napkin','feminine hygiene'],
 'm巾':['衛生巾','衞生巾','sanitary pad','sanitary napkin'],
 '廁紙':['廁紙','衛生紙','toilet paper','toilet tissue','bathroom tissue'],
 '洗頭水':['洗頭水','洗髮水','洗髮','shampoo'],
 '牛奶':['牛奶','鮮奶','milk'],
 '咖啡':['咖啡','coffee']
};
const tc=v=>typeof v==='string'?v:(v?.['zh-Hant']||v?.en||v?.['zh-Hans']||'');
const norm=v=>String(v??'').toLowerCase().replace(/[\s\-_/（）()]/g,'');
const allLang=v=>typeof v==='string'?v:[v?.['zh-Hant'],v?.['zh-Hans'],v?.en].filter(Boolean).join(' ');
function terms(q){const key=String(q).trim().toLowerCase();return [...new Set([q,...(ALIASES[key]||[])])].map(norm).filter(Boolean)}
function haystack(p){return norm([allLang(p.brand),allLang(p.name),allLang(p.cat1Name),allLang(p.cat2Name),allLang(p.cat3Name),p.code].join(' '))}
export default async function handler(req,res){
 const q=String(req.query.q||'').trim(); if(!q)return res.status(400).json({error:'missing query'});
 const sourceUrl=`https://online-price-watch.consumer.org.hk/opw/search/${encodeURIComponent(q)}`;
 try{
  const r=await fetch(DATA_URL,{headers:{'user-agent':'CEGO-Price-Radar/0.4','accept':'application/json'}}); if(!r.ok)throw new Error('feed '+r.status);
  const raw=await r.json(); const items=Array.isArray(raw)?raw:(raw.products||raw.items||raw.data||[]); const needles=terms(q);
  const matched=items.filter(p=>{const h=haystack(p);return needles.some(n=>h.includes(n))&&Array.isArray(p.prices)&&p.prices.length}).slice(0,120);
  const results=[];
  for(const p of matched){
   const offerMap={}; for(const o of (p.offers||[])){const code=o.supermarketCode||o.supermarket||o.code; offerMap[code]=tc(o);}
   for(const x of (p.prices||[])){const code=x.supermarketCode||x.supermarket||x.code; const price=Number(x.price); if(!Number.isFinite(price)||price<=0)continue;
    results.push({code:p.code||'',brand:tc(p.brand),product:tc(p.name),category:[tc(p.cat1Name),tc(p.cat2Name),tc(p.cat3Name)].filter(Boolean).join(' › '),store:STORE[code]||code,price,promo:offerMap[code]||'',source:'Consumer Council Open Data'});
   }
  }
  results.sort((a,b)=>a.product.localeCompare(b.product,'zh-Hant')||a.price-b.price);
  return res.status(200).json({query:q,expandedTerms:needles,source:'Consumer Council Online Price Watch Open Data',dataUrl:DATA_URL,sourceUrl,updatedAt:new Date().toISOString(),products:matched.length,results:results.slice(0,180),note:`官方每日 Open Data｜找到 ${matched.length} 款相關貨品、${results.length} 個價格`});
 }catch(e){return res.status(200).json({query:q,source:'Consumer Council Online Price Watch',sourceUrl,results:[],note:'官方 Open Data 暫時讀取失敗，可開來源頁核對。',error:String(e.message||e)});}
}
