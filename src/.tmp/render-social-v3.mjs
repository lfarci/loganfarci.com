import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const root = process.cwd();
const fonts = [
  {pkg:"@fontsource-variable/manrope", family:"Manrope Variable", file:"manrope-latin-wght-normal", weight:"200 800"},
  {pkg:"@fontsource/noto-sans", family:"Noto Sans", file:"noto-sans-latin-400-normal", weight:"400"},
  {pkg:"@fontsource/reddit-mono", family:"Reddit Mono", file:"reddit-mono-latin-400-normal", weight:"400"}
];
const fontRules = [];
for (const font of fonts) {
  const folder = path.join(root,"node_modules",font.pkg,"files");
  const files = await fs.readdir(folder);
  const name = files.find(item=>item===font.file+".woff2") ??
    files.find(item=>item.startsWith(font.file)&&item.endsWith(".woff2"));
  if (!name) throw Error("Missing website font "+font.family+" in "+folder);
  const encoded=(await fs.readFile(path.join(folder,name))).toString("base64");
  fontRules.push('@font-face{font-family:"'+font.family+'";src:url("data:font/woff2;base64,'+
    encoded+'") format("woff2");font-weight:'+font.weight+';font-style:normal;font-display:block}');
}
const css=[
 '*{box-sizing:border-box}',
 'html,body{margin:0;padding:0;width:1200px;height:630px}',
 'body{background:#060c1a;color:#f6f9fe}',
 '#canvas{width:1200px;height:630px;position:relative;overflow:hidden;background:#060c1a}',
 '.orb{position:absolute;width:770px;height:760px;left:705px;top:-35px;border-radius:50%;background:radial-gradient(ellipse at 43% 47%,rgba(20,183,227,.77) 0%,rgba(16,118,207,.63) 28%,rgba(24,76,170,.40) 48%,rgba(9,19,42,0) 73%);filter:blur(29px)}',
 '.arc{position:absolute;border:1px solid rgba(61,136,220,.36);border-radius:50%;width:570px;height:545px;right:-180px;top:-203px;transform:rotate(15deg)}',
 '.arc.second{width:385px;height:580px;top:139px;right:-289px;opacity:.67}',
 '.dot{position:absolute;top:85px;left:81px;width:11px;height:11px;border-radius:50%;background:#3996f1;box-shadow:0 0 13px rgba(67,152,240,.48)}',
 '.wordmark{position:absolute;top:77px;left:109px;font-family:"Manrope Variable",sans-serif;font-weight:700;font-size:19px;letter-spacing:.08em;color:#e6eefb}',
 '.rule{position:absolute;left:80px;top:119px;height:1px;width:630px;background:rgba(103,145,188,.47)}',
 '.hero{position:absolute;left:76px;top:205px;font-family:"Manrope Variable",sans-serif;font-size:82px;line-height:1.07;font-weight:550;letter-spacing:-.035em}',
 '.hero .first{display:block;color:#f5f7fd}',
 '.hero .second{display:block;color:#4c9dfb;margin-top:15px}',
 '.desc{position:absolute;left:80px;top:480px;color:#b9cce6;font-family:"Noto Sans",sans-serif;font-size:19px;font-weight:400;line-height:1.54}',
 '.rule-bottom{position:absolute;left:80px;top:552px;width:760px;height:1px;background:rgba(109,146,191,.43)}',
 '.stack{position:absolute;left:80px;top:577px;font-family:"Reddit Mono",monospace;font-weight:400;font-size:17px;letter-spacing:.03em;color:#a5c5e9}'
].join("\n");
const body='<div id="canvas"><div class="orb"></div><div class="arc"></div><div class="arc second"></div>'+
 '<div class="dot"></div><div class="wordmark">LOGAN FARCI</div><div class="rule"></div>'+
 '<div class="hero"><span class="first">Hi, I&#39;m Logan.</span><span class="second">Software Engineer</span></div>'+
 '<div class="desc">Software engineer building for the web and cloud.</div>'+
 '<div class="rule-bottom"></div><div class="stack">loganfarci.com</div></div>';
const html='<!doctype html><html lang="en"><head><meta charset="utf-8"/><style>'+
 fontRules.join("\n")+css+'</style></head><body>'+body+'</body></html>';
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
await page.setContent(html,{waitUntil:"load"});
await page.evaluate(async ()=>{
  await document.fonts.load('550 82px "Manrope Variable"',"Hi, I'm Logan. Software Engineer");
  await document.fonts.load('700 19px "Manrope Variable"',"LOGAN FARCI");
  await document.fonts.load('400 19px "Noto Sans"',"Software engineer");
  await document.fonts.load('400 17px "Reddit Mono"',"loganfarci.com");
  await document.fonts.ready;
});
const loaded=await page.evaluate(()=>({
  manrope:document.fonts.check('550 82px "Manrope Variable"'),
  noto:document.fonts.check('400 19px "Noto Sans"'),
  reddit:document.fonts.check('400 17px "Reddit Mono"')
}));
if(!loaded.manrope||!loaded.noto||!loaded.reddit)throw Error("Website font not loaded: "+JSON.stringify(loaded));
const screenshot=await page.locator("#canvas").screenshot();
const headingLayout = await page.locator(".hero .second").evaluate((node) => {
  const range = document.createRange();
  range.selectNodeContents(node);
  const bounds = range.getBoundingClientRect();
  return { right: bounds.right, bottom: bounds.bottom };
});
if (headingLayout.right > 860 || headingLayout.bottom > 525) {
  throw Error("Headline risks overlapping brand artwork: " + JSON.stringify(headingLayout));
}
await browser.close();
const output="public/images/social-preview-v3.png";
await sharp(screenshot).png({compressionLevel:9,effort:9}).toFile(output);
const info=await sharp(output).metadata();
if(info.format!=="png"||info.width!==1200||info.height!==630||info.size>=5*1024*1024){
 throw Error("Unexpected static social image dimensions or size: "+JSON.stringify(info));
}
console.log("Rendered exact homepage fonts: "+JSON.stringify({fonts:loaded,size:info.size}));
