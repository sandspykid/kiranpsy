const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR ' + page.url() + ': ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE ' + page.url() + ': ' + m.text()); });
  const log = (...a) => console.log(...a);

  // ---- booking flow
  await page.goto('http://127.0.0.1:8080/book.html', { waitUntil: 'networkidle' });
  await page.click('[data-step="1"] [data-next]');
  await page.click('[data-step="2"] [data-next]');
  await page.click('[data-step="3"] [data-next]');
  // pick a slot on a non-today day (tomorrow or later) to avoid "past" slots
  const days = await page.$$('.day:not([disabled])');
  await days[Math.min(1, days.length-1)].click();
  const slots = await page.$$('.slot:not([disabled])');
  log('book: open slots', slots.length);
  await slots[0].click();
  log('book: summary when =', await page.textContent('[data-sum="when"]'), '| token =', await page.textContent('[data-sum="token"]'));
  await page.click('[data-step="4"] [data-next]');
  await page.click('[data-step="5"] [data-next]'); // should fail validation
  log('book: phone error visible =', await page.isVisible('#phone-err'));
  await page.fill('#phone', '9825012345'); await page.fill('#name', 'Test');
  await page.click('[data-step="5"] [data-next]');
  log('book: ticket =', (await page.textContent('#ticket')).replace(/\s+/g,' ').slice(0,160));
  await page.click('#confirm');
  log('book: done pane active =', await page.isVisible('[data-step="7"] .chip'));
  // private mode via hash
  await page.goto('http://127.0.0.1:8080/book.html#private', { waitUntil: 'networkidle' });
  log('book#private: body.is-private =', await page.evaluate(() => document.body.classList.contains('is-private')), '| name label =', await page.textContent('#name-label'));

  // ---- saathi
  await page.goto('http://127.0.0.1:8080/saathi.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.fill('#chat-text', 'I want to die'); await page.click('#chat-form button[type=submit]');
  await page.waitForSelector('.msg--crisis', { timeout: 5000 });
  log('saathi: crisis card shown =', await page.isVisible('.msg--crisis'));
  await page.click('#reset'); await page.waitForTimeout(1200);
  await page.click('[data-scenario="intake"]'); await page.waitForTimeout(1500);
  for (const a of ['Bahu tension rehta hai', '3 months', 'Sleep bad', 'No', 'Go back to work']) { await page.fill('#chat-text', a); await page.click('#chat-form button[type=submit]'); await page.waitForTimeout(1800); }
  await page.waitForSelector('.summary-card', { timeout: 8000 });
  log('saathi: intake summary rendered =', await page.isVisible('.summary-card'));
  await page.click('[data-scenario="report"]'); await page.waitForTimeout(1500);
  await page.fill('#chat-text', 'Lithium 1.4'); await page.click('#chat-form button[type=submit]'); await page.waitForTimeout(2500);
  log('saathi: lithium escalation text present =', (await page.textContent('#chat-body')).includes('escalate'));
  await page.fill('#chat-text', 'મારી ઊંઘ નથી આવતી'); await page.click('#chat-form button[type=submit]'); await page.waitForTimeout(2500);
  log('saathi: gujarati sleep route =', (await page.textContent('#chat-body')).includes('Sleep trouble'));

  // ---- portal
  await page.goto('http://127.0.0.1:8080/portal.html#trends', { waitUntil: 'networkidle' });
  log('portal: trends view active =', await page.evaluate(() => document.getElementById('trends').classList.contains('active')), '| charts =', await page.$$eval('#trends svg.chart', e => e.length));
  await page.click('[data-view="today"]'); await page.click('#checkin button[type=submit]'); await page.waitForTimeout(300);
  log('portal: checkin rows =', await page.$$eval('#checkin-table tbody tr', e => e.length));
  await page.click('[data-view="journal"]'); await page.fill('#sz-date', '2026-10-05'); await page.fill('#sz-time', '22:15'); await page.click('#seiz-form button[type=submit]');
  log('portal: seizure rows =', await page.$$eval('#seiz-table tbody tr', e => e.length));
  await page.click('[data-view="messages"]'); await page.fill('#msg-text', 'hello'); await page.click('#msg-form button[type=submit]'); await page.waitForTimeout(1200);
  log('portal: thread msgs =', await page.$$eval('#thread .msg', e => e.length));

  // ---- clinic
  await page.goto('http://127.0.0.1:8080/clinic.html', { waitUntil: 'networkidle' });
  await page.click('#call-next'); await page.waitForTimeout(200);
  log('clinic: seen =', await page.textContent('#k-seen'), '| selected token =', await page.$eval('#queue-list .row.sel', e => e.dataset.token));
  await page.click('[data-view="brief"]'); log('clinic: sparks =', await page.$$eval('#view-brief svg.spark', e => e.length));
  await page.click('[data-view="consult"]'); await page.click('#rec'); await page.waitForTimeout(9500);
  log('clinic: transcript lines =', await page.$$eval('#transcript p', e => e.length), '| gen enabled =', await page.$eval('#gen', e => !e.disabled));
  await page.click('#gen'); await page.waitForTimeout(3500);
  log('clinic: note sections =', await page.$$eval('#note-draft h5', e => e.length));
  await page.click('[data-view="outcomes"]'); log('clinic: outcome charts =', await page.$$eval('#view-outcomes svg.chart', e => e.length));
  await page.click('[data-view="content"]'); await page.click('#draft-post'); log('clinic: post panels =', await page.$$eval('[data-tab-panel="post"]', e => e.length));

  // ---- header: language switch + theme + drawer at mobile
  await page.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
  await page.click('.lang button[data-lang="gu"]'); await page.waitForTimeout(200);
  log('i18n: html lang =', await page.evaluate(() => document.documentElement.lang), '| h1 =', await page.textContent('h1'));
  await page.click('[data-theme-toggle]'); log('theme: data-theme =', await page.evaluate(() => document.documentElement.getAttribute('data-theme')));
  await page.setViewportSize({ width: 390, height: 800 }); await page.waitForTimeout(200);
  await page.click('.nav-toggle'); log('drawer open =', await page.evaluate(() => document.getElementById('drawer').classList.contains('open')));
  await page.click('.drawer [data-drawer-close].icon-btn');
  await page.click('.myth'); log('myth flipped =', await page.$eval('.myth', e => e.classList.contains('flipped')));
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'No JS errors across flows');
  await browser.close();
  if (errors.length) process.exit(1);
})().catch(e => { console.error('FLOW FAILURE', e); process.exit(1); });
