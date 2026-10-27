const puppeteer=require('/workspace/cafe-v2/node_modules/puppeteer-core');
const fs=require('fs');
const URL='http://127.0.0.1:8900/';
const sizes=[[360,640],[375,667],[390,844],[414,896],[430,932],[768,1024],[820,1180],[1024,768],[1180,820],[1280,800],[1366,768],[1440,900],[1512,820],[1728,1000],[1920,1080],[2560,1440],[1024,470],[1280,600],[1366,650],[844,390],[932,430]];
(async()=>{
 const browser=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--force-device-scale-factor=1']});
 const page=await browser.newPage(); let pass=0,fail=0; const failures=[];
 async function check(label,setup){
   await page.goto(URL,{waitUntil:'networkidle0',timeout:60000});
   await page.evaluate(()=>{try{localStorage.clear()}catch(e){}});
   await page.goto(URL,{waitUntil:'networkidle0',timeout:60000});
   if(setup) await setup();
   await new Promise(r=>setTimeout(r,1300));
   const res=await page.evaluate(()=>{
     const out=[]; const W=innerWidth;
     if(document.documentElement.scrollWidth>W+1) out.push('h-overflow doc '+document.documentElement.scrollWidth+'>'+W);
     document.querySelectorAll('h1,h2,h3,.brand,.btn,figcaption,.cline,.courses a,.courses h3,.hcard h3').forEach(el=>{
       if(el.closest('.htrack')||el.closest('#overlay')||el.closest('#loader')) return;
       const r=el.getBoundingClientRect(); if(!r.width) return;
       if(r.left<-1||r.right>W+1) out.push('offscreen '+el.tagName+' "'+(el.textContent||'').trim().slice(0,28)+'" '+Math.round(r.left)+','+Math.round(r.right)+' W'+W);
     });
     const els=[...document.querySelectorAll('header .brand, header nav a, header .hactions > *')].filter(e=>e.getBoundingClientRect().width&&getComputedStyle(e).display!=='none');
     for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){const a=els[i].getBoundingClientRect(),b=els[j].getBoundingClientRect();
       if(a.left<b.right-2&&b.left<a.right-2&&a.top<b.bottom-2&&b.top<a.bottom-2) out.push('overlap header '+(els[i].textContent||'').trim().slice(0,15)+' x '+(els[j].textContent||'').trim().slice(0,15));}
     // hero title must be within viewport horizontally
     const h1=document.querySelector('.hero h1'); if(h1){const r=h1.getBoundingClientRect(); if(r.left<-1||r.right>W+1) out.push('hero h1 offscreen');}
     return out;
   });
   if(res.length){fail++; failures.push(label+': '+res.slice(0,4).join(' | '));} else pass++;
 }
 for(const [w,h] of sizes){ await page.setViewport({width:w,height:h}); await check(`EN-dark ${w}x${h}`); }
 for(const [w,h] of [[390,844],[1024,470],[1440,900],[844,390]]){
   await page.setViewport({width:w,height:h});
   await check(`EN-light ${w}x${h}`,async()=>{await page.evaluate(()=>localStorage.setItem('cda3-theme','light')); await page.goto(URL,{waitUntil:'networkidle0'});});
   await check(`TH-dark ${w}x${h}`,async()=>{await page.evaluate(()=>localStorage.setItem('cda3-lang','th')); await page.goto(URL,{waitUntil:'networkidle0'});});
   await check(`TH-light ${w}x${h}`,async()=>{await page.evaluate(()=>{localStorage.setItem('cda3-lang','th');localStorage.setItem('cda3-theme','light')}); await page.goto(URL,{waitUntil:'networkidle0'});});
   if(w<=900) await check(`menu-open ${w}x${h}`,async()=>{await page.click('#menuBtn');});
 }
 await page.setViewport({width:1440,height:900}); await page.goto(URL,{waitUntil:'networkidle0'}); await page.evaluate(()=>document.body.style.zoom='1.25'); await new Promise(r=>setTimeout(r,1300));
 await check('125% zoom 1440x900');
 console.log(`PASS ${pass} FAIL ${fail}`); failures.forEach(f=>console.log('FAIL:',f));
 // screenshots required
 const dir='/workspace/outputs/vantage-launch/cafe-redo/v3'; fs.mkdirSync(dir,{recursive:true});
 const shots=[[1440,900,'desktop'],[390,844,'phone'],[1024,470,'short'],[1920,1080,'wide']];
 for(const [w,h,n] of shots){ await page.setViewport({width:w,height:h}); await page.evaluate(()=>localStorage.clear()); await page.goto(URL,{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1400));
   await page.screenshot({path:`${dir}/v3-hero-${n}-${w}x${h}.png`});
   await page.evaluate(()=>{document.querySelector('.hcard:nth-child(2)').scrollIntoView({block:'center',behavior:'instant'})}); await new Promise(r=>setTimeout(r,900)); await page.screenshot({path:`${dir}/v3-dish-${n}-${w}x${h}.png`});
   await page.evaluate(()=>document.querySelector('#menu').scrollIntoView({behavior:'instant'})); await new Promise(r=>setTimeout(r,900)); await page.screenshot({path:`${dir}/v3-menu-${n}-${w}x${h}.png`});
   await page.evaluate(()=>document.querySelector('#wellington').scrollIntoView({behavior:'instant'})); await new Promise(r=>setTimeout(r,900)); await page.screenshot({path:`${dir}/v3-wellington-${n}-${w}x${h}.png`});
 }
 await browser.close();
})();
