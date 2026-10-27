const puppeteer=require('/workspace/cafe-v2/node_modules/puppeteer-core');
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const pg=await b.newPage(); const dir='/workspace/outputs/vantage-launch/cafe-redo/v3';
for(const theme of ['dark','light']){ for(const [w,h,n] of [[1440,900,'desktop'],[390,844,'phone'],[1024,470,'short']]){
 await pg.setViewport({width:w,height:h}); await pg.goto('http://127.0.0.1:8900/',{waitUntil:'networkidle0'}); await pg.evaluate((t)=>{localStorage.setItem('cda3-theme',t);localStorage.setItem('cda3-lang','en')},theme); await pg.goto('http://127.0.0.1:8900/',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1600));
 await pg.evaluate(()=>{const el=document.querySelector('.feature'); const total=el.offsetHeight-innerHeight; scrollTo({top:el.getBoundingClientRect().top+scrollY+0.22*total,behavior:'instant'});});
 await new Promise(r=>setTimeout(r,900)); await pg.screenshot({path:`${dir}/wellington-fixed-${theme}-${n}-${w}x${h}.png`});
}}
await b.close(); console.log('done')})();
