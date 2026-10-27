const puppeteer=require('/workspace/cafe-v2/node_modules/puppeteer-core'); const fs=require('fs');
function lum(r,g,b){const f=c=>{c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(b)}
function ratio(c1,c2){const [l1,l2]=[lum(...c1),lum(...c2)].sort((a,b)=>b-a);return ((l1+.05)/(l2+.05)).toFixed(2)}
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const pg=await b.newPage(); const dir='/workspace/outputs/vantage-launch/cafe-redo/v3';
const checks=[];
for(const [w,h,n] of [[1440,900,'desktop'],[1024,470,'short'],[390,844,'phone']]){
 await pg.setViewport({width:w,height:h}); await pg.goto('http://127.0.0.1:8900/',{waitUntil:'networkidle0'}); await pg.evaluate(()=>{localStorage.setItem('cda3-theme','light');localStorage.setItem('cda3-lang','en')}); await pg.goto('http://127.0.0.1:8900/',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1700));
 await pg.screenshot({path:`${dir}/light-fixed-${n}-${w}x${h}.png`});
 if(n==='desktop'){
   checks.push(await pg.evaluate(()=>{const out=[]; const parse=s=>s.match(/\d+(\.\d+)?/g).slice(0,3).map(Number);
     const items=[['hero-sub','.hero-sub','#14100d'],['hero-meta','.hero-meta','#14100d'],['ghost-btn','.hero .btn.ghost','#14100d'],['primary-btn','.hero .btn:not(.ghost)','#d8bc82'],['kicker','.hero .kicker','#14100d']];
     for(const [name,sel,bg] of items){const e=document.querySelector(sel); if(!e)continue; const c=getComputedStyle(e); out.push({name,color:c.color,bg,border:c.borderColor});}
     // light section samples
     const litems=[['body-text','.manifesto .scrub','#f3ead9'],['menu-price','.mp','#f4ecdd'],['primary-light','.feature-body .btn','#8a5a12']];
     for(const [name,sel,bg] of litems){const e=document.querySelector(sel); if(!e)continue; out.push({name,color:getComputedStyle(e).color,bg});}
     return out;}));
   for(const sec of ['gin','visit','menu']){ await pg.evaluate((s)=>document.querySelector('#'+s).scrollIntoView({behavior:'instant'}),sec); await new Promise(r=>setTimeout(r,900)); await pg.screenshot({path:`${dir}/light-fixed-${sec}-desktop-1440x900.png`}); }
   // overlay
   await pg.goto('http://127.0.0.1:8900/',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1500)); await pg.click('#menuBtn').catch(()=>{}); await pg.setViewport({width:390,height:844}); await pg.goto('http://127.0.0.1:8900/',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1200)); await pg.click('#menuBtn'); await new Promise(r=>setTimeout(r,800)); await pg.screenshot({path:`${dir}/light-fixed-overlay-phone-390x844.png`});
 }
}
console.log(JSON.stringify(checks,null,1));
console.log('contrast hero-sub cream-on-scrim ~', ratio([240,230,212],[20,16,13]), ' primary dark-on-brass ~', ratio([23,18,8],[216,188,130]), ' light-btn cream-on-darkbrass ~', ratio([255,248,236],[138,90,18]));
await b.close()})();
