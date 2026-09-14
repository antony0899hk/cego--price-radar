export default async function handler(req, res) {
  const q = String(req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'missing query' });

  const sourceUrl = `https://online-price-watch.consumer.org.hk/opw/search/${encodeURIComponent(q)}`;

  try {
    const r = await fetch(sourceUrl, {
      headers: {
        'user-agent': 'Mozilla/5.0 CEGOPR/0.2',
        'accept-language': 'zh-HK,zh;q=0.9,en;q=0.8'
      }
    });
    const html = await r.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&#36;/g, '$')
      .replace(/\s+/g, ' ');

    const stores = ['惠康','百佳','Market Place','屈臣氏','萬寧','AEON','大昌食品','莎莎','龍豐'];
    const hits = [];
    for (const store of stores) {
      let from = 0;
      while (true) {
        const i = text.indexOf(store, from);
        if (i < 0) break;
        const chunk = text.slice(Math.max(0, i - 90), i + 180);
        const prices = [...chunk.matchAll(/(?:HK\$|\$)?\s*(\d{1,4}(?:\.\d{1,2})?)/g)]
          .map(m => Number(m[1]))
          .filter(n => n >= 1 && n <= 9999);
        if (prices.length) {
          hits.push({ store, price: prices[0], snippet: chunk.slice(0, 220) });
          break;
        }
        from = i + store.length;
      }
    }

    const deduped = Object.values(hits.reduce((acc, x) => {
      if (!acc[x.store] || x.price < acc[x.store].price) acc[x.store] = x;
      return acc;
    }, {})).sort((a,b) => a.price - b.price);

    return res.status(200).json({
      query: q,
      source: 'Consumer Council Online Price Watch',
      sourceUrl,
      updatedAt: new Date().toISOString(),
      results: deduped,
      note: deduped.length ? '官方搜尋頁擷取測試資料；請以來源頁為準。' : '官方搜尋已接通，但此頁暫未能可靠解析價錢；可直接開來源頁核對。'
    });
  } catch (e) {
    return res.status(200).json({
      query: q,
      source: 'Consumer Council Online Price Watch',
      sourceUrl,
      results: [],
      note: '官方來源暫時無法解析，可直接開來源頁核對。'
    });
  }
}
