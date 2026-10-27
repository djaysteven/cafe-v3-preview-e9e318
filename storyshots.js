const puppeteer=require('/workspace/cafe-v2/node_modules/puppeteer-core');
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const pg=await b.newPage(); const dir='/workspace/outputs/vantage-launch/cafe-redo/v3';
await pg.setViewport({width:1440,height:900}); await pg.goto('http://127.0.0.1:8900/',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1500));
for(const [f,label] of [[0,'rest1'],[0.5,'rest-mid'],[0.999,'rest-end']]){
 await pg.evaluate((fr)=>{const el=document.querySelector('.hwrap'); const total=el.offsetHeight-innerHeight; scrollTo({top:el.getBoundingClientRect().top+scrollY+fr*total,behavior:'instant'});},f);
 await new Promise(r=>setTimeout(r,1400)); await pg.screenshot({path:`${dir}/v3-story-${label}-desktop-1440x900.png`});
 console.log(label, await pg.evaluate(()=>({idx:document.getElementById('hIdx').textContent, tx:document.getElementById('htrack').style.transform})));
}
await pg.setViewport({width:390,height:844}); await pg.goto('http://127.0.0.1:8900/',{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1500));
await pg.evaluate(()=>{document.querySelector('#story').scrollIntoView({behavior:'instant'}); const t=document.getElementById('htrack'); const card=t.children[4]; t.scrollTo({left:card.offsetLeft-16,behavior:'instant'});});
await new Promise(r=>setTimeout(r,900)); await pg.screenshot({path:`${dir}/v3-story-phone-390x844.png`});
console.log('phone card check', await pg.evaluate(()=>{const t=document.getElementById('htrack'); const c=t.children[4]; const r=c.getBoundingClientRect(); return {left:r.left,right:r.right,W:innerWidth,title:c.querySelector('h3').textContent}}));
await b.close()})();
