const SOURCES=[
 {id:'bestmart360',store:'優品360',url:'https://www.bestmart360.com/promo',scope:'官方香港推廣'},
 {id:'circlek',store:'OK便利店',url:'https://www.circlek.hk/hk/hotpicks/deals',scope:'官方好抵呀'},
 {id:'circlek-new',store:'OK便利店',url:'https://www.circlek.hk/hotpicks/new/',scope:'官方新品／套餐'},
 {id:'7eleven-10',store:'7-Eleven',url:'https://www.7-eleven.com.hk/zh/Promotions/10-Picks',scope:'官方 $10 一口價'},
 {id:'7eleven-combo',store:'7-Eleven',url:'https://www.7-eleven.com.hk/zh/Promotions/Saver-Combos',scope:'官方至抵配'}
];
const ALIASES={
 '鮮奶':['鮮奶','牛奶','milk','fresh milk'], '牛奶':['鮮奶','牛奶','milk','fresh milk'],
 '零食':['零食','薯片','餅','朱古力','snack','chips','biscuit','chocolate'],
 '咖啡':['咖啡','coffee'], '飲品':['飲品','汽水','果汁','茶','coffee','drink','beverage'],
 '早餐':['早餐','三文治','麵包','飯團','豆漿','breakfast','sandwich'],
 '牙膏':['牙膏','toothpaste'], '牙刷':['牙刷','toothbrush'], '廁紙':['廁紙','toilet paper','tissue']
};
const norm=s=>String(s||'').toLowerCase().replace(/\s+/g,' ');
const strip=html=>html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/\s+/g,' ').trim();
function terms(q){const k=norm(q).trim();return [...new Set([k,...(ALIASES[k]||[])])].filter(Boolean)}
function snippets(text,needles){const low=norm(text),out=[];for(const n of needles){let at=low.indexOf(norm(n));let loops=0;while(at>=0&&loops<3){const start=Math.max(0,at-80),end=Math.min(text.length,at+n.length+180);const s=text.slice(start,end).trim();if(s.length>20&&!out.some(x=>x.includes(s)||s.includes(x)))out.push(s);at=low.indexOf(norm(n),at+n.length);loops++}}return out.slice(0,4)}
async function inspect(source,needles){try{const r=await fetch(source.url,{headers:{'user-agent':'Mozilla/5.0 CEGO-Price-Radar/0.7','accept':'text/html,application/xhtml+xml'},redirect:'follow'});if(!r.ok)throw new Error('HTTP '+r.status);const html=await r.text(),text=strip(html),hits=snippets(text,needles);return {...source,status:'ok',matched:hits.length>0,snippets:hits};}catch(e){return {...source,status:'unavailable',matched:false,snippets:[],error:String(e.message||e)}}}
export default async function handler(req,res){
 const q=String(req.query.q||'').trim();if(!q)return res.status(400).json({error:'missing query'});
 const needles=terms(q);const checked=await Promise.all(SOURCES.map(s=>inspect(s,needles)));
 const results=checked.filter(x=>x.matched).map(x=>({store:x.store,sourceId:x.id,scope:x.scope,url:x.url,evidence:x.snippets,priceScope:'official-promotion',branchConfirmed:false}));
 res.setHeader('Cache-Control','s-maxage=900, stale-while-revalidate=1800');
 return res.status(200).json({query:q,updatedAt:new Date().toISOString(),results,checked:checked.map(({id,store,scope,url,status,matched})=>({id,store,scope,url,status,matched})),rule:'只顯示官方推廣頁可找到的文字證據；不把推廣頁當成指定分店即時貨架價或庫存。'});
}
