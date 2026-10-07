/* Kiran Neuro-Psychiatry Care — shared behaviour
   Renders the emergency strip, header, drawer and footer into every page,
   handles language (en/gu/hi), theme, quick exit, the live queue simulation,
   toasts and small helpers used by the interactive pages. */
(function () {
  "use strict";

  const PHONE_MAIN = "+918758299921";
  const PHONE_LAND = "+912782423513";
  const WHATSAPP = "https://wa.me/918758299921?text=" + encodeURIComponent("Namaste, I would like to book a visit at Kiran Neuro-Psychiatry Care.");
  const MAPS = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Samved Complex, Jail Road, Bhavnagar 364001");

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ---------- icons (inline SVG, 24px grid, stroke) ---------- */
  const I = {
    mark: '<svg class="mark" viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="kg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#F0B254"/><stop offset="1" stop-color="#E3A23A"/></linearGradient></defs><circle cx="20" cy="26" r="9" fill="url(#kg)"/><path d="M20 4v7M8.3 9.3l4.9 4.9M31.7 9.3l-4.9 4.9M3 20h7M30 20h7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M4 34h32" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" opacity=".35"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.7a2 2 0 0 1 1.9 2z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 0 1 0 16.4 8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8zm-3.3 4.4c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.2 5 4.4 2.5 1 3 .8 3.5.7.5 0 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.5-.4-.5-.6-.5z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    exit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3M21 4v16"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>'
  };
  window.KIRAN_ICONS = I;

  /* ---------- language ---------- */
  const DICT = window.KIRAN_I18N || { en: {} };
  let lang = store.get("kiran.lang") || "en";
  if (!DICT[lang]) lang = "en";

  function t(key) {
    return (DICT[lang] && DICT[lang][key]) || (DICT.en && DICT.en[key]) || key;
  }
  window.t = t;

  function applyLang(next, announce) {
    lang = DICT[next] ? next : "en";
    store.set("kiran.lang", lang);
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (el.hasAttribute("data-i18n-attr")) {
        el.setAttribute(el.getAttribute("data-i18n-attr"), val);
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    if (announce) toast(t("toast.lang"));
    document.dispatchEvent(new CustomEvent("kiran:lang", { detail: { lang } }));
  }
  window.applyLang = applyLang;
  window.currentLang = () => lang;

  /* ---------- theme ---------- */
  function currentTheme() {
    const explicit = document.documentElement.getAttribute("data-theme");
    if (explicit) return explicit;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function setTheme(theme) {
    if (theme) document.documentElement.setAttribute("data-theme", theme); else document.documentElement.removeAttribute("data-theme");
    store.set("kiran.theme", theme || "");
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => { b.innerHTML = currentTheme() === "dark" ? I.sun : I.moon; });
  }
  const savedTheme = store.get("kiran.theme");
  if (savedTheme === "dark" || savedTheme === "light") document.documentElement.setAttribute("data-theme", savedTheme);

  /* ---------- toast ---------- */
  let toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }
  window.toast = toast;

  /* ---------- copy helper ---------- */
  window.copyText = function (text, btn) {
    const done = () => { toast(t("toast.copied")); if (btn) { const o = btn.textContent; btn.textContent = "✓"; setTimeout(() => (btn.textContent = o), 1200); } };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallback());
    } else fallback();
    function fallback() {
      const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { /* ignore */ }
      document.body.removeChild(ta);
    }
  };

  /* ---------- quick exit ---------- */
  function quickExit() {
    document.title = t("exit.title");
    const s = document.createElement("div");
    s.className = "exit-screen";
    s.innerHTML = "<div><h1>" + t("exit.title") + "</h1><p>" + t("exit.body") + "</p></div>";
    document.body.innerHTML = "";
    document.body.appendChild(s);
    try { window.location.replace("https://www.google.com/search?q=bhavnagar+weather"); } catch (e) { /* stay on neutral screen */ }
  }
  window.quickExit = quickExit;
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && e.shiftKey) quickExit(); });

  /* ---------- live queue simulation ----------
     Models a real OPD day: morning session 10:00-13:00, evening 16:00-19:00,
     roughly 6 minutes per consultation, two doctors. Deterministic from the
     clock so the number looks the same on every page in the same minute. */
  function istNow() {
    // The clinic runs on India Standard Time wherever the viewer is.
    try {
      const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "numeric", weekday: "short", day: "numeric", hour12: false }).formatToParts(new Date());
      const get = (t) => (parts.find((p) => p.type === t) || {}).value;
      const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: days[get("weekday")] ?? new Date().getDay(), hours: parseInt(get("hour"), 10) % 24, minutes: parseInt(get("minute"), 10), date: parseInt(get("day"), 10) };
    } catch (e) {
      const d = new Date(); return { day: d.getDay(), hours: d.getHours(), minutes: d.getMinutes(), date: d.getDate() };
    }
  }
  window.istNow = istNow;
  function queueState(now) {
    now = now || istNow();
    const day = now.day;
    const mins = now.hours * 60 + now.minutes;
    const sessions = [{ name: "Morning", start: 600, end: 780 }, { name: "Evening", start: 960, end: 1140 }];
    const open = day !== 0;
    let cur = null;
    for (const s of sessions) if (mins >= s.start && mins < s.end) cur = s;
    if (!open || !cur) {
      let next;
      if (!open || mins >= 1140) next = { name: "Morning", at: "10:00", label: day === 6 || !open ? "Monday" : "tomorrow" };
      else if (mins < 600) next = { name: "Morning", at: "10:00", label: "today" };
      else next = { name: "Evening", at: "16:00", label: "today" };
      return { open: false, next, token: 0, waiting: 0, waitMin: 0, pct: 0, nextSlot: next.at, session: next.name };
    }
    const elapsed = mins - cur.start;
    const perConsult = 6;
    const token = Math.max(1, Math.floor(elapsed / perConsult) + 1);
    const waiting = 3 + ((Math.floor(elapsed / 7) * 7 + now.date) % 5); // 3-7 people waiting, slowly changing
    const waitMin = waiting * perConsult;
    const slotMin = cur.start + Math.ceil((elapsed + waitMin) / 10) * 10;
    const h = Math.floor(slotMin / 60), m = slotMin % 60;
    return { open: true, token, waiting, waitMin, pct: Math.round((elapsed / (cur.end - cur.start)) * 100), nextSlot: String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0"), session: cur.name };
  }
  window.queueState = queueState;

  function renderQueue(el) {
    const q = queueState();
    if (!q.open) {
      el.innerHTML = '<div class="q-head"><span><span class="dot"></span> ' + t("queue.label") + '</span><span>' + q.next.label + '</span></div>'
        + '<div class="q-token"><small>' + t("queue.closed") + '</small>' + q.next.at + '</div>'
        + '<div class="q-row"><div class="q-stat"><b>' + q.next.name + '</b><span>' + t("queue.session") + '</span></div><div class="q-stat"><b>24x7</b><span>' + t("trust.emergency") + '</span></div></div>'
        + '<a class="btn btn--primary btn--block" href="book.html">' + t("cta.book") + '</a>';
      return;
    }
    el.innerHTML = '<div class="q-head"><span><span class="dot dot--live"></span> ' + t("queue.label") + ' · ' + q.session + '</span><span class="num">' + q.waiting + ' waiting</span></div>'
      + '<div class="q-token"><small>' + t("queue.now") + '</small>' + String(q.token).padStart(2, "0") + '</div>'
      + '<div class="q-bar"><i style="width:' + q.pct + '%"></i></div>'
      + '<div class="q-row"><div class="q-stat"><b>~' + q.waitMin + ' min</b><span>' + t("queue.wait") + '</span></div><div class="q-stat"><b>' + q.nextSlot + '</b><span>' + t("queue.next") + '</span></div></div>'
      + '<a class="btn btn--primary btn--block" href="book.html">' + t("cta.book") + '</a>';
  }

  /* ---------- header / footer ---------- */
  const NAV = [
    ["conditions.html", "nav.conditions"],
    ["self-check.html", "nav.selfcheck"],
    ["saathi.html", "nav.saathi"],
    ["deaddiction.html", "nav.quit"]
  ];
  const MORE = [
    ["doctors.html", "nav.doctors"],
    ["resources.html", "nav.resources"],
    ["rights.html", "nav.rights"],
    ["contact.html", "nav.contact"],
    ["portal.html", "nav.portal"],
    ["clinic.html", "nav.clinic"]
  ];

  function pageName() {
    const p = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    return p === "" ? "index.html" : p;
  }

  function link(href, key, cls) {
    const cur = pageName() === href ? ' aria-current="page"' : "";
    return '<a href="' + href + '"' + cur + (cls ? ' class="' + cls + '"' : "") + ' data-i18n="' + key + '">' + t(key) + "</a>";
  }

  function renderHeader() {
    const host = document.getElementById("site-header");
    if (!host) return;
    host.innerHTML =
      '<div class="strip"><div class="wrap"><div class="strip-text"><span data-i18n="strip.text">' + t("strip.text") + '</span> <a href="tel:' + PHONE_MAIN + '" class="num">+91 87582 99921</a> <span aria-hidden="true">·</span> <a href="tel:14416" data-i18n="strip.manas">' + t("strip.manas") + '</a></div>'
      + '<a href="emergency.html" class="link-arrow small" style="color:var(--gold-2)" data-i18n="nav.emergency">' + t("nav.emergency") + '</a></div></div>'
      + '<div class="site-header"><div class="wrap">'
      + '<a class="brand" href="index.html" aria-label="Kiran Neuro-Psychiatry Care, home">' + I.mark + '<span><span data-i18n="brand.kiran">' + t("brand.kiran") + '</span><small data-i18n="brand.line">' + t("brand.line") + '</small></span></a>'
      + '<nav class="nav" aria-label="Primary">' + NAV.map((n) => link(n[0], n[1])).join("")
      + '<div class="nav-more"><button type="button" aria-haspopup="true" aria-expanded="false"><span data-i18n="nav.more">' + t("nav.more") + '</span>' + I.chevron + '</button><div class="menu">' + MORE.map((n) => link(n[0], n[1])).join("") + '</div></div>'
      + '</nav>'
      + '<div class="header-tools">'
      + '<div class="lang hide-md" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="false">EN</button><button type="button" data-lang="gu" aria-pressed="false" lang="gu">ગુ</button><button type="button" data-lang="hi" aria-pressed="false" lang="hi">हि</button></div>'
      + '<button type="button" class="icon-btn hide-md" data-theme-toggle aria-label="' + t("nav.theme") + '" title="' + t("nav.theme") + '">' + I.moon + '</button>'
      + '<button type="button" class="quick-exit" data-quick-exit title="Shift + Esc"><span>' + I.exit + '</span><span data-i18n="nav.exit">' + t("nav.exit") + '</span></button>'
      + '<a class="btn btn--primary btn--sm hide-md" href="book.html" data-i18n="cta.book">' + t("cta.book") + '</a>'
      + '<button type="button" class="icon-btn nav-toggle" aria-label="' + t("nav.menu") + '" aria-controls="drawer" aria-expanded="false">' + I.menu + '</button>'
      + '</div></div></div>'
      + '<div class="drawer" id="drawer"><div class="scrim" data-drawer-close></div><div class="panel" role="dialog" aria-label="Menu">'
      + '<div class="drawer-head"><div class="lang" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="false">EN</button><button type="button" data-lang="gu" aria-pressed="false" lang="gu">ગુ</button><button type="button" data-lang="hi" aria-pressed="false" lang="hi">हि</button></div>'
      + '<div class="cluster"><button type="button" class="icon-btn" data-theme-toggle aria-label="' + t("nav.theme") + '">' + I.moon + '</button><button type="button" class="icon-btn" data-drawer-close aria-label="' + t("nav.close") + '">' + I.close + '</button></div></div>'
      + link("index.html", "nav.home") + NAV.map((n) => link(n[0], n[1])).join("") + '<a href="book.html" class="btn btn--primary" data-i18n="cta.book">' + t("cta.book") + '</a>'
      + '<div class="drawer-group">' + MORE.map((n) => link(n[0], n[1])).join("") + '</div>'
      + '<div class="drawer-group"><a href="emergency.html" style="color:var(--crimson)" data-i18n="nav.emergency">' + t("nav.emergency") + '</a></div>'
      + '</div></div>';

    // behaviour
    host.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang, true)));
    host.querySelectorAll("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => setTheme(currentTheme() === "dark" ? "light" : "dark")));
    host.querySelectorAll("[data-quick-exit]").forEach((b) => b.addEventListener("click", quickExit));
    const more = host.querySelector(".nav-more");
    if (more) {
      const btn = more.querySelector("button");
      btn.addEventListener("click", (e) => { e.stopPropagation(); const open = more.classList.toggle("open"); btn.setAttribute("aria-expanded", String(open)); });
      document.addEventListener("click", () => { more.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); });
    }
    const drawer = host.querySelector("#drawer");
    const toggle = host.querySelector(".nav-toggle");
    const openDrawer = (v) => { drawer.classList.toggle("open", v); toggle.setAttribute("aria-expanded", String(v)); document.body.style.overflow = v ? "hidden" : ""; };
    toggle.addEventListener("click", () => openDrawer(!drawer.classList.contains("open")));
    host.querySelectorAll("[data-drawer-close]").forEach((b) => b.addEventListener("click", () => openDrawer(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !e.shiftKey) openDrawer(false); });
  }

  function renderFooter() {
    const host = document.getElementById("site-footer");
    if (!host) return;
    host.className = "site-footer";
    host.innerHTML = '<div class="wrap">'
      + '<div><a class="brand" href="index.html">' + I.mark + '<span><span data-i18n="brand.kiran">' + t("brand.kiran") + '</span><small data-i18n="brand.line">' + t("brand.line") + '</small></span></a><p class="mt-2" style="font-family:var(--font-display);font-weight:500;font-size:1.05rem;color:var(--gold)" data-i18n="hero.title">' + t("hero.title") + '</p>'
      + '<p class="mt-3 small" style="color:var(--on-night-muted);max-width:40ch">309/310 Samved Complex, Opp. A Division Police Station, Jail Road, Bhavnagar 364001, Gujarat</p>'
      + '<p class="small mt-2" style="color:var(--on-night-muted)" data-i18n="footer.hours">' + t("footer.hours") + '</p>'
      + '<div class="crisis"><b data-i18n="footer.crisis">' + t("footer.crisis") + '</b><span class="num">Clinic 24x7: +91 87582 99921 · Tele-MANAS 14416 · Ambulance 108 · Police 112</span></div></div>'
      + '<div><h4 data-i18n="footer.visit">' + t("footer.visit") + '</h4><ul><li>' + link("book.html", "nav.book") + '</li><li>' + link("doctors.html", "nav.doctors") + '</li><li>' + link("conditions.html", "nav.conditions") + '</li><li>' + link("contact.html", "nav.contact") + '</li><li><a href="tel:' + PHONE_MAIN + '" class="num">+91 87582 99921</a></li><li><a href="tel:' + PHONE_LAND + '" class="num">+91 278 2423513</a></li><li><a href="mailto:kiran.neurocare@gmail.com">kiran.neurocare@gmail.com</a></li></ul></div>'
      + '<div><h4 data-i18n="footer.care">' + t("footer.care") + '</h4><ul><li>' + link("self-check.html", "nav.selfcheck") + '</li><li>' + link("saathi.html", "nav.saathi") + '</li><li>' + link("deaddiction.html", "nav.quit") + '</li><li>' + link("portal.html", "nav.portal") + '</li><li>' + link("clinic.html", "nav.clinic") + '</li><li>' + link("resources.html", "nav.resources") + '</li></ul></div>'
      + '<div><h4 data-i18n="footer.help">' + t("footer.help") + '</h4><ul><li>' + link("emergency.html", "nav.emergency") + '</li><li>' + link("rights.html", "footer.privacy") + '</li><li><a href="https://telemanas.mohfw.gov.in/" target="_blank" rel="noopener">Tele-MANAS 14416</a></li><li><a href="https://www.facebook.com/Dr.KeyurParmar" target="_blank" rel="noopener">Facebook</a></li><li><a href="https://www.instagram.com/kiranneuropsychiatrycare/" target="_blank" rel="noopener">Instagram</a></li></ul></div>'
      + '<div class="foot-note"><span data-i18n="footer.note">' + t("footer.note") + '</span><span data-i18n="footer.reg">' + t("footer.reg") + '</span><span>© ' + new Date().getFullYear() + ' Kiran Neuro-Psychiatry Care</span></div>'
      + '</div>';
  }

  function renderWhatsApp() {
    if (document.querySelector(".wa-fab") || document.body.hasAttribute("data-no-fab")) return;
    const a = document.createElement("a");
    a.className = "wa-fab"; a.href = WHATSAPP; a.target = "_blank"; a.rel = "noopener"; a.setAttribute("aria-label", t("cta.whatsapp")); a.title = t("cta.whatsapp");
    a.innerHTML = I.whatsapp; document.body.appendChild(a);
  }

  /* ---------- tiny chart helpers (SVG, to scale) ---------- */
  window.KIRAN_CHART = {
    // Line chart with optional severity bands. series: [{values:[], cls:'line'|'line line--gold', label}], labels: x labels
    line(opts) {
      const w = opts.width || 520, h = opts.height || 220, pl = 34, pr = 14, pt = 16, pb = 28;
      const max = opts.max != null ? opts.max : Math.max.apply(null, opts.series.flatMap((s) => s.values)) * 1.1;
      const n = Math.max.apply(null, opts.series.map((s) => s.values.length));
      const x = (i) => pl + (i * (w - pl - pr)) / Math.max(1, n - 1);
      const y = (v) => pt + (h - pt - pb) * (1 - v / max);
      let out = '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + (opts.aria || "Trend chart") + '">';
      (opts.bands || []).forEach((b) => { out += '<rect class="' + b.cls + '" x="' + pl + '" y="' + y(b.to) + '" width="' + (w - pl - pr) + '" height="' + (y(b.from) - y(b.to)) + '"/>'; });
      const ticks = opts.ticks || [0, Math.round(max / 2), Math.round(max)];
      ticks.forEach((tv) => { out += '<line class="grid-line" x1="' + pl + '" x2="' + (w - pr) + '" y1="' + y(tv) + '" y2="' + y(tv) + '"/><text x="' + (pl - 8) + '" y="' + (y(tv) + 4) + '" text-anchor="end">' + tv + "</text>"; });
      if (opts.threshold != null) out += '<line class="threshold" x1="' + pl + '" x2="' + (w - pr) + '" y1="' + y(opts.threshold) + '" y2="' + y(opts.threshold) + '"/>';
      (opts.labels || []).forEach((l, i) => { if (n > 8 && i % 2) return; out += '<text x="' + x(i) + '" y="' + (h - 8) + '" text-anchor="middle">' + l + "</text>"; });
      opts.series.forEach((s) => {
        const pts = s.values.map((v, i) => [x(i), y(v)]);
        const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
        if (s.area) out += '<path class="' + (s.area) + '" d="' + d + " L" + pts[pts.length - 1][0].toFixed(1) + " " + (h - pb) + " L" + pts[0][0].toFixed(1) + " " + (h - pb) + ' Z"/>';
        out += '<path class="' + (s.cls || "line") + '" d="' + d + '"/>';
        pts.forEach((p, i) => { out += '<circle class="pt' + (i === pts.length - 1 ? " pt--end" : "") + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.5"' + (s.cls && s.cls.indexOf("gold") > -1 ? ' style="stroke:var(--gold-2)' + (i === pts.length - 1 ? ";fill:var(--gold-2)" : "") + '"' : "") + "><title>" + (s.label || "") + " " + (opts.labels ? opts.labels[i] : i) + ": " + s.values[i] + "</title></circle>"; });
        if (s.endLabel !== false) { const last = pts[pts.length - 1]; out += '<text class="lbl-strong" x="' + (last[0] - 6) + '" y="' + (last[1] - 10) + '" text-anchor="end">' + s.values[s.values.length - 1] + "</text>"; }
      });
      if (opts.nowIndex != null) out += '<line class="now" x1="' + x(opts.nowIndex) + '" x2="' + x(opts.nowIndex) + '" y1="' + pt + '" y2="' + (h - pb) + '"/>';
      out += "</svg>";
      return out;
    },
    bars(opts) {
      const w = opts.width || 520, h = opts.height || 200, pl = 34, pr = 10, pt = 14, pb = 28;
      const max = opts.max || Math.max.apply(null, opts.values) * 1.15;
      const n = opts.values.length, gap = 6, bw = (w - pl - pr) / n - gap;
      const y = (v) => pt + (h - pt - pb) * (1 - v / max);
      let out = '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + (opts.aria || "Bar chart") + '">';
      [0, Math.round(max / 2), Math.round(max)].forEach((tv) => { out += '<line class="grid-line" x1="' + pl + '" x2="' + (w - pr) + '" y1="' + y(tv) + '" y2="' + y(tv) + '"/><text x="' + (pl - 8) + '" y="' + (y(tv) + 4) + '" text-anchor="end">' + tv + "</text>"; });
      opts.values.forEach((v, i) => {
        const bx = pl + i * (bw + gap) + gap / 2;
        out += '<rect class="bar' + (opts.highlight === i ? " bar--gold" : "") + (opts.cls ? " " + opts.cls[i] : "") + '" x="' + bx.toFixed(1) + '" y="' + y(v).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + (h - pb - y(v)).toFixed(1) + '"><title>' + (opts.labels ? opts.labels[i] : i) + ": " + v + "</title></rect>";
        if (opts.labels) out += '<text x="' + (bx + bw / 2).toFixed(1) + '" y="' + (h - 8) + '" text-anchor="middle">' + opts.labels[i] + "</text>";
        if (opts.showValues) out += '<text class="lbl-strong" x="' + (bx + bw / 2).toFixed(1) + '" y="' + (y(v) - 5).toFixed(1) + '" text-anchor="middle">' + v + (opts.unit || "") + "</text>";
      });
      out += "</svg>";
      return out;
    },
    spark(values, cls) {
      const w = 100, h = 28, max = Math.max.apply(null, values), min = Math.min.apply(null, values);
      const x = (i) => (i * (w - 4)) / (values.length - 1) + 2;
      const y = (v) => 24 - ((v - min) / Math.max(1, max - min)) * 20;
      const d = values.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");
      const last = values[values.length - 1];
      return '<svg class="chart spark" viewBox="0 0 ' + w + " " + h + '" aria-hidden="true"><path class="' + (cls || "line") + '" d="' + d + '"/><circle class="pt pt--end" cx="' + x(values.length - 1).toFixed(1) + '" cy="' + y(last).toFixed(1) + '" r="3"/></svg>';
    }
  };

  /* ---------- boot ---------- */
  function boot() {
    renderHeader();
    renderFooter();
    renderWhatsApp();
    applyLang(lang, false);
    setTheme(document.documentElement.getAttribute("data-theme") || "");
    document.querySelectorAll("[data-queue]").forEach((el) => { renderQueue(el); setInterval(() => renderQueue(el), 30000); });
    document.addEventListener("kiran:lang", () => document.querySelectorAll("[data-queue]").forEach(renderQueue));
    document.querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", () => window.copyText(b.getAttribute("data-copy"), b)));
    document.querySelectorAll(".myth").forEach((m) => { m.setAttribute("tabindex", "0"); m.setAttribute("role", "button"); const flip = () => m.classList.toggle("flipped"); m.addEventListener("click", flip); m.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } }); });
    document.querySelectorAll("[data-tabs]").forEach((group) => {
      const tabs = group.querySelectorAll("[role=tab]");
      tabs.forEach((tab) => tab.addEventListener("click", () => {
        tabs.forEach((x) => x.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");
        const target = group.getAttribute("data-tabs");
        document.querySelectorAll("[data-tab-panel='" + target + "']").forEach((p) => p.classList.toggle("active", p.id === tab.getAttribute("aria-controls")));
      }));
    });
    document.querySelectorAll("form[data-demo]").forEach((f) => f.addEventListener("submit", (e) => { e.preventDefault(); toast(f.getAttribute("data-demo")); }));
    document.querySelectorAll("a[href='#saathi-open']").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); location.href = "saathi.html"; }));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
