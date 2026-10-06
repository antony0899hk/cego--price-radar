const BASE='https://online-price-watch.consumer.org.hk';
export default async function handler(req,res){
 const code=String(req.query.code||'').replace(/[^A-Z0-9]/gi,'');
 const store=String(req.query.store||'WELLCOME').replace(/[^A-Z0-9]/gi,'');
 if(!code)return res.status(400).end();
 try{
  const page=await fetch(BASE+'/opw/product/'+code+'?lang=zh-Hant',{headers:{'User-Agent':'Mozilla/5.0','Accept-Language':'zh-HK,zh;q=0.9'}});
  if(!page.ok)throw new Error('product page '+page.status);
  const html=await page.text();
  const prefix='photoRedirect/'+code+'/'+store+'/';
  const links=[...html.matchAll(/href=["']([^"']*photoRedirect\/[^"']+)["'][^>]*data-photo-idx=["']([^"']+)["']/gi)];
  let hit=links.find(x=>x[1].includes(prefix)&&x[2]==='1')||links.find(x=>x[1].includes(prefix));
  if(!hit)return res.status(404).end();
  const photo=new URL(hit[1],BASE).href;
  const ir=await fetch(photo,{redirect:'follow',headers:{'User-Agent':'Mozilla/5.0','Referer':BASE+'/opw/product/'+code}});
  if(!ir.ok)throw new Error('photo '+ir.status);
  const type=ir.headers.get('content-type')||'image/jpeg';
  if(!type.startsWith('image/'))throw new Error('not image '+type);
  const buf=Buffer.from(await ir.arrayBuffer());
  res.setHeader('Content-Type',type);res.setHeader('Cache-Control','public, s-maxage=604800, stale-while-revalidate=2592000');res.status(200).send(buf);
 }catch(e){res.status(404).end()}
}