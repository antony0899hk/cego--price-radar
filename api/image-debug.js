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
  const clues=[...html.matchAll(/.{0,220}(?:productImage|product-image|product-images|photo|imageUrl|imagePath|supermarketCode|multipic).{0,500}/gi)].slice(0,80).map(x=>x[0]); const scripts=[...html.matchAll(/<script[^>]+src=[\"']([^\"']+)[\"']/gi)].map(x=>x[1]);
  const terms={}; for(const term of ['multipic','product-images','ajax','fetch(','/image','images/']){let pos=0,a=[];while((pos=html.indexOf(term,pos))>=0&&a.length<30){a.push(html.slice(Math.max(0,pos-300),pos+700));pos+=term.length}terms[term]=a.slice(-12)} res.status(200).json({status:r.status,url,length:html.length,imgs,clues,scripts,terms});
 }catch(e){res.status(500).json({error:String(e)})}
}