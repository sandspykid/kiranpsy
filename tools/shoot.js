const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const fs = require('fs');
  const root = path.join(__dirname, '..');
  const pages = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(root).filter(f => f.endsWith('.html')).sort();
  fs.mkdirSync('shots', { recursive: true });
  let failures = 0;
  const browser = await chromium.launch();
  for (const p of pages) {
    for (const [name, vw, scheme] of [["desktop",1280,"light"],["mobile",390,"light"],["desktop-dark",1280,"dark"]]) {
      const ctx = await browser.newContext({ viewport: { width: vw, height: 900 }, colorScheme: scheme, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
      await page.goto('http://127.0.0.1:8080/' + p, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(600);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      const out = path.join('shots', p.replace('.html','') + '-' + name + '.png');
      await page.screenshot({ path: out, fullPage: true });
      const bad = errors.length > 0 || sw > vw;
      if (bad) failures++;
      console.log((bad ? 'FAIL ' : 'ok   ') + p, name, 'scrollWidth=' + sw, 'viewport=' + vw, errors.length ? errors.join(' | ') : 'no errors');
      await ctx.close();
    }
  }
  await browser.close();
  console.log(failures ? failures + ' failing page/mode combinations' : 'all page/mode combinations clean');
  if (process.env.STRICT && failures) process.exit(1);
})();
