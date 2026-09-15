const DATA_URL='https://online-price-watch.consumer.org.hk/opw/opendata/pricewatch.json';
const OFFICIAL={home:'https://www.parknshop.com/'};
const ALIASES={
  '牛奶':['牛奶','鮮奶','milk','fresh milk'],
  '鮮奶':['鮮奶','牛奶','fresh milk','milk'],
  '薯片':['薯片','chips','crisps','potato chips'],
  '零食':['零食','小食','snack','chips','crisps','biscuit','chocolate','薯片','餅乾','朱古力'],
  '廁紙':['廁紙','衛生紙','toilet paper','toilet tissue'],
  '咖啡':['咖啡','coffee']
};
const tc=v=>typeof v==='string'?v:(v?.['zh-Hant']||v?.en||v?.['zh-Hans']||'');
const all=v=>typeof v==='string'?v:[v?.['zh-Hant'],v?.['zh-Hans'],v?.en].filter(Boolean).join(' ');
const norm=v=>String(v??'').toLowerCase().replace(/[\s\-_/（）()]/g,'');
function terms(q){const key=String(q||'').trim().toLowerCase();return [...new Set([q,...(ALIASES[key]||[])])].map(norm).filter(Boolean)}
function haystack(p){return norm([all(p.brand),all(p.name),all(p.cat1Name),all(p.cat2Name),all(p.cat3Name),p.code].join(' '))}
export default async function handler(req,res){
  const q=String(req.query.q||'').trim();
  try{
    const r=await fetch(DATA_URL,{headers:{'user-agent':'CEGO-Price-Radar/0.6','accept':'application/json'}});
    if(!r.ok) throw new Error('feed '+r.status);
    const raw=await r.json();
    const items=Array.isArray(raw)?raw:(raw.products||raw.items||raw.data||[]);
    const needles=terms(q),results=[];
    for(const p of items){
      if(needles.length&&!needles.some(n=>haystack(p).includes(n))) continue;
      const price=(p.prices||[]).find(x=>(x.supermarketCode||x.supermarket||x.code)==='PARKNSHOP');
      if(!price) continue;
      const value=Number(price.price); if(!Number.isFinite(value)||value<=0) continue;
      const offer=(p.offers||[]).find(x=>(x.supermarketCode||x.supermarket||x.code)==='PARKNSHOP');
      results.push({code:p.code||'',brand:tc(p.brand),product:tc(p.name),category:[tc(p.cat1Name),tc(p.cat2Name),tc(p.cat3Name)].filter(Boolean).join(' › '),store:'百佳',price:value,promo:offer?tc(offer):'',evidence:'Consumer Council Online Price Watch Open Data',priceScope:'online/public chain data',branchConfirmed:false});
      if(results.length>=120) break;
    }
    results.sort((a,b)=>a.price-b.price||a.product.localeCompare(b.product,'zh-Hant'));
    return res.status(200).json({provider:'PARKNSHOP',store:'百佳',query:q,updatedAt:new Date().toISOString(),source:'Consumer Council Online Price Watch Open Data',dataUrl:DATA_URL,official:OFFICIAL,results,note:'百佳已接入 Price Radar。價格以消委會公開網上價格資料為基礎；網上／連鎖層級資料不等於指定分店即時貨架價或庫存。'});
  }catch(e){
    return res.status(200).json({provider:'PARKNSHOP',store:'百佳',query:q,official:OFFICIAL,results:[],note:'百佳價格來源暫時未能讀取；保留官方入口供核對。',error:String(e?.message||e)});
  }
}
