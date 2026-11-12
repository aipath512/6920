const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'artifacts/screenshots');
fs.mkdirSync(out, {recursive:true});
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const candidate=path.resolve(root,'.'+pathname,(pathname.endsWith('/')?'index.html':''));
  if(!candidate.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(candidate,(err,data)=>{if(err){res.writeHead(404).end();return;}res.writeHead(200,{'content-type':mime[path.extname(candidate)]||'text/plain'});res.end(data)});
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [390,768,1440]){
   const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   await page.locator('.premium-service-row').first().waitFor();
   assert.equal(await page.locator('.premium-service-row').count(),6);
   assert.equal(await page.locator('.premium-service-row.is-reversed').count(),3);
   assert.ok(await page.locator('.luxe-photo').isVisible(),'HERO background layer hidden');
   assert.ok(await page.locator('#footer-cookie-settings').count(),'Cookie footer settings missing');
   assert.ok(await page.locator('[data-cookie="reject"]').count(),'Reject control missing');
   assert.ok(await page.locator('[data-cookie="accept"]').count(),'Accept control missing');
   const reject=await page.locator('[data-cookie="reject"]').boundingBox();
   const accept=await page.locator('[data-cookie="accept"]').boundingBox();
   assert.ok(reject&&accept&&Math.abs(reject.height-accept.height)<3,'Accept and reject differ in height');
   assert.ok((await page.locator('.premium-service-row img').count())===6);
   await page.screenshot({path:path.join(out,'homepage-'+width+'.png'),fullPage:true,animations:'disabled'});
   assert.deepEqual(errors,[],'Browser JavaScript errors');
   await page.close();
  }
  console.log('PASS: responsive browser invariants and screenshots');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
