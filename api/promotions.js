const SOURCES=[
 {id:'wellcome-weekly',store:'惠康',url:'https://www.wellcome.com.hk/zh-hant/wellcome/d/UYotKNFg7BGJ.html',scope:'官方本週廣告',tier:'official',channel:'mixed'},
 {id:'bestmart360',store:'優品360',url:'https://www.bestmart360.com/promo',scope:'官方香港推廣',tier:'official',channel:'physical-promo'},
 {id:'circlek',store:'OK便利店',url:'https://www.circlek.hk/hk/hotpicks/deals',scope:'官方好抵呀',tier:'official',channel:'physical-promo'},
 {id:'circlek-new',store:'OK便利店',url:'https://www.circlek.hk/hotpicks/new/',scope:'官方新品／套餐',tier:'official',channel:'physical-promo'},
 {id:'7eleven-10',store:'7-Eleven',url:'https://www.7-eleven.com.hk/zh/Promotions/10-Picks',scope:'官方 $10 一口價',tier:'official',channel:'physical-promo'},
 {id:'7eleven-combo',store:'7-Eleven',url:'https://www.7-eleven.com.hk/zh/Promotions/Saver-Combos',scope:'官方至抵配',tier:'official',channel:'physical-promo'},
 {id:'hksb-wellcome',store:'惠康',url:'https://iac-tdls.hksb.org.hk/web_info_detail.php?content=supermarket_wellcome',scope:'每週優惠文字版',tier:'secondary-structured',channel:'physical-promo'},
 {id:'hksb-parknshop',store:'百佳',url:'https://iac-tdls.hksb.org.hk/web_info_detail.php?content=supermarket_parknshop',scope:'每週優惠文字版',tier:'secondary-structured',channel:'physical-promo'},
 {id:'media-wellcome-20260911',store:'惠康',url:'https://www.stheadline.com/food/3614252/',scope:'公開優惠報道',tier:'media',channel:'physical-promo'}
];

const ALIASES={
 '鮮奶':['鮮奶','牛奶','milk','fresh milk'],'牛奶':['鮮奶','牛奶','milk','fresh milk'],
 '零食':['零食','薯片','餅','朱古力','snack','chips','biscuit','chocolate'],
 '咖啡':['咖啡','coffee'],'飲品':['飲品','汽水','果汁','茶','可口可樂','雪碧','芬達','玉泉','coffee','drink','beverage'],
 '汽水':['汽水','可口可樂','雪碧','芬達','玉泉','coca-cola','coke','sprite','fanta','schweppes'],
 '早餐':['早餐','三文治','麵包','飯團','豆漿','breakfast','sandwich'],
 '牙膏':['牙膏','舒適達','高露潔','黑人','darlie','sensodyne','colgate','toothpaste'],
 '牙刷':['牙刷','toothbrush'],'廁紙':['廁紙','衛生紙','紙巾','toilet paper','tissue'],
 '午餐肉':['午餐肉','火腿豬肉','長城牌','luncheon meat']
};

const norm=s=>String(s||'').toLowerCase().replace(/\s+/g,' ').trim();
const decode=s=>s.replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,'<').replace(/&gt;/gi,'>');
const strip=html=>decode(html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')).trim();
function terms(q){const k=norm(q);return [...new Set([k,...(ALIASES[k]||[])])].filter(Boolean)}
function snippets(text,needles){const low=norm(text),out=[];for(const n0 of needles){const n=norm(n0);let at=low.indexOf(n),loops=0;while(at>=0&&loops<4){const start=Math.max(0,at-95),end=Math.min(text.length,at+n.length+230),s=text.slice(start,end).trim();if(s.length>20&&!out.some(x=>x.includes(s)||s.includes(x)))out.push(s);at=low.indexOf(n,at+n.length);loops++}}return out.slice(0,5)}
function iso(y,m,d){return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
function validity(text){
 const m=text.match(/(20\d{2})年\s*(\d{1,2})月\s*(\d{1,2})日\s*(?:至|到|[-–—])\s*(?:(20\d{2})年\s*)?(\d{1,2})月\s*(\d{1,2})日/);
 if(!m)return {validFrom:null,validTo:null};
 return {validFrom:iso(+m[1],+m[2],+m[3]),validTo:iso(+(m[4]||m[1]),+m[5],+m[6])};
}
function hkToday(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Hong_Kong',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function mechanics(text){const x=norm(text),out=[];if(/買.{0,30}送/.test(x))out.push('buy-get');if(/買\s*\d+|\d+\s*(?:件|包|盒|支|排|罐).{0,12}\$\s*\d+/i.test(x))out.push('multi-buy');if(/滿\s*\$?\s*\d+/.test(x))out.push('spend-threshold');if(/會員|member|yuu/.test(x))out.push('member');if(/換購/.test(x))out.push('redemption');if(/門市限定|只限門市|不適用於.{0,20}網店/.test(x))out.push('store-only');return [...new Set(out)]}
function confidence(tier){return tier==='official'?0.95:tier==='secondary-structured'?0.82:0.74}
async function inspect(source,needles){
 try{
  const r=await fetch(source.url,{headers:{'user-agent':'Mozilla/5.0 CEGO-Price-Radar/0.8','accept':'text/html,application/xhtml+xml'},redirect:'follow'});if(!r.ok)throw new Error('HTTP '+r.status);
  const text=strip(await r.text()),hits=snippets(text,needles),v=validity(text),today=hkToday();
  return {...source,status:'ok',matched:hits.length>0,snippets:hits,...v,active:!v.validFrom||!v.validTo||(today>=v.validFrom&&today<=v.validTo),mechanics:mechanics(hits.join(' ')),confidence:confidence(source.tier)};
 }catch(e){return {...source,status:'unavailable',matched:false,snippets:[],validFrom:null,validTo:null,active:false,mechanics:[],confidence:confidence(source.tier),error:String(e.message||e)}}
}
export default async function handler(req,res){
 const q=String(req.query.q||'').trim();if(!q)return res.status(400).json({error:'missing query'});
 const needles=terms(q),checked=await Promise.all(SOURCES.map(s=>inspect(s,needles)));
 const results=checked.filter(x=>x.matched&&x.active).sort((a,b)=>b.confidence-a.confidence).map(x=>({store:x.store,sourceId:x.id,scope:x.scope,sourceTier:x.tier,channel:x.channel,url:x.url,evidence:x.snippets,validFrom:x.validFrom,validTo:x.validTo,mechanics:x.mechanics,confidence:x.confidence,priceScope:'public-promotion',branchConfirmed:false}));
 res.setHeader('Cache-Control','s-maxage=900, stale-while-revalidate=1800');
 return res.status(200).json({version:'0.8.0',query:q,updatedAt:new Date().toISOString(),results,checked:checked.map(({id,store,scope,tier,url,status,matched,active,validFrom,validTo})=>({id,store,scope,tier,url,status,matched,active,validFrom,validTo})),rule:'公開優惠情報只作門市推廣證據；官方來源優先，文字轉錄及媒體用作補漏／交叉核對。未有指定分店證據時，不當成該分店即時貨架價或庫存。'});
}
