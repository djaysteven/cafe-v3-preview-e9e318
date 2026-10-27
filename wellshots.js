const puppeteer=require('/workspace/cafe-v2/node_modules/puppeteer-core'); const fs=require('fs');
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const pg=await b.newPage();
const dir='/workspace/outputs/vantage-launch/cafe-redo/v3';
for(const [w,h,n] of [[1440,900,'desktop'],[390,844,'phone']]){
 await pg.setViewport({width:w,height:h}); await pg.goto('http://127.0.0.1:8900/',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1400));
 for(const [frac,label] of [[0,'before'],[0.5,'mid'],[0.95,'after']]){
   await pg.evaluate((f)=>{const el=document.querySelector('.feature'); const total=el.offsetHeight-innerHeight; const y=el.getBoundingClientRect().top+scrollY+f*total; scrollTo({top:y,behavior:'instant'});},frac);
   await new Promise(r=>setTimeout(r,700)); await pg.screenshot({path:`${dir}/v3-wellington-${label}-${n}-${w}x${h}.png`});
 }
}
await b.close(); console.log('done')})();
