const puppeteer=require('/workspace/cafe-v2/node_modules/puppeteer-core'); const fs=require('fs');
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const pg=await b.newPage();
const dir='/workspace/outputs/vantage-launch/cafe-redo/v3'; fs.mkdirSync(dir,{recursive:true}); let fails=0;
async function measure(sel){return pg.evaluate((s)=>{const els=[...document.querySelectorAll(s)].filter(e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return r.width&&r.height&&c.display!=='none'&&c.visibility!=='hidden'}); if(!els.length)return null; const cs=els.map(e=>{const r=e.getBoundingClientRect();return {t:(e.textContent||'').trim().slice(0,14),cy:+(r.top+r.height/2).toFixed(1),h:+r.height.toFixed(1),l:+r.left.toFixed(0),r:+r.right.toFixed(0)}}); const dev=Math.max(...cs.map(x=>x.cy))-Math.min(...cs.map(x=>x.cy)); const hs=new Set(cs.map(x=>x.h)); return {dev,heights:[...hs],items:cs,overflow:cs.some(x=>x.l<-1||x.r>innerWidth+1)};},sel)}
for(const [w,h,n] of [[1440,900,'desktop'],[1024,470,'short'],[390,844,'phone']]){
 await pg.setViewport({width:w,height:h}); await pg.evaluate(()=>{try{localStorage.clear()}catch(e){}}).catch(()=>{}); await pg.goto('http://127.0.0.1:8900/',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1600));
 const hdr=await measure('header .brand, header nav.desk a, header .hactions > *'); console.log(n,'header',JSON.stringify(hdr)); if(!hdr||hdr.dev>1||hdr.overflow) fails++;
 const sticky=await measure('.stickybar a'); if(sticky){console.log(n,'sticky',JSON.stringify(sticky)); if(sticky.dev>1||sticky.overflow)fails++;}
 await pg.screenshot({path:`${dir}/header-fixed-${n}-${w}x${h}.png`});
 // cropped header shot too
 const clip=await pg.evaluate(()=>{const r=document.querySelector('header').getBoundingClientRect();return {x:0,y:0,width:innerWidth,height:Math.ceil(r.bottom)}}); await pg.screenshot({path:`${dir}/header-fixed-crop-${n}-${w}x${h}.png`,clip});
 await pg.evaluate(()=>document.querySelector('#menu').scrollIntoView({behavior:'instant'})); await new Promise(r=>setTimeout(r,800)); const tabs=await measure('.mtab'); console.log(n,'tabs',JSON.stringify(tabs)); if(!tabs||tabs.dev>1)fails++;
 await pg.evaluate(()=>document.querySelector('#visit').scrollIntoView({behavior:'instant'})); await new Promise(r=>setTimeout(r,800)); const cl=await measure('.resform .btn, .resform input, .resform select'); console.log(n,'resform',JSON.stringify(cl));
 await pg.goto('http://127.0.0.1:8900/',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,500));
}
console.log(fails?'ALIGN FAIL '+fails:'ALIGN ALL PASS'); await b.close()})();
