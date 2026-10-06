export default async function handler(req,res){
 const code=String(req.query.code||'P000005441').replace(/[^A-Z0-9]/gi,'');
 if(!code)return res.status(400).json({error:'code required'});
 try{
  const url='https://online-price-watch.consumer.org.hk/opw/product/'+code+'?lang=zh-Hant';
  const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0','Accept-Language':'zh-HK,zh;q=0.9'}});
  const html=await r.text();
  const imgs=[]; let m; const re=/<img\b[^>]*>/gi;
  while((m=re.exec(html))&&imgs.length<200){
   const tag=m[0],src=(tag.match(/(?:src|data-src|data-original|data-lazy-src)=["']([^"']+)["']/i)||[])[1]||'';
   const alt=(tag.match(/(?:alt|title)=["']([^"']*)["']/i)||[])[1]||'';
   if(src)imgs.push({src,alt,tag:tag.slice(0,300)});
  }
  const clues=[...html.matchAll(/.{0,180}(?:productImage|product-image|photo|imageUrl|imagePath|supermarketCode).{0,300}/gi)].slice(0,40).map(x=>x[0]);
  res.status(200).json({status:r.status,url,length:html.length,imgs,clues});
 }catch(e){res.status(500).json({error:String(e)})}
}