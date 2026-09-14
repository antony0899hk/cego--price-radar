const DATA_URL='https://online-price-watch.consumer.org.hk/opw/opendata/pricewatch.json';
const STORE={WELLCOME:'惠康',PARKNSHOP:'百佳',JASONS:'Market Place',WATSONS:'屈臣氏',MANNINGS:'萬寧',AEON:'AEON',DCHFOOD:'大昌食品',SASA:'莎莎',LUNGFUNG:'龍豐'};
const z=v=>String(v??'').toLowerCase();
const tc=v=>typeof v==='string'?v:(v?.['zh-Hant']||v?.en||v?.['zh-Hans']||'');
export default async function handler(req,res){
 const q=String(req.query.q||'').trim(); if(!q)return res.status(400).json({error:'missing query'});
 const sourceUrl=`https://online-price-watch.consumer.org.hk/opw/search/${encodeURIComponent(q)}`;
 try{
  const r=await fetch(DATA_URL,{headers:{'user-agent':'CEGO-Price-Radar/0.3','accept':'application/json'}}); if(!r.ok)throw new Error('feed '+r.status);
  const raw=await r.json(); const items=Array.isArray(raw)?raw:(raw.products||raw.items||raw.data||[]); const needle=z(q);
  const matched=items.filter(p=>[tc(p.brand),tc(p.name),tc(p.cat1Name),tc(p.cat2Name),tc(p.cat3Name),p.code].some(v=>z(v).includes(needle))).slice(0,80);
  const results=[];
  for(const p of matched){
   const offerMap={}; for(const o of (p.offers||[])){const code=o.supermarketCode||o.supermarket||o.code; offerMap[code]=tc(o.offers||o.offer||o.text||o);}
   for(const x of (p.prices||[])){const code=x.supermarketCode||x.supermarket||x.code; const price=Number(x.price); if(!Number.isFinite(price)||price<=0)continue;
    results.push({code:p.code||'',brand:tc(p.brand),product:tc(p.name),category:[tc(p.cat1Name),tc(p.cat2Name),tc(p.cat3Name)].filter(Boolean).join(' › '),store:STORE[code]||code,price,promo:offerMap[code]||'',source:'Consumer Council Open Data'});
   }
  }
  results.sort((a,b)=>a.product.localeCompare(b.product,'zh-Hant')||a.price-b.price);
  return res.status(200).json({query:q,source:'Consumer Council Online Price Watch Open Data',dataUrl:DATA_URL,sourceUrl,updatedAt:new Date().toISOString(),products:matched.length,results:results.slice(0,120),note:`官方每日 Open Data｜找到 ${matched.length} 款相關貨品、${results.length} 個價格`});
 }catch(e){return res.status(200).json({query:q,source:'Consumer Council Online Price Watch',sourceUrl,results:[],note:'官方 Open Data 暫時讀取失敗，可開來源頁核對。',error:String(e.message||e)});}
}
